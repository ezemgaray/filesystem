<?php
if (isset($_POST["path"])) {
?>
   <div><?php $_POST["path"] ?></div>
<?php
   echo $_POST["path"];
}else{
?>
   <div>ADIOS</div>
<?php
}
?>