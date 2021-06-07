let heroes = null;

let xhr = new XMLHttpRequest();
xhr.open('GET', '../api/hero/getAll.php', false);

// will replace user with the value of cookie "User"
xhr.setRequestHeader("X-Auth-Username", "frontend");

// will replace token with the value of cookie "Token"
xhr.setRequestHeader("X-Auth-Token", "yOiWrHLCyaBIJZvkWDfv8KQLoTOOGIJwqx0oF4cjsmXUCaStY793PYUAZEDGwh7uVLP9NftZ0oCarR3mule6HvJaIEgkXZNrYaJCk6wQoIQ7Wi0BMRnMSrZ8lF9mZy2Q0dfpyqBt7CIuhJu5IqguyGgs1rao6S0otVeYOFvHVsrssg2v1ZP077BzIDOlR7yXItjNQ48ZyijCqfqVSAAjuC13Ku7lt3FWFlLaPo7t4GmPE97DIXgL0BZXPPPayd6");
xhr.onload = function() {
    console.log(this);
    if (this.status == 200) {
        heroes = JSON.parse(this.responseText)['heroList'];
        displayHeroes();
    }
}
xhr.send();

function displayHeroes() {
    let resultString = [];
    for (let i = 0; i < heroes.length; i++) {
        if (heroes[i].hero_name === "Iron Man") {
            heroes[i].domain = "Comp. Science";
        }
        resultString.push(`
        <div class="responsive">
            <div class="gallery">
                <a href="./wiki-character.html?hero=${heroes[i].hero_name}">
                <img src="../images/${heroes[i].photo_url}" alt="${heroes[i].hero_name}" width="600" height="400">
                </a>
                <div class="desc">${heroes[i].hero_name} - ${heroes[i].domain}</div>
            </div>
        </div>`);
    }
    resultString.push(`
    <div class="clearfix"></div>
    <div class="navigators">
        <button class="home" type="button" onclick="document.location.href='../html/main.html'"><img src="../images/home.png" alt="Home"></button>
    </div>`);
    document.querySelector('div#hero-gallery').innerHTML = resultString.join('');
}