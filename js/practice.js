// Script to build & display a set of questions in the form of a quiz about the hero chosen by the user.
// Adapted from the following tutorial: https://www.sitepoint.com/simple-javascript-quiz/

function buildQuiz() {

    // variable to store the HTML output
    const output = [];

    questions.forEach((currentQuestion, questionNumber) => {

        // variable to store the list of possible answers
        const answers = [];

        // for the current question, for each available choice, add an HTML radio button
        for (letter in currentQuestion.answers) {

            // if we are building the correct answer, also add a mention that this was the correct answer (useful when submitting)
            let aux;
            if (letter === currentQuestion.correctAnswer) {
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
            <div class="question"> <strong>${questionNumber + 1}. ${currentQuestion.question}</strong> </div>
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

// this array will be populated from a pool of questions available on the server; hardcoding for proof-of-concept only
const questions = [
    {
        domain: "Math",
        question: "What's 2 + 2?",
        answers: {
            a: "4",
            b: "5",
            c: "2"
        },
        correctAnswer: "a"
    },
    {
        domain: "Math",
        question: "What is the derivative of sin(u), where by u we denote a composite function of x?",
        answers: {
            a: "cos(u)",
            b: "cos(u) * u'",
            c: "-sin(u) * cos(u)"
        },
        correctAnswer: "b"
    },
    {
        domain: "Math",
        question: "What is the integral of ln(x)?",
        answers: {
            a: "log2(x)",
            b: "logx(n)",
            c: "1 &frasl; x, granted that x is nonzero"
        },
        correctAnswer: "c"
    },
    {
        domain: "Math",
        question: "What is the Mandelbrot set?",
        answers: {
            a: "The set of all natural numbers that are less than 0",
            b: "The set of all complex numbers z that, when iterated over the function f(z) = z<sup>2</sup> + c for an arbitrary complex number c, do not go towards infinity",
            c: "The set of all numbers with the property that when tripled and incremented, they are odd, and when halved, they yield an integer"
        },
        correctAnswer: "b"
    },
    {
        domain: "Math",
        question: "Given an equilateral triangle, what can be said about it's sides?",
        answers: {
            a: "They are parwise perpendicular",
            b: "The sum of either two equals the double of the third",
            c: "Exactly one of the sides is bigger than the other two"
        },
        correctAnswer: "b"
    },
    {
        domain: "Math",
        question: "Who invented math?",
        answers: {
            a: "Math",
            b: "Math Jr.",
            c: "Batman"
        },
        correctAnswer: "c"
    },
    {
        domain: "Math",
        question: "What is the number π equal to?",
        answers: {
            a: "≈3.14",
            b: "≈1.41",
            c: "≈2.61"
        },
        correctAnswer: "a"
    },
    {
        domain: "Math",
        question: "What is the formula for the area of a circle of radius r?",
        answers: {
            a: "π * r<sup>2</sup>",
            b: "(π * r) &frasl; 2",
            c: "(π<sup>2</sup> * r) &frasl; 2"
        },
        correctAnswer: "a"
    },
    {
        domain: "Math",
        question: "For which of the following shapes are the diagonals always perpendicular?",
        answers: {
            a: "Trapezoids",
            b: "Circles",
            c: "Squares"
        },
        correctAnswer: "c"
    },
    {
        domain: "Math",
        question: "What are complex numbers?",
        answers: {
            a: "Numbers bigger than 1 million",
            b: "Numbers of the form z = a + b * i, where a and b are real numbers, and by i we denote the square root of -1",
            c: "Numbers that are divisible by 0"
        },
        correctAnswer: "b"
    },
];

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

        if (userAnswer === currentQuestion.correctAnswer) { // if answer is correct
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
    location.reload();
});