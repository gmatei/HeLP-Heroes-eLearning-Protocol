function logoutUser() {
    let logoutRequest = new XMLHttpRequest();
    
    if (checkCookie("USERNAME")) {

        // A user wants to log out...
        logoutRequest.open('DELETE', '../api/user/logout.php');
        logoutRequest.setRequestHeader('X-AUTH-TOKEN', getCookie('TOKEN'));
        logoutRequest.setRequestHeader('X-AUTH-USERNAME', getCookie('USERNAME'));
        logoutRequest.onload = function() {
            if (this.status == 200) {

                deleteCookie('USERNAME');
                deleteCookie('TOKEN');

                window.location.href = "./login.html";
            }
            else {
                console.log("Fatal error...");
            }
        }
    }
    else {

        // An admin wants to log out...

        logoutRequest.open('DELETE', '../api/admin/logout.php');
        logoutRequest.setRequestHeader('X-AUTH-TOKEN', getCookie('TOKEN'));
        logoutRequest.setRequestHeader('X-AUTH-USERNAME', getCookie('USERNAME'));
        logoutRequest.onload = function() {
            if (this.status == 200) {

                deleteCookie('USERNAME_ADMIN');
                deleteCookie('TOKEN');

                window.location.href = "./login.html";
            }
            else {
                console.log("Fatal error...");
            }
        }
    }

    logoutRequest.send();
}

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
 * @param {} cookieName the name of the cookie to search for
 * @returns true if the cookie is found, false otherwise.
 */
function checkCookie(cookieName) {
    return getCookie(cookieName) != "";
}

function deleteCookie(name) {
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
}