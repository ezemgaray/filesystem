<?php

if (isset($_POST["path"])) {
   $path = $_POST["path"];

   $regex = '/[ <>:"\/\\|?*\x00-\x1F]|^(?:aux|con|clock\$|nul|prn|com[1-9]|lpt[1-9])$/i';
   if(preg_match($regex, $_POST["name"])){
      echo json_encode(["aaa" =>"aqui"]);
      die();
   }

   if(file_exists($path)){
      echo json_encode(["aa" =>"aqui"]);
      die();
   }
   
   if(!mkdir($path)){
      echo json_encode(["aa" =>"aqui"]);
      die();
   }else{
      echo json_encode(["ok" =>'<div class="border p-2 m-2 rounded file" tabindex="0">'
      . '<p> <i class="fa fa-folder mr-2"></i>' . $_POST["name"] . '</p>'
      . '</div>']);
      die();
   }
}