<?php
  if(empty($_SERVER['HTTP_X_REQUESTED_WITH']) || strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) != 'xmlhttprequest' ){
  	exit;
  }

function strip($x){
   return strip_tags(trim(stripslashes(htmlspecialchars($x))));
}

function connectDataBase(){
  include_once $_SERVER['DOCUMENT_ROOT'].'/Keys/keys.php';

  $mysqli = new mysqli($servername, $username, $passwordDB, $dbname,$port);

  if($mysqli->connect_error){
      exit(-1);
  }

  return $mysqli;
}

 ?>
