if (window.location.search) {
   let param = new URLSearchParams(window.location.search)
   updateMenu(param.get("root"))
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
   sendRequestFiles()
   $(".sidebar-menu, .bread-crumb").animate({
      scrollLeft: $('.sidebar-menu').prop("scrollWidth")
   }, 1000);
})

/* --- REQUEST FILES --- */

function sendRequestFiles() {
   $("#folders").html("")
   $("#files").html("")
   let uri = ""
   if ($(".open").length) {
      // Build uri
      uri = getOpenFilePath()
      printBreadcrumb(uri)

      $.ajax({
         type: "POST",
         url: "get-files.php",
         data: {
            "uri": uri
         },
         success: function (data) {
            if (uri != getOpenFilePath()) return
            data = JSON.parse(data)
            $("#folders").html("")
            $("#files").html("")
            if (data.files)
               printFile(data.files)
            if (data.folders)
               printFolder(data.folders)
            if (!data.folders && !data.files)
               printFolder()
            window.history.pushState({
               page: './index.php?root=' + uri
            }, uri, './index.php?root=' + uri);
         }
      })
   } else {
      printBreadcrumb(uri)
   }
}

/**
 * Print breadcrumb into main view
 * @param {*String} uri -> folder path
 */
function printBreadcrumb(uri) {
   if (uri) {
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

   } else {
      $("#breadcrumb").text(" ")
      newFileFolderButtons()
   }
}

/**
 * Print file card into main view
 * @param {*String} data -> File card
 */
function printFolder(data = "") {
   if (data.length)
      $("#folders").append(data)
   else
      $("#folders").html("").append(`<div class="alert alert-warning m-2 p-2" role="alert">Empty folder</div>`)
}
/**
 * Print file card into main view
 * @param {*String} data -> File card
 */
function printFile(data) {
   if (data.length)
      $("#files").append(data)
   else
      $("#files").append("")

}

$("#folders").on("dblclick", "div.file", function (e) {
   $opened = $(".open").last().parent()
   $name = $(this).children().first().text().trim()
   $($opened.find('[data-name="' + $name + '"]')).click()

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
   let fullName = $(this).attr("data-ext") == "folder" ? $(this).text() : $(this).text() + "." + $(this).attr("data-ext")
   showInfo(getOpenFilePath(fullName))

})

function showInfo(path) {
   $.ajax({
      type: "POST",
      url: "show-info.php",
      data: {
         "path": path
      },
      success: function (data) {
         $(".aside-view").html("").append(data)
      }
   })
}

/* --- ADD FOLDER --- */
$("#add-ff").on("click", "a.add-btn", function (e) {
   $("#folders")
      .append($('<div class="border p-2 m-2 rounded"></div>')
         .append($('<p> <i class="fa fa-folder mr-2"></i></p>')
            .append($('<input type="text" id="new-folder" class="new-folder">'))
         )
      )
   $("#new-folder").focus()
   $("#new-folder").keyup(function (e) {
      e.preventDefault()
      if (e.keyCode == 13) {
         createFolder(getOpenFilePath($("#new-folder").val().trim()))
      }
   })
   $("#new-folder").blur(function () {
      $(this).parent().parent().remove()
   })
})

function newFileFolderButtons(uri) {
   if (!$("#add-ff").is(':empty') && uri) {
      $("#add-ff").html(`
         <a href="#" class="m-1 add-btn folder">
            <i class="fa fa-folder-plus button"></i>
         </a>
         <a href="#" class="mb-1 add-btn">
            <i class="fa fa-file-medical button"></i>
         </a>
      `)
   } else {
      $("#add-ff").html(" ")
   }
}

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
         if (data.ok) {
            updateMenu(getOpenFilePath())
         } else {
            $("#new-folder").parent().addClass("error")
         }
      }
   })
}

function updateMenu(path = "root/") {
   $.ajax({
      type: "POST",
      url: "print-menu.php",
      data: {
         "from": "root/"
      },
      success: function (data) {
         $("#menu-list").html("").append(data)
         path = path.split("/")
         path.pop()
         $(path).each(function (key, name) {
            $($("#menu-list").find('[data-name="' + name + '"]')).click()
         })
      }
   })
}

/* --- CONTEXT MENU --- */

var contextMenu = CtxMenu(".file");
contextMenu.addItem("Change Name  ", function (e) {
   editName(e)
}, "https://image.flaticon.com/icons/svg/598/598234.svg");

contextMenu.addSeperator();

contextMenu.addItem("Delete", function () {

}, "https://image.flaticon.com/icons/svg/60/60761.svg");


/* --- CHANGE NAME --- */

function editName(elem) {
   let icon = $(elem).find("i")
   let name = $(elem).text()
   let extension = $(elem).attr("data-ext") == "folder" ? "" : "." + $(elem).attr("data-ext")
   let fullName = (name+extension)
   $(elem).first().text("")
   $(elem).append($(`<p></p>`).append(icon)
   .append($('<input type="text" id="rename-folder" class="new-folder">')).append(" " + extension))
   $("#rename-folder").focus()
   $("#rename-folder").keyup(function (e) {
      e.preventDefault()
      if (e.keyCode == 13) {
         let newName = $("#rename-folder").val().trim() + extension
         changeName(getOpenFilePath(), fullName, newName)
      }
   })
   $("#rename-folder").blur(function () {
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
         if (data.ok) {
            updateMenu(getOpenFilePath())
         } else {
            $("#rename-folder").parent().addClass("error")
         }
      }
   })
}