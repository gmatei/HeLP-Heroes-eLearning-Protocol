/**
 * JS file for checking if the actual session credentials (USERNAME and TOKEN) are valid.
 * If they are, the page will load. Otherwise, the user will be redirected to the Log in page.
 */

let request = new XMLHttpRequest();

if (checkCookie('USERNAME')) {
    // Verify for a user

    request.open('GET', '../api/user/checkSession.php');
    request.setRequestHeader('X-AUTH-TOKEN', getCookie('TOKEN'));
    request.setRequestHeader('X-AUTH-USERNAME', getCookie('USERNAME'));
    request.onload = function () {
        if (this.status == 200) {
            responseJSON = JSON.parse(this.responseText);
            if (responseJSON.result == "invalid-session") {
                window.location.href = "../html/login.html";
            }
        }
        else {
            window.location.href = "../html/login.html";
        }
    }
    request.send();
}
else {
    // Verify for an admin
    request.open('GET', '../api/admin/checkSession.php');
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
}