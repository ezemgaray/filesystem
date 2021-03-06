<?php

require("functions.php");

if (isset($_POST["path"])) {
   $path = $_POST["path"];
   
   //Create object to save in json
   $newItem = [];
   $newItem += ["id" => time()];
   $newItem += ["name" => $_POST["name"]];
   $newItem += ["full_name" => $_POST["full-name"]];
   $newItem += ["extension" => !$_POST["extension"] ? "/" : $_POST["extension"]];
   $newItem += ["created" => filectime("../" . $path . $_POST["full-name"])];
   $newItem += ["modified" => filemtime("../" . $path . $_POST["full-name"])];
   $newItem += ["trash" => time()];
   $newItem += ["old_path" => $path . $_POST["full-name"]];
   $newItem += ["old_parent_path" => $path];
   // Move file/folder to trash
   $old = $path . $_POST["full-name"];
   $new = "trash/" . $newItem["id"] . $_POST["extension"];
   if(!rename("../" . $old, "../" . $new)){
      //if it cannot be moved with rename, it is moved with copy
      if (copy ("../" . $old, "../" . $new)) {
         unlink($old);
         addToTrashJson($newItem);
         echo json_encode([
            "type" => "success",
            "thumb" => "thumbs-up",
            "subject" => "Move to Trash",
            "message" => "File \"". $_POST["full-name"] ."\" has been removed. From the trash you can delete the file permanently."
            ]);
         die();
      }
      echo json_encode([
         "type" => "danger",
         "thumb" => "thumbs-down",
         "subject" => "Move to Trash",
         "message" => "Could not delete file \"". $_POST["full-name"] ."\"."
         ]);
      die();
   }else{
      addToTrashJson($newItem);
      echo json_encode([
         "type" => "success",
         "thumb" => "thumbs-up",
         "subject" => "Move to Trash",
         "message" => "File \"". $_POST["full-name"] ."\" has been removed. From the trash you can delete the file permanently."
         ]);
      die();
   }
}