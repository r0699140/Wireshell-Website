<link rel="stylesheet" href="<?php echo $homeDir ?>/Parts/Body/Body.css">
<div id="bodyContainer">
    <?php
    if($_SESSION["logon"]){
        include "BodyOnn.php";
    }else
    {
        include "BodyOff.php";
    }
        ?>
</div>
