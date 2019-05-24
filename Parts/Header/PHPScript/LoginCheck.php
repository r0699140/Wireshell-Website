<?php
session_start();

  require_once '../../../Scripts/PHPScripts.php';

  $mysqli = connectDataBase();

  $email = strip($_POST["Email"]);
  $password = $_POST["Password"];
  
  $databaseQuery = $mysqli->prepare('call sp_getUserMail(?)');

  if(!$databaseQuery)
  {
    echo json_encode(array("valid" => false, "userMsg" => "Er is iets fout gegaan met de verbinding met de databank", "error" => "Select query failed"));
    $mysqli->close();
    exit(0);
  }

  $databaseQuery->bind_param('s', $email);

  $databaseQuery->execute();

  $databaseQuery->bind_result($passwordHash, $accountID, $activated, $name, $firstname);
  $databaseQuery->fetch();

  if($accountID != null && password_verify($password, $passwordHash)){
    if($activated == 1){
      echo json_encode(array("valid" => true, "userMsg" => "", "error" => ""));
      $_SESSION["logon"] = true;
      $_SESSION["userID"] = $accountID;
      $_SESSION["Name"] = $name;
    }else{
      echo json_encode(array("valid" => false, "userMsg" => "Activeer eerst je account met de verificatie mail.", "error" => ""));
    }

    $databaseQuery->close();
    $mysqli->close();
    exit(0);
  }
  echo json_encode(array("valid" => false, "userMsg" => "Fout wachtwoord of email", "error" => ""));

  $databaseQuery->close();
  $mysqli->close();
?>
