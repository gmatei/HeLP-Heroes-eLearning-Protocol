function setCookie(name, value, expirationInDays) {
    var d = new Date();
    d.setTime(d.getTime() + (expirationInDays * 24 * 60 * 60 * 1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
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
 * @returns true if the cookie is found, 
 *          false otherwise.
 */
function checkCookie(cookieName) {
    return getCookie(cookieName) != "";
}

function deleteCookie(name) {
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
}