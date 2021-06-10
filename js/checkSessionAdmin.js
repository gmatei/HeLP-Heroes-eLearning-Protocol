/**
 * JS file for checking if the actual session credentials (USERNAME and TOKEN) are valid ONLY FOR ADMINS.
 * If they are, the page will load. Otherwise, the user will be redirected to the Log in page.
 */

let request = new XMLHttpRequest();

// Verify for an admin
request.open('GET', '../api/admin/checkSession.php', false);
request.setRequestHeader('X-AUTH-TOKEN', getCookie('TOKEN'));
request.setRequestHeader('X-AUTH-USERNAME', getCookie('USERNAME_ADMIN'));
request.onload = function () {
    if (this.status == 200) {
        responseJSON = JSON.parse(this.responseText);
        console.log(responseJSON.result);
        if (responseJSON.result == "invalid-session") {
            window.location.href = "../html/login.html";
        }
    }
    else {
        window.location.href = "../html/login.html";
    }
}
request.send();

