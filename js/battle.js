let hero = null;
let SetOfQuestions = null;
let username = getCookie("USERNAME");
let token = getCookie("TOKEN");

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
                setBackground();
                setItem1();
                setItem4();
                startGame();
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


function startGame(){


    


}



init();