<?php
if(isset($_POST["from"])){
   echo printMenu($_POST["from"]);
}
/**
 * Search folders recursively to print side menu
 */
$html = "";
function printMenu($target, &$html = ""){
   if (is_dir($target)) {
      $files = str_replace("\\", "/", glob($target . '*', GLOB_MARK)); //GLOB_MARK adds a slash to directories returned
      $name = explode("/", $target);
      array_pop($name);
      if (count($files)) {
         //have folders
         $html .= '<li class="sidebar-dropdown">'
            . '<a href="#" data-name="' . end($name) . '" class="w-100">'
            . '<i class="fa fa-folder"></i>'
            . '<span>' . end($name) . '</span>'
            . '</a>'
            . '<div class="sidebar-submenu">'
            . '<ul>';
            
         foreach ($files as $file) {
            printMenu($file, $html);
         }
         $html .=  '</ul>'
            . '</div>';
      } else {
         //have no folders
         $html .= '<li>'
            . '<a href="#" data-name="' . end($name) . '" "class="w-100">'
            . '<i class="fa fa-folder"></i>' . end($name)
            . '</a>'
            . '</li>';
      }
   }
   return $html;
}