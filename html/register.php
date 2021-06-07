<?php
include "../utility/database_connection.php";
$instance = DbConnection::getInstance();
$registerResult = -2;
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register</title>
    <link rel="stylesheet" href="../css/login.css">

    <?php
    // Check to see if the registerButton was pressed
    if (isset($_POST['registerButton']))
    {
        $first_name = trim($_POST['firstname']);
        $last_name = trim($_POST['lastname']);
        $username = trim($_POST['uname']);
        $email = trim($_POST['email']);
        $password = trim($_POST['pass']);
        $repassword = trim($_POST['repass']);

        // The passwords must match and must not be empty
        if ($password == $repassword && $password != "")
            $registerResult = $instance->registerUser($username, $first_name, $last_name, $email, $password);

        // unset($first_name, $last_name, $username, $email, $password, $repassword);
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
        <!-- for the moment, this form does not submit anything -->
        <form action="" method="POST">
            <h1>Sign up</h1>
            <p>Already have an account? Login <a href="./login.html">here</a>. </p>
        
            <div class="credentials">
                <label for="firstname"><strong>First name</strong></label>
                <input type="text" placeholder="Your first name here!" name="firstname" id="firstname" maxlength="50" required>

                <label for="lastname"><strong>Last name</strong></label>
                <input type="text" placeholder="Your last name here!" name="lastname" id="lastname" maxlength="50" required>

                <label for="uname"><strong>Username</strong></label>
                <input type="text" placeholder="Your username here!" name="uname" id="uname" minlength="5" maxlength="30" required>

                <label for="email"><strong>E-mail</strong></label>
                <input type="email" placeholder="Your email here!" name="email" id="email" maxlength="200" required>

                <label for="pass"><strong>Password</strong></label>
                <input type="password" placeholder="Your password here!" name="pass" id="pass" minlength="5" maxlength="30" required>

                <label for="repass"><strong>Retype your password</strong></label>
                <input type="password" placeholder="The password above" name="repass" id="repass" minlength="5" maxlength="30" required>

                <?php
                // Check to see if the registerButton was pressed
                if (isset($_POST['registerButton']))
                {
                    $pass = trim($_POST['pass']);
                    $repass = trim($_POST['repass']);
                    if ($pass != $repass)
                        echo "<p>Passwords must match!</p>";
                    else if ($registerResult != -2)
                    {
                        if ($registerResult == -1)
                            echo "<p>Internal server error!</p>";
                        else if ($registerResult == 0)
                            echo "<p>Username already exists!</p>";
                        else
                            echo "<p>Registration successful!</p>";
                        
                        $registerResult = -2;
                    }
                }
                ?>

            </div>

            <input type="submit" name="registerButton" value="Register">
        </form>
    </main>
</body>
</html>