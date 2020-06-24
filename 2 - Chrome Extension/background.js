chrome.tabs.executeScript(tabId, {file: "body-pix.js"}, function(){
chrome.tabs.executeScript(tabId, {file: "tfjs.js"}, function() {
    console.log("test");
});
});