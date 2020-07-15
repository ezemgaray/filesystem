<?php
require("functions.php");

if (isset($_POST["uri"])) {
   $content = scandir($_POST["uri"]);
   $data = [];
   $files = "";
   $folders = "";
   foreach ($content as $file) {
      if (is_file($_POST["uri"] . $file)) {
         $files .= '<div class="border p-2 m-2 rounded file" tabindex="0" data-ext="' . pathinfo(($_POST["uri"] . $file), PATHINFO_EXTENSION) . '">'
            . '<p> <i class="fa ' . getIcon(($_POST["uri"] . $file)) . ' mr-2"></i>' . pathinfo(($_POST["uri"] . $file), PATHINFO_FILENAME) . '</p>'
            . '</div>';
      } else if ($file != "." && $file != "..") {
         if(is_dir($_POST["uri"] . $file . "/")){

            $folders .= '<div class="border p-2 m-2 rounded file" tabindex="0" data-ext="folder">'
            . '<p> <i class="fa fa-folder mr-2"></i>' . $file . '</p>'
            . '</div>';
         }
      }
   }
   $data += ["files" => $files];
   $data += ["folders" => $folders];
   echo json_encode($data);
}