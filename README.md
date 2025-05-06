# Amazon Vine Auto-Refresh Notifier

**Automatic page refresh & webhook alerts for Amazon Vine products**

This Chrome extension reloads the Amazon Vine page at random intervals and sends notifications to any webhook URL whenever new products appear. Ideal for receiving instant updates on new Vine offers (e.g. via Telegram, Slack, etc.).


## Features

* 🔄 **Auto Refresh**: Random interval between configured minimum and maximum (in seconds).
* 📋 **Product Detection**: New items are detected on the page; duplicates are avoided via local storage.
* ⏰ **Time Window**: Only active between specified `From` and `To` times.
* ☑️ **Enable/Disable**: Toggle monitoring on/off in the popup.
* 🔍 **Filter**: Optional keyword filter to report only matching product names.
* 🌐 **Webhook Support**: Send GET or POST requests with `{ArticleName}` placeholder in URL or request body.
* 🌎 **Internationalization**: UI supports multiple languages (e.g. English, German) via external JSON files.



## Installation

1. Clone the repo or download ZIP:

   ```bash
   git clone https://github.com/your-user/vine-notifier.git
   ```
2. Open Chrome and go to `chrome://extensions`.
3. Enable **Developer mode**.
4. Click **Load unpacked** and select the extension folder.
5. The Vine Notifier icon appears in the toolbar.



## Configuration

1. Click the Vine Notifier toolbar icon.
2. In the popup, set:

   * **Enabled**: Turn monitoring on or off.
   * **Webhook URL**: Use `{ArticleName}` placeholder.
   * **HTTP Method**: GET or POST.
   * **POST Body**: (only if POST) e.g. JSON with `{ArticleName}`.
   * **Min/Max Interval**: Seconds between reloads.
   * **Time Window**: Only run between chosen times.
   * **Filter**: Optional keyword to match product names.
   * **Language**: Click flag icon to switch UI language.
3. Click **Save**.



## How It Works

* **Content Script** (`content.js`) loads settings from `chrome.storage.local`.
* It checks the current time against the configured time window.
* It scans `#vvp-items-grid .vvp-item-tile` for new product titles not yet seen.
* New items trigger a message to the **Background** script.
* **Background Script** (`background.js`) sends a GET/POST request to the webhook.
* The page is reloaded after a random delay within the interval range.



## File Structure

```
├── manifest.json        # Chrome Manifest V3
├── content.js           # Scans Amazon Vine & sends messages
├── background.js        # Executes webhook requests
├── popup.html           # Settings UI
├── popup.js             # Popup logic & i18n loader
├── locales/             # JSON translation files (en.json, de.json)
└── icons/               # Flag SVGs (de.svg, en.svg)
```



## Internationalization

UI texts are stored in separate JSON files under `locales/`, e.g.:

```jsonc
// locales/en.json
{
  "settingsTitle": "Settings",
  "enabledLabel": "Enabled",
  "webhookUrlLabel": "Webhook URL ({ArticleName}):",
  // ...
}
```

`popup.js` dynamically loads the appropriate JSON based on the selected language, applies translations to all elements with `data-i18n`, and highlights the chosen flag. Placeholders (e.g. filter input placeholder) are also defined in these JSON files and replaced at runtime.



## License

This project is licensed under **Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)**.

* **Attribution**: You must give appropriate credit.
* **NonCommercial**: You may not use the material for commercial purposes.
* **No additional restrictions**: You may not apply legal or technological measures that legally restrict others from doing anything the license permits.

For details: [https://creativecommons.org/licenses/by-nc/4.0/](https://creativecommons.org/licenses/by-nc/4.0/)
