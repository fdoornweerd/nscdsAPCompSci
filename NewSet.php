<?php
    $set = $_POST['set'];
    $userID = $_POST['userID'];
    $setName = $_POST['setName'];
    print_r($sets);
    $con = new mysqli('127.0.0.1','root','cassie','ASL');


    $queryString=
    "SELECT id FROM User_Sets
    WHERE name = '$setName'
    AND userID = $userID";
    $row = $con->query($queryString)->fetch_array();

    if($row == null){
        $queryString = 
        "INSERT INTO User_Sets(name,userID)
        VALUES ('$setName',$userID)";
        $query = $con->query($queryString);

        $queryString=
        "SELECT id FROM User_Sets
        WHERE name = '$setName'
        AND userID = $userID";
        $row = $con->query($queryString)->fetch_array();

        $setID = $row['id'];

        for($i=0; $i<count($set); $i++){
            $wordID = $set[$i][0];
            $typeID = $set[$i][1];
            
            $queryString=
            "SELECT * FROM Set_Words
            WHERE setID = $setID
            AND wordID = $wordID
            AND typeID = typeID";
            $row = $con->query($queryString)->fetch_array();

            if($row == null){                
                $queryString =
                "INSERT INTO Set_Words(setID,wordID,typeID)
                VALUES($setID,$wordID,$typeID)";
                $query = $con->query($queryString);
            }
        }
    }

    else{
        $setID = $row['id'];
        for($i=0; $i<count($set); $i++){
            $wordID = $set[$i][0];
            $typeID = $set[$i][1];

            $queryString=
            "SELECT * FROM Set_Words
            WHERE setID = $setID
            AND wordID = $wordID
            AND typeID = $typeID";
            $row = $con->query($queryString)->fetch_array();

            if($row == null){                
                $queryString =
                "INSERT INTO Set_Words(setID,wordID,typeID)
                VALUES($setID,$wordID,$typeID)";
                $query = $con->query($queryString);
            }
        }
    }
    
    $con->close();

?>