let hero = null;
let username = getCookie("USERNAME");
let token = getCookie("TOKEN");
const heroName = new URLSearchParams(window.location.search).get('hero'); // get the hero's name (provided in the url)

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
            displayHeroData();
        }
    }
}
xhr.send();

function displayHeroData() {
    document.querySelector('div.heading').innerHTML = hero.hero_name + " - " + hero.domain;
    document.querySelector('div.character-outlook img').src = "../images/" + hero.photo_url;
    document.querySelector('div.character-outlook img').alt = hero.hero_name;
    document.querySelector('html').style.backgroundImage = "url(../images/" + hero.background_url + ")";

    let charDescString = `
        <p>
            <span class="left-desc"><strong>Name</strong></span>
            <span class="right-desc">${hero.hero_name}</span>
        </p>
        <div class="clearfix"></div>
        <hr />

        <p>
            <span class="left-desc"><strong>Real name</strong></span>
            <span class="right-desc">${hero.real_name}</span>
        </p>
        <div class="clearfix"></div>
        <hr />

        <p>
            <span class="left-desc"><strong>Identity</strong></span>
            <span class="right-desc">${hero.identity}</span>
        </p>
        <div class="clearfix"></div>
        <hr />

        <p>
            <span class="left-desc"><strong>Hair color</strong></span>
            <span class="right-desc">${hero.hair_color}</span>
        </p>
        <div class="clearfix"></div>
        <hr />

        <p>
            <span class="left-desc"><strong>Eye color</strong></span>
            <span class="right-desc">${hero.eye_color}</span>
        </p>
        <div class="clearfix"></div>
        <hr />

        <p>
            <span class="left-desc"><strong>Ability</strong></span>
            <span class="right-desc">${hero.ability_name}</span>
        </p>
        <div class="clearfix"></div>
    `;
    document.querySelector('div.character-description').innerHTML = charDescString;

    xhr = new XMLHttpRequest();
    xhr.open('GET', '../api/hero/getData.php?hero=' + heroName, false);
    xhr.setRequestHeader("X-Auth-Username", username);
    xhr.setRequestHeader("X-Auth-Token", token);
    xhr.onload = function() {
        console.log(this);
        if (this.status == 200) {
            result = JSON.parse(this.responseText)['result'];
            if (result === "invalid-hero-name") {
                document.querySelector('html').innerHTML = "Invalid hero name.";    
            } else {
                let data = JSON.parse(this.responseText)['responseBody']['data'];
                data = data.replace('{', '[');
                data = data.replace('}', ']');
                data = JSON.parse(data);
                let charDataString = [];
                charDataString.push(`<ul>`)
                for (let i = 0; i < data.length; i++) {
                    charDataString.push(`<li>${data[i]}</li>`);
                }
                charDataString.push(`</ul>`);
                document.querySelector('div.subject-info').innerHTML = charDataString.join('');
            }
        }
    }
    xhr.send();
}