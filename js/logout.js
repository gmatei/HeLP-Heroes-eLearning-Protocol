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