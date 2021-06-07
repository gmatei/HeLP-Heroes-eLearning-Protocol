const heroName = new URLSearchParams(window.location.search).get('hero'); // get the hero's name (provided in the url)
console.log(heroName);
let hero = null;

let xhr = new XMLHttpRequest();
xhr.open('GET', '../api/hero/getByName.php?hero=' + heroName, false);

// will replace user with the value of cookie "User"
xhr.setRequestHeader("X-Auth-Username", "frontend");

// will replace token with the value of cookie "Token"
xhr.setRequestHeader("X-Auth-Token", "yOiWrHLCyaBIJZvkWDfv8KQLoTOOGIJwqx0oF4cjsmXUCaStY793PYUAZEDGwh7uVLP9NftZ0oCarR3mule6HvJaIEgkXZNrYaJCk6wQoIQ7Wi0BMRnMSrZ8lF9mZy2Q0dfpyqBt7CIuhJu5IqguyGgs1rao6S0otVeYOFvHVsrssg2v1ZP077BzIDOlR7yXItjNQ48ZyijCqfqVSAAjuC13Ku7lt3FWFlLaPo7t4GmPE97DIXgL0BZXPPPayd6");
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

    // will replace user with the value of cookie "User"
    xhr.setRequestHeader("X-Auth-Username", "frontend");

    // will replace token with the value of cookie "Token"
    xhr.setRequestHeader("X-Auth-Token", "yOiWrHLCyaBIJZvkWDfv8KQLoTOOGIJwqx0oF4cjsmXUCaStY793PYUAZEDGwh7uVLP9NftZ0oCarR3mule6HvJaIEgkXZNrYaJCk6wQoIQ7Wi0BMRnMSrZ8lF9mZy2Q0dfpyqBt7CIuhJu5IqguyGgs1rao6S0otVeYOFvHVsrssg2v1ZP077BzIDOlR7yXItjNQ48ZyijCqfqVSAAjuC13Ku7lt3FWFlLaPo7t4GmPE97DIXgL0BZXPPPayd6");
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