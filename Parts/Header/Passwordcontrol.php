<?php
    
    $password = "Blablabla"; 
       $hashpassword = password_hash($password,PASSWORD_DEFAULT);
    
    if(password_verify($password,$hashpassword))
    {
        echo "passwoord komt overeen";
    }else
    {
        echo "passwoord komt niet overeen";
    }
    
    ?>