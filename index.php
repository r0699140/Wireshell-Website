<?php
  session_start();

  if(!isset($_SESSION["logon"])){
    $_SESSION["logon"] = false;
  }
?>

<!DOCTYPE html>
<html lang="">
<head>
    <meta charset="utf-8"/>
    <title>Wireshell</title>
    <link rel="icon" href="style/logo2.png">
    <script src="https://www.google.com/recaptcha/api.js" async defer></script>

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.2/css/all.css"/>
    <script src="Scripts/script.js"></script>
    <link href="https://fonts.googleapis.com/css?family=Roboto+Mono:300,400,700" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.3/Chart.bundle.js"></script>
    <link rel="stylesheet" href="style/style.css">
</head>

<body>
    <?php
        $homeDir = "";
        include $homeDir."Parts/Header/header.php";
        include $homeDir."Parts/Body/Body.php";
    ?>


</body>
</html>
