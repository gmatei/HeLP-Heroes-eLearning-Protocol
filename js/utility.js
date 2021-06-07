function setCookie(name, value, expirationInDays) {
    var d = new Date();
    d.setTime(d.getTime() + (expirationInDays * 24 * 60 * 60 * 1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
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

function deleteCookie(name) {
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
}