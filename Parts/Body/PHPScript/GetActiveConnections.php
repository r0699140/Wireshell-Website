<?php
  session_start();
  require_once '../../../Scripts/PHPScripts.php';

  $con = connectDataBase();

  $names = array();
  $numbers = array();

  $amount = 0;
  $pName = "";
  $total = 0;

  $numberQuery = $con->prepare('call sp_GetActiveCount(?)');
  $numberQuery->bind_param('i', $_SESSION['userID']);

  $numberQuery->execute();
  $numberQuery->bind_result($pName, $amount);

  while($numberQuery->fetch()){
    $pNameLow = strtolower($pName);

    if(!in_array($pNameLow, $names)){
      array_push($names, $pNameLow);

      $numbers[$pNameLow] = array();
    }

    array_push($numbers[$pNameLow], $amount);
    $total += $amount;
  }

  $numberQuery->close();

  echo json_encode(array("numbers"=>$numbers, "names"=>$names, "totalCon"=>$total));
?>
