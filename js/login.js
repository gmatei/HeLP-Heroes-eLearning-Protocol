/**
 * Method that sends the username and password provided to the API (using a POST)
 * and retrieves the USERNAME and TOKEN provided, adding them as a COOKIE that will expire in 1 day.
 */
function loginUser() {
    messageBoard = document.getElementById('messageBoard');

    username = document.getElementById('username').value;
    password = document.getElementById('password').value;

    if (username == '' || password == '') {
        console.log("No username or password attached.");
        return;
    }

    
    if (!document.getElementById("adminCheck").checked) {

        // A user initiated a log in action
        let request = new XMLHttpRequest();

        request.open('POST', '../api/user/login.php?username=' + username + '&password=' + password);
        request.onload = function() {
            if (this.status == 200) {
                // Debug functionality
                console.log(this);

                resultJSON = JSON.parse(this.responseText);
                
                if (resultJSON.result == 1) {
                    messageBoard.innerHTML = "Login successful!";

                    deleteCookie("USERNAME_ADMIN");
                    deleteCookie("USERNAME");
                    deleteCookie("TOKEN");

                    // create cookie 1 day
                    setCookie("USERNAME", resultJSON.username, 1);
                    setCookie("TOKEN", resultJSON.token, 1);

                    window.location.href = "../html/main.html";
                }
                else if (resultJSON.result == 0) {
                    messageBoard.innerHTML = "User is banned!";
                }
                else {
                    messageBoard.innerHTML = "Incorrect credentials!";
                }
                // Remove the username and password provided
                document.getElementById('username').value = "";
                document.getElementById('password').value = "";
            }
            else {
                messageBoard.innerHTML = "Internal error with code " + this.status;
            }
        };
        request.send();
    }
    else {

        // An admin initiated a log in action
        let request = new XMLHttpRequest();

        request.open('POST', '../api/admin/login.php?username=' + username + '&password=' + password);
        request.onload = function() {
            if (this.status == 200) {
                // Debug functionality
                console.log(this);

                resultJSON = JSON.parse(this.responseText);
                
                if (resultJSON.result == 1) {
                    messageBoard.innerHTML = "Login successful!";

                    deleteCookie("USERNAME_ADMIN");
                    deleteCookie("USERNAME");
                    deleteCookie("TOKEN");

                    // create cookie 1 day
                    setCookie("USERNAME_ADMIN", resultJSON.username, 1);
                    setCookie("TOKEN", resultJSON.token, 1);

                    window.location.href = "../html/adminPage.php";
                }
                else {
                    messageBoard.innerHTML = "Incorrect credentials!";
                }

                // Remove the username and password provided
                document.getElementById('username').value = "";
                document.getElementById('password').value = "";
            }
            else {
                messageBoard.innerHTML = "Internal error with code " + this.status;
            }
        };
        request.send();
    }
}

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