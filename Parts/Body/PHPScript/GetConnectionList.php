<?php
  session_start();

  require_once '../../../Scripts/PHPScripts.php';

  $con = connectDataBase();

  $boxes = array();

  $names = array();
  $timestamps = array();
  $graphData = array();
  $connectionsPerName = array();

  $range = $_POST['range'];
  $step = $_POST['step'];

  $datatime;
  $dataPoint = 0;
  $pName = "";

  $numberQuery = $con->prepare('call sp_GetAllActiveConSince(?, ?, ?)');
  $numberQuery->bind_param('iii', $_SESSION['userID'], $range, $step);

  $numberQuery->execute();
  $numberQuery->bind_result($pName, $datatime, $dataPoint);

  while($numberQuery->fetch()){
    $pNameLow = strtolower($pName);

    if(!in_array($pNameLow, $names)){
      array_push($names, $pNameLow);

      $timestamps[$pNameLow] = array();
      $graphData[$pNameLow] = array();
      $connectionsPerName[$pNameLow] = 0;
    }

    $time = date("H:i", strtotime($datatime));
    $prevTime = end($timestamps[$pNameLow]);

    $date = (int)strtotime($datatime);
    $prevDate = (int)strtotime($prevTime);

    $timeDif = ($date - $prevDate) / 60;

    if($connectionsPerName[$pNameLow] != $dataPoint || ($timeDif > 10 && $dataPoint != 0)){
      $connectionsPerName[$pNameLow] = $dataPoint;
      array_push($graphData[$pNameLow], $dataPoint);

      array_push($timestamps[$pNameLow], $time);
    }
  }

  $numberQuery->close();

  foreach($names as $name){
    $box = "<div class = 'ProcessBox'>
      <p class = 'pName' title = '$name'>$name</p>
      <p class = 'pRam'>Ram: 0%</p>
      <p class = 'pCPU'>CPU: 0%</p>
      <p class = 'pAmount'>Verbindingen: $connectionsPerName[$name]</p>
      <p class = 'pGraph'><input type = 'hidden'/><canvas class = 'graphCanvas'> </canvas></p>
    </div>";

    $boxes[$name] = $box;
  }


  echo json_encode(array("boxes"=>$boxes, "timeHistory"=>$timestamps, "graphData"=>$graphData, "names"=>$names));
?>
