<?php
    $word = $_POST['word'];
    $picture = $_POST['picture'];
    $typeID = $_POST['typeID'];
    $userID = $_POST['userID'];
    $setID = $_POST['setID'];

    $con = new mysqli('127.0.0.1','root','cassie','ASL');

    $queryString =
    "SELECT id FROM Words WHERE word = '$word' AND typeID = $typeID";
    $row = $con->query($queryString)->fetch_array();
    $wordID = $row['id'];

    if($setID == null){
        $queryString = 
        "SELECT * FROM Results
        WHERE userID = $userID
        AND typeID = $typeID
        AND wordID = $wordID
        AND ISNULL(setID)";
    }
    else{
        $queryString=
        "SELECT * FROM Results
        WHERE userID = $userID
        AND typeID = $typeID
        AND wordID = $wordID
        AND setID = $setID";
    }

    $row = $con->query($queryString)->fetch_array();
    if($row == null){
        $newWord = true;
    }
    else{
        $newWord = false;
    }

    $queryString = 
    "SELECT * FROM Words
    WHERE picture = '$picture'
    AND word = '$word'";
    $query = $con->query($queryString);
    if($query->fetch_array() == null){
        if($newWord == true){
            if($setID == null){
                $queryString = 
                "INSERT INTO Results(userID,wordID,correct,total,correct_in_a_row,typeID)
                VALUES($userID,$wordID,0,1,0,$typeID)";
            }
            else{
                $queryString = 
                "INSERT INTO Results(userID,wordID,correct,total,correct_in_a_row,typeID,setID)
                VALUES($userID,$wordID,0,1,0,$typeID,$setID)";
            }

        }
        else{
            if($setID == null){
                $queryString = 
                "UPDATE Results
                SET total = total+1, correct_in_a_row = 0
                WHERE userID = $userID 
                AND wordID = $wordID
                AND typeID = $typeID
                AND ISNULL(setID)";
            }
            else{
                $queryString = 
                "UPDATE Results
                SET total = total+1, correct_in_a_row = 0
                WHERE userID = $userID 
                AND wordID = $wordID
                AND typeID = $typeID
                AND setID = $setID";
            }

        }

        $query = $con->query($queryString);
        echo 'false';
    }
    else{
        if($newWord == true){
            if($setID == null){
                $queryString = 
                "INSERT INTO Results(userID,wordID,correct,total,correct_in_a_row,typeID)
                VALUES($userID,$wordID,1,1,1,$typeID)";
            }
            else{
                $queryString = 
                "INSERT INTO Results(userID,wordID,correct,total,correct_in_a_row,typeID,setID)
                VALUES($userID,$wordID,1,1,1,$typeID,$setID)";     
            }

        }
        else{
            if($setID == null){
                $queryString = 
                "UPDATE Results
                SET correct = correct+1, total = total+1, correct_in_a_row = correct_in_a_row+1
                WHERE userID = $userID 
                AND wordID = $wordID
                AND typeID = $typeID
                AND ISNULL(setID)";
            }
            else{
                $queryString = 
                "UPDATE Results
                SET correct = correct+1, total = total+1, correct_in_a_row = correct_in_a_row+1
                WHERE userID = $userID 
                AND wordID = $wordID
                AND typeID = $typeID
                AND setID = $setID";   
            }
        }

        $query = $con->query($queryString);
        echo 'true';
    }


    $con->close();

?>