
var s = document.createElement('script');
// TODO: add "script.js" to web_accessible_resources in manifest.json
s.src = chrome.runtime.getURL('combined.js');
(document.head || document.documentElement).appendChild(s);
