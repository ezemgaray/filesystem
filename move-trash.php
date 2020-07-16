<?php

require("functions.php");

if (isset($_POST["path"])) {
   $path = $_POST["path"];

   // Generate ID
   $ref = getTrashData();
   if ($ref) {
      $newId = end($ref)["id"] + 1;
   } else {
      $newId = 1;
   }

   //Create object to save in json
   $newItem = [];
   $newItem += ["id" => $newId];
   $newItem += ["name" => $_POST["name"]];
   $newItem += ["full_name" => $_POST["full-name"]];
   $newItem += ["extension" => !$_POST["extension"] ? "/" : $_POST["extension"]];
   $newItem += ["created" => filectime($path . $_POST["full-name"])];
   $newItem += ["modified" => filemtime($path . $_POST["full-name"])];
   $newItem += ["trash" => time()];
   $newItem += ["old_path" => $path . $_POST["full-name"]];
   $newItem += ["old_parent_path" => $path];

   // Move file/folder to trash
   $old = $path . $_POST["full-name"];
   $new = "trash/" . $newId . $_POST["extension"];
   if(!rename($old, $new)){
      //if it cannot be moved with rename, it is moved with copy
      if (copy ($old,$new)) {
         unlink($old);
         addToTrashJson($newItem);
         echo json_encode(["ok" =>'message']);
         die();
      }
      echo json_encode(["aa" =>"aqui"]);
      die();
   }else{
      addToTrashJson($newItem);
      echo json_encode(["ok" =>'message']);
      die();
   }
}