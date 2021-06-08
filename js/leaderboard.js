let xhr = new XMLHttpRequest();
xhr.open('GET', '../api/leaderboard/sort.php', false);

// will replace user with the value of cookie "User"
xhr.setRequestHeader("X-Auth-Username", getCookie("USERNAME"));

// will replace token with the value of cookie "Token"
xhr.setRequestHeader("X-Auth-Token", getCookie("TOKEN"));
xhr.onload = function() {
    console.log(this);
    if (this.status == 200) {
        result = JSON.parse(this.responseText)['result'];
        if (result === 0) {
            document.querySelector('html').innerHTML = "Error on displaying leaderboard";    
        } else {
            rowEntries = JSON.parse(this.responseText)['data'];
            displayLeaderboard();
            generateRSS();
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

function generateRSS(){

    document.getElementById("feed").addEventListener("click", () => {

        var text = [];

        text.push(
            `<?xml version="1.0" encoding="UTF-8"?>
            <rss version="2.0">
            <channel>
            <title>Leaderboard HeLP</title>
            <link>../html/leaderboard.html</link>
            <description>The top 100 leaderboard for the game Heroes: eLearning Protocol.</description>
            `
        );

        for (var i = 0; i < rowEntries.length; i++) 
        {
            text.push(
            `
            <item>
            <title>Rank ${i+1}</title>
            <description>Username: ${rowEntries[i].username}, Score: ${rowEntries[i].score}, Hero: ${rowEntries[i].hero}</description>
            </item>
            `);
        }
        
        text.push(
            `
            </channel>
            </rss>
            `
        );

        let xhr = new XMLHttpRequest();
        xhr.open('POST', '../api/leaderboard/updateRSS.php', true);
        xhr.setRequestHeader("X-Auth-Username", getCookie("USERNAME"));
        xhr.setRequestHeader("X-Auth-Token", getCookie("TOKEN"));
        xhr.onload = function() {
            window.location.href = "../utility/feed.xml";
        }
        xhr.send(JSON.stringify(text.join("")));
    });

}