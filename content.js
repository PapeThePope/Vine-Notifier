// content.js

chrome.storage.local.get([
    "enabled","webhookURL","httpMethod","postBody",
    "minInterval","maxInterval","fromTime","toTime","filter","knownItems"
  ], data => {
    if (data.enabled === false) return;
  
    // Zeitfenster prüfen
    const now = new Date();
    const [h0, m0] = data.fromTime.split(':').map(Number);
    const [h1, m1] = data.toTime.split(':').map(Number);
    const start = new Date(now);
    start.setHours(h0, m0, 0, 0);
    const end = new Date(now);
    end.setHours(h1, m1, 0, 0);
    if (end <= start) end.setDate(end.getDate() + 1);
    if (now < start || now > end) {
      console.log('Außerhalb Zeitfenster, überspringe Überprüfung.');
      return;
    }
  
    const urlTpl  = data.webhookURL || '';
    const method  = data.httpMethod || 'GET';
    const bodyTpl = data.postBody || '';
    const filter  = (data.filter||'').toLowerCase();
    let minSec     = Number(data.minInterval)||60;
    let maxSec     = Number(data.maxInterval)||120;
    const knownSet = new Set(data.knownItems||[]);
  
    if (minSec<1) minSec=1;
    if (maxSec<minSec) maxSec=minSec;
  
    document.querySelectorAll('#vvp-items-grid .vvp-item-tile').forEach(tile => {
      // 1) Titel auslesen
    const titleEl = tile.querySelector('.vvp-item-product-title-container .a-truncate-full');
    const title   = titleEl?.textContent.trim()
                  || tile.querySelector('a')?.textContent.trim()
                  || '';
    if (!title || knownSet.has(title)) return;
    knownSet.add(title);
    if (!urlTpl) return;
    if (filter && !title.toLowerCase().includes(filter)) return;

    // 2) Link zur Produktseite
    const linkEl  = tile.querySelector('a.a-link-normal[href*="/dp/"]');
    const hrefRaw = linkEl?.getAttribute('href') || '';
    const link    = hrefRaw
      ? (hrefRaw.startsWith('http') ? hrefRaw : `${window.location.origin}${hrefRaw}`)
      : '';

    // 3) Bild-URL
    const imageUrl = tile.dataset.imgUrl
      || (tile.querySelector('img')?.src)
      || '';

    // 4) URL und Body mit allen Platzhaltern befüllen
    //    Neue Platzhalter: {ArticleLink}, {ImageUrl}
    const url  = urlTpl
      .replaceAll('{ArticleName}', encodeURIComponent(title))
      .replaceAll('{ArticleLink}', encodeURIComponent(link))
      .replaceAll('{ImageUrl}', encodeURIComponent(imageUrl));

    let body = bodyTpl
      .replaceAll('{ArticleName}', title)
      .replaceAll('{ArticleLink}', link)
      .replaceAll('{ImageUrl}', imageUrl);
  
      // Nachricht senden
      chrome.runtime.sendMessage({
        type: 'newItem', url, method, body
      });
      console.log('New item:', title);
    });
  
    chrome.storage.local.set({ knownItems: Array.from(knownSet) });
    const delay = minSec + Math.random()*(maxSec-minSec);
    console.log(`Refresh in ${delay.toFixed(1)}s`);
    setTimeout(()=>location.reload(), delay*1000);
  });