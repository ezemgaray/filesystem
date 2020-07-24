let currentPath
let timeOut = false

if (document.location.search) {
   let param = (document.location.search).split("=").pop()
   if (param != "") currentPath = param
   controller("update-menu")
   if (param == "trash/") controller("get-files")
} else {
   controller("update-menu")
}
// Stop default acction of <a> without link
$('main').on("click", 'a[href="#"]', function (e) {
   e.preventDefault()
})

/* --- MENU LISTENERS --- */

/**
 * show and hide folders in menu
 */
$("#menu-list").on("click", ".sidebar-dropdown>a", function () {
   if (
      $(this)
      .parent()
      .hasClass("active")
   ) {
      $(this)
         .parent()
         .removeClass("active")
      $(this).next().slideUp(200)
   } else {
      $(this).next().removeClass("active")
      $(this)
         .next(".sidebar-submenu")
         .slideDown(200)
      $(this)
         .parent()
         .addClass("active")
   }
});

/**
 * show clicked folder content
 */
$(".sidebar-menu").on("click", "a", function () {
   if ($(this).parent().parent().find(".open").length > 0) {
      $click = $(this)
      $(this).parent().parent().find(".open").each(function (i, opened) {
         if (!$click.is($(opened))) {
            $(opened).toggleClass("open")
            $(opened).children().first().toggleClass("fa-folder fa-folder-open")
         }
         if ($(opened).parent()
            .hasClass("active")) {
            $(opened).parent().removeClass("active")
            $(opened).next().slideUp("200")
         }
      })
   }
   $(".aside-view").html("")
   $(this).toggleClass("open")
   $(this).children().first().toggleClass("fa-folder fa-folder-open")

   if (timeOut)
      clearTimeout(timeOut)
   timeOut = setTimeout(() => {
      currentPath = getOpenFilePath()
      controller("get-files")
   }, 50);


   $(".sidebar-menu, .bread-crumb").animate({
      scrollLeft: $('.sidebar-menu').prop("scrollWidth")
   }, 1000);
})



/**
 * Print breadcrumb into main view
 * @param {*String} uri -> folder path
 */
function printBreadcrumb(uri) {
   switch (uri) {
      case undefined:
         $("#breadcrumb").text(" ")
         newFileFolderButtons()
         break;
      case "search":
         $("#breadcrumb").css("background-color", "#d4edda").html(`Results for: <b>"${$("#search").val()}"</b>`)
         break;
      case "search/":
         $("#breadcrumb").css("background-color", "#d4edda").html(`trash/`)
         break;
      default:
         $("#breadcrumb").removeAttr("style")
         let arrUri = uri.split("/")
         arrUri.pop()
         let link = ""
         $(arrUri).each(function (key, value) {
            link += value + "/"
            if ((key + 1) < arrUri.length)
               arrUri[key] = `<a href="?root=${link}">${value}</a> / `
            else
               arrUri[key] = `<span>${value}</span> / `

         })
         $("#breadcrumb").html(arrUri.join(""))
         newFileFolderButtons(uri)
         break;

   }
}

/**
 * Open folder on double click
 */
$("#folders").on("dblclick", "div.file", function (e) {
   $opened = $(".open").last().parent()
   let id = $(this).attr("data-id")
   $($opened.find('[data-id="' + id + '"]')).click()
})

$("#folders").on("dblclick", "div.in-search", function (e) {
   $opened = $(".open").last().parent()
   let arrayPath = $(this).attr("data-path").split("/")
   openFolders(arrayPath)
})

/**
 * Return the path of the open file.
 * To get the path of the file or folder that 
 * you want to display information, add the name of 
 * the clicked item in the central view
 * @param {*String} forInfo  -> name of folder or file clicked element.text()
 */
function getOpenFilePath(forInfo = "") {
   let uri = ""
   $(".open").each(function () {
      uri += $(this).text() + "/"
   })
   uri += forInfo.trim()
   return uri
}

/* --- SHOW FILE INFO --- */
$("#folders, #files").on("click", "div.file, div.in-search, div.in-trash", function (e) {
   controller("show-info", $(this).attr("data-path"))
})

/**
 * --- BUTTONS TO ADD FILE/FOLDER ---
 * print buttons to add folder or file
 * @param {*String} uri 
 */
function newFileFolderButtons(uri) {
   if (!$("#add-ff").is(':empty') && uri) {
      if(uri == "trash/") return
      $("#add-ff").html(`
         <a href="#" class="m-1 add-btn add-folder" data-toggle="tooltip" data-placement="top" title="Add Folder">
            <i class="fa fa-folder-plus button"></i>
         </a>
         <label for="add-new-file" class="mb-1 add-btn add-file" data-toggle="tooltip" data-placement="top" title="Add File">
            <i class="fa fa-file-medical button"></i>
            <input type="file" name="add-new-file" id="add-new-file" class="d-none">
         </label>
      `)
      $('.add-btn').tooltip()
   } else if (uri == "") {
      $("#add-ff").html(" ")
      folderMessage(`Sorry, you don't have access to other directories  <i class="fa fa-user-lock"></i>`)
      $("#folders-count").text("0")
      $("#files-count").text("0")
   }
}

/* --- FOLDER MESSAGE --- */
function folderMessage(message) {
   $("#folders").html(`<div class="alert alert-warning m-2 p-2" role="alert">${message}</div>`)

}

/**
 * --- CREATE FOLDER ---
 * generates the input and event to add folder. 
 * if it loses focus it is canceled
 */
$("#add-ff").on("click", "a.add-btn.add-folder", function (e) {
   $("#folders")
      .append($('<div class="border p-2 m-2 rounded file"></div>')
         .append($('<p> <i class="fa fa-folder mr-2"></i></p>')
            .append($('<input type="text" id="new-folder" class="new-folder" data-toggle="tooltip" data-placement="bottom" title="Enter to save. Click outside the input to cancel">'))
         )
      )
   $("#new-folder").focus()
   $('#new-folder').tooltip('show')
   $("#new-folder").keyup(function (e) {
      e.preventDefault()
      if (e.keyCode == 13) {
         controller("create-folder")
      }
   })
   $("#new-folder").blur(function () {
      $('.tooltip').tooltip('hide')
      $(this).parent().parent().remove()
   })
})

/**
 * --- ADD FILE ---
 * generates the input and event to add folder. 
 * if it loses focus it is canceled
 */
$("#add-ff").on("change", "#add-new-file", function (e) {
   addFile(currentPath)
})

/**
 * --- SHOW/REMOVE TOAST ---
 * Show meesage (succes - ajax)
 * @param {*Object} data 
 */
function showToast(data) {
   let toast = `<div class="toast" role="alert" aria-live="assertive" aria-atomic="true" data-delay="10000">
      <div class="toast-header">
      <i class="rounded mr-2 fa fa-${data.thumb} text-${data.type}" ></i>
      <strong class="mr-auto text-${data.type}">  ${data.subject} </strong>
      <button type="button" class="close" data-dismiss="toast" aria-label="Close">
      <span aria-hidden="true">&times;</span>
      </button></div>
      <div class="toast-body">
      <b>${data.message}</b>
   </div></div> `
   $(".toast-container").append(toast);
   $('.toast').toast('show');
   $('.toast').on('hidden.bs.toast', function () {
      $(this).remove()
   })
}

/**
 * --- SHOW TOAST CONFIRM ---
 * Show meesage (succes - ajax)
 * @param {*Object} data 
 */
function showToastConfirm(subject, message, handler) {
   let toast = `<div class="toast" role="alert" aria-live="assertive" aria-atomic="true" data-delay="15000">
      <div class="toast-header">
      <i class="rounded mr-2 fa fa-exclamation-triangle text-danger" ></i>
      <strong class="mr-auto text-danger">  ${subject} </strong>
      <span class="float-right mr-2 timer"></span>
      <button type="button" class="close" data-dismiss="toast" aria-label="Close">
      <span aria-hidden="true">&times;</span>
      </button></div>
      <div class="toast-body">
      <b>${message}</b>
      <div class="m-2 text-right">
         <button type="button" class="btn btn-danger btn-sm" id="confirm-yes">YES</button>
         <button type="button" class="btn btn-success btn-sm" class="close" data-dismiss="toast" aria-label="Close" id="confirm-no">NO</button>
      </div>
   </div></div> `
   $("#toast-confirm").append(toast);
   $('#toast-confirm .toast').toast('show');

   var start = 15;
   let interval = setInterval(function () {
      start--
      $('.timer').text(start + " Seconds");
      if (start == 0)
         clearInterval(interval)
   }, 1000);

   $("#confirm-yes").click(function () {
      clearInterval(interval)
      $('#toast-confirm').html("")
      handler(true)
   })
   $('.close').click(function () {
      clearInterval(interval)
      handler(false)
   })
   $('.toast').on('hidden.bs.toast', function () {
      $(this).remove()
      clearInterval(interval)
      handler(false)
   })
}


/**
 * Open current folder
 * @param {*Array} arrayPath  - Folder Names to open
 */
function openFolders(arrayPath) {
   let aux
   $(arrayPath).each(function (key, name) {
      if (key == 0) {
         let checkOpen = $('#menu-list [data-name="' + name + '"]')
         if (checkOpen && !checkOpen.hasClass("open")) {
            checkOpen.click()
         }
            aux = $('#menu-list [data-name="' + name + '"]')
      } else {

         let checkOpen = $('[data-id="' + aux[0].dataset.id + '"] ~ div > ul > li > a[data-name="' + name + '"]') 
         if (checkOpen && !checkOpen.hasClass("open")) {
            checkOpen.click()
         }
         aux = $('[data-id="' + aux[0].dataset.id + '"]  ~ div  a[data-name="' + name + '"]')
      }
   })
}

/**
 * --- CHANGE NAME ---
 * generates the input and the event to send the request. 
 * if it loses focus it is canceled
 */
function editName(elem) {
   let innerElem = $(elem).html()
   let icon = $(elem).find("i")
   let name = $(elem).text()
   let extension = $(elem).attr("data-ext") == "folder" ? "" : "." + $(elem).attr("data-ext")
   let fullName = (name + extension).trim()
   $(elem).first().text("")
   $(elem).append($(`<p></p>`).append(icon)
      .append($('<input type="text" id="rename-folder" class="new-folder" data-toggle="tooltip" data-placement="bottom" title="Enter to save. Click outside the input to cancel">')).append(" " + extension))
   $("#rename-folder").focus()
   $('#rename-folder').tooltip('show')
   $("#rename-folder").keyup(function (e) {
      e.preventDefault()
      if (e.keyCode == 13) {
         let newName = $("#rename-folder").val().trim() + extension
         let data = {
            oldName: fullName,
            newName: newName
         }
         controller("change-name", data)
      }
   })
   $("#rename-folder").blur(function () {
      $('.tooltip').tooltip('hide')
      $(elem).html(innerElem)
   })
}

/**
 * Show tooltip on mouse over
 */
$("body").on("mouseenter mouseleave", '[data-toggle="tooltip"]', function () {
   $(this).tooltip()
})

/**
 * --- CONTEXT MENU ---
 * generates the context menu
 */
var contextFile = CtxMenu(".file");
contextFile.addItem("Change Name  ", function (e) {
   editName(e)
}, "https://image.flaticon.com/icons/svg/598/598234.svg");

contextFile.addSeperator();

contextFile.addItem("Delete", function (e) {
   showToastConfirm("Move to Trash", `Are you sure?? Move to trash "${$(e).text().trim()}"`, function (confirm) {
      if (confirm) {
         controller("move-trash", e)
      }
   })
}, "https://image.flaticon.com/icons/svg/60/60761.svg");

var contextFileTrash = CtxMenu(".in-trash");
contextFileTrash.addItem("Delete", function (e) {
   showToastConfirm("Delete Permanently", `Are you sure?? Delete "${$(e).text().trim()}"`, function (confirm) {
      if (confirm) {
         controller("delete", e)
      }
   })
}, "https://image.flaticon.com/icons/svg/60/60761.svg");

// ----- -------- ------ //
// ----- REQUESTS ------ //
// ----- -------- ------ //

function controller(action, extraData = null) {
   let url
   let data
   switch (action) {
      case "get-files":
         /**
          * --- REQUEST FILES ---
          * Print folders and files of the current open folder
          */
         $("#folders").html("")
         $("#files").html("")
         if (currentPath && (currentPath.includes("root/") || currentPath.includes("trash/"))) {
            printBreadcrumb(currentPath)
            url = "actions/search.php"
            data = {
               "root": "../" + currentPath
            }
            runAction(action, url, data)

         } else {
            window.history.pushState({
               path: "null"
            }, "", 'http://localhost/filesystem/index.php?root=');
            newFileFolderButtons("")
            printBreadcrumb("")
         }
         break

      case "update-menu":
         /**
          * --- UPDATE MENU ---
          */
         url = "actions/print-menu.php"
         data = {
            "from": "../root/"
         }
         runAction(action, url, data)
         break
      case "show-info":
         /**
          * --- SHOW INFO ---
          * Show info (folder/file)
          * @extraData {*String} Path from data-path html attribute
          */
         url = extraData.includes("trash") ? "actions/show-trash-info.php" : "actions/show-info.php"
         data = {
            "path": "../" + extraData
         }
         runAction(action, url, data)
         break

      case "create-folder":
         /**
          * --- CREATE FOLDER ---
          * Create folder - Set data with input value
          */
         url = "actions/create-folder.php"
         data = {
            "path": "../" + currentPath + $("#new-folder").val().trim() + "/",
            "name": $("#new-folder").val().trim()
         }
         runAction(action, url, data)
         break

      case "change-name":
         /**
          * --- CHANGE NAME ---
          * Change name (folder/file)
          * @extraData {*Obkect} oldName, newName
          */
         url = "actions/change-name.php"
         data = {
            "path": "../" + currentPath,
            "old-name": extraData.oldName,
            "new-name": extraData.newName
         }
         runAction(action, url, data)
         break
      case "move-trash":
         /**
          * --- MOVE TO TRASH ---
          * Move element to trash
          * @extraData {*HTML Element} elem 
          */
         let name = $(extraData).text().trim()
         let extension = $(extraData).attr("data-ext") == "folder" ? "" : "." + $(extraData).attr("data-ext")
         let fullName = (name + extension).trim()
         url = "actions/move-trash.php"
         data = {
            "path": currentPath,
            "name": name,
            "full-name": fullName,
            "extension": extension
         }
         runAction(action, url, data)
         break
      case "delete":
         /**
          * --- DELETE PERMANENTLY ---
          * Move element to trash
          * @extraData {*HTML Element} elem 
          */
         url = "actions/delete.php"
         data = {
            "path": "../" + $(extraData).attr("data-path"),
            "name": $(extraData).text()
         }
         runAction(action, url, data)
         break
   }

}

function runAction(action, url, data) {
   $.ajax({
      type: "POST",
      url: url,
      data: data,
      success: function (data) {
         runSuccess(action, data)
      }
   })
}

function runSuccess(action, data) {
   switch (action) {
      case "get-files":
         data = JSON.parse(data)
         $("#folders").html("").html(data.folders)
         $("#files").html("").html(data.files)
         $("#folders-count").text($("#folders").children().length)
         $("#files-count").text($("#files").children().length)
         let folder = currentPath.split("/")
         folder.pop()
         folder = folder.pop()
         window.history.pushState({
            path: folder
         }, folder, 'http://localhost/filesystem/index.php?root=' + currentPath);
         break

      case "update-menu":
         data = JSON.parse(data)
         $("#menu-list").html("").append(data.menu)
         let arrayPath = currentPath ? currentPath.split("/") : "root/".split("/")

         arrayPath.pop()
         if (arrayPath[0] != "root" && arrayPath[0] != "trash") {
            folderMessage(`Folder not found <i class="fa fa-search-minus">`)
            $('#trash-count').text(data.trash);
            $('[data-toggle="tooltip"]').tooltip("hide")
            return
         }
         openFolders(arrayPath)
         $('#trash-count').text(data.trash);
         $('[data-toggle="tooltip"]').tooltip("hide")
         break

      case "show-info":
         $(".aside-view").html("").append(data)
         break

      case "create-folder":
         data = JSON.parse(data)
         if (data.type == "success") {
            controller("update-menu")
            showToast(data)
         } else {
            $("#new-folder").parent().addClass("error")
            $('#new-folder').tooltip('hide')
               .attr('data-original-title', data.message).tooltip('show')
            showToast(data)
         }
         break

      case "change-name":
         data = JSON.parse(data)
         if (data.type == "success") {
            controller("update-menu")
            showToast(data)
         } else {
            $("#rename-folder").parent().addClass("error")
            $('#rename-folder').tooltip('hide')
               .attr('data-original-title', data.message).tooltip('show')
            showToast(data)
         }
         break

      case "move-trash":
         data = JSON.parse(data)
         if (data.type == "success") {
            controller("update-menu")
            showToast(data)
         } else {
            showToast(data)
         }
         break

      case "delete":
         data = JSON.parse(data)
         if (data.type == "success") {
            controller("update-menu")
            controller("get-files")
            showToast(data)
         } else {
            showToast(data)
         }
         break
   }
}

/* --- SEARCH --- */
$("#search").keyup(function () {
   let value = $("#search").val()
   $.ajax({
      type: "POST",
      url: "actions/search.php",
      data: {
         "search": value,
         "root": "../root/"
      },
      success: function (data) {
         data = JSON.parse(data)
         if (value) {
            printBreadcrumb("search")
         } else {
            controller("get-files")

            printBreadcrumb(currentPath)
         }
         $("#folders").html("").html(data.folders)
         $("#files").html("").html(data.files)
         $("#folders-count").text($("#folders").children().length)
         $("#files-count").text($("#files").children().length)
      }
   })
})

/* --- ADD FILE --- */
function addFile(path) {
   let data = new FormData()
   data.append('file', $('#add-new-file')[0].files[0]);
   data.append("path", "../" + path)
   $.ajax({
      type: "POST",
      url: "actions/add-file.php",
      cache: false,
      contentType: false,
      processData: false,
      data: data,
      success: function (data) {
         data = JSON.parse(data)
         if (data.type == "success") {
            controller("update-menu")
            showToast(data)
         } else {
            showToast(data)
         }
      }
   })
}