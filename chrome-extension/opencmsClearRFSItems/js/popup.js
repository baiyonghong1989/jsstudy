chrome.storage.sync.get(
  { storeFileCount: 100, timeInterval: 2 },
  function (items) {
    let { timeInterval, storeFileCount } = items;
    document.querySelector("#timeInterval").value = timeInterval;
    document.querySelector("#storeFileCount").value = storeFileCount;
  }
);

document.querySelector("#confirmBtn").addEventListener("click", () => {
  let timeInterval = document.querySelector("#timeInterval").value;
  let storeFileCount = document.querySelector("#storeFileCount").value;
  chrome.storage.sync.set({ storeFileCount, timeInterval });
});
