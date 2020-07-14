<?php
/**
 * Search folders recursively to print side menu
 */
function printMenu($target)
{
   if (is_dir($target)) {
      $files = str_replace("\\", "/", glob($target . '*', GLOB_MARK)); //GLOB_MARK adds a slash to directories returned
      $name = explode("/", $target);
      array_pop($name);
      if (count($files)) {
         //have folders
         echo '<li class="sidebar-dropdown">'
            . '<a href="#" data-name="' . end($name) . '">'
            . '<i class="fa fa-folder"></i>'
            . '<span>' . end($name) . '</span>'
            . '</a>'
            . '<div class="sidebar-submenu">'
            . '<ul>';
         foreach ($files as $file) {
            printMenu($file);
         }
         echo '</ul>'
            . '</div>';
      } else {
         //have no folders
         echo '<li>'
            . '<a href="#" data-name="' . end($name) . '">'
            . '<i class="fa fa-folder"></i>' . end($name)
            . '</a>'
            . '</li>';
      }
   }
}


function getIcon($file){
   $extension = pathinfo($file, PATHINFO_EXTENSION);
   switch($extension){
      case "csv":
         return "fa-file-csv";
      case "doc":
      case "docx":
         return "fa-file-word";
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
      case "svg":
         return "fa-file-image";
      case "txt":
         return "fa-file-alt";
      case "ppt":
      case "odt":
         return "fa-file-powerpoint";
      case "pdf":
         return "fa-file-pdf";
      case "zip":
      case "rar":
         return "fa-file-archive";
      case "exe":
         return "fa-cogs";
      case "mp3":
         return "fa-file-audio";
      case "mp4":
         return "fa-file-video";
      default:
      break;
   }
}