<?php
if (isset($_POST["uri"])) {
   $files = scandir($_POST["uri"]);
   foreach ($files as $file) {
      if (is_file($_POST["uri"] . $file)) {
      echo '<div class="border p-2 m-2 rounded file">'
      . '<p> <i class="fa fa-file-word mr-2"></i>' . $file . '</p>'
      . '</div>';
      }
   }
}