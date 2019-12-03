<?php 
    $con = new mysqli('127.0.0.1','root','cassie','Spanish');
    $username = $_POST['username'];
    $password = $_POST['password'];
    $email = $_POST['email'];

    $queryString = 
    "SELECT username FROM Users WHERE username = '$username'";
    if(!$con->query($queryString)->fetch_array()){
        $queryString = 
        "INSERT INTO Users(username,password,email)
        VALUES('$username','$password','$email')";
        
        $con->query($queryString);
        echo 'new';
    }
    else{
        echo 'taken';
    }
    $con->close();
?>