<?php
  require_once '../../../Scripts/PHPScripts.php';

  $mysqli = connectDataBase();

  $Name = strip($_POST["Name"]);
  $Lastname = strip($_POST["LastName"]);
  $email = $_POST["Email"];
  $password = password_hash($_POST["Password"],PASSWORD_DEFAULT);

  $databaseQuery = $mysqli->prepare('call sp_CheckAccount(?)');

  if(!$databaseQuery)
  {
    echo json_encode(array("email" => true, "created" => false, "error" => "select email query failed", "id" => 0));
    $mysqli->close();
    exit(0);
  }

  $databaseQuery->bind_param('s', $email);

  $databaseQuery->execute();

  $databaseQuery->bind_result($result);
  $databaseQuery->fetch();

  $databaseQuery->close();

  if($result >= 1){
      echo json_encode(array("email" => true, "created" => false, "error" => "", "id" => 0));
      $mysqli->close();
      exit(0);
  }

  $database = $mysqli->prepare('call sp_createUser(?,?,?,?)');

  if(!$database)
  {
    echo json_encode(array("email" => false, "created" => false, "error" => "insert query failed", "id" => 0));
    $mysqli->close();
    exit(0);
  }

  $database->bind_param('ssss', $Lastname, $Name, $email, $password); // 's' specifies the variable type => 'string'
  $database->execute();

  $database = $mysqli->prepare('call sp_getUserID(?)');

  if(!$database)
  {
    echo json_encode(array("email" => false, "created" => true, "error" => "select id query failed", "id" => 0));
    $mysqli->close();
    $database->close();
    exit(0);
  }

  $database->bind_param('s', $email); // 's' specifies the variable type => 'string'
  $database->execute();

  $database->bind_result($id);
  $database->fetch();

  echo json_encode(array("email" => false, "created" => true, "error" => "", "id" => $id));
  $IDHash = password_hash($id,PASSWORD_DEFAULT);
  $link = "http://localhost?email=$email&activatie=$IDHash";

  require_once "Mail.php";

  $host = "smtp.gmail.com";
  $port = 587;
  $username = "noreply.wireshell@gmail.com";
  $password = "s27101998";


  $from = "<noreply.wireshell@gmail.com>";
  $to = "<$email>";


  $subject = "Activatie mail Wireshell";
  $body = "klik op deze link om je account te activeren $link";

  $headers = array ('From' => $from,
  'To' => $to,
  'Subject' => $subject);
  $smtp = Mail::factory('smtp',
  array ('host' => $host,
  'port' => $port,
  'auth' => true,
  'username' => $username,
  'password' => $password));

  $mail = $smtp->send($to, $headers, $body);
  $mysqli->close();
  $database->close();
?>
