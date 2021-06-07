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
    request.setRequestHeader('X-AUTH-USERNAME', getCookie('USERNAME'));
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


/**
 * Method for returning a value of a given cookie
 * @param {string} cname the cookie which value it is needed
 * @returns the value of the cookie if it exists or the empty string otherwise
 */
 function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

/**
 * Method that checks whether or not a cookie is set.
 * @param {string} cookieName the name of the cookie to search for
 * @returns true if the cookie is found, false otherwise.
 */
 function checkCookie(cookieName) {
    return getCookie(cookieName) != "";
}