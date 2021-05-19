<?php
include "../utility/database_connection.php";
$instance = DbConnection::getInstance();

$loginResult = -2;
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link rel="stylesheet" href="../css/login.css">
    <?php
    if (isset($_POST['loginButton']))
    {
        $username = $_POST['uname'];
        $password = $_POST['pass'];
    
        if (isset($_POST['adminCheck']))
            $loginResult = $instance->checkAdminLoginInfo($username, $password);
        else
            $loginResult = $instance->checkUserLoginInfo($username, $password);
    }
    ?>

    <script>
        // On page refresh, don't resend the information
        if (window.history.replaceState) 
            window.history.replaceState(null, null, window.location.href);
    </script>

</head>
<body>
    <main>
        <form action="" method="POST">
            <h1>Sign in</h1>
            <p>A newcomer eager to learn? Register <a href="./register.php">here</a>. </p>

            <?php
            if (isset($_POST['loginButton']))
            {
                if ($loginResult == -1)
                    echo "<p>Incorrect credentials!</p>";
                else if ($loginResult == 0)
                    echo "<p>This account is banned!</p>";
                else
                    echo "<p>Login successful!</p>";
                $loginResult = -2;
            }
            ?>
        
            <div class="credentials">
                <label for="uname"><strong>Username</strong></label>
                <input type="text" placeholder="Your username here!" name="uname" id="uname"  minlength="5" maxlength="30" required>

                <label for="pass"><strong>Password</strong></label>
                <input type="password" placeholder="Your password here!" name="pass" id="pass"  minlength="5" maxlength="30" required>
            </div>

            <label for="adminCheck">I am an admin</label>
            <input type="checkbox" name="adminCheck" id="adminCheck">

            <!-- <input type="submit" name="loginButton" value="Login" onclick="document.location.href='../html/main.html'"> -->
            <input type="submit" name="loginButton" value="Login">
            <p class="forgotPass"><a href="#">I forgot my password...</a></p>
        </form>
        <img src="../images/logo.png" width="320px">
    </main>
    
</body>
</html>