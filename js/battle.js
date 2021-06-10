let hero = null;
let user = getCookie("USERNAME");
let token = getCookie("TOKEN");
let questionCount = 0;
let easySet = null;
let mediumSet = null;
let hardSet = null;
let expertSet = null;
let currentSet = null;
let buttonListener = true;
let lifeCount = 5;
let score = 0;
let time = 0;
let sec = 0;
let gameOver = false;
let physicsFlag = false;
let historyFlag = false;
let mathFlag = false;
let chemistryFlag = false;
let compSciFlag = false;
let artFlag = false;

const heroName = new URLSearchParams(window.location.search).get('hero'); // get the hero's name (provided in the url)

function init() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', '../api/hero/getByName.php?hero=' + heroName, false);
    xhr.setRequestHeader("X-Auth-Username", user);
    xhr.setRequestHeader("X-Auth-Token", token);
    xhr.onload = function() {
        console.log(this);
        if (this.status == 200) {
            result = JSON.parse(this.responseText)['result'];
            if (result === "invalid-hero-name") {
                document.querySelector('html').innerHTML = "Invalid hero name.";    
            } else {
                hero = JSON.parse(this.responseText)['responseBody'];
                setBackground();
                setItem1(); //hero name and ability
                setItem4(); //hero picture
                displayScore(); //item 6
                displayLife(); //item 8
            }
        }
    }
    xhr.send();
}

function setBackground() {

    document.querySelector('html').style.backgroundImage = "url(../images/" + hero.background_url + ")";
}

function setItem1() {

    var text = [];

    text.push(
    `
    <h2> ${hero.hero_name} </h2>
    <p> <b>${hero.domain}: </b> ${hero.ability_name} </p>   
    `
    )

    document.querySelector('div.item1').innerHTML = text.join("");
}

function setItem4() {

    var text = [];

    text.push(
    `
    <img src="../images/${hero.photo_url}" alt="${hero.hero_name}" id="superhero"></img> 
    `
    )

    document.querySelector('div.item4').innerHTML = text.join("");
}


function startGame()
{
    returnQuestionsOfDifficulty('1');
    returnQuestionsOfDifficulty('2');
    returnQuestionsOfDifficulty('3');
    returnQuestionsOfDifficulty('4');

    document.querySelector(".button").addEventListener("click", activateAbility);

    setInterval( function(){
        if(!gameOver && !compSciFlag)
        {document.getElementById("seconds").innerHTML=pad(++sec%60);
        document.getElementById("minutes").innerHTML=pad(parseInt(sec/60,10));
        time++;}
    }, 1000);   //set time

    initQuestion()

}

function activateAbility() 
{
    if(currentSet[questionCount%10].domain == hero.domain)
        {   
            useAbility();
        }
        else
        {
            window.alert("You can't use the ability for this question as this is not your hero's area of expertise!");
        }
}

function useAbility()
{
    if(hero.domain == 'Math') 
    {
        mathFlag = true;
        window.alert("Be careful! You can gain 2 lives but you will lose them you answer incorrectly!");
    }
    if(hero.domain == 'Geography') 
    {
        let correctAnswer = currentSet[questionCount%10].correct_answer;

        if(correctAnswer == 'a') {document.getElementById('b').innerHTML = ` `; document.getElementById('d').innerHTML = ` `;}
        if(correctAnswer == 'b') {document.getElementById('a').innerHTML = ` `; document.getElementById('c').innerHTML = ` `;}
        if(correctAnswer == 'c') {document.getElementById('b').innerHTML = ` `; document.getElementById('d').innerHTML = ` `;}
        if(correctAnswer == 'd') {document.getElementById('a').innerHTML = ` `; document.getElementById('c').innerHTML = ` `;}
        
        window.alert("SNAP! Thanos has removed 2 incorrect answers!");
    }
    if(hero.domain == 'History') 
    {
        historyFlag = true;

        window.alert("You will gain another life if you give the correct answer!");
    }
    if(hero.domain == 'Biology') 
    {
        time += 20;
        sec += 20;
        initQuestion();

        window.alert("The question will be skipped and 20 seconds will be added to your time!");
    }
    if(hero.domain == 'Chemistry') 
    {
        chemistryFlag = true;

        window.alert("Answer correctly and 10 seconds will be taken of your time!");
    }
    if(hero.domain == 'Physics') 
    {
        physicsFlag = true;

        window.alert("You just gained supernatural strength! Double points will be awrded for this question!");
    }
    if(hero.domain == 'Computer Science') 
    {
        compSciFlag = true;

        window.alert("Time has stopped! Take as long as you like to answer the question!");
    }
    if(hero.domain == 'Sports') 
    {
        score += 800;
        gameOverLogic();

        window.alert("You worked hard so here's an extra bonus and go take a break!");
    }
    if(hero.domain == 'Arts') 
    {
        artFlag = true;

        window.alert("Risky move! Bonus points if you answer correctly but you will lose some if you get it wrong!");
    }
    if(hero.domain == 'Literature') 
    {
        let nmb = Math.floor(Math.random() * 10);

        if(nmb == 0) {mathFlag = true;}
        if(nmb == 1) {let correctAnswer = currentSet[questionCount%10].correct_answer;
                    if(correctAnswer == 'a') {document.getElementById('b').innerHTML = ` `; document.getElementById('d').innerHTML = ` `;}
                    if(correctAnswer == 'b') {document.getElementById('a').innerHTML = ` `; document.getElementById('c').innerHTML = ` `;}
                    if(correctAnswer == 'c') {document.getElementById('b').innerHTML = ` `; document.getElementById('d').innerHTML = ` `;}
                    if(correctAnswer == 'd') {document.getElementById('a').innerHTML = ` `; document.getElementById('c').innerHTML = ` `;}}
        if(nmb == 2) {historyFlag = true;}
        if(nmb == 3) {time += 20;
                    sec += 20;
                    initQuestion();}
        if(nmb == 4) {chemistryFlag = true;}
        if(nmb == 5) {physicsFlag = true;}
        if(nmb == 6) {compSciFlag = true;}
        if(nmb == 7) {score += 800;
                     gameOverLogic();}
        if(nmb == 8) {artFlag = true;}
        if(nmb == 9) {window.alert("Call the all-knowing Peterca Adrian : 0751640092");}
    }

}


function displayScore()
{
    document.querySelector('div.item6').innerHTML = `<h1> Score: </h1> <p> ${score} </p>`;  
}

function displayLife()
{
    if(lifeCount == 5)
        {document.getElementById("heart1").style.opacity = 1; document.getElementById("heart2").style.opacity = 1; document.getElementById("heart3").style.opacity = 1; document.getElementById("heart4").style.opacity = 1; document.getElementById("heart5").style.opacity = 1;}
    if(lifeCount == 4)
        {document.getElementById("heart1").style.opacity = 1; document.getElementById("heart2").style.opacity = 1; document.getElementById("heart3").style.opacity = 1; document.getElementById("heart4").style.opacity = 1; document.getElementById("heart5").style.opacity = 0.2;}
    if(lifeCount == 3)
        {document.getElementById("heart1").style.opacity = 1; document.getElementById("heart2").style.opacity = 1; document.getElementById("heart3").style.opacity = 1; document.getElementById("heart4").style.opacity = 0.2; document.getElementById("heart5").style.opacity = 0.2;}
    if(lifeCount == 2)
        {document.getElementById("heart1").style.opacity = 1; document.getElementById("heart2").style.opacity = 1; document.getElementById("heart3").style.opacity = 0.2; document.getElementById("heart4").style.opacity = 0.2; document.getElementById("heart5").style.opacity = 0.2;}
    if(lifeCount == 1)
        {document.getElementById("heart1").style.opacity = 1; document.getElementById("heart2").style.opacity = 0.2; document.getElementById("heart3").style.opacity = 0.2; document.getElementById("heart4").style.opacity = 0.2; document.getElementById("heart5").style.opacity = 0.2;} 
    if(lifeCount == 0)
        {document.getElementById("heart1").style.opacity = 0.2; document.getElementById("heart2").style.opacity = 0.2; document.getElementById("heart3").style.opacity = 0.2; document.getElementById("heart4").style.opacity = 0.2; document.getElementById("heart5").style.opacity = 0.2;}    
}

function waitForClientToAnswer()
{
    document.querySelectorAll('.answer').forEach(function(e) {
        e.addEventListener('click', function() {

            if(buttonListener)
                {
                let correctAnswer = currentSet[questionCount%10].correct_answer;    
                
                if (this.id == correctAnswer)    
                    {
                        this.style.backgroundColor = "#2f6631";
                        
                        if(currentSet[questionCount%10].difficulty == '1')  {score += 100; if(physicsFlag) {score += 100; physicsFlag = false;}}
                        if(currentSet[questionCount%10].difficulty == '2')  {score += 250; if(physicsFlag) {score += 250; physicsFlag = false;}}
                        if(currentSet[questionCount%10].difficulty == '3')  {score += 400; if(physicsFlag) {score += 400; physicsFlag = false;}}
                        if(currentSet[questionCount%10].difficulty == '4')  {score += 600; if(physicsFlag) {score += 600; physicsFlag = false;}}
                    
                        if(historyFlag)
                        {
                            lifeCount++;
                            historyFlag = false;
                        }

                        if(mathFlag)
                        {
                            lifeCount+=2;
                            mathFlag = false;
                        }

                        if(chemistryFlag)
                        {
                            time-=10;
                            sec-=10;
                            chemistryFlag = false;
                        }

                        if(artFlag)
                        {
                            score+=600;
                            artFlag = false;
                        }
                    }
                    else
                    {
                        this.style.backgroundColor = "red";
                        colorCorrectAnswer(correctAnswer);
                        lifeCount--;

                        if(mathFlag)
                        {
                            lifeCount--;
                            mathFlag = false;
                        }   

                        if(artFlag)
                        {
                            score-=600;
                            artFlag = false;
                        }
                    }
                
                
                displayScore();
                displayLife();
                buttonListener = false;

                document.getElementById("arrow").addEventListener("click", nextQuestion);
                compSciFlag = false;
                }        
                
      });
    });  
}

function nextQuestion() 
{
    if(!buttonListener)
        initQuestion();
}

function initQuestion()
{
    if(questionCount == 40 || lifeCount == 0)
        gameOverLogic();


    resetAnswerColor();
    buttonListener = true;
    questionCount++;
    displayQuestionNumber();

    if(questionCount <= 10) currentSet = easySet;
    else if(questionCount <= 20)    currentSet = mediumSet;
    else if(questionCount <= 30)    currentSet = hardSet;
    else if(questionCount <= 40)    currentSet = expertSet;

    displayQuestionText(currentSet);
    displayQuestionAnswers(currentSet);

    waitForClientToAnswer();
}

function resetAnswerColor()
{
    document.getElementById("a").style.backgroundColor = "#d6d6d67a";
    document.getElementById("b").style.backgroundColor = "#d6d6d67a";
    document.getElementById("c").style.backgroundColor = "#d6d6d67a";
    document.getElementById("d").style.backgroundColor = "#d6d6d67a";
}

function colorCorrectAnswer(correctAnswer)
{
    if(correctAnswer == 'a') document.getElementById("a").style.backgroundColor = "#2f6631";
    else if(correctAnswer == 'b') document.getElementById("b").style.backgroundColor = "#2f6631";
    else if(correctAnswer == 'c') document.getElementById("c").style.backgroundColor = "#2f6631";
    else if(correctAnswer == 'd') document.getElementById("d").style.backgroundColor = "#2f6631";

}

function displayQuestionNumber()
{
    document.querySelector('div.item3').innerHTML = `<h1> ${questionCount}/40 </h1>`;
}

function displayQuestionText(currentSet)
{
    document.querySelector('div.item2').innerHTML = `<p> <b>${currentSet[questionCount%10].domain}:</b> ${currentSet[questionCount%10].content} </p>`;
}

function displayQuestionAnswers(currentSet)
{
    document.getElementById('a').innerHTML = `${currentSet[questionCount%10].a}`;
    document.getElementById('b').innerHTML = `${currentSet[questionCount%10].b}`;
    document.getElementById('c').innerHTML = `${currentSet[questionCount%10].c}`;
    document.getElementById('d').innerHTML = `${currentSet[questionCount%10].d}`;
}



function returnQuestionsOfDifficulty(difficulty)
{
    let xhr = new XMLHttpRequest();
    
    if(difficulty === '1')
        xhr.open('GET', '../api/question/getWithDifficulty.php?difficulty=' + difficulty, false);
        else
        xhr.open('GET', '../api/question/getWithDifficulty.php?difficulty=' + difficulty, true);
    
    
    xhr.setRequestHeader("X-Auth-Username", user);
    xhr.setRequestHeader("X-Auth-Token", token);
    xhr.onload = function() {
        console.log(this);
        if (this.status == 200) {
            result = JSON.parse(this.responseText)['result'];
            if (result === "invalid-session") {
                document.querySelector('html').innerHTML = "Invalid session.";    
            } 
            else if (result === "invalid-difficulty") {
                document.querySelector('html').innerHTML = "Invalid difficulty.";
                }
            else
            {
                if(difficulty === '1')
                    easySet = JSON.parse(this.responseText)['questionSet'];
                if(difficulty === '2')
                    mediumSet = JSON.parse(this.responseText)['questionSet'];
                if(difficulty === '3')
                    hardSet = JSON.parse(this.responseText)['questionSet'];
                if(difficulty === '4')
                    expertSet = JSON.parse(this.responseText)['questionSet'];
                    
            }
        }
    }
    xhr.send();
}

function pad ( val ) { return val > 9 ? val : "0" + val; }


function gameOverLogic()
{
    gameOver = true;

    let scoreMultiplier = 2.0;
    if(time < 1000) scoreMultiplier = 1.0;
    if(time < 900) scoreMultiplier = 1.1;
    if(time < 800) scoreMultiplier = 1.2;
    if(time < 700) scoreMultiplier = 1.3;
    if(time < 600) scoreMultiplier = 1.4;
    if(time < 500) scoreMultiplier = 1.5;
    if(score < 1000) scoreMultiplier = 1.0;

    let lifeMultiplier = 1.0;
    if(lifeCount == 5) lifeMultiplier = 1.5;
    if(lifeCount == 4) lifeMultiplier = 1.4;
    if(lifeCount == 3) lifeMultiplier = 1.3;
    if(lifeCount == 2) lifeMultiplier = 1.2;
    if(lifeCount == 1) lifeMultiplier = 1.1;

    let bonus = 0;
    if(questionCount >= 10) bonus += 500;
    if(questionCount >= 20) bonus += 1000;
    if(questionCount >= 30) bonus += 1500;
    if(questionCount >= 40) bonus += 2000;

    score = parseInt(score * scoreMultiplier * lifeMultiplier) + bonus;

    addEntryIntoLeaderboard();

    let minutes = parseInt(time / 60);
    let seconds = time % 60;

    document.getElementById("overlay").style.display = "block";
    document.getElementById("ov-text-1").innerHTML = `Game Over!`;

    if(seconds < 10)
        document.getElementById("ov-text-2").innerHTML = `Final Score: ${score} <br> Time: ${minutes}:0${seconds}`;
        else
        document.getElementById("ov-text-2").innerHTML = `Final Score: ${score} <br> Time: ${minutes}:${seconds}`;

    document.getElementById("try-again-button").innerHTML = `<button class="ov-retry-button" type="button" onclick="document.location.href='../html/battle.html?hero=${heroName}'">Try Again</button>`;

}

function addEntryIntoLeaderboard()
{
    let xhr = new XMLHttpRequest();

    let url = '../api/leaderboard/add.php'; 

    xhr.open('POST', url, true);
    xhr.setRequestHeader("X-Auth-Username", user);
    xhr.setRequestHeader("X-Auth-Token", token);
    xhr.onload = function() {
        console.log(this);
        if (this.status != 200)
            window.alert("An error occured while trying to add your score to the database! Please screenshot your result and contact an admin!");
    }

    xhr.send(JSON.stringify({
        username: user, 
        score: score,
        hero: heroName  
    }));
}

init();
startGame();