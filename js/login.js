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