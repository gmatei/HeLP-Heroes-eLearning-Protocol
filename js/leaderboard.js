let xhr = new XMLHttpRequest();
xhr.open('GET', '../api/leaderboard/sort.php', false);

// will replace user with the value of cookie "User"
xhr.setRequestHeader("X-Auth-Username", "frontend");

// will replace token with the value of cookie "Token"
xhr.setRequestHeader("X-Auth-Token", "yOiWrHLCyaBIJZvkWDfv8KQLoTOOGIJwqx0oF4cjsmXUCaStY793PYUAZEDGwh7uVLP9NftZ0oCarR3mule6HvJaIEgkXZNrYaJCk6wQoIQ7Wi0BMRnMSrZ8lF9mZy2Q0dfpyqBt7CIuhJu5IqguyGgs1rao6S0otVeYOFvHVsrssg2v1ZP077BzIDOlR7yXItjNQ48ZyijCqfqVSAAjuC13Ku7lt3FWFlLaPo7t4GmPE97DIXgL0BZXPPPayd6");
xhr.onload = function() {
    console.log(this);
    if (this.status == 200) {
        result = JSON.parse(this.responseText)['result'];
        if (result === 0) {
            document.querySelector('html').innerHTML = "Error on displaying leaderboard";    
        } else {
            rowEntries = JSON.parse(this.responseText)['data'];
            displayLeaderboard();
        }
    }
}
xhr.send();

function displayLeaderboard() {
    
    var text = [];

    for (var i = 0; i < rowEntries.length; i++) 
    {
        text.push(`<tr>
        <td>${i+1}</td>
        <td>${rowEntries[i].username}</td>
        <td>${rowEntries[i].score}</td>
        <td>${rowEntries[i].hero}</td>
        </tr>`);
    }

    document.getElementById("body").innerHTML = text.join("");
    
}