var stampCount=0;
var timer;
var channelId = "";
$(window).on('load', () => {
    getChannelId();
    waitforStamps();
    timer = setInterval(waitforStamps, 500);
});
$("#applyBtn").on("click", () => {
    order = getOrder();
    applyOrder(order);
});
function waitforStamps(){
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { operation: "getOrder" }, function (response) {
            console.log(stampCount,response.length);
            if(stampCount == response.length && stampCount > 0){
                clearInterval(timer);
                $("#overlay").css("display","none");
            }else{
                stampCount = response.length;
            }
            console.log(response);
            displayStamps(response);
        });
    });
}

function displayStamps(images) {
    document.querySelector("#stamplist").innerHTML = "";
    images.forEach(function (v) {
        console.log(v.src);
        tmp = document.createElement("img");
        tmp.src = v.src;
        tmp.id = v.label;
        tmp.draggable = "true";
        $('#stamplist').append(tmp);
    });
    $('#stamplist').sortable({
        opacity: 0.5,
        placeholder: "ph1"
    });

}
function applyOrder(order){
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { operation: "applyOrder",order: order},function (response) {
            console.log(response);
        });
    });
    chrome.storage.local.set({[channelId]: order}, function() {console.log('stored to '+channelId);});
}
function getOrder(){
    return $("#stamplist").sortable("toArray");
}
function getChannelId(){
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { operation: "getChid" }, function (response) {
            channelId = response;
        });
    });
}