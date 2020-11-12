<?php
    $typeID = $_POST['typeID'];
    $userID = $_POST['userID'];
    $setID = $_POST['setID'];

    $con = new mysqli('127.0.0.1','root','cassie','ASL');
    if($setID == null){
        $queryString =
        "DELETE FROM Results
        WHERE userID = $userID
        AND typeID = $typeID";
    }
    else{
        $queryString =
        "DELETE FROM Results
        WHERE userID = $userID
        AND setID = $setID";
    }
    $query = $con->query($queryString);
    $con->close();

?>