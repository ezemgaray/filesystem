<?php

if (isset($_POST["path"])) {
   $path = "../".$_POST["path"];

   if(trim($_POST["new-name"]) == ""){
      echo json_encode([
         "type" => "danger",
         "thumb" => "thumbs-down",
         "subject" => "Change Name",
         "message" => "The name is required. To cancel click outside the field."
         ]);
      die();
   }

   $regex = '/[<>:"\/\\|?*\x00-\x1F]|^(?:aux|con|clock\$|nul|prn|com[1-9]|lpt[1-9])$/i';
   if(preg_match($regex, $_POST["new-name"])){
      echo json_encode([
         "type" => "danger",
         "thumb" => "thumbs-down",
         "subject" => "Change Name",
         "message" => "The new name has characters not allowed: < > : \" / \ | ?  *"
         ]);
      die();
   }

   if(file_exists($path . $_POST["new-name"])){
      echo json_encode([
         "type" => "danger",
         "thumb" => "thumbs-down",
         "subject" => "Change Name",
         "message" => "A file named ". $_POST["new-name"] ." already exists! Try renaming the file"
         ]);
      die();
   }
   $old = $path . $_POST["old-name"];
   $new = $path . $_POST["new-name"];
   if(!rename($old, $new)){
      echo json_encode([
         "type" => "danger",
         "thumb" => "thumbs-down",
         "subject" => "Change Name",
         "message" => "A file named ". $_POST["new-name"] ." already exists! Try renaming the file"
         ]);
      die();
   }else{
      echo json_encode([
         "type" => "success",
         "thumb" => "thumbs-up",
         "subject" => "Change Name",
         "message" => "Successful name change!!! The name \"" . $_POST["old-name"] ."\" has been changed to \"" . $_POST["new-name"] . "\""
         ]);
      die();
   }
}