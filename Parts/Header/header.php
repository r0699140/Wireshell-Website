<link rel="stylesheet" href="/Parts/Header/header.css">
<link rel="stylesheet" href="/Parts/Header/login.css">
<link rel="stylesheet" href ="/Parts/Header/Register.css">

<?php
    include $homeDir."Parts/Header/login.php";
    include $homeDir."Parts/Header/Register.php";
    include_once $_SERVER['DOCUMENT_ROOT'].'/Keys/keys.php';
?>

<div class="header">
    <div class="title">
        <a href ="../../index.php"><img class = "logotitle" src = "../../style/logo.png">Wireshell</a>
    </div>
    <?php
    $loginContent = "";
    if($_SESSION["logon"]){
      $loginContent = "
      <div class = 'loggout' id = 'logoutButton'><i class='fas fa-sign-out-alt'></i></div>
      <div class = 'username'> Welkom ".$_SESSION["Name"]."</div>";
    }else{
      $loginContent = '
      <div id="recaptcha" class="g-recaptcha"
       data-sitekey="'.$googleAPI.'"
       data-callback="validate"
       data-size="invisible"></div>

      <div class="registerHeader" id ="RegisterButton">
        <i class="fas fa-user-plus"></i>Registreer
      </div>
      <div class="login" id ="LoginButton">
          <i class="fas fa-user"></i>Login
      </div>';
    }

    echo $loginContent;
    ?>


</div>
