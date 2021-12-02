let doDelete = function (el, count) {
  while (el.childNodes.length >= count) {
    el.removeChild(el.firstChild);
  }
};
let deleteChild = function (storeFileCount) {
  let frame = document.querySelector("iframe");
  if (
    frame &&
    frame.contentDocument.querySelector(".gwt-HTML.o-report-content")
  ) {
    doDelete(
      frame.contentDocument.querySelector(".gwt-HTML.o-report-content"),
      storeFileCount
    );
  } else {
    console.log("el not exist");
  }
};

let intervalCheckDelete = function () {
  chrome.storage.sync.get(
    { storeFileCount: 100, timeInterval: 2 },
    function (items) {
      let { timeInterval, storeFileCount } = items;
      deleteChild(storeFileCount);
      setTimeout(() => {
        console.log("execute check");
        intervalCheckDelete();
      }, timeInterval * 1000);
    }
  );
};

intervalCheckDelete();
