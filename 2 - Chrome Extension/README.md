# Chrome-Extension:
* we have a manifest file from which we are loading our script.
* if user has our extension installed, it will load our script to takeOver the camera.

Steps to install this project as your chrome extension:
1. clone or download this project.
2. Open the Extension Management page by navigating to chrome://extensions.
3. The Extension Management page can also be opened by clicking on the Chrome menu, hovering over More Tools then selecting Extensions.
4. Enable Developer Mode by clicking the toggle switch next to Developer mode.
5. Click the LOAD UNPACKED button and select this directory.
TO DO:
Make this extension available in web-store.

# Notes:

* Persistent Storage & Reads: Since our combined.js is technically not a content script but an injected script, it doesn't have the exposure to chrome APIs.
 * To overcome that drawback, we pass the messages on update/onchange from the base.js(content script) to combined.js.
 * base.js and the popup have all the access to chrome APIs.
 * [TODO]: Update popup on-load with last saved config.
