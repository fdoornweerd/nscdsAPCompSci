<?php
    $userID = $_POST['userID'];

    $con = new mysqli('127.0.0.1','root','cassie','ASL');

    $queryString = 
    "SELECT name,id FROM User_Sets
    WHERE userID = $userID";
    $query = $con->query($queryString);

    $xml = "<xml>";
    while($row = $query->fetch_array()){
        $setName = $row['name'];
        $setID = $row['id'];
        $xml.="<newSet>";
        $xml.= "<setName>$setName</setName>";
        $xml.= "<setID>$setID</setID>";
        $xml.="</newSet>";
    }
    $xml.= "</xml>";

    echo $xml;

    $con->close();
?>