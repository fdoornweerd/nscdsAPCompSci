<?php
    $typeID = $_POST['typeID'];
    $setID = $_POST['setID'];
    $userID = $_POST['userID'];

    $con = new mysqli('127.0.0.1','root','cassie','ASL');


    $totalWords = 0;

    if($setID == null){
        $queryString=
        "SELECT * FROM Words
        WHERE typeID = $typeID";

        $query = $con->query($queryString);
        while($row = $query->fetch_array()){
            $totalWords = $totalWords+1;
        }

        $queryString = 
        "SELECT correct, total, correct_in_a_row 
        FROM Results
        WHERE typeID = $typeID
        AND userID = $userID
        AND ISNULL(setID)";
    }
    else{
        $queryString=
        "SELECT * FROM Set_Words
        WHERE setID = $setID";

        $query = $con->query($queryString);
        while($row = $query->fetch_array()){
            $totalWords = $totalWords+1;
        }

        $queryString =
        "SELECT correct, total, correct_in_a_row
        FROM Results
        WHERE setID = $setID
        AND userID = $userID";
    }


    $unseen = 0;
    $learning = 0;
    $mastered = 0;


    $query = $con->query($queryString);

    while($row = $query->fetch_array()){
        $total = $row['total'];
        $correct = $row['correct'];
        $inRow = $row['correct_in_a_row'];

        if($inRow >= 4 || ($total >= 4 && $correct/$total >= 0.80)){
            $mastered = $mastered+1;
        }
        else{
            $learning = $learning+1;
        }
    }

    $unseen = $totalWords-($learning+$mastered);
    $xml = "<xml>";
    $xml.= "<unseen>$unseen</unseen>";
    $xml.= "<learning>$learning</learning>";
    $xml.= "<mastered>$mastered</mastered>";
    $xml.= "</xml>";

    $con->close();

    echo $xml;

?>