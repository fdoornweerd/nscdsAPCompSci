<?php 
    $username = $_POST['username'];
    $email = $_POST['email'];

    $con = new mysqli('127.0.0.1','root','cassie','ASL');
    $queryString = 
    "SELECT id FROM Users
    WHERE username = '$username' AND email = '$email'";

    $row = $con->query($queryString)->fetch_array();
    
    if($row['id'] == null){
        $queryString = 
        "INSERT INTO Users(username,email)
        VALUES('$username','$email')";
        
        $con->query($queryString);

        $queryString = 
        "SELECT id FROM Users
        WHERE username = '$username' AND email = '$email'";
    
        $row = $con->query($queryString)->fetch_array();
    }

    echo $row['id'];

    $con->close();
?>


