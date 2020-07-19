let currentPath
let timeOut = false

if (document.location.search) {
   let param = (document.location.search).split("=").pop()
   if (param == "trash/") {
      currentPath = param
   }
   updateMenu(param)
   sendRequestFiles()

} else {
   updateMenu()
}
// Stop default acction of <a> without link
$('main').on("click", 'a[href="#"]', function (e) {
   e.preventDefault()
})

/* --- MENU LISTENERS --- */
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
      currentPath = ""
      currentPath = getOpenFilePath()
      sendRequestFiles()
   }, 50);


   $(".sidebar-menu, .bread-crumb").animate({
      scrollLeft: $('.sidebar-menu').prop("scrollWidth")
   }, 1000);
})

/* --- REQUEST FILES --- */

function sendRequestFiles() {
   $("#folders").html("")
   $("#files").html("")
   if (currentPath) {
      printBreadcrumb(currentPath)

      $.ajax({
         type: "POST",
         url: "search.php",
         data: {
            "root": currentPath
         },
         success: function (data) {
            // if (currentPath != getOpenFilePath()) return
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
         }
      })
   } else {
      printBreadcrumb(currentPath)
   }
}

/**
 * Print breadcrumb into main view
 * @param {*String} uri -> folder path
 */
function printBreadcrumb(uri) {
   console.log(uri);
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

$("#folders").on("dblclick", "div.file", function (e) {
   $opened = $(".open").last().parent()
   let id = $(this).attr("data-id")
   $($opened.find('[data-id="' + id + '"]')).click()
})

/**
 * Retur the path of the open file.
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

/* --- SHOW INFO --- */
$("#folders, #files").on("click", "div.file", function (e) {
   showInfo($(this).attr("data-path"))
})

function showInfo(path) {
   let url = path.includes("trash") ? "show-trash-info.php" : "show-info.php"
   $.ajax({
      type: "POST",
      url: url,
      data: {
         "path": path
      },
      success: function (data) {
         $(".aside-view").html("").append(data)
      }
   })
}

/* --- BUTTONS TO ADD FILE/FOLDER --- */

/**
 * print buttons to add folder or file
 * @param {*String} uri 
 */
function newFileFolderButtons(uri) {
   console.log(uri);
   if (!$("#add-ff").is(':empty') && uri) {
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
      $("#folders").html(`<div class="alert alert-warning m-2 p-2" role="alert">Sorry, you don't have access to other directories  <i class="fa fa-user-lock"></i></div>`)
      $("#folders-count").text("0")
      $("#files-count").text("0")
   }
}

/* --- ADD FOLDER --- */

/**
 * generates the input and event to add folder. 
 * if it loses focus it is canceled
 */
$("#add-ff").on("click", "a.add-btn.add-folder", function (e) {
   $("#folders")
      .append($('<div class="border p-2 m-2 rounded"></div>')
         .append($('<p> <i class="fa fa-folder mr-2"></i></p>')
            .append($('<input type="text" id="new-folder" class="new-folder" data-toggle="tooltip" data-placement="top" title="Enter to save. Click outside the input to cancel">'))
         )
      )
   $("#new-folder").focus()
   $('#new-folder').tooltip('show')
   $("#new-folder").keyup(function (e) {
      e.preventDefault()
      if (e.keyCode == 13) {
         createFolder(currentPath + $("#new-folder").val().trim() + "/")
      }
   })
   $("#new-folder").blur(function () {
      $('.tooltip').tooltip('hide')
      $(this).parent().parent().remove()
   })
})

function createFolder(path) {
   $.ajax({
      type: "POST",
      url: "create-folder.php",
      data: {
         "path": path,
         "name": $("#new-folder").val().trim()
      },
      success: function (data) {
         data = JSON.parse(data)
         if (data.type == "success") {
            updateMenu(currentPath)
            showToast(data)
         } else {
            $("#new-folder").parent().addClass("error")
            $('#new-folder').tooltip('hide')
               .attr('data-original-title', data.message).tooltip('show')
            showToast(data)
         }
      }
   })
}

/* --- ADD FILE --- */

/**
 * generates the input and event to add folder. 
 * if it loses focus it is canceled
 */
$("#add-ff").on("change", "#add-new-file", function (e) {
   addFile(currentPath)
})

function addFile(path) {
   let data = new FormData()
   data.append('file', $('#add-new-file')[0].files[0]);
   data.append("path", path)
   $.ajax({
      type: "POST",
      url: "add-file.php",
      cache: false,
      contentType: false,
      processData: false,
      data: data,
      success: function (data) {
         data = JSON.parse(data)
         if (data.type == "success") {
            updateMenu(currentPath)
            showToast(data)
         } else {
            showToast(data)
         }
      }
   })
}

/* --- SHOW/REMOVE TOAST --- */

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

/* --- UPDATE MENU --- */

/**
 * Update the folder menu and access the current folder.
 * By default access the root.
 * @param {*String} path 
 */
function updateMenu(path = "root/") {
   $.ajax({
      type: "POST",
      url: "print-menu.php",
      data: {
         "from": "root/"
      },
      success: function (data) {
         data = JSON.parse(data)
         $("#menu-list").html("").append(data.menu)
         let arrayPath = path.split("/")
         arrayPath.pop()
         let aux
         $(arrayPath).each(function (key, name) {
            if (key == 0) {
               if ($('#menu-list [data-name="' + name + '"]')) {
                  $('#menu-list [data-name="' + name + '"]').click()
                  aux = $('#menu-list [data-name="' + name + '"]')
               }
            } else {

               if ($('[data-id="' + aux[0].dataset.id + '"] ~ div > ul > li > a[data-name="' + name + '"]')) {
                  $('[data-id="' + aux[0].dataset.id + '"]  ~ div > ul > li > a[data-name="' + name + '"]').click()
               }
               aux = $('[data-id="' + aux[0].dataset.id + '"]  ~ div  a[data-name="' + name + '"]')
            }
         })
         // print number of elements into trash
         $('#trash-count').text(data.trash);
         $('[data-toggle="tooltip"]').tooltip("hide")
      }
   })

}

/* --- CONTEXT MENU --- */
/**
 * generates the context menu
 */
var contextMenu = CtxMenu(".file");
contextMenu.addItem("Change Name  ", function (e) {
   editName(e)
}, "https://image.flaticon.com/icons/svg/598/598234.svg");

contextMenu.addSeperator();

contextMenu.addItem("Delete", function (e) {
   if (confirm("Are you sure? Delete " + $(e).text() + ($(e).attr("data-ext") == "folder" ? "/" : "." + $(e).attr("data-ext")))) {
      if ($(e).attr("data-path").includes("trash/"))
         deletePermanently(e)
      else
         moveToTrash(e)
   }
}, "https://image.flaticon.com/icons/svg/60/60761.svg");


/* --- CHANGE NAME --- */

/**
 * generates the input and the event to send the request. 
 * if it loses focus it is canceled
 */
function editName(elem) {
   let icon = $(elem).find("i")
   let name = $(elem).text()
   let extension = $(elem).attr("data-ext") == "folder" ? "" : "." + $(elem).attr("data-ext")
   let fullName = (name + extension).trim()
   $(elem).first().text("")
   $(elem).append($(`<p></p>`).append(icon)
      .append($('<input type="text" id="rename-folder" class="new-folder" data-toggle="tooltip" data-placement="top" title="Enter to save. Click outside the input to cancel">')).append(" " + extension))
   $("#rename-folder").focus()
   $('#rename-folder').tooltip('show')
   $("#rename-folder").keyup(function (e) {
      e.preventDefault()
      if (e.keyCode == 13) {
         let newName = $("#rename-folder").val().trim() + extension
         changeName(currentPath, fullName, newName)
      }
   })
   $("#rename-folder").blur(function () {
      $('.tooltip').tooltip('hide')
      $(this).parent().parent().html("").append($(`<p></p>`).append(icon).append(name))
   })
}

function changeName(path, oldName, newName) {
   $.ajax({
      type: "POST",
      url: "change-name.php",
      data: {
         "path": path,
         "old-name": oldName,
         "new-name": newName
      },
      success: function (data) {
         data = JSON.parse(data)
         if (data.type == "success") {
            updateMenu(currentPath)
            showToast(data)
         } else {
            $("#rename-folder").parent().addClass("error")
            $('#rename-folder').tooltip('hide')
               .attr('data-original-title', data.message).tooltip('show')
            showToast(data)
         }
      }
   })
}

/* --- DELETE FILE OR FOLDER --- */

/**
 * request confirmation and if accepted, make the request to move to trash
 * @param {*HTML Element} elem 
 */
function moveToTrash(elem) {
   let name = $(elem).text().trim()
   let extension = $(elem).attr("data-ext") == "folder" ? "" : "." + $(elem).attr("data-ext")
   let fullName = (name + extension).trim()
   let path = currentPath
   $.ajax({
      type: "POST",
      url: "move-trash.php",
      data: {
         "path": path,
         "name": name,
         "full-name": fullName,
         "extension": extension
      },
      success: function (data) {
         data = JSON.parse(data)
         if (data.type == "success") {
            updateMenu(currentPath)
            showToast(data)
         } else {
            showToast(data)
         }
      }
   })
}

function deletePermanently(elem){
   $.ajax({
      type: "POST",
      url: "delete.php",
      data: {
         "path": $(elem).attr("data-path")
      },
      success: function (data) {
         console.log(data);
         data = JSON.parse(data)
         if (data.type == "success") {
            updateMenu(currentPath)
            sendRequestFiles()
            showToast(data)
         } else {
            showToast(data)
         }
      }
   })
}

/* --- SEARCH --- */
$("#search").keyup(function () {
   let value = $("#search").val()
   $.ajax({
      type: "POST",
      url: "search.php",
      data: {
         "search": value,
         "root": "root/"
      },
      success: function (data) {
         data = JSON.parse(data)
         if (value) {
            printBreadcrumb("search")
         } else {
            sendRequestFiles(currentPath)
            printBreadcrumb(currentPath)
         }
         $("#folders").html("").html(data.folders)
         $("#files").html("").html(data.files)
         $("#folders-count").text($("#folders").children().length)
         $("#files-count").text($("#files").children().length)
      }
   })
})

// $('[data-toggle="tooltip"]').tooltip()
$("body").on("mouseenter mouseleave", '[data-toggle="tooltip"]', function () {
   $(this).tooltip()
})