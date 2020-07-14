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
})

/* --- REQUEST FILES --- */

function sendRequestFiles() {
   $("#result").html("")
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
            printFile(data)
         }
      })
   }else{
      printBreadcrumb(uri)
   }
}

/**
 * Print breadcrumb into main view
 * @param {*String} uri -> folder path
 */
function printBreadcrumb(uri){
   if(uri)
      $("#breadcrumb").text(uri.split("/").join(" / "))
   else
      $("#breadcrumb").text(" ")
}

/**
 * Print file card into main view
 * @param {*String} data -> File card
 */
function printFile(data){
   $("#result").append(data)
}