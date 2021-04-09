let currentIndexLearning = 2;
let currentIndexBattle = 2;

const HEROES_NUMBER_ALL = 4;
const HEROES_NUMBER_UNLOCKED = 4;

/**
 * Images are indexed from 1 to N (the number of images)
 * Every image from the database will have an unique ID from 1 to N (also the extentions will be only .png).
 * All images with superheroes are stored in the "/database_superheroes_all/" folder.
 * All images with UNLOCKED superheroes are stored in the "/database_superheroes_unlocked/" folder.
 * 
 * Number of heroes (per total): 4
 * Photo sizes used: 640 x 860.
 */

window.onload = function () {
    document.getElementById("learning-card-1").setAttribute("src", "database_superheroes_all/1.png");
    document.getElementById("learning-card-2").setAttribute("src", "database_superheroes_all/2.png");
    document.getElementById("learning-card-3").setAttribute("src", "database_superheroes_all/3.png");

    document.getElementById("battle-card-1").setAttribute("src", "database_superheroes_unlocked/1.png");
    document.getElementById("battle-card-2").setAttribute("src", "database_superheroes_unlocked/2.png");
    document.getElementById("battle-card-3").setAttribute("src", "database_superheroes_unlocked/3.png");

    
}

function prevImgLearning() {
    if (currentIndexLearning == 1) {
        currentIndexLearning = HEROES_NUMBER_ALL;
    }
    else {
        currentIndexLearning--;
    }
    displayLearningCards();
}

function nextImgLearning() {
    if (currentIndexLearning == HEROES_NUMBER_ALL) {
        currentIndexLearning = 1;
    }
    else {
        currentIndexLearning++;
    }
    displayLearningCards();
}

function displayLearningCards() {

    let left = document.getElementById("learning-card-1");
    let central = document.getElementById("learning-card-2");
    let right = document.getElementById("learning-card-3");
    
    if (currentIndexLearning == 1) {
        left.setAttribute("src", "database_superheroes_all/" + HEROES_NUMBER_ALL + ".png");
        central.setAttribute("src", "database_superheroes_all/1.png");
        right.setAttribute("src", "database_superheroes_all/2.png");
    }
    else if (currentIndexLearning == HEROES_NUMBER_ALL) {
        left.setAttribute("src", "database_superheroes_all/" + (currentIndexLearning - 1) +".png");
        central.setAttribute("src", "database_superheroes_all/" + currentIndexLearning +".png");
        right.setAttribute("src", "database_superheroes_all/1.png");
    }
    else {
        left.setAttribute("src", "database_superheroes_all/" + (currentIndexLearning - 1) +".png");
        central.setAttribute("src", "database_superheroes_all/" + currentIndexLearning + ".png");
        right.setAttribute("src", "database_superheroes_all/" + (currentIndexLearning + 1) + ".png");
    }
}

function prevImgBattle() {
    if (currentIndexBattle == 1) {
        currentIndexBattle = HEROES_NUMBER_UNLOCKED;
    }
    else {
        currentIndexBattle--;
    }
    
    displayBattleCards();
}

function nextImgBattle() {
    if (currentIndexBattle == HEROES_NUMBER_UNLOCKED) {
        currentIndexBattle = 1;
    }
    else {
        currentIndexBattle++;
    }

    displayBattleCards();
}

function displayBattleCards() {

    let left = document.getElementById("battle-card-1");
    let central = document.getElementById("battle-card-2");
    let right = document.getElementById("battle-card-3");

    if (currentIndexBattle == 1) {
        left.setAttribute("src", "database_superheroes_unlocked/" + HEROES_NUMBER_UNLOCKED +".png");
        central.setAttribute("src", "database_superheroes_unlocked/1.png");
        right.setAttribute("src", "database_superheroes_unlocked/2.png");
    }
    else if (currentIndexBattle == HEROES_NUMBER_UNLOCKED) {
        left.setAttribute("src", "database_superheroes_unlocked/" + (currentIndexBattle - 1) +".png");
        central.setAttribute("src", "database_superheroes_unlocked/" + currentIndexBattle + ".png");
        right.setAttribute("src", "database_superheroes_unlocked/1.png");
    }
    else {
        left.setAttribute("src", "database_superheroes_unlocked/" + (currentIndexBattle - 1) +".png");
        central.setAttribute("src", "database_superheroes_unlocked/" + currentIndexBattle + ".png");
        right.setAttribute("src", "database_superheroes_unlocked/" + (currentIndexBattle + 1) + ".png");
    }
}