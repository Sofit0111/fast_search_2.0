"use strict";

const ENGINES = {
  google: "https://www.google.com/search?q=%s",
  yandex: "https://yandex.ru/search/?text=%s",
  bing: "https://www.bing.com/search?q=%s",
  youtube: "https://www.youtube.com/results?search_query=%s",
  duckduckgo: "https://duckduckgo.com/?q=%s"
};

const DEFAULTS = { searchEngine: "google", customEngine: "", inBackground: false };
const MAX_QUERY = 500;
const SAMPLE = "пример запроса";

const $ = (id) => document.getElementById(id);
const ui = {
  engine: $("engine"),
  customBlock: $("custom-block"),
  custom: $("customEngine"),
  customError: $("custom-error"),
  background: $("inBackground"),
  preview: $("preview"),
  status: $("status"),
  test: $("test"),
  reset: $("reset"),
  shortcuts: $("shortcuts")
};

let saveTimer = null;
let statusTimer = null;

function showStatus(text, isError = false) {
  clearTimeout(statusTimer);
  ui.status.textContent = text;
  ui.status.classList.toggle("error", isError);
  statusTimer = setTimeout(() => {
    ui.status.textContent = "";
    ui.status.classList.remove("error");
  }, 2500);
}

function showCustomError(message) {
  ui.customError.textContent = message || "";
  ui.customError.hidden = !message;
}

function validateCustom(raw) {
  const value = (raw || "").trim();
  if (!value) return { ok: false, error: "Укажи адрес поиска." };
  if (!value.includes("%s")) return { ok: false, error: "В адресе должен быть %s — место для запроса." };
  let url;
  try {
    url = new URL(value.replace("%s", "test"));
  } catch {
    return { ok: false, error: "Это не похоже на корректный URL." };
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return { ok: false, error: "Поддерживаются только http:// и https://." };
  }
  if (value.length > 2000) return { ok: false, error: "Слишком длинный адрес." };
  return { ok: true, value };
}

function readForm() {
  return {
    searchEngine: ui.engine.value,
    customEngine: ui.custom.value.trim(),
    inBackground: ui.background.checked
  };
}

function templateFor(state) {
  if (state.searchEngine === "custom") {
    const check = validateCustom(state.customEngine);
    return check.ok ? check.value : ENGINES.google;
  }
  return ENGINES[state.searchEngine] || ENGINES.google;
}

function buildUrl(template, text) {
  const query = text.replace(/\s+/g, " ").trim().slice(0, MAX_QUERY);
  const encoded = encodeURIComponent(query);
  return template.includes("%s") ? template.replace("%s", encoded) : template + encoded;
}

function updatePreview() {
  const state = readForm();
  ui.customBlock.hidden = state.searchEngine !== "custom";
  ui.preview.textContent = buildUrl(templateFor(state), SAMPLE);
}

function render(state) {
  const known = state.searchEngine === "custom" || ENGINES[state.searchEngine];
  ui.engine.value = known ? state.searchEngine : "google";
  if (ui.custom.value !== state.customEngine) ui.custom.value = state.customEngine;
  ui.background.checked = Boolean(state.inBackground);
  updatePreview();
}

async function save() {
  const state = readForm();
  const isCustom = state.searchEngine === "custom";
  const check = isCustom ? validateCustom(state.customEngine) : { ok: true, value: state.customEngine };

  showCustomError(isCustom && !check.ok ? check.error : "");
  if (isCustom && !check.ok) {
    showStatus("Не сохранено: исправь адрес", true);
    updatePreview();
    return;
  }

  try {
    await chrome.storage.sync.set({
      searchEngine: state.searchEngine,
      customEngine: check.value || "",
      inBackground: state.inBackground
    });
    showStatus("Сохранено");
  } catch (e) {
    showStatus("Ошибка сохранения: " + (e.message || e), true);
  }
  updatePreview();
}

ui.engine.addEventListener("change", () => { updatePreview(); save(); });
ui.background.addEventListener("change", save);
ui.custom.addEventListener("input", () => {
  updatePreview();
  clearTimeout(saveTimer);
  saveTimer = setTimeout(save, 450);
});
ui.custom.addEventListener("blur", save);

document.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    ui.engine.value = "custom";
    ui.custom.value = chip.dataset.url;
    updatePreview();
    save();
  });
});

ui.test.addEventListener("click", async () => {
  const state = readForm();
  if (state.searchEngine === "custom" && !validateCustom(state.customEngine).ok) {
    showStatus("Сначала исправь адрес", true);
    return;
  }
  try {
    await chrome.tabs.create({ url: buildUrl(templateFor(state), SAMPLE), active: true });
  } catch {
    showStatus("Не удалось открыть вкладку", true);
  }
});

ui.reset.addEventListener("click", async () => {
  try {
    await chrome.storage.sync.set(DEFAULTS);
    showCustomError("");
    render(DEFAULTS);
    showStatus("Настройки сброшены");
  } catch {
    showStatus("Ошибка сброса", true);
  }
});

ui.shortcuts.addEventListener("click", async () => {
  try {
    await chrome.tabs.create({ url: "chrome://extensions/shortcuts" });
  } catch {
    showStatus("Открой вручную: chrome://extensions/shortcuts", true);
  }
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "sync") return;
  const state = readForm();
  for (const key of Object.keys(DEFAULTS)) {
    if (changes[key]) state[key] = changes[key].newValue;
  }
  render(state);
});

(async () => {
  try {
    render(await chrome.storage.sync.get(DEFAULTS));
  } catch {
    render(DEFAULTS);
    showStatus("Не удалось прочитать настройки", true);
  }
})();