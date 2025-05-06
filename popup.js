// popup.js

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("settingsForm");
    const statusMsg = document.getElementById("statusMsg");
    const enabledSwitch = document.getElementById("enabledSwitch");
    const httpMethod = document.getElementById("httpMethod");
    const bodyContainer = document.getElementById("bodyContainer");
  
    // Sichtbarkeit Body-Feld bei Methode wechseln
    httpMethod.addEventListener("change", () => {
      bodyContainer.style.display = httpMethod.value === 'POST' ? 'block' : 'none';
    });
  
    // Lade Einstellungen
    chrome.storage.local.get([
      "enabled", "webhookURL", "httpMethod", "postBody",
      "minInterval", "maxInterval", "fromTime", "toTime", "filter"
    ], data => {
      enabledSwitch.checked = data.enabled !== false;
      document.getElementById('webhookUrl').value = data.webhookURL || '';
      httpMethod.value = data.httpMethod || 'GET';
      document.getElementById('postBody').value = data.postBody || '';
      document.getElementById('minInterval').value = data.minInterval || '';
      document.getElementById('maxInterval').value = data.maxInterval || '';
      document.getElementById('fromTime').value = data.fromTime || '';
      document.getElementById('toTime').value = data.toTime || '';
      document.getElementById('filter').value = data.filter || '';
      // Body-Feld initial anzeigen/verstecken
      bodyContainer.style.display = httpMethod.value === 'POST' ? 'block' : 'none';
    });
  
    // Speichern
    form.addEventListener("submit", e => {
      e.preventDefault();
      const isEnabled = enabledSwitch.checked;
      const url       = form.webhookUrl.value.trim();
      const method    = httpMethod.value;
      const body      = document.getElementById('postBody').value;
      const minI      = parseInt(form.minInterval.value, 10);
      const maxI      = parseInt(form.maxInterval.value, 10);
      const fromTime  = form.fromTime.value;
      const toTime    = form.toTime.value;
      const filter    = form.filter.value.trim();
  
      // Validierungen
      if (!url || minI<1||maxI<1||!fromTime||!toTime) {
        statusMsg.textContent = "Bitte alle Pflichtfelder korrekt ausfüllen.";
        return;
      }
      if (minI > maxI) {
        statusMsg.textContent = "Min darf nicht größer als Max sein.";
        return;
      }
  
      chrome.storage.local.set({
        enabled:    isEnabled,
        webhookURL: url,
        httpMethod: method,
        postBody:   body,
        minInterval: minI,
        maxInterval: maxI,
        fromTime:   fromTime,
        toTime:     toTime,
        filter:     filter
      }, () => {
        statusMsg.textContent = "Gespeichert!";
        setTimeout(() => statusMsg.textContent = '', 2000);
      });
    });
  });