<?php 
    $username = $_POST['username'];
    $password = $_POST['password'];

    $con = new mysqli('127.0.0.1','root','cassie','Spanish');
    $queryString = 
    "SELECT id FROM Users
    WHERE username = '$username' AND password = '$password'";

    $row = $con->query($queryString)->fetch_array();
    
    if($row['id'] == null){
        echo "wrong";
    }
    else{
        echo $row['id'];
    }
    $con->close();
?>