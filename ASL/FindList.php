<?php
    $typeID = $_POST['typeID'];
    $input = $_POST['input'];
    $setID = $_POST['setID'];
    $userID = intval($_POST['userID']);

    $con = new mysqli('127.0.0.1','root','cassie','ASL');
    if($setID == null){
        $queryString = 
        "SELECT Words.id, Words.word, Words.picture, Words.typeID, Types.type
         FROM Words
         LEFT JOIN Types 
         ON Words.typeID = Types.id
         WHERE Words.typeID = $typeID
         AND Words.word LIKE '$input%'";

    }

    else{
        $queryString = 
        "SELECT Words.id, Words.word, Words.picture, Words.typeID, Types.type
        FROM Set_Words
        LEFT JOIN Words
        ON Words.id = Set_Words.wordID
        LEFT JOIN Types 
        ON Types.id = Set_Words.typeID
        WHERE setID = $setID
        AND Words.word LIKE '$input%'";
    }


    $xml = '<xml>';
    $query = $con->query($queryString);
    while($wordRow = $query->fetch_array()){
        $wordID = $wordRow['id'];
        if($setID == null){
            $queryString2 =
            "SELECT Words.word, Words.picture, Words.id, Words.typeID, Types.type, Results.correct, Results.total, Results.userID, Results.correct_in_a_row
            FROM Words
            LEFT JOIN Results
            ON Words.id = Results.wordID
            LEFT JOIN Types
            ON Types.id = Words.typeID
            WHERE Words.typeID = $typeID
            AND Results.wordID = $wordID
            AND ISNULL(setID)
            AND userID = $userID
            AND Words.word LIKE '$input%'";
        }

        else{
            $queryString2 =
            "SELECT Words.word, Words.picture, Words.id, Words.typeID, Types.type, Results.correct, Results.total, Results.userID, Results.correct_in_a_row
            FROM Words
            LEFT JOIN Results
            ON Words.id = Results.wordID
            LEFT JOIN Types
            ON Types.id = Words.typeID
            WHERE Results.wordID = $wordID
            AND setID = $setID
            AND userID = $userID
            AND Words.word LIKE '$input%'";
        }

        $row = $con->query($queryString2)->fetch_array();

        if($row !== null){
            $word = $row['word'];
            $picture = $row['picture'];
            $wordType = $row['type'];
            $wordID = $row['id'];
            $typeID = $row['typeID'];
            $correct_in_a_row = $row['correct_in_a_row'];
            $correct = $row['correct'];
  
            $total = $row['total'];    
            $percentage = round(($correct/$total)*100);
            $percentage.="%"; 

            if($correct_in_a_row >= 4 || ($percentage >= 80 && $total >=4)){
                $status = 'Completed';
            }
            else{
                $status = 'Learning';
            }
        }

        else{
            $word = $wordRow['word'];
            $picture = $wordRow['picture'];
            $wordType = $wordRow['type'];
            $wordID = $wordRow['id'];
            $typeID = $wordRow['typeID'];
            $percentage = "Not Encountered";
            $status = "Not Encountered";
        }



            $xml.= "<group>";
                $xml.= "<wordID>$wordID</wordID>";
                $xml.= "<typeID>$typeID</typeID>";
                $xml.= "<wordType>$wordType</wordType>";
                $xml.= "<word>$word</word>";
                $xml.= "<picture>$picture</picture>";
                $xml.= "<percentage>$percentage</percentage>";
                $xml.= "<status>$status</status>";
            $xml.= "</group>"; 
    }

    $xml.= '</xml>';
    $con->close();
    echo $xml;
?>