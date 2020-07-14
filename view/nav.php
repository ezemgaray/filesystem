<nav id="sidebar" class="sidebar-wrapper pl-2 pr-2 w-25">
   <div class="sidebar-content ">
      <div class="sidebar-header d-flex justify-content-between">
         <p class="mb-2">Folders</p>
         <span class=" mb-2">
            <i class="fa fa-folder-plus button"></i>
         </span>
      </div>

      <div class="sidebar-menu">
         <ul class="mt-2">
            <?php
            printMenu("root/");
            ?>
         </ul>
      </div>
      <!-- sidebar-menu  -->
   </div>
</nav>