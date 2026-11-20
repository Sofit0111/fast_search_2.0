const SEARCH_ENGINES = {
  google:     "https://www.google.com/search?q=%s",
  yandex:     "https://yandex.ru/search/?text=%s",
  bing:       "https://www.bing.com/search?q=%s",
  youtube:    "https://www.youtube.com/results?search_query=%s",
  duckduckgo: "https://duckduckgo.com/?q=%s"
};
const MAX_QUERY = 500;
const STORES = /^https:\/\/(chromewebstore\.google\.com|chrome\.google\.com\/webstore|addons\.opera\.com|microsoftedge\.microsoft\.com\/addons)/i;

// инъектится в страницу
function grabSelection() {
  const el = document.activeElement;
  if (el && (el.tagName === "TEXTAREA" ||
      (el.tagName === "INPUT" && typeof el.selectionStart === "number"))) {
    const t = el.value.slice(el.selectionStart, el.selectionEnd);
    if (t) return t;
  }
  return window.getSelection()?.toString() || "";
}

async function badge(text) {
  await chrome.action.setBadgeText({ text });
  setTimeout(() => chrome.action.setBadgeText({ text: "" }), 1500);
}

async function openSearch(raw, tab) {
  const query = raw.replace(/\s+/g, " ").trim().slice(0, MAX_QUERY);
  if (!query) return;

  const { searchEngine, customEngine, inBackground } = await chrome.storage.sync.get({
    searchEngine: "google", customEngine: "", inBackground: false
  });

  const template = (searchEngine === "custom" && customEngine)
    ? customEngine
    : (SEARCH_ENGINES[searchEngine] || SEARCH_ENGINES.google);

  const q = encodeURIComponent(query);
  const url = template.includes("%s") ? template.replace("%s", q) : template + q;

  chrome.tabs.create({
    url,
    index: tab.index + 1,
    openerTabId: tab.id,
    active: !inBackground
  });
}

async function handleCommand(tab) {
  if (!tab?.id) return;
  const url = tab.url || "";
  if (!/^(https?|file):/i.test(url) || STORES.test(url)) return badge("×");

  let results;
  try {
    results = await chrome.scripting.executeScript({
      target: { tabId: tab.id, allFrames: true },
      func: grabSelection
    });
  } catch (e) {
    console.warn("Injection failed:", e);
    return badge("!");
  }

  const text = results.map(r => r.result).find(t => t && t.trim());
  if (!text) return badge("∅");
  openSearch(text, tab);
}

chrome.commands.onCommand.addListener(async (command, tab) => {
  if (command !== "search-selection") return;
  handleCommand(tab || (await chrome.tabs.query({ active: true, lastFocusedWindow: true }))[0]);
});

chrome.action.onClicked.addListener(handleCommand);

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({ id: "search-selection", title: "Искать «%s»", contexts: ["selection"] });
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "search-selection" && info.selectionText) {
    openSearch(info.selectionText, tab);
  }
});