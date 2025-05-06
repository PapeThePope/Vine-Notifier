// background.js

chrome.runtime.onMessage.addListener(msg => {
    if (msg.type !== 'newItem') return;
    const opts = { method: msg.method || 'GET' };
    if (msg.method === 'POST') {
      opts.headers = { 'Content-Type': 'application/json' };
      opts.body = msg.body;
    }
    fetch(msg.url, opts)
      .then(res => console.log('Webhook', opts.method, 'Status:', res.status))
      .catch(err => console.error('Webhook error:', err));
  });