<?php
if (isset($_POST["path"])) {
?>
   <div><?php $_POST["path"] ?></div>
   <div class="d-flex">
      <div>
         <i class="fa"></i>
      </div>
   </div>
<?php
   echo $_POST["path"];
}
?>