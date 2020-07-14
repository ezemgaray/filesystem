<?php
if (isset($_POST["uri"])) {
   $content = scandir($_POST["uri"]);
   $data = [];
   $files = "";
   $folders = "";
   foreach ($content as $file) {
      if (is_file($_POST["uri"] . $file)) {
         $files .= '<div class="border p-2 m-2 rounded file">'
            . '<p> <i class="fa ' . getIcon(($_POST["uri"] . $file)) . ' mr-2"></i>' . $file . '</p>'
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
   
   $extension = pathinfo($file, PATHINFO_EXTENSION);
   // return $extension;
   // die();
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