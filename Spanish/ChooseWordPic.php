<?php 
    $con = new mysqli('127.0.0.1','root','cassie','Spanish');
    $xml = "<xml>";

    $userID = $_POST['userID'];

    $type = $_POST['type'];
    $queryString = 
    "SELECT id,word,picture FROM $type";

    $unused = [];
    $query = $con->query($queryString);
    while($row = $query->fetch_array()){
        $id = $row['id'];
        $queryString2 = 
        "SELECT wordID FROM Results
        WHERE wordID = $id AND userID = $userID";
        $query2 = $con->query($queryString2);
        if($query2->fetch_array() == null){
            array_push($unused, [$row['word'],$row['picture'],$row['id']]);
        }
    }
    
    if(count($unused) == 0){
        $queryString = 
        "SELECT $type.word, $type.picture, $type.id
        FROM Results
        RIGHT JOIN $type
        ON $type.id = Results.wordID
        WHERE Results.userID = $id 
        AND Results.correct_in_a_row < 4 
        AND (Results.correct/Results.total < 0.8 OR Results.total < 4)
        AND Results.type = '$type'
        ORDER BY Rand()
        LIMIT 1";

        $query = $con->query($queryString);
        $row = $query->fetch_array();
        if($row !== null){
            $word = $row['word'];
            $picture = $row['picture'];
            $wordID = $row['id'];
    
            $xml.= "<correct>";
            $xml.= "<word>$word</word>";
            $xml.= "<picture>$picture</picture>";
            $xml.= "</correct>";
        }
        else{
            $xml.= "<end>true</end>";
        }
    }


    else{
        $word = $unused[0][0];
        $picture = $unused[0][1];
        $wordID = $unused[0][2];
        $xml.= "<correct>";
        $xml.= "<word>$word</word>";
        $xml.= "<picture>$picture</picture>";
        $xml.= "</correct>";
    }

    $queryString = 
    "SELECT picture FROM $type
    WHERE id != $wordID
    ORDER BY Rand()
    LIMIT 3";

    $query = $con->query($queryString);
    while($row = $query->fetch_array()){
        $picture = $row['picture'];
        $xml.= "<incorrect>";
        $xml.= "<picture>$picture</picture>";
        $xml.= "</incorrect>";
    }

    $xml.= "</xml>";
    echo $xml;

    $con->close();
?>