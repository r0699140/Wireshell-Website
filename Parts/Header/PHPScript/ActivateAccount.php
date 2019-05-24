<?php
session_start();

  require_once '../../../Scripts/PHPScripts.php';

  $mysqli = connectDataBase();

  $email = strip($_POST["Email"]);
  $IdHash = $_POST["Hash"];


  $queryUserID = $mysqli->prepare('call sp_getUserMail(?)');

  if(!$queryUserID)
  {
    echo json_encode(array("valid" => false, "userMsg" => "Er is iets fout gegaan met de verbinding met de databank", "error" => "Query mislukt select user"));

    $mysqli->close();
    exit(0);
  }

  $queryUserID->bind_param('s', $email);

  $queryUserID->execute();
  $queryUserID->bind_result($passwordHash, $accountID, $activated, $name, $firstname);
  $queryUserID->fetch();

  if($accountID == null || !password_verify($accountID, $IdHash)){
    echo json_encode(array("valid" => false, "userMsg" => "Fout met link", "error" => ""));

    $queryUserID->close();
    $mysqli->close();
    exit(0);
  }
  $queryUserID->close();
  if($activated == 1){
    echo json_encode(array("valid" => false, "userMsg" => "Account is al geactiveerd", "error" => ""));

    $mysqli->close();
    exit(0);
  }

  $queryActivateUser = $mysqli->prepare('call sp_ActivateUser(?)');

  if(!$queryActivateUser)
  {
    echo json_encode(array("valid" => false, "userMsg" => "Er is iets fout gegaan met de verbinding met de databank", "error" => "Query mislukt activate"));

    $mysqli->close();
    exit(0);
  }

  $queryActivateUser->bind_param('s', $accountID);
  $queryActivateUser->execute();

  echo json_encode(array("valid" => true, "userMsg" => "Account is geactiveerd", "error" => ""));

  $queryActivateUser->close();
  $mysqli->close();
?>
