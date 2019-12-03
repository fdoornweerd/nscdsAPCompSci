var user;
var userID;

function submitUser(){
    $('#signIn').show();
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    var submit = $.ajax({
        type: 'POST',
        url: 'CheckUser.php',
        data: {
            username: username,
            password: password,
        },
        dataType: 'text',
    })

    submit.done(function(text){
        if(text =='wrong'){
            alert('Incorrect Username or Passowrd');
        }
        else{
            userID = text;
            $('#signIn').hide();
            user = username;
            MainPage();
        }
    });
    submit.fail(function(text,errorStatus){
        console.log(errorStatus,text.responseText);
    });
}

function createUser(){
    var username = document.getElementById('newUsername').value;
    var password = document.getElementById('newPassword').value;
    var email = document.getElementById('newEmail').value;

    if(username !== '' && password !== '' && email !== ''){
        var create = $.ajax({
            type: 'POST',
            url: 'CreateUser.php',
            data: {
                username: username,
                password: password,
                email: email,
            },
            dataType: 'text',
        });

        create.done(function(text){
            if(text=='new'){
                $('#newUser').hide();
                $('#signIn').show();
            }
            if(text=='taken'){
                alert("USERNAME IS TAKEN");
            }
        });
    }

    else{
        alert('Fill all the boxes');
    }
}


function MainPage(){
    $('#mainPage').show();
    document.getElementById('showUserMain').innerHTML = user;
}



function hidePages(){
    $('#mainPage').hide();
    $('#signIn').hide();
    $('#newUser').hide();
    $('#nounPage').hide();
    $('#verbPage').hide();
}

$('#createNewUser').click(function(){
    $('#signIn').hide();
    $('#newUser').show();
});


$('#learnVerbs').click(function(){
    $('#mainPage').hide();
    $('#verbPage').show();
    document.getElementById('showUserVerb').innerHTML = user;
});

$('#learnNouns').click(function(){
    $('#mainPage').hide();
    $('#nounPage').show();
    document.getElementById('showUserNoun').innerHTML = user;
});

$('#verbBack').click(function(){
    $('#mainPage').show();
    $('#startVerbs').show();
    $('#verbPage').hide();
});

$('#nounBack').click(function(){
    $('#mainPage').show();
    $('#startNouns').show();
    $('#nounPage').hide();
});

function startNouns(){
    $('#startNouns').hide();
    getWord('Nouns');
}

function startVerbs(){
    $('#startVerbs').hide();
    getWord('Verbs');
}

function getWord(type){
    var chosen = $.ajax({
        type: 'POST',
        url: 'ChooseWordPic.php',
        data: {
            type: type,
            userID: userID,
        },
        dataType: 'xml',
    });

    chosen.done(function(xml){

        var end = $(xml).find('end').text();
        if(end == 'true'){
            alert('RESTART');
        }

        else{
            var pictures = [];
            var word;
            var correct = $(xml).find('correct');
            $(correct).each(function(){
                word = $(this).find('word').text();
                pictures.push($(this).find('picture').text());
            });
    
            var incorrect = $(xml).find('incorrect');
            $(incorrect).each(function(){
                pictures.push($(this).find('picture').text());
            });
    
    
            display(word,pictures,type);
            console.log(word,pictures);
        }
    });

    chosen.fail(function(xml,errorStatus){
        console.log(xml.responseText, errorStatus);
    });
}

function display(word,pictures,type){
    if(type == 'Nouns'){
        var addTo = '#nounDisplay';
    }
    else{
        var addTo = '#verbDisplay';
    }
    
    $(addTo).empty();
    $(addTo).append("<h1 style='position:absolute; left:500px; top:100px;'>"+word+"</h1>");

    //PROBLEM
    //CANT ACCESS LOCALHOST
    $(addTo).append("<img src='Pictures/Nouns/libro.jpg' alt='"+pictures[0]+"' style='position:absolute; left:600px; top:100px; width:200px'></img>");

    
}



function init(){
    hidePages();
    $('#signIn').show();
}

init();