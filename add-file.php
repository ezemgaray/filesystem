<?php
if (isset($_POST["path"]) && isset($_FILES["file"])) {
   $fileName = $_FILES['file']['name'];
   $fileType = $_FILES['file']['type'];
   $fileError = $_FILES['file']['error'];
   $fileContent = file_get_contents($_FILES['file']['tmp_name']);

   if(file_exists($_POST["path"].$fileName)){
      echo json_encode(["error" => "a file named $fileName already exists! Try renaming the file."]);
      die();
   }

   if ($fileError == UPLOAD_ERR_OK && @move_uploaded_file($_FILES['file']['tmp_name'], $_POST["path"].$fileName)) {
      echo json_encode(["ok" => "file $fileName uploaded successfully!!!"]);
   } else {
      switch ($fileError) {
         case UPLOAD_ERR_INI_SIZE:
            $message = 'Error trying to upload a file that exceeds the allowed size.';
            break;
         case UPLOAD_ERR_FORM_SIZE:
            $message = 'Error trying to upload a file that exceeds the allowed size.';
            break;
         case UPLOAD_ERR_PARTIAL:
            $message = 'Error: the file upload action did not finish.';
            break;
         case UPLOAD_ERR_NO_FILE:
            $message = 'Error: no file was uploaded.';
            break;
         case UPLOAD_ERR_NO_TMP_DIR:
            $message = 'Error: server not configured for file upload.';
            break;
         case UPLOAD_ERR_CANT_WRITE:
            $message = 'Error: possible failure to save file.';
            break;
         case  UPLOAD_ERR_EXTENSION:
            $message = 'Error: file upload not completed.';
            break;
         default:
            $message = 'Error: file upload not completed.';
            break;
      }
      echo json_encode(['error' => $message]);
   }
}
