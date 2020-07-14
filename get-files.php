<?php
if (isset($_POST["uri"])) {
   $content = scandir($_POST["uri"]);
   $data = [];
   $files = "";
   $folders = "";
   foreach ($content as $file) {
      if (is_file($_POST["uri"] . $file)) {
         $files .= '<div class="border p-2 m-2 rounded file">'
            . '<p> <i class="fa fa-file-word mr-2"></i>' . $file . '</p>'
            . '</div>';
      } else if ($file != "." && $file != "..") {
         if(is_dir($_POST["uri"] . $file . "/")){

            $folders .= '<div class="border p-2 m-2 rounded file">'
            . '<p> <i class="fa fa-folder mr-2"></i>' . $file . '</p>'
            . '</div>';
         }
      }
   }
   $data += ["files" => $files];
   $data += ["folders" => $folders];
   echo json_encode($data);
}

function getIcon($file){
   $file = explode(".", $file);
   switch(array_pop($file)){
      case "":
         break;
   }
}