// Script to build & display a set of questions in the form of a quiz about the hero chosen by the user.
// Adapted from the following tutorial: https://www.sitepoint.com/simple-javascript-quiz/

questions = null;

function getQuestions() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', '../api/question/getFromDomain.php?domain=Math', false);
    xhr.setRequestHeader("X-Auth-Username", "frontend");
    xhr.setRequestHeader("X-Auth-Token", "EhW7jOfAPHpxlzz1Ve8xFalRZhQm8AsmFZEIVVvlNI7n0yM4dw5I0G2spEpDjQNQ18hpnrcaV0LgRNH2OS1KcU4ZqiihL7RTX9qvqy1TQgNdIIDaFk29kw6fAh4NBNKBRNw03L9uYSmoFCh3UraIKsme6YOD7JZMBZGiwLjQyEf00ErMALtVpWmEyAh18o7e7uwTtVEN4iz7Igz42qsi1EGiXLWywckKkNqtduOka1vajoaedIFH5ZTxlieAQc1");
    xhr.onload = function() {
        console.log(this);
        if (this.status == 200) {
            questions = JSON.parse(this.responseText);
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

const quizContainer = document.getElementById('quiz');
const resultsContainer = document.getElementById('results');
const submitButton = document.getElementById('submit');
const retryButton = document.getElementById('retry');
const buttonGridContainer = document.getElementById('buttonGrid');

// send the XHRequest to the server
getQuestions();

// build and display the quiz
buildQuiz();

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

        // TODO: add the hero to the user's collection
        // addHero();
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
retryButton.addEventListener('click', () => {
    getQuestions();
    buildQuiz();
    retryButton.style.display = "none";
    resultsContainer.innerHTML = "";
    submitButton.style.display = "inline-block";
});