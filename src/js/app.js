// Stop default acction of <a> without link
$('a[href="#"]').click(function (e) {
   e.preventDefault()
})
/* --- MENU LISTENERS --- */
$(".sidebar-dropdown > a").click(function () {
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
      // $(".sidebar-dropdown").removeClass("active")
      $(this).next().removeClass("active")
      $(this)
         .next(".sidebar-submenu")
         .slideDown(200)
      $(this)
         .parent()
         .addClass("active")
   }
});

$(".sidebar-menu a").click(function () {
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
   $(this).toggleClass("open")
   $(this).children().first().toggleClass("fa-folder fa-folder-open")
   sendRequestFiles()
   $(".sidebar-menu").animate({
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
      $(".open").each(function () {
         uri += $(this).text() + "/"
      })
      printBreadcrumb(uri)
      $.ajax({
         type: "POST",
         url: "get-files.php",
         data: {
            "uri": uri
         },
         success: function (data) {
            data = JSON.parse(data)
            if (data.files)
               printFile(data.files)
            else
               printFile()
            if (data.folders)
               printFolder(data.folders)
            else
               printFolder()

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
   if (uri)
      $("#breadcrumb").text(uri.split("/").join(" / "))
   else
      $("#breadcrumb").text(" ")


}

/**
 * Print file card into main view
 * @param {*String} data -> File card
 */
function printFolder(data = "") {
   // if (data.length)
      $("#folders").append(data)
   // else
      // $("#folders").append(`<div class="alert alert-warning" role="alert">No folders</div>`)
}
/**
 * Print file card into main view
 * @param {*String} data -> File card
 */
function printFile(data = "") {
   // if (data.length)
      $("#files").append(data)
   // else
      // $("#files").append(`<div class="alert alert-warning" role="alert">No files</div>`)
}

$("#folders").on("click", "div", function (e) {
   $opened = $(".open").last().parent()
   $name = $(this).children().first().text().trim()
   $($opened.find('[data-name="' + $name + '"]')).click()
})