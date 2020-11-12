<?php
    $con = new mysqli('127.0.0.1','root','cassie','ASL');

    $types = [];
    $queryString = "SELECT id, type FROM Types";
    $query = $con->query($queryString);
    while($row = $query->fetch_array()){
        $typeID = $row['id'];
        $typeName = $row['type'];
        array_push($types,[$typeID,$typeName]);
    }


    for($t=0;$t<count($types);$t++){
        $typeID = $types[$t][0];
        $typeName = $types[$t][1];

        $dir    = '../Pictures/'.$typeName;
        $files = scandir($dir);
        array_splice($files,0,3);

        for($i=0;$i<count($files);$i++){
            $picture = $files[$i];
            $fileWord = strstr($files[$i],'.',true);
            $word = str_replace("_"," ",$fileWord);
        
            $queryString = "SELECT * FROM Words WHERE word = '$word' AND typeID = $typeID";
            $row = $con->query($queryString)->fetch_array();
            if($row == null){
                $queryString =
                "INSERT INTO Words(word,picture,typeID)
                VALUES ('$word','$picture',$typeID)";
                $query = $con->query($queryString);
            }
        }
    }


    $con->close();
?>