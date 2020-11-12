var user;
var userID;

function onSignIn(googleUser){
    var profile = googleUser.getBasicProfile();

    var submit = $.ajax({
        type: 'POST',
        url: 'PHP/CheckUser.php',
        data: {
            username: profile.getName(),
            email: profile.getEmail(),
        },
        dataType: 'text',
    })

    submit.done(function(text){
        var addWords = $.ajax({
            url: 'PHP/AddWords.php',
        });
        userID = text;
        $('#signIn').hide();
        user = profile.getName();
        MainPage();
    });
    submit.fail(function(text,errorStatus){
        console.log(errorStatus,text.responseText);
    });
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function(){
        hidePages();
        $('#signIn').show();
        if(deleting){
            endDeleteSpecific();
        }
        if(newSet){
            cancel();
        }
    });
  }


function MainPage(){
    $('#mainPage').show();
    document.getElementById('showUserMain').innerHTML = user;
}



function hidePages(){
    $('#mainPage').hide();
    $('#signIn').hide();
    $('#nounPage').hide();
    $('#miscellaneousPage').hide();
    $('#verbPage').hide();
    $('#NounsList').hide();
    $('#MiscList').hide();
    $('#VerbsList').hide();
    $('#setsPage').hide();
    $('#SetsList').hide();
}


function back(){
    if(!setInfo){
        hidePages();
        $('#mainPage').show();
        $('#startNouns').show();
        $('#nounDisplay').empty();
        $('#startVerbs').show();
        $('#verbDisplay').empty();
        $('#startMiscellaneous').show();
        $('#miscellaneousDisplay').empty();
        $('#startSets').show();
        $('#SetOptionsLearn').show();
        $('#setsDisplay').empty();
        document.getElementById('nounSearch').value = '';
        document.getElementById('verbSearch').value = '';
        document.getElementById('miscellaneousSearch').value = '';
        document.getElementById('setSearch').value = '';
        endDeleteSpecific();
    }
}

function startNouns(){
    $('#mainPage').hide();
    $('#nounPage').show();
    document.getElementById('showUserNoun').innerHTML = user;
    getWord('Nouns');
}

function startVerbs(){
    $('#mainPage').hide();
    $('#verbPage').show();
    document.getElementById('showUserVerb').innerHTML = user;
    getWord('Verbs');
}

function startMiscellaneous(){
    $('#mainPage').hide();
    $('#miscellaneousPage').show();
    document.getElementById('showUserMiscellaneous').innerHTML = user;
    getWord('Miscellaneous');
}

function startSet(change){

    if(change){
        var setID = document.getElementById('SetOptionsLearn').value;
        getWord('Sets',setID);
    }

    else{
        $('#mainPage').hide();
        $('#setsPage').show();
        document.getElementById('showUserSets').innerHTML = user;
        $('#SetOptionsLearn').empty();
        getSets('#SetOptionsLearn');
    }

}

function getWord(type,setID){
    console.log(setID);
    var typeID;
    if(type == 'Nouns'){
        var typeID = 2;
    }
    else if(type == 'Verbs'){
        var typeID = 1;
    }

    else if(type == 'Miscellaneous'){
        var typeID = 3;
    }

    var chosen = $.ajax({
        type: 'POST',
        url: 'PHP/ChooseWordPic.php',
        data: {
            typeID: typeID,
            userID: userID,
            setID: setID,
        },
        dataType: 'xml',
    });

    

    chosen.done(function(xml){
        var end = $(xml).find('end').text();

        if(end == 'true'){
            restart(type,userID,setID);
        }

        else{
            var pictures = [];
            var word;
            var correct = $(xml).find('correct');
            $(correct).each(function(){
                word = $(this).find('word').text();
                pictures.push([$(this).find('picture').text(),$(this).find('typeID').text()]);
            });
    
            var incorrect = $(xml).find('incorrect');
            $(incorrect).each(function(){
                pictures.push([$(this).find('picture').text(),$(this).find('typeID').text()]);
            });
    

            display(word,pictures,type,typeID,setID);
        }
    });

    chosen.fail(function(xml,errorStatus){
        console.log(xml.responseText, errorStatus);
    });
}

function display(word,pictures,type,typeID,setID){

    if(type == 'Nouns'){
        var addTo = '#nounDisplay';
    }
    else if(type == 'Verbs'){
        var addTo = '#verbDisplay';
    }
    else if(type == 'Miscellaneous'){
        var addTo = '#miscellaneousDisplay';
    }
    else{
        var addTo = '#setsDisplay';    
    }

    $(addTo).empty();

    showInfo(addTo,typeID,setID);

    $(addTo).append("<h1 style='position:absolute; left:600px; top:200px; font-size: 80px'>"+word+"</h1>");

    var xPos = [100,400,700,1000];
    for(var i in pictures){
        var randSpot = Math.floor(Math.random()*xPos.length);
        var randX = xPos[randSpot];

        if(pictures[i][1] == 1){
            type = 'Verbs';
        }
        if(pictures[i][1] == 2){
            type = 'Nouns';
        }
        if(pictures[i][1] == 3){
            type = 'Miscellaneous';
        }

        var imageTag = "<img src='Pictures/"+type+"/"+pictures[i][0]+"' id='"+pictures[i][0]+"' typeID ='"+pictures[i][1]+"'class = 'pictures' style='max-width: 250px; max-height: 250px; margin-left: auto; margin-right: auto; display: block;'></img>"
        $(addTo).append("<div class='case' style='position:absolute; cursor: pointer; left:"+randX+"px; top:400px; max-width: 250px; max-height: 250px; border: 2px solid black'>"+imageTag+"</div>");
        xPos.splice(randSpot,1);
    }   

    $('.pictures').click(function(){
        checkWord(word,$(this).attr('id'),type,$(this).attr('typeID'),setID,addTo);
    })
}


function checkWord(word,clickedPic,type,typeID,setID,addTo){
    var check = $.ajax({
        url: 'PHP/CheckClickedPic.php',
        type: 'POST',
        data: {
            word: word,
            picture: clickedPic,
            typeID: typeID,
            setID: setID,
            userID: userID,
        },  
        dataType: 'text',
    });

    check.done(function(text){
        if(text == 'true'){
            showResult(true,addTo);
            setTimeout(function(){
                if(setID !== undefined){
                    type = 'Sets'
                }
                getWord(type,setID);
            },300);
        }
        else{
            showResult(false,addTo);
        }
    });

    check.fail(function(text,errorStatus){
        console.log(text.responseText,errorStatus);
    })

}

function showResult(answer,addTo){
    if(answer){
        var picture = "Pictures/Others/Check.png";
    }
    else{
        var picture = "Pictures/Others/Cross.png";
    }

    $(addTo).append("<img src='"+picture+"' id='picture' style='position:absolute; left:300px; top:175px; width:200px'></img>");

    setTimeout(function(){
        $('#picture').remove();
    },300);
}

function restart(type,userID,setID){
    alert("Congradulations! You have learned all the words in this set! Either click on the big red button to restart or click on the back button");
    if(type == 'Nouns'){
        var addTo = '#nounDisplay';
        var typeID = 2;
    }
    else if(type == 'Verbs'){
        var addTo = '#verbDisplay';
        var typeID = 1;
    }
    else if(type == 'Sets'){
        var addTo = '#setsDisplay';
    }
    else{
        var addTo = '#miscellaneousDisplay';
        var typeID = 3;
    }

    $(addTo).empty();
    
    $(addTo).append("<div id='circle' style='position:absolute; left:500px; top:100px; width:300px; height:300px; border-radius:50%; background-color:red; cursor: pointer;'></div>");
    $('#circle').append("<h1 style='position:absolute; left:75px; top:100px;'>RESTART</h1>");

    $("#circle").click(function(){
        var restarting = $.ajax({
            type: "POST",
            url: 'PHP/Restart.php',
            data: {
                typeID: typeID,
                userID: userID,
                setID: setID,
            },
            dataType: 'text',
        });

        restarting.done(function(text){
            getWord(type,setID);
        });

        restarting.fail(function(text,errorStatus){
            console.log(text.responseText,errorStatus);
        })
    });
}


function displayList(listType){
    hidePages();

    if(listType == 'nounList'){
        var type = 'nounSearch';
        $('#NounsList').show();
        var typeID = 2;
        search(type,typeID);
    }
    else if(listType == 'verbList'){
        var type = 'verbSearch';
        $('#VerbsList').show();
        var typeID = 1;
        search(type,typeID);
    }

    else if(listType == 'miscList'){
        var type = 'miscellaneousSearch';
        $('#MiscList').show();
        var typeID = 3;
        search(type,typeID);
    }
    else{
        $('#SetsList').show();
        $('#SetOptionsList').empty();
        getSets('#SetOptionsList');
    }
}

function search(searchType,typeID){

    var input = document.getElementById(searchType).value;

    var setID;
    var type;
    var typeID;
    if(searchType == 'verbSearch'){
        type='Verbs';
        typeID = 1;
    }
    else if(searchType == 'nounSearch'){
        type='Nouns';
        typeID = 2;
    }
    else if(searchType == 'miscellaneousSearch'){
        type = 'Miscellaneous';
        typeID = 3;
    }
    else{
        type = 'Sets';
        setID = $("#SetOptionsList").val();
    }

    $('#'+type+'Container').empty();

    var showList = $.ajax({
        type: 'POST',
        url: 'PHP/FindList.php',
        data: {
            typeID: typeID,
            userID: userID,
            setID: setID,
            input: input,
        },
        dataType: 'xml',
    });

    showList.done(function(xml){

        var group = $(xml).find('group');
        $(group).each(function(){
            var percentage = $(this).find('percentage').text();
            var word = $(this).find('word').text();
            var wordID = $(this).find('wordID').text();
            var picture = $(this).find('picture').text();
            var status = $(this).find('status').text();
            var typeID = $(this).find('typeID').text();
            var wordType = $(this).find('wordType').text();
            if(setID == undefined){
                var setIDTag = 'none';
            }
            else{
                var setIDTag = setID;
            }


            var pictureDisplay = '<img src="Pictures/'+wordType+'/'+picture+'" id="'+picture+'" style="max-width: 100%; max-height: 70%; display: block;">';
            var infoDisplay = "<div class='learningInfo' style='width:100%; height:30%;'>"+word+"<br>Percentage Correct: "+percentage+"<br> Status: "+status+"</div>";
            $('#'+type+'Container').append('<div class="box" id='+wordID+' typeID= '+typeID+' setID ='+setIDTag+' style="width:250px; height:200px; border: 2px solid black; margin:8px; margin-left:70px; display: inline-block;">'+pictureDisplay+''+infoDisplay+'</div>');

            if(setName !== undefined){
                $('.box').css('cursor','pointer');
            }
        });


        $('.box').click(function(){
            addToSet($(this).attr('id'),$(this).attr('typeID'));

            if(deleting == true && $(this).attr('setID') !== 'none'){
                removeWord($(this).attr('id'),$(this).attr('setID'));
            }
        })
    });

    showList.fail(function(xml,errorStatus){
        console.log(xml.responseText,errorStatus);
    })
}


var set = [];
var newSet = false;
var setName = undefined;
var setInfo = false;
function setInfoWindow(setType){
    setInfo = true;
    if(setType == 'newNounSet'){
        var display = '#NounsList';
    }
    else if(setType == 'newVerbSet'){
        var display = '#VerbsList';
    }
    else{
        var display = '#MiscList';
    }

    var info = "Name your set, and then click on the boxes of the words you would like to add to that set. You can move between the different lists of words to add to your set (A set could have both nouns and verbs). Once you are done with your set, click 'Finish Set' to save it. If you want to add to an existing set, just type the name of the set previously made.";
    var inputName = "<input id='inputName' style='font-size: 20px' autocomplete='off'>";
    var sendName = "<button id='sendName' style='font-size: 20px;'onclick='giveSetName()'>Name Set</button>";
    var cancel = "<button class='cancel' style='font-size: 40px; position:absolute; left:250px; top:10px;'onclick='cancel()'>Cancel Set</button>";

    $(display).append("<div id='setInfo' style = 'width:300px; height:100px; position:absolute; left:550px; top:200px; height:300px; background-color:white; border: 2px solid black; font-size: 20px;'>"+info+""+inputName+""+sendName+"</div>");

    $('#MiscList').append(cancel);
    $('#VerbsList').append(cancel);
    $('#NounsList').append(cancel);

    $('#newVerbSet').hide();
    $('#newNounSet').hide();
    $('#newMiscellaneousSet').hide();


    newSet = true;
}



function cancel(){
    newSet = false;
    setName = undefined;
    set = [];
    $(".cancel").hide();
    $("#newVerbSet").show();
    $("#endVerbSet").hide();
    $("#newNounSet").show();
    $("#endNounSet").hide();
    $("#newMiscellaneousSet").show();
    $("#endMiscellaneousSet").hide();
    $('.box').css('cursor','auto');
    $('#setInfo').empty();
    $('#setInfo').remove();
    setInfo = false;
}



function giveSetName(){
    var inputName = document.getElementById("inputName").value;
    if(inputName!== ''){
        $('#setInfo').empty();
        $('#setInfo').remove();
    
        $('#endMiscellaneousSet').show();
        $('#endVerbSet').show();
        $('#endNounSet').show();

        $('.box').css('cursor','pointer');
        setInfo = false;
        setName = inputName;
    }
}


function addToSet(wordID,typeID){
    if(newSet && setName !== undefined){
        set.push([wordID,typeID]);
    }
}

function endSet(setType){
    if(newSet){
        $("#newVerbSet").show();
        $("#endVerbSet").hide();
        $("#newNounSet").show();
        $("#endNounSet").hide();
        $("#newMiscellaneousSet").show();
        $("#endMiscellaneousSet").hide();
        $(".cancel").hide();
        $('.box').css('cursor','auto');

        var addSet = $.ajax({
            type: 'POST',
            url: 'PHP/NewSet.php',
            data: {
                setName: setName,
                set: set,
                userID: userID,
            },
            dataType: 'text',
        });

        addSet.done(function(text){

        });

        addSet.fail(function(text,errorStatus){
            console.log(text,responseText, errorStatus);
        })

        newSet = false;
        set = [];
        setName = undefined;

    }
}

function getSets(name){
    var userSets = $.ajax({
        url: 'PHP/GetSets.php',
        data: {
            userID: userID,
        },
        type: 'POST',
        dataType: 'xml',
    });

    userSets.done(function(xml){
        var newSet = $(xml).find('newSet');

        $(newSet).each(function(){
            var setName = $(this).find('setName').text();
            var setID = $(this).find('setID').text();

            $(name).append("<option value='"+setID+"'>"+setName+"</option>");
        })

        if(name == '#SetOptionsList'){
            search('setSearch',undefined);
        }
        if(name == '#SetOptionsLearn'){
            var setID = document.getElementById('SetOptionsLearn').value;
            getWord('Sets',setID);
        }
    });

    userSets.fail(function(xml,errorStatus){
        console.log(xml.responseText,errorStatus);
    })
}


function deleteSet(){
    var setID = $("#SetOptionsList").val();

    var remove = $.ajax({
        url: 'PHP/DeleteSet.php',
        type: 'POST',
        data: {
            setID: setID,
        },
        dataType: 'text'
    });

    remove.done(function(text){
        $('#SetOptionsList').empty();
        getSets('#SetOptionsList');
    });

    remove.fail(function(text,errorStatus){
        console.log(text.responseText,errorStatus);
    });
}


var deleting = false;
function deleteSpecific(){
    $('#specificDelete').hide();
    $('#endSpecificDelete').show();
    deleting = true;
}

function removeWord(wordID,setID){
    var remove = $.ajax({
        url:'PHP/DeleteSet.php',
        type:'POST',
        data: {
            wordID: wordID,
            setID: setID,
        },
        dataType: 'text',
    });
    remove.done(function(text){
        search('setSearch');
    });
    remove.fail(function(text,errorStatus){
        console.log(text.responseText,errorStatus);
    });
}

function endDeleteSpecific(){
    $('#endSpecificDelete').hide();
    $('#specificDelete').show();
    deleting = false;
}

function showInfo(addTo,typeID,setID){
    var info = $.ajax({
        type: 'POST',
        url: 'PHP/GetInfo.php',
        data: {
            typeID: typeID,
            setID: setID,
            userID: userID,
        },
        dataType: 'xml',
    });

    info.done(function(xml){
        var unseen = parseInt($(xml).find('unseen').text());
        var learning = parseInt($(xml).find('learning').text());
        var mastered = parseInt($(xml).find('mastered').text());


        $(addTo).append("<div id='unseen' style='width: 250px; height:40px; border: 2px solid black; position:absolute; top:30px; left:200px; font-size: 30px; color:gray'>Unseen Words: "+unseen+"</div>");
        $(addTo).append("<div id='unseenOut' style='width: 250px; height:40px; border: 2px solid black; position:absolute; top:80px; left:200px;'></div>");
        var unseenWidth = 250*(unseen/(learning+mastered+unseen));
        $("#unseenOut").append("<div id='unseenIn' style='width: "+unseenWidth+"px; height:40px; background-color:gray;'></div>");


        $(addTo).append("<div id='learning' style='width: 250px; height:40px; border: 2px solid black; position:absolute; top:30px; left:500px; font-size: 30px; color:orange'>Learning Words: "+learning+"</div>");
        $(addTo).append("<div id='learningOut' style='width: 250px; height:40px; border: 2px solid black; position:absolute; top:80px; left:500px;'></div>");
        var learningWidth = 250*(learning/(learning+mastered+unseen));
        $("#learningOut").append("<div id='learningIn' style='width: "+learningWidth+"px; height:40px; background-color:orange;'></div>");

        $(addTo).append("<div id='mastered' style='width: 250px; height:40px; border: 2px solid black; position:absolute; top:30px; left:800px; font-size: 30px; color:green'>Mastered Words: "+mastered+"</div>");
        $(addTo).append("<div id='masteredOut' style='width: 250px; height:40px; border: 2px solid black; position:absolute; top:80px; left:800px;'></div>");
        var masteredWidth = 250*(mastered/(learning+mastered+unseen));
        $("#masteredOut").append("<div id='masteredIn' style='width: "+masteredWidth+"px; height:40px; background-color:green;'></div>");
    });

    info.fail(function(xml,errorStatus){
        console.log(xml.responseText,errorStatus);
    });
}



function init(){
    hidePages();
    $('#signIn').show();
}

init();