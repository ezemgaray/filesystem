<?php
require("functions.php");
?>
<!DOCTYPE html>
<html lang="en">

<head>
   <meta charset="UTF-8">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>File System</title>
   <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
   <link href="https://use.fontawesome.com/releases/v5.8.1/css/all.css" rel="stylesheet">
   <link rel="stylesheet" href="src/css/style.css">

</head>

<body>
   <!-- <div class="page-wrapper  d-flex"> -->

   <div class="border-bottom d-flex justify-content-between align-items-center p-2 m-auto w-100">
      <h3 class="m-0 ml-2">FileSystem</h3>
      <form class="form-inline d-flex justify-content-center md-form form-sm active-cyan-2 ">
         <input class="form-control form-control-sm mr-3 w-75" type="text" placeholder="Search" aria-label="Search">
         <i class="fas fa-search" aria-hidden="true"></i>
      </form>
   </div>
   <main class="page-content page-wrapper chiller-theme d-flex">
      <?php
      include("view/nav.php");
      include("view/main.php");
      include("view/aside.php");
      ?>

   </main>
   <!-- </div> -->
   <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
   <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
   <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js" integrity="sha384-OgVRvuATP1z7JjHLkuOU7Xw704+h835Lr+6QL9UvYjZE3Ipu6Tp75j7Bh/kR0JKI" crossorigin="anonymous"></script>
   <script src="src/js/app.js"></script>
</body>

</html>