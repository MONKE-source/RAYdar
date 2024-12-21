chrome.runtime.onInstalled.addListener(() => {
  console.log("extension installed");
});

chrome.bookmarks.onCreated.addListener(() => {
  console.log("extension bookmarked");
});
