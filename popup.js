(function() {
  // Load translations JSON from locales folder
  function loadTranslations(lang) {
    const url = chrome.runtime.getURL(`locales/${lang}.json`);
    return fetch(url).then(res => res.json());
  }

  // Apply translations for text elements and placeholder
  function applyTranslations(translations) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[key]) el.textContent = translations[key];
    });
    const filterInput = document.getElementById('filter');
    if (translations.filterPlaceholder) {
      filterInput.placeholder = translations.filterPlaceholder;
    }
  }

  // Flag elements for language selection
  const flags = {
    de: document.getElementById('lang-de'),
    en: document.getElementById('lang-en')
  };

  // Set language, highlight flag, and load translations
  function setLanguage(lang) {
    chrome.storage.local.set({ language: lang });
    loadTranslations(lang)
      .then(applyTranslations)
      .catch(err => console.error('i18n load error:', err));
    Object.keys(flags).forEach(key => {
      flags[key].classList.toggle('selected', key === lang);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('settingsForm');
    const httpMethod = document.getElementById('httpMethod');
    const bodyContainer = document.getElementById('bodyContainer');
    const statusMsg = document.getElementById('statusMsg');

    // Language flags click handlers
    flags.de.addEventListener('click', () => setLanguage('de'));
    flags.en.addEventListener('click', () => setLanguage('en'));

    // Toggle POST body field
    httpMethod.addEventListener('change', () => {
      bodyContainer.style.display = httpMethod.value === 'POST' ? 'block' : 'none';
    });

    // Load saved settings and translations
    chrome.storage.local.get([
      'language', 'enabled', 'webhookURL', 'httpMethod', 'postBody',
      'minInterval', 'maxInterval', 'fromTime', 'toTime', 'filter'
    ], data => {
      const lang = data.language || 'de';
      setLanguage(lang);
      document.getElementById('enabledSwitch').checked = data.enabled !== false;
      document.getElementById('webhookUrl').value = data.webhookURL || '';
      httpMethod.value = data.httpMethod || 'GET';
      document.getElementById('postBody').value = data.postBody || '';
      document.getElementById('minInterval').value = data.minInterval || '';
      document.getElementById('maxInterval').value = data.maxInterval || '';
      document.getElementById('fromTime').value = data.fromTime || '';
      document.getElementById('toTime').value = data.toTime || '';
      document.getElementById('filter').value = data.filter || '';
      bodyContainer.style.display = httpMethod.value === 'POST' ? 'block' : 'none';
    });

    // Save settings handler
    form.addEventListener('submit', e => {
      e.preventDefault();
      const lang = Object.keys(flags).find(k => flags[k].classList.contains('selected')) || 'de';
      const isEnabled = document.getElementById('enabledSwitch').checked;
      const url = document.getElementById('webhookUrl').value.trim();
      const method = httpMethod.value;
      const body = document.getElementById('postBody').value;
      const minI = parseInt(document.getElementById('minInterval').value, 10);
      const maxI = parseInt(document.getElementById('maxInterval').value, 10);
      const fromTime = document.getElementById('fromTime').value;
      const toTime = document.getElementById('toTime').value;
      const filter = document.getElementById('filter').value.trim();

      // Validate required fields
      if (!url || minI < 1 || maxI < 1 || !fromTime || !toTime) {
        chrome.storage.local.get('language', ({ language }) => {
          loadTranslations(language || 'de').then(trans => {
            statusMsg.textContent = trans.saveError;
          });
        });
        return;
      }

      // Save all settings
      chrome.storage.local.set({
        language: lang,
        enabled: isEnabled,
        webhookURL: url,
        httpMethod: method,
        postBody: body,
        minInterval: minI,
        maxInterval: maxI,
        fromTime: fromTime,
        toTime: toTime,
        filter: filter
      }, () => {
        loadTranslations(lang).then(trans => {
          statusMsg.textContent = trans.saveSuccess;
          setTimeout(() => { statusMsg.textContent = ''; }, 2000);
        });
      });
    });
  });
})();