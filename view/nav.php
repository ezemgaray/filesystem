<nav id="sidebar" class="sidebar-wrapper pl-2 pr-2 w-25">
   <div class="sidebar-content ">
      <div class="sidebar-header d-flex justify-content-between">
         <p class="mb-2">Folders</p>
         <a href="#" class="mb-2">
            <i class="fa fa-folder-plus button"></i>
         </a>
      </div>

      <div class="sidebar-menu border-bottom border-top">
         <ul class="mt-2">
            <?php
            printMenu("root/");
            ?>
         </ul>
      </div>
      <!-- sidebar-menu  -->
      <a class="float-right a-trash" href="#">
         <i class="fa fa-trash"></i>
         Trash
      </a>
   </div>
</nav>