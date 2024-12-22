/******/ (() => { // webpackBootstrap
/*!**************************************!*\
  !*** ./src/background/background.js ***!
  \**************************************/
// filepath: /Users/tedgoh/RAYdar/src/background/background.js
let lastMessage = null;

chrome.runtime.onInstalled.addListener(() => {
  console.log("extension installed");
});

chrome.bookmarks.onCreated.addListener(() => {
  console.log("extension bookmarked");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "ARTICLE_TEXT_VALUE") {
    lastMessage = message;
    chrome.runtime.sendMessage(message);
  }
});

chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "popup") {
    if (lastMessage) {
      port.postMessage(lastMessage);
    }
  }
});

/******/ })()
;
//# sourceMappingURL=background.js.map