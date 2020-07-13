// Stop default acction of <a> without link
$('a[href="#"]').click(function (e) {
   e.preventDefault();
})
/* --- MENU LISTENERS --- */
$(".sidebar-dropdown > a").click(function () {
   $(".sidebar-submenu").slideUp(200);
   if (
      $(this)
      .parent()
      .hasClass("active")
   ) {
      $(".sidebar-dropdown").removeClass("active");
      $(this)
         .parent()
         .removeClass("active");
   } else {
      $(".sidebar-dropdown").removeClass("active");
      $(this)
         .next(".sidebar-submenu")
         .slideDown(200);
      $(this)
         .parent()
         .addClass("active");
   }
});

$(".sidebar-menu  li > a").click(function () {
   $(this).children().first().toggleClass(" fa-folder fa-folder-open")
})


$("#close-sidebar").click(function () {
   $(".page-wrapper").removeClass("toggled");
});
$("#show-sidebar").click(function () {
   $(".page-wrapper").addClass("toggled");
});