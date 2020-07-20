<?php



/**
 * Return class name of icon based on file extension.
 * @param {String} $path
 */
function getIcon($path)
{
   $extension = pathinfo($path, PATHINFO_EXTENSION);
   if (is_dir($path)) return "fa-folder";
   switch ($extension) {
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

/**
 * Return the size of a file.
 * B, KB, MB, GB
 * @param {String} $path
 */
function getSize($path)
{
   $bytes = sprintf('%u', filesize($path));

   if ($bytes > 0) {
      $unit = intval(log($bytes, 1024));
      $units = array('B', 'KB', 'MB', 'GB');

      if (array_key_exists($unit, $units) === true) {
         return sprintf('%d %s', $bytes / pow(1024, $unit), $units[$unit]);
      }
   }
   return $bytes;
}

/**
 * Return trash data
 */
function getTrashData()
{
   $data = file_get_contents("trash-data/trash.json");
   $arrayData = json_decode($data, true);
   return $arrayData;
}

/**
 * Find Object into trash.json
 * @param [*String or Numbre] -> id
 */
function findItem($id)
{
   $arrayData = getTrashData();
   foreach ($arrayData as $item) {
      if($item["id"] == $id){
         return $item;
      }
   }
   return false;
}

/**
 * Add item into trash.json
 * @param {*Array} -> $item
 */
function addToTrashJson(array $item)
{
   $data = getTrashData();
   if ($data == NULL) $data = [];
   array_push($data, $item);
   $file = "trash-data/trash-temp.json";
   fopen($file, "w");
   file_put_contents($file, json_encode($data));
   if (!unlink("trash-data/trash.json")) {
      return false;
   } else {
      rename($file, "trash-data/trash.json");
      return true;
   }
}

/**
 * delete item from trash.json
 * @param {*Array} -> $toRemove - item to remove
 */
function removeFromTrashJson(array $toRemove)
{
   $dataList = getTrashData();
   unset($dataList[array_search($toRemove, $dataList)]);
   $file = "trash-data/file-temp.json";
   fopen($file, "w");
   file_put_contents($file, json_encode($dataList));
   if (!unlink("trash-data/trash.json")) {
      return false;
   } else {
      rename($file, "trash-data/trash.json");
      return true;
   }
}

function deleteElement($dir)
{
   $elem = explode("/", $dir);
   $elem = end($elem);
   $elem = findItem($elem);

   if(is_file($dir)){
      if(@unlink($dir)){
         removeFromTrashJson($elem);
         echo json_encode([
            "type" => "success",
            "thumb" => "thumbs-up",
            "subject" => "Delete",
            "message" => "File \"". $dir ."\" has been removed permanently."
            ]);
         die();
      }else{
         echo json_encode([
            "type" => "danger",
            "thumb" => "thumbs-down",
            "subject" => "Delete",
            "message" => "Could not delete file \"". $_POST["full-name"] ."\"."
            ]);
         die();
      }
   }
   if (!$dh = @opendir($dir)){
      if(@rmdir($dir)){
         removeFromTrashJson($elem);

         echo json_encode([
            "type" => "success",
            "thumb" => "thumbs-up",
            "subject" => "Delete",
            "message" => "File \"". $dir ."\" has been removed permanently."
            ]);
         die();
      }else{
         echo json_encode([
            "type" => "danger",
            "thumb" => "thumbs-down",
            "subject" => "Delete",
            "message" => "Could not delete file \"". $_POST["full-name"] ."\"."
            ]);
         die();
      }
   }
   while (false !== ($current = readdir($dh))) {
      if ($current != '.' && $current != '..') {
         if (!@unlink($dir . '/' . $current))
            deleteElement($dir . '/' . $current);
      }
   }
   closedir($dh);
   if(@rmdir($dir)){
      removeFromTrashJson($elem);

      echo json_encode([
         "type" => "success",
         "thumb" => "thumbs-up",
         "subject" => "Delete",
         "message" => "File \"". $dir ."\" has been removed permanently."
         ]);
      die();
   }else{
      echo json_encode([
         "type" => "danger",
         "thumb" => "thumbs-down",
         "subject" => "Delete",
         "message" => "Could not delete file \"". $_POST["full-name"] ."\"."
         ]);
      die();
   }
}