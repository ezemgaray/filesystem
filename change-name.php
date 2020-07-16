<?php

if (isset($_POST["path"])) {
   $path = $_POST["path"];

   $regex = '/[<>:"\/\\|?*\x00-\x1F]|^(?:aux|con|clock\$|nul|prn|com[1-9]|lpt[1-9])$/i';
   if(preg_match($regex, $_POST["new-name"])){
      echo json_encode(["aaa" =>"aqui"]);
      die();
   }

   if(file_exists($path . $_POST["new-name"])){
      echo json_encode(["aa" =>"aqui"]);
      die();
   }

   $old = $path . $_POST["old-name"];
   $new = $path . $_POST["new-name"];
   if(!rename($old, $new)){
      echo json_encode(["aa" =>"aqui"]);
      die();
   }else{
      echo json_encode(["ok" =>'message']);
      die();
   }
}