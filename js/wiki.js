let heroes = null;
let username = getCookie("USERNAME");
let token = getCookie("TOKEN");

let xhr = new XMLHttpRequest();
xhr.open('GET', '../api/hero/getAll.php', false);
xhr.setRequestHeader("X-Auth-Username", username);
xhr.setRequestHeader("X-Auth-Token", token);
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