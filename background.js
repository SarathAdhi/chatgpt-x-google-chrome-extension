chrome.tabs.onUpdated.addListener(function () {
  chrome.tabs.query({ active: true }, async (tabs) => {
    let url = tabs[0].url;

    if (url.includes("google.com")) {
      let paramString = url.split("?")[1];
      let queryString = new URLSearchParams(paramString);

      for (let pair of queryString.entries()) {
        chrome.tabs.sendMessage(tabs[0].id, {
          name: "google-query",
          query: pair[1],
        });

        break;
      }
    }

    return true;
  });

  return true;
});
