chrome.runtime.onInstalled.addListener(function () {
  console.log("running first time");
  chrome.storage.local.get(["sites", "enabled"], function (obj) {
   if(!obj.sites)
   {
     chrome.storage.sync.set({sites:[],function(){}})
   }
   if(!obj.enabled)
   {
     chrome.storage.sync.set({enabeld:false})
   }
  });
});


chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {

  let en = false;
  chrome.storage.sync.get(["enabled"], function (obj) {
    const url = changeInfo.pendingUrl || changeInfo.url;
    if (url && url.startsWith("http")&&obj.enabled) {
      
      chrome.storage.sync.get(["sites"], function (obj) {
        obj.sites.forEach((site) => {
          if (url.includes(site)) {
            chrome.tabs.query({windowType:'normal'}, function(tabs) {
              if(tabs.length===1)
              chrome.tabs.create({},function(){})
   chrome.tabs.remove(tabId,function () {
              alert("You just tried to access a blocked site.");
            })
}); 
            
          }
        });
      });
    }
  });
});

