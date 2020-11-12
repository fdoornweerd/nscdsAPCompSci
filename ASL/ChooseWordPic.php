<?php 
    $con = new mysqli('127.0.0.1','root','cassie','ASL');
    $xml = "<xml>";
    $end = false;
    $userID = $_POST['userID'];
    $setID = $_POST['setID'];
    $typeID = $_POST['typeID'];

    $usingSet = true;
    if($setID == null){
        $usingSet = false;
    }

    if(!$usingSet){
        $queryString = 
        "SELECT id,word,picture FROM Words 
        WHERE typeID = $typeID";
        $unused = [];
        $query = $con->query($queryString);
        while($row = $query->fetch_array()){
            $id = $row['id'];
            $queryString2 = 
            "SELECT wordID FROM Results
            WHERE wordID = $id 
            AND userID = $userID
            AND typeID = $typeID
            AND ISNULL(setID)";
            $query2 = $con->query($queryString2);
            if($query2->fetch_array() == null){
                array_push($unused, [$row['word'],$row['picture'],$row['id']]);
            }
        }
    }

    else{
        $queryString =
        "SELECT Words.id,Words.word,Words.picture,Words.typeID
        FROM Set_Words
        RIGHT JOIN Words
        ON Words.id = Set_Words.wordID
        WHERE setID = $setID";
        $unused = [];
        $query = $con->query($queryString);
        while($row = $query->fetch_array()){
            $id = $row['id'];
            $queryString2 = 
            "SELECT wordID FROM Results
            WHERE wordID = $id 
            AND userID = $userID
            AND setID = $setID";
            $query2 = $con->query($queryString2);
            if($query2->fetch_array() == null){
                array_push($unused, [$row['word'],$row['picture'],$row['id'],$row['typeID']]);
            }
        }
    }



    if(count($unused) == 0){
        if(!$usingSet){
            $queryString = 
            "SELECT Words.word, Words.picture, Words.id, Words.typeID
            FROM Results
            RIGHT JOIN Words
            ON Words.id = Results.wordID
            WHERE Results.userID = $userID 
            AND Words.typeID = $typeID
            AND ISNULL(setID)
            AND Results.correct_in_a_row < 4 
            AND (Results.correct/Results.total < 0.80 OR Results.total < 4)
            ORDER BY Rand()
            LIMIT 1";
        }

        else{
            $queryString = 
            "SELECT Words.word, Words.picture, Words.id, Words.typeID
            FROM Results
            RIGHT JOIN Words
            ON Words.id = Results.wordID
            WHERE Results.userID = $userID 
            AND Results.setID = $setID
            AND Results.correct_in_a_row < 4 
            AND (Results.correct/Results.total < 0.80 OR Results.total < 4)
            ORDER BY Rand()
            LIMIT 1";
        }


        $query = $con->query($queryString);
        $row = $query->fetch_array();
        if($row !== null){
            $word = $row['word'];
            $picture = $row['picture'];
            $wordID = $row['id'];
            $typeID = $row['typeID'];
    
            $xml.= "<correct>";
            $xml.= "<word>$word</word>";
            $xml.= "<picture>$picture</picture>";
            $xml.= "<typeID>$typeID</typeID>";
            $xml.= "</correct>";
        }
        else{
            $xml.= "<end>true</end>";
            $end = true;
        }
    }

    else{
        $randIndex = rand(0,count($unused)-1);
        $word = $unused[$randIndex][0];
        $picture = $unused[$randIndex][1];
        $wordID = $unused[$randIndex][2];
        if($usingSet){
            $typeID = $unused[$randIndex][3];
        }
        $xml.= "<correct>";
        $xml.= "<typeID>$typeID</typeID>";
        $xml.= "<word>$word</word>";
        $xml.= "<picture>$picture</picture>";
        $xml.= "</correct>";
    }

    if(!$end){
        if(!$usingSet){
            $queryString = 
            "SELECT picture, typeID FROM Words
            WHERE id != $wordID
            AND typeID = $typeID
            ORDER BY Rand()
            LIMIT 3";         
        }
        else{
            $queryString = 
            "SELECT Words.picture, Words.typeID 
            FROM Set_Words
            RIGHT JOIN Words
            ON Words.id = Set_Words.wordID
            WHERE Words.id != $wordID
            AND Set_Words.setID = $setID
            ORDER BY Rand()
            LIMIT 3";
        }

        $query = $con->query($queryString);
        while($row = $query->fetch_array()){
            $typeID = $row['typeID'];
            $picture = $row['picture'];
            $xml.= "<incorrect>";
            $xml.= "<typeID>$typeID</typeID>";
            $xml.= "<picture>$picture</picture>";
            $xml.= "</incorrect>";
        }    
    }

    $xml.= "</xml>";
    echo $xml;

    $con->close();
?>