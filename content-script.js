chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // message的数据格式取决于发送时的数据
    const { start } = message;
  
    if (start) {
      const images = document.getElementsByTagName('img');
      const imgSrcList = Array.from(images).map((img) => img.src);
      const description = document.querySelector('meta[name="description"]').getAttribute('content');
      sendResponse({
        description,
        imgSrcList,
      });
    }
  });