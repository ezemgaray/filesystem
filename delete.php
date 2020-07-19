<?php
require("functions.php");

if (isset($_POST["path"])) {
   $path = $_POST["path"];
   deleteElement($path);
}