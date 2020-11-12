<?php
    $setID = $_POST['setID'];
    $wordID = $_POST['wordID'];

    $con = new mysqli('127.0.0.1','root','cassie','ASL');

    if($wordID == null){
        $queryString1 = "DELETE FROM User_Sets WHERE id = $setID";
        $queryString2 = "DELETE FROM Set_Words WHERE setID = $setID";
        $queryString3 = "DELETE FROM Results WHERE setID = $setID";

        $con->query($queryString3);
    }
    else{
        $queryString1 = "DELETE FROM Set_Words WHERE setID = $setID AND wordID = $wordID";
        $queryString2 = "DELETE FROM Results WHERE setID = $setID AND wordID = $wordID";      
    }

    
    $con->query($queryString1);
    $con->query($queryString2);

    $con->close();
?>