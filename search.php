<?php
require("functions.php");

if (isset($_POST["root"])) {

   $content = scandir($_POST["root"]);
   $data = [];
   $files = "";
   $folders = "";

   $search = isset($_POST["search"]) ? $_POST["search"] : false;

   search($_POST["root"], $files, $folders, $search);
}
function search($url, &$files, &$folders, $search)
{
   $content = scandir($url);

   foreach ($content as $file) {
      if ($file == "." || $file == "..") continue;

      if ($search) {
         if (strripos($file, $search) >= 0 && is_int(strripos($file, $search))) {
            if (is_file($url . $file)) {
               $files .= '<div class="border p-2 m-2 rounded file" tabindex="0" data-path="' . $url . $file . '" data-id="' . filectime($url . $file) . '" data-ext="' . pathinfo(($url . $file), PATHINFO_EXTENSION) . '">'
                  . '<p> <i class="fa ' . getIcon(($url . $file)) . ' mr-2"></i>' . pathinfo(($url . $file), PATHINFO_FILENAME) . '</p>'
                  . '</div>';
            } else if (is_dir($url . $file . "/")) {
               $folders .= '<div class="border p-2 m-2 rounded file" tabindex="0" data-path="' . $url . $file . '" data-id="' . filectime($url . $file) . '" data-ext="folder">'
                  . '<p> <i class="fa fa-folder mr-2"></i>' . $file . '</p>'
                  . '</div>';
               $moreContent = scandir($url . $file . "/");
               if (count($moreContent)) {
                  search(($url . $file . "/"), $files, $folders, $search);
               }
            }
         }
         if (is_dir($url . $file . "/")) {
            $moreContent = scandir($url . $file . "/");
            if (count($moreContent)) {
               search(($url . $file . "/"), $files, $folders, $search);
            }
         }
      } else {
         if($_POST["root"] == "trash/"){
            $item = findItem($file);
            if (is_file($url . $file)) {
               $files .= '<div class="border p-2 m-2 rounded file trash" tabindex="0" data-path="' . $url . $file . '" data-id="' . $item["id"] . '" data-ext="' . pathinfo(($url . $file), PATHINFO_EXTENSION) . '">'
               . '<p> <i class="fa ' . getIcon(($url . $file)) . ' mr-2"></i>' . $item["name"] . '</p>'
               . '</div>';
            } else if (is_dir($url . $file . "/")) {
               $folders .= '<div class="border p-2 m-2 rounded file trash" tabindex="0" data-path="' . $url . $file . '" data-id="' . $item["id"] . '" data-ext="folder">'
               . '<p> <i class="fa fa-folder mr-2"></i>' . $item["name"] . '</p>'
               . '</div>';
            }
         }else{
            if (is_file($url . $file)) {
               $files .= '<div class="border p-2 m-2 rounded file" tabindex="0" data-path="' . $url . $file . '" data-id="' . filectime($url . $file) . '" data-ext="' . pathinfo(($url . $file), PATHINFO_EXTENSION) . '">'
               . '<p> <i class="fa ' . getIcon(($url . $file)) . ' mr-2"></i>' . pathinfo(($url . $file), PATHINFO_FILENAME) . '</p>'
               . '</div>';
            } else if (is_dir($url . $file . "/")) {
               $folders .= '<div class="border p-2 m-2 rounded file" tabindex="0" data-path="' . $url . $file . '" data-id="' . filectime($url . $file) . '" data-ext="folder">'
               . '<p> <i class="fa fa-folder mr-2"></i>' . $file . '</p>'
               . '</div>';
            }
         }
      }
   }
}
$data += ["files" => $files];
$data += ["folders" => $folders];
echo json_encode($data);
