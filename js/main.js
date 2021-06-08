let learnIdx1 = 0, learnIdx2 = 1, learnIdx3 = 2;
let battleIdx1 = 0, battleIdx2 = 1, battleIdx3 = 2;
let heroes = null;
let unlocked = null;
let username = getCookie("USERNAME");
let token = getCookie("TOKEN");

/**
 * Images are indexed from 1 to N (the number of images)
 * Every image from the database will have an unique ID from 1 to N (also the extentions will be only .png).
 * All images with superheroes are stored in the "../database_superheroes_all/" folder.
 * All images with UNLOCKED superheroes are stored in the "../database_superheroes_unlocked/" folder.
 * 
 * Number of heroes (per total): 4
 * Photo sizes used: 640 x 860.
 */

function getAllHeroes() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', '../api/hero/getAll.php', false);
    xhr.setRequestHeader("X-Auth-Username", username);
    xhr.setRequestHeader("X-Auth-Token", token);
    xhr.onload = function() {
        console.log(this);
        if (this.status == 200) {
            heroes = JSON.parse(this.responseText)['heroList'];
        }
    }
    xhr.send();
}

function getUnlocked() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', '../api/hero/getUnlocked.php', false);
    xhr.setRequestHeader("X-Auth-Username", username);
    xhr.setRequestHeader("X-Auth-Token", token);
    xhr.onload = function() {
        console.log(this);
        if (this.status == 200) {
            unlocked = JSON.parse(this.responseText)['heroList'];
        }
    }
    xhr.send();
}

getAllHeroes();
getUnlocked();
displayLearningCards();
displayBattleCards();

function prevImgLearning() {
    learnIdx1 = learnIdx1 - 1;
    if (learnIdx1 < 0) learnIdx1 += heroes.length;
    learnIdx2 = learnIdx2 - 1;
    if (learnIdx2 < 0) learnIdx2 += heroes.length;
    learnIdx3 = learnIdx3 - 1;
    if (learnIdx3 < 0) learnIdx3 += heroes.length;
    displayLearningCards();
}

function nextImgLearning() {
    learnIdx1 = (learnIdx1 + 1) % heroes.length;
    learnIdx2 = (learnIdx2 + 1) % heroes.length;
    learnIdx3 = (learnIdx3 + 1) % heroes.length;
    displayLearningCards();
}

function displayLearningCards() {
    document.getElementById("learning-card-1").setAttribute("src", "../images/" + heroes[learnIdx1].photo_url);
    document.getElementById("learning-card-2").setAttribute("src", "../images/" + heroes[learnIdx2].photo_url);
    document.getElementById("learning-card-3").setAttribute("src", "../images/" + heroes[learnIdx3].photo_url);
}

function prevImgBattle() {
    battleIdx1 = battleIdx1 - 1;
    if (battleIdx1 < 0) battleIdx1 += unlocked.length;
    battleIdx2 = battleIdx2 - 1;
    if (battleIdx2 < 0) battleIdx2 += unlocked.length;
    battleIdx3 = battleIdx3 - 1;
    if (battleIdx3 < 0) battleIdx3 += unlocked.length;
    displayBattleCards();
}

function nextImgBattle() {
    battleIdx1 = (battleIdx1 + 1) % unlocked.length;
    battleIdx2 = (battleIdx2 + 1) % unlocked.length;
    battleIdx3 = (battleIdx3 + 1) % unlocked.length;
    displayBattleCards();
}

function displayBattleCards() {
    document.getElementById("battle-card-1").setAttribute("src", "../images/" + unlocked[battleIdx1].photo_url);
    document.getElementById("battle-card-2").setAttribute("src", "../images/" + unlocked[battleIdx2].photo_url);
    document.getElementById("battle-card-3").setAttribute("src", "../images/" + unlocked[battleIdx3].photo_url);
}

document.getElementById("learning-button").addEventListener("click", () => {
    window.location.href = "../html/practice.html?hero=" + heroes[learnIdx2].hero_name;
});

document.getElementById("wiki-button").addEventListener("click", () => {
    window.location.href = "../html/wiki-character.html?hero=" + heroes[learnIdx2].hero_name;
});

document.getElementById("battle-button").addEventListener("click", () => {
    window.location.href = "../html/battle.html?hero=" + unlocked[battleIdx2].hero_name;
});