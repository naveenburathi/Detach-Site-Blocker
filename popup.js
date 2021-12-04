let site;
let siteList = [];
let defaultSites = [];
let temp = document.getElementsByClassName("defaultSites");


checkBox();
//checking the CHECKBOXES
function checkBox() {
  console.log("hello");
  for (var i = 0; i < temp.length; i++) {
    let c = temp[i].id;

    chrome.storage.sync.get(["sites"], function (obj) {
      if (obj.sites) {
        obj.sites.forEach((site) => {
          if (site.includes(c) || c.includes(site)) {
            $("#" + c).prop("checked", true);
            console.log("hell");
          }
        });
      }
    });
  }
}

chrome.storage.sync.get(["sites", "enabled"], function (obj) {
  if (obj.enabled === true) {
    $("#enabled").prop("checked", true);
    $(".left").addClass("blockMode");
  } else {
    $("#enabled").prop("checked", false);
    $(".left").removeClass("blockMode");
  }
});
updateList();

$("#site").on("input", function () {
  site = $("#site").val();
});

//REMOVES ALL SITES
$("#clearButton").click(function () {
  chrome.storage.sync.remove(["sites"], function (items) {});
  siteList = [];
  $(".defaultSites").each(function () {
    this.checked = false;
  });
  $("#blockedList").html("");
  $("#emptyList").removeClass("hide");
  $("#clearButton").addClass("hide");
});

//RECOMMENDED SITES ADD OR REMOVE BY CHECKBOX

$("#instagram").change(function () {
  let url = $("#instagram").val();
  if ($("#instagram").is(":checked")) {
    addSite(url);
  } else {
    removeUrl(url);
  }
});
$("#facebook").change(function () {
  let url = $("#facebook").val();
  if ($("#facebook").is(":checked")) {
    addSite(url);
  } else {
    removeUrl(url);
  }
});
$("#twitter").change(function () {
  let url = $("#twitter").val();
  if ($("#twitter").is(":checked")) {
    addSite(url);
  } else {
    removeUrl(url);
  }
});

$("#addSite").submit(function (e) {
  e.preventDefault();

  if ($("#site").val() === "") return;
  $("#site").val("");

  addSite(site);
});

//FUNCTION TO ADD SITES

function addSite(url) {
  chrome.storage.sync.get(["enabled"], function (obj) {
    if (obj.enabled) {
      checkSite(url);
    }
  });
  // checkSite(url);

  chrome.storage.sync.get(["sites"], function (obj) {
    let isBlock = 0;
    let newSiteList = [];

    if (obj.sites) {
      newSiteList = obj.sites;
      for (let i = 0; i < obj.sites.length; i++) {
        if (obj.sites[i].includes(url) || url.includes(obj.sites[i]))
          isBlock = 1;
      }
    }

    if (isBlock === 0) {
      newSiteList.push(url);
      // console.log(newSiteList);
      // console.log(siteList);
      chrome.storage.sync.set({ sites: newSiteList }, function () {});
      insertItem(url);
      checkBox();
    } else alert("The site you entered is already blocked!");
  });
}

//FUNCTION TO REMOVE THE ELEMENT from UI and BLOCKED LIST
$("#blockedList").on("click", ".removeButton", function () {
  let removedUrl = $(this).parent().text();
  $(this).parent().remove();
  removedUrl = removedUrl.substring(0, removedUrl.length - 1);
  // console.log(removedUrl);
  removeUrl(removedUrl);
});

//FUNCTION TO REMOVE AN ELEMENT FROM BLOCKED LIST

function removeUrl(url) {
  // console.log(url);

  chrome.storage.sync.get(["sites"], function (obj) {
    let newSiteList = [];
    for (let i = 0; i < obj.sites.length; i++) {
      // const element = array[i];
      if (!(obj.sites[i].includes(url) || url.includes(obj.sites[i])))
        newSiteList.push(obj.sites[i]);
    }
    if (newSiteList.length === 0) {
      $("#emptyList").removeClass("hide");
      $("#clearButton").addClass("hide");
    }
    chrome.storage.sync.set({ sites: newSiteList }, function () {});
    updateList();
  });
}
//ENABLE OR DISABLE CHECKBOX

$("#enabled").change(function () {
  if ($("#enabled").is(":checked")) {
    $(".left").addClass("blockMode");
    chrome.storage.sync.set({ enabled: true }, function () {});
    chrome.windows.getAll({ populate: true }, function (windows) {
      windows.forEach(function (window) {
        window.tabs.forEach(function (tab) {
          chrome.storage.sync.get(["sites", "enabled"], function (obj) {
            obj.sites.forEach((site) => {
              if (tab.url.includes(site) && obj.enabled) {
                alert(
                  "Some of the blocked sites is already opened.They will be blocked."
                );
                chrome.tabs.query({ windowType: "normal" }, function (tabs) {
                  if (tabs.length === 1) chrome.tabs.create({}, function () {});
                  chrome.tabs.remove(tab.id, function () {});
                });
              }
            });
          });
        });
      });
    });
  } else {
    $(".left").removeClass("blockMode");
    chrome.storage.sync.set({ enabled: false }, function () {});
  }
});

// CHECKS AND REMOVE IF THE LINK IS ALREADY PRESENT

function checkSite(url) {
  if (!siteList) return;
  chrome.windows.getAll({ populate: true }, function (windows) {
    windows.forEach(function (window) {
      window.tabs.forEach(function (tab) {
        if (tab.url.includes(url)) {
          // chrome.storage.sync.get(["enabled"])
          alert(
            "The site you just added is already opened and will be blocked."
          );
          chrome.tabs.query({ windowType: "normal" }, function (tabs) {
            if (tabs.length === 1) chrome.tabs.create({}, function () {});
            chrome.tabs.remove(tab.id, function () {});
          });
        }
      });
    });
  });
}

//FUNCTION TO ADD LISTS TO UI
function insertItem(site) {
  $("#emptyList").addClass("hide");
  $("#clearButton").removeClass("hide");
  const e = $(
    "<li >" + site + '<i class="removeButton fas fa-trash" > </i></li>'
  );
  $("#blockedList").append(e);
}

//FUNCTION TO UPDATE LIST
function updateList() {
  $("#blockedList").html("");
  chrome.storage.sync.get(["sites"], function (obj) {
    $("#emptyList").removeClass("hide");
    $("#clearButton").addClass("hide");
    if (obj.sites) {
      // console.log(obj.sites);
      for (let i = 0; i < obj.sites.length; i++) {
        // console.log(obj.sites[i]);
        $("#emptyList").addClass("hide");
        $("#clearButton").removeClass("hide");
        const e = $(
          "<li >" +
            obj.sites[i] +
            '<i class="removeButton fas fa-trash"> </i></li>'
        );
        $("#blockedList").append(e);
      }
    } else {
    }
  });
}

//FUNCTION TO GET SITES

function getSiteList() {
  let newSiteList = [];
  chrome.storage.sync.get(["sites"], function (obj) {
    if (obj.sites) {
      for (let i = 0; i < obj.sites.length; i++) {
        // const element = array[i];
        newSiteList.push(obj.sites[i]);
      }
    }
  });
  return newSiteList;
}
