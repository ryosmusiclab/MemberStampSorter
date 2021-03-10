var timer;
$(window).on('load', () => {
  bgtimer = setInterval(function(){
    container = document.querySelector("div#categories div#emoji");
    if(container == undefined){
      console.log("loaded");
      document.querySelector("#input-panel #buttons #button").click();
      document.querySelector("#input-panel #buttons #button").click();
      channelId = getChannelId();
      console.log(channelId);
      chrome.storage.local.get(function (items) {
        order = items[channelId];
        if (order != null) {
          console.log(order);
          timer = setInterval(function(){
            result = applyOrder(order);
            if(result == order.length){
              console.log("finished.");
              clearInterval(timer);
            }
          }, 100);
        }else{
          console.log("not stored");
        }
      });
    }
  },100);
});
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  //console.log(msg);
  if (msg.operation == "getOrder") {
    container = document.querySelector("div#categories div#emoji");
    array = [].slice.call(container.querySelectorAll("img"))
      .map(function (v) {
        src = v.getAttribute('src');
        label = v.getAttribute('aria-label');
        return { src: src, label: label }
      });
    sendResponse(array);

  } else if (msg.operation == "applyOrder") {
    order = msg.order;
    console.log(order);
    applyOrder(order);
    sendResponse("done");
  } else if (msg.operation == "getChid") {
    sendResponse(getChannelId());
  }
});

function applyOrder(order) {
  container = document.querySelector("div#categories div#emoji");
  array = [].slice.call(container.querySelectorAll("img"));
  array.sort(function (a, b) {
    return order.indexOf(a.getAttribute("aria-label")) - order.indexOf(b.getAttribute("aria-label"));
  }).forEach(function (v) { container.append(v) });
  return array.length;
}
function getChannelId(){
  return document.querySelector("#input-panel #category-buttons").firstElementChild.id;
}