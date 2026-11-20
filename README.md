# Search Selection 🔍

**EN** · [RU](#search-selection-ru)

A minimalist Manifest V3 extension for Chromium browsers: select any text on a page and search it instantly — no copy-paste, no new tab typing.

## ✨ Features

- **Hotkey search** — `Alt + S` (`Ctrl + S` on macOS by default; remappable).
- **Toolbar button** — one click on the icon does the same thing.
- **Context menu** — right-click the selection → *Искать «…»*.
- **Works everywhere on the page** — regular text, `<input>` / `<textarea>` fields and iframes.
- **Smart cleanup** — line breaks, tabs and repeated spaces collapse into a single space; the query is capped at 500 characters.
- **Opens next to the current tab**, linked to its opener, optionally in the background.
- **Engines** — Google, Yandex, Bing, DuckDuckGo, YouTube, or **any custom URL** with a `%s` placeholder.
- **Visible feedback** — a badge on the icon tells you why nothing happened:

  | Badge | Meaning |
  |:-----:|---------|
  | `∅`   | No text selected |
  | `×`   | Page is protected by the browser |
  | `!`   | No access to the page |

- **Privacy-first** — only `activeTab`, no host permissions, no content scripts, no analytics.

## 🛠 Installation

1. Download or clone this repository.
2. Open `chrome://extensions/`.
3. Enable **Developer mode** (top right).
4. Click **Load unpacked** and select the project folder.

Works in Chrome, Edge, Brave, Opera, Vivaldi, Yandex Browser and other Chromium-based browsers.

## ⚙️ Configuration

**Search engine:** right-click the toolbar icon → *Options*. Settings are saved automatically and synced via your browser account.

**Custom engine:** pick *Свой поисковик…* and paste a URL containing `%s` — that's where the query goes.

**Hotkey:** `chrome://extensions/shortcuts` → Search Selection. There's a shortcut button in the options page.

**Local files:** to search text in local HTML files, enable *Allow access to file URLs* on the extension details page.

## 🔗 Custom engine examples

| Name / Название | URL |
|---|---|
| Wikipedia (RU) | `https://ru.wikipedia.org/w/index.php?search=%s` |
| GitHub | `https://github.com/search?q=%s` |
| MDN | `https://developer.mozilla.org/ru/search?q=%s` |
| Stack Overflow | `https://stackoverflow.com/search?q=%s` |
| Хабр | `https://habr.com/ru/search/?q=%s` |
| Perplexity | `https://www.perplexity.ai/search?q=%s` |

## ⚠️ Limitations

The browser forbids script injection on:
- internal pages (`chrome://`, `edge://`, `about:`, `devtools://`, `view-source:`);
- extension stores (Chrome Web Store, Edge Add-ons, Opera Add-ons);
- other extensions' pages and the built-in PDF viewer.

Cross-origin iframes may also be inaccessible. In these cases the icon shows `×` or `!` instead of failing silently.

## 🔒 Privacy

The selected text is sent **only** to the search engine you chose, at the moment you trigger a search. Nothing is collected, stored or transmitted anywhere else. `chrome.storage.sync` holds three settings: engine, custom URL, background-tab flag.

## 📁 Project structure

```
manifest.json   — MV3 config: permissions, command, action, options
background.js   — service worker: hotkey/click/context menu, selection capture, tab opening
options.html    — settings UI (light + dark theme)
options.js      — settings logic, validation, live preview
icons/          — 16 / 48 / 128 px icons
```

## 📝 License

MIT — free to use, modify and distribute.

---

# Search Selection (RU)

[⬆️ English](#search-selection-)

Минималистичное расширение на Manifest V3 для Chromium-браузеров: выдели текст на странице и мгновенно найди его — без копипасты и набора вручную.

## ✨ Возможности

- **Поиск по хоткею** — `Alt + S` (на macOS по умолчанию `Ctrl + S`, можно переназначить).
- **Кнопка на панели** — клик по иконке делает то же самое.
- **Контекстное меню** — правый клик по выделению → *Искать «…»*.
- **Читает выделение везде** — обычный текст, поля `<input>` / `<textarea>` и iframe.
- **Умная очистка** — переносы строк, табы и повторные пробелы схлопываются в один пробел; запрос обрезается до 500 символов.
- **Открытие рядом** с текущей вкладкой, с привязкой к родительской, опционально — в фоне.
- **Поисковики** — Google, Яндекс, Bing, DuckDuckGo, YouTube или **любой свой URL** с `%s`.
- **Понятная обратная связь** — бейдж на иконке объясняет, почему поиск не сработал:

  | Бейдж | Значение |
  |:-----:|----------|
  | `∅`   | Текст не выделен |
  | `×`   | Страница защищена браузером |
  | `!`   | Нет доступа к странице |

- **Приватность** — только `activeTab`, без host-разрешений, без content-скриптов, без аналитики.

## 🛠 Установка

1. Скачай или клонируй репозиторий.
2. Открой `chrome://extensions/`.
3. Включи **Режим разработчика** (справа сверху).
4. Нажми **Загрузить распакованное расширение** и выбери папку проекта.

Работает в Chrome, Edge, Brave, Opera, Vivaldi, Яндекс.Браузере и других Chromium-браузерах.

## ⚙️ Настройка

**Поисковик:** правый клик по иконке → *Параметры*. Всё сохраняется автоматически и синхронизируется через аккаунт браузера.

**Свой поисковик:** выбери *Свой поисковик…* и вставь URL с `%s` — туда подставится запрос. Готовые примеры — в таблице выше.

**Горячие клавиши:** `chrome://extensions/shortcuts` → Search Selection. В настройках есть кнопка для перехода.

**Локальные файлы:** чтобы искать в локальных HTML, включи *Разрешить открывать локальные файлы* на странице расширения.

## ⚠️ Ограничения

Браузер запрещает внедрение скриптов на:
- служебных страницах (`chrome://`, `edge://`, `about:`, `devtools://`, `view-source:`);
- магазинах расширений (Chrome Web Store, Edge Add-ons, Opera Add-ons);
- страницах других расширений и во встроенном просмотрщике PDF.

Кросс-доменные iframe тоже могут быть недоступны. В таких случаях на иконке появится `×` или `!` — молчаливых отказов больше нет.

## 🔒 Приватность

Выделенный текст уходит **только** в выбранный тобой поисковик и только в момент запуска поиска. Ничего не собирается и не отправляется больше никуда. В `chrome.storage.sync` лежат три настройки: движок, свой URL, флаг фоновой вкладки.

## 🧾 Что нового в 1.2

- Выделение в полях ввода и внутри iframe.
- Контекстное меню и поиск по клику на иконку.
- Свой поисковик с `%s`, DuckDuckGo, предпросмотр URL и кнопка проверки.
- Открытие вкладки в фоне, обрезка запроса, бейджи-подсказки.
- Обновлённый фильтр запрещённых страниц (новый домен Chrome Web Store).
- Тёмная тема и доступная разметка страницы настроек.

## 📝 Лицензия

MIT — свободно используй, меняй и распространяй.# fast_search_2.0
