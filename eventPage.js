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

function checkOne() {
  
}
//     } else {
//         // Checkbox is not checked..
//     }
// });
// $('#enabled').change(
//   function () {
//     if($('#enabled').is(':checked')){
//       chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
//      const url = changeInfo.pendingUrl || changeInfo.url;
//   if (url && url.startsWith("http")) {
//       console.log(url.substring(0,26));
//     chrome.storage.sync.get(["sites"],function (obj) {
//         obj.sites.forEach(site => {
//             if(url.includes(site))
//             {alert("oops! u are on blocked site");}
//         });
//     })
//   }
// });
//     }
//   }
// )

//     chrome.tabs.query({},function(tabs){
//     tabs.forEach(function(tab){
//     if(tab.url.substring(0,26)==="https://www.instagram.com/")
//     {
//         const opt={
//     type:"basic",
//     title:"Alert",
//     message:"You got distracted from your task.",
//     iconUrl:"icon128.png"
// }
// chrome.notifications.create("alertN",opt);
// chrome.notifications.clear("alertN");
//     }
//     });
//  });

// // const opt={
// //     type:"basic",
// //     title:"Alert",
// //     message:"You got distracted from your task.",
// //     iconUrl:"icon128.png"
// // }
