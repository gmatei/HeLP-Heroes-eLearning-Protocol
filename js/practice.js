// Script to build & display a set of questions in the form of a quiz about the hero chosen by the user.
// Adapted from the following tutorial: https://www.sitepoint.com/simple-javascript-quiz/

let questions = null;
let hero = null;
let username = getCookie("USERNAME");
let token = getCookie("TOKEN");
let firstRequestSent = false;

const quizContainer = document.getElementById('quiz');
const resultsContainer = document.getElementById('results');
const submitButton = document.getElementById('submit');
const retryButton = document.getElementById('retry');
const wikiPageButton = document.getElementById('toWiki');
const buttonGridContainer = document.getElementById('buttonGrid');
const heroName = new URLSearchParams(window.location.search).get('hero'); // get the hero's name (provided in the url)

function init() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', '../api/hero/getByName.php?hero=' + heroName, false);
    xhr.setRequestHeader("X-Auth-Username", username);
    xhr.setRequestHeader("X-Auth-Token", token);
    xhr.onload = function() {
        console.log(this);
        if (this.status == 200) {
            result = JSON.parse(this.responseText)['result'];
            if (result === "invalid-hero-name") {
                document.querySelector('html').innerHTML = "Invalid hero name.";    
            } else {
                hero = JSON.parse(this.responseText)['responseBody'];
                document.getElementById('header').innerHTML = "Learning: " + hero.hero_name;
                document.getElementById('img').src = "../images/" + hero.photo_url;
                document.getElementById('img').alt = hero.hero_name;
                document.querySelector('html').style.backgroundImage = "url(../images/" + hero.background_url + ")";
            }
        }
    }
    xhr.send();
}

function getQuestions() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', '../api/question/getFromDomain.php?domain=' + hero.domain, firstRequestSent);
    xhr.setRequestHeader("X-Auth-Username", username);
    xhr.setRequestHeader("X-Auth-Token", token);
    xhr.onload = function() {
        console.log(this);
        if (this.status == 200) {
            firstRequestSent = true;
            questions = JSON.parse(this.responseText);
            buildQuiz();
            retryButton.style.display = "none";
            resultsContainer.innerHTML = "";
            submitButton.style.display = "inline-block";
        }
    }
    xhr.send();
}

function addHero() {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', '../api/user/addHero.php?&hero=' + heroName, true);
    xhr.setRequestHeader("X-Auth-Username", username);
    xhr.setRequestHeader("X-Auth-Token", token);
    xhr.onload = function() {
        console.log(this);
        if (this.status == 200) {
            let result = JSON.parse(this.responseText)['result'];
            if (result === 1) {
                window.alert("Hero unlockled successfully!");
            } else if (result === 0) {
                window.alert("You already unlocked this hero. Head into the arena!");    
            } else {
                window.alert("An error occured while trying to unlock your hero... Try again later!");
            }
        } else {
            window.alert("An error occured while trying to unlock your hero... Try again later!");
        }
    }
    xhr.send();
}

function buildQuiz() {

    questions.forEach(currentQuestion => {
        currentQuestion.answers = {
            a: currentQuestion.a,
            b: currentQuestion.b,
            c: currentQuestion.c,
            d: currentQuestion.d
        }
        delete currentQuestion.a;
        delete currentQuestion.b;
        delete currentQuestion.c;
        delete currentQuestion.d;
    });

    // variable to store the HTML output
    const output = [];

    questions.forEach((currentQuestion, questionNumber) => {

        // variable to store the list of possible answers
        const answers = [];

        // for the current question, for each available choice, add an HTML radio button
        for (letter in currentQuestion.answers) {

            // if we are building the correct answer, also add a mention that this was the correct answer (useful when submitting)
            let aux;
            if (letter === currentQuestion.correct_answer) {
                aux = `<span class="correct-ans" style="display:none;"> <strong><- this was correct!</strong> </span><br>`
            } else {
                aux = `<br>`
            }

            answers.push(
                `<label for="question${questionNumber}"></label>
                <input type="radio" name="question${questionNumber}" value="${letter}" required>
                ${currentQuestion.answers[letter]} ${aux}`
            );
        }

        // add this question and its answers to the output
        output.push(
            `
            <div class="entry">
            <div class="question"> <strong>${questionNumber + 1}. ${currentQuestion.content}</strong> </div>
            <div class="answers"> ${answers.join('')} </div>
            </div>
            `
        );
    });

    // display the quiz
    quizContainer.innerHTML = output.join('');
}

wikiPageButton.addEventListener('click', () => {
    window.location.href = "../html/wiki-character.html?hero=" + heroName;
});


// then define the onClick event for the submit button
submitButton.addEventListener('click', () => {

    // gather answer containers from our quiz
    const answerContainers = quizContainer.querySelectorAll('.answers');

    // gather question containers from the quiz
    const questionContainers = quizContainer.querySelectorAll('.question');

    // keep track of user's answers
    let numCorrect = 0;

    // for each question...
    questions.forEach((currentQuestion, questionNumber) => {

        // find selected answer
        const answerContainer = answerContainers[questionNumber];
        const selector = `input[name=question${questionNumber}]:checked`;
        const userAnswer = (answerContainer.querySelector(selector) || {}).value;

        if (userAnswer === currentQuestion.correct_answer) { // if answer is correct
            // then increment number of correct answers
            numCorrect++;

            // and color the question green
            questionContainers[questionNumber].style.color = 'green';

        } else { // if answer is wrong or blank, color the question red
            questionContainers[questionNumber].style.color = 'red';
        }

    });

    // show number of correct answers out of total
    let resultString = `You got ${numCorrect} out of ${questions.length}.`;

    if (numCorrect == questions.length) { // if we got all the answers right
        // then customize the message
        resultString = resultString.concat(' Congrats!');

        // and make it so that the button grid at the bottom of the test only displays the 'back to menu' and 'go to wiki' buttons
        buttonGridContainer.style.gridTemplateColumns = "1fr 1fr";

        // and add the hero to the user's collection
        addHero();
    } else { // if we have at least one wrong answer
        // then customize the message
        resultString = resultString.concat(' Would you like to try again?');

        // and make the retry button visible
        retryButton.style.display = "inline-block";
    }

    // display the results
    resultsContainer.innerHTML = resultString;

    // then hide the submit button (we don't want the user to correct their answers and submit again, since they know which questions
    // they got wrong)
    submitButton.style.display = "none";

    // display the correct answers
    const correctAnswers = quizContainer.querySelectorAll('.correct-ans');
    correctAnswers.forEach(curr => {
        curr.style.display = "inline";
        curr.style.color = "green";
    });
});

// define the onClick event for the retry button (currently, reloading the page)
retryButton.addEventListener('click', () => { getQuestions() });

init();
getQuestions();