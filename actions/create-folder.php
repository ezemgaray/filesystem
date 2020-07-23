<?php

if (isset($_POST["path"])) {
   $path = "../" . $_POST["path"];

   if (trim($_POST["name"]) == "") {
      echo json_encode([
         "type" => "danger",
         "thumb" => "thumbs-down",
         "subject" => "Create Folder",
         "message" => "The name is required. To cancel click outside the field."
      ]);
      die();
   }

   $regex = '/[<>:"\/\\|?*\x00-\x1F]|^(?:aux|con|clock\$|nul|prn|com[1-9]|lpt[1-9])$/i';
   if (preg_match($regex, $_POST["name"])) {
      echo json_encode([
         "type" => "danger",
         "thumb" => "thumbs-down",
         "subject" => "Create Folder",
         "message" => "The new name has characters not allowed: < > : \" / \ | ?  *"
      ]);
      die();
   }

   if (file_exists($path)) {
      echo json_encode([
         "type" => "danger",
         "thumb" => "thumbs-down",
         "subject" => "Create Folder",
         "message" => "A file named " . $_POST["name"] . " already exists! Try renaming the file."
      ]);
      die();
   }

   if (!mkdir($path)) {
      echo json_encode([
         "type" => "danger",
         "thumb" => "thumbs-down",
         "subject" => "Create Folder",
         "message" => "Something has gone wrong. Could not create folder."
      ]);
      die();
   } else {
      echo json_encode([
         "type" => "success",
         "thumb" => "thumbs-up",
         "subject" => "Create Folder",
         "message" => "folder \"" . $_POST["name"] . "\" was created successfully."
      ]);
      die();
   }
}
