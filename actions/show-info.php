<?php
require("functions.php");
if (isset($_POST["path"])) {
   $path = $_POST["path"];
   $realPath = str_replace("../", "", $path);
   $arr = explode("/", $path);
   $name = end($arr);
?>
   <div class="d-flex border-bottom">
      <div class="info-icon">
         <i class="fa <?php echo getIcon($path); ?> p-1"></i>
      </div>
      <div>
         <h4 class="p-1 m-0"><?php echo $name ?></h4>
      </div>
   </div>
   <div class="mt-2 mb-2 pb-2 pt-2 border-bottom">
      <small class="d-block"><b>Created:</b> <?php echo date("l d, M Y H:i", filectime($path)) ?></small>
      <small class="d-block"><b>Modified:</b> <?php echo date("l d, M Y H:i", filemtime($path)); ?></small>
      <small class="d-block"><b>Extension:</b> <?php echo is_dir($path) ? "Folder" : "." . pathinfo($path, PATHINFO_EXTENSION); ?></small>
      <small class="d-block"><b>Path:</b> <?php echo $realPath; ?></small>
      <?php
      if (is_dir($path)) {
      ?>
         <small class="d-block"><b>Content:</b> <?php echo (count(scandir($path)) - 2); ?> Files/Folders</small>
      <?php
      } else {
      ?>
         <small class="d-block"><b>Size:</b> <?php echo getSize($path); ?></small>
      <?php
      }
      ?>
   </div>
   <?php
   switch (pathinfo($path, PATHINFO_EXTENSION)) {
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
   ?>
         <input type="checkbox" id="expand" class="d-none">
         <div class="mt-2 mb-2 pt-2 pb-2 border-bottom media">
            <label for="expand" class="media-expand"><i class="fa fa-expand"></i></label>
            <img src="<?php echo $realPath; ?>" alt="<?php echo $name ?>" class="media-preview">
         </div>
      <?php
         break;
      case "mp3":
      ?>
         <div class="mt-2 mb-2 pt-2 pb-2 border-bottom">
            <audio src="<?php echo $realPath; ?>" controls class="media-preview"></audio>
         </div>
      <?php
         break;
      case "mp4":
      ?>
         <input type="checkbox" id="expand" class="d-none">
         <div class="mt-2 mb-2 pt-2 pb-2 border-bottom media">
         <label for="expand" class="media-expand"><i class="fa fa-expand"></i></label>
            <video src="<?php echo $realPath; ?>" controls class="media-preview"></video>
         </div>
<?php

         break;
   }
}
?>