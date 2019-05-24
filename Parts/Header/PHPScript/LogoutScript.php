<?php
session_start();
require_once '../../../Scripts/PHPScripts.php';

$_SESSION["logon"] = false;
unset($_SESSION);
echo json_encode(array("loggedOut" => true, "error" => ""));

?>
