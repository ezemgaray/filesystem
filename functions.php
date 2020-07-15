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
