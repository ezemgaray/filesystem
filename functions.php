<?php

function printMenu($target)
{
   if (is_dir($target)) {
      $files = str_replace("\\", "/", glob($target . '*', GLOB_MARK)); //GLOB_MARK adds a slash to directories returned
      $name = explode("/", $target);
      array_pop($name);
      if (count($files)) {
         //have folders
         echo '<li class="sidebar-dropdown">'
            . '<a href="#">'
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
            . '<a href="#">'
            . '<i class="fa fa-folder"></i>' . end($name)
            . '</a>'
            . '</li>';
      }
   }
}
