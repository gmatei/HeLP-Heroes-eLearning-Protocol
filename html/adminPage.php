<?php
include "../utility/database_connection.php";
$instance = DbConnection::getInstance();
?>

<html>
<head>
    <title>Admin page</title>
    <?php
    
    // Was the banUser button pressed?
    if (isset($_POST['banUserButton']))
    {
        $result = -2;
        $username = $_POST['username'];
        if ($_POST['banUserChoice'] == 'banUser')
            $result = $instance->setBanStatus($username, 1);
        else if ($_POST['banUserChoice'] == 'unbanUser')
            $result = $instance->setBanStatus($username, 0);
        else
            $result = $_POST['banUserChoice'];
    }

    // Was the addQuestion button pressed?
    if (isset($_POST['addQuestionButton']))
    {
        $domain = $_POST['domain'];
        if ($_POST['difficulty'] == 'easyDifficulty')
            $difficulty = 1;
        else if ($_POST['difficulty'] == 'mediumDifficulty')
            $difficulty = 2;
        else if ($_POST['difficulty'] == 'hardDifficulty')
            $difficulty = 3;
        else
            $difficulty = 4;
        $content = $_POST['content'];
        $answer_a = $_POST['answerA'];
        $answer_b = $_POST['answerB'];
        $answer_c = $_POST['answerC'];
        $answer_d = $_POST['answerD'];
        if ($_POST['correctAnswer'] == 'correctAnswerA')
            $correct_answer = 'a';
        else if ($_POST['correctAnswer'] == 'correctAnswerB')
            $correct_answer = 'b';
        else if ($_POST['correctAnswer'] == 'correctAnswerC')
            $correct_answer = 'c';
        else
            $correct_answer = 'd';
        
        $result = $instance->addQuestion($domain, $difficulty, $content, $answer_a, $answer_b, $answer_c, $answer_d, $correct_answer);
    }

    // Was the addHero button pressed?
    if (isset($_POST['addHeroButton']))
    {
        $hero_name = $_POST['heroName'];
        $domain = $_POST['heroDomain'];
        $alignment = $_POST['alignment'];
        $eye_color = $_POST['eyeColor'];
        $hair_color = $_POST['hairColor'];
        $photo_url = $_POST['photoUrl'];
        $ability_name = $_POST['abilityName'];
        $background_url = $_POST['backgroundUrl'];
        $identity = $_POST['identity'];
        $real_name = $_POST['realName'];

        $result = $instance->addHero($hero_name, $domain, $alignment, $eye_color, $hair_color, $photo_url, $ability_name, $background_url, $identity, $real_name);
    }

    // Was the addAdmin button pressed?
    if (isset($_POST['addAdminButton']))
    {
        $result = $instance->registerAdmin($_POST['adminUsername'], $_POST['adminPassword']);
    }
    ?>

    <script src="../js/utility.js"></script>
    <script src="../js/checkSession.js"></script>
    <script src="../js/logout.js"></script>
    <script>

        // On page refresh, don't resend the information
        if (window.history.replaceState) 
            window.history.replaceState(null, null, window.location.href);
    </script>
</head>

<body>
    <main>
        <div>
            <input style="font-size: 30px; margin: 30px 10px 30px 10px;" type="submit" value="Logout" name="logoutButton" id="logoutButton" onclick="javascript:logoutUser();">
        </div>
        <form action="" method="POST">
            <fieldset>
                <legend>Ban user</legend>
                <?php
                if (isset($_POST['banUserButton']))
                {
                    if ($result == -1)
                        echo "<p>An error occured!</p>";
                    else if ($result == 0)
                        echo "<p>The username was not found!</p>";
                    else if ($result == 1)
                        echo "<p>Changes were applied with success!</p>";
                    else
                        echo "<p>Unexpected result...{$result}</p>";
                }
                ?>

                <p>
                    <label for="username">Username</label>
                    <input type="text" name="username" id="username" required>
                </p>
                <p>
                    <label for="banUser">Ban user</label>
                    <input type="radio" name="banUserChoice" id="banUser" value="banUser" checked>
                </p>
                <p>
                    <label for="unbanUser">Unban user</label>
                    <input type="radio" name="banUserChoice" id="unbanUser" value="unbanUser">
                </p>
                <input type="submit" value="Submit user changes" name="banUserButton" id="banUserButton">
            </fieldset>
        </form>
        <br><br>
        <form action="" method="POST">
            <fieldset>
                <legend>Add new question</legend>
                <?php
                if (isset($_POST['addQuestionButton']))
                {
                    if ($result == 1)
                        echo '<p>Question added with success!</p>';
                    else if ($result == -1)
                        echo "<p>Failed to add question!";
                    else
                        echo "<p>Unexpected result...{$result}</p>";
                }
                ?>
                <p>
                    <label for="domain">Domain</label>
                    <input type="text" name="domain" id="domain" required maxlength="20">
                </p>
                <div>
                    <p>Difficulty</p>
                    <p>
                        <input type="radio" name="difficulty" id="easyDifficulty" value="easyDifficulty" checked>
                        <label for="easyDifficulty">Easy</label>
                    </p>
                    <p>
                        <input type="radio" name="difficulty" id="mediumDifficulty" value="mediumDifficulty">
                        <label for="mediumDifficulty">Medium</label>
                    </p>
                    <p>
                        <input type="radio" name="difficulty" id="hardDifficulty" value="hardDifficulty">
                        <label for="hardDifficulty">Hard</label>
                    </p>
                    <p>
                        <input type="radio" name="difficulty" id="expertDifficulty" value="expertDifficulty">
                        <label for="expertDifficulty">Expert</label>
                    </p>
                </div>
                <p>
                    <label for="content">Content</label>
                    <input type="text" name="content" id="content" required maxlength="400">
                </p>
                <p>
                    <label for="answerA">Answer A</label>
                    <input type="text" name="answerA" id="answerA" required maxlength="100">
                </p>
                <p>
                    <label for="answerB">Answer B</label>
                    <input type="text" name="answerB" id="answerB" required maxlength="100">
                </p>
                <p>
                    <label for="answerC">Answer C</label>
                    <input type="text" name="answerC" id="answerC" required maxlength="100">
                </p>
                <p>
                    <label for="answerD">Answer D</label>
                    <input type="text" name="answerD" id="answerD" required maxlength="100">
                </p>
                <div>
                    <p>Correct answer</p>
                    <span>
                        <input type="radio" name="correctAnswer" id="correctAnswerA" value="correctAnswerA" checked>
                        <label for="correctAnswerA">A</label>
                    </span>
                    <span>
                        <input type="radio" name="correctAnswer" id="correctAnswerB" value="correctAnswerB">
                        <label for="correctAnswerB">B   </label>
                    </span>
                    <span>
                        <input type="radio" name="correctAnswer" id="correctAnswerC" value="correctAnswerC">
                        <label for="correctAnswerC">C   </label>
                    </span>
                    <span>
                        <input type="radio" name="correctAnswer" id="correctAnswerD" value="correctAnswerD">
                        <label for="correctAnswerD">D   </label>
                    </span>
                </div>
                <br>
                <input type="submit" value="Add question" id="addQuestionButton" name="addQuestionButton">
            </fieldset>
        </form>
        <br><br>
        <form action="" method="POST">
            <fieldset>
                <legend>Add new hero</legend>
                <?php
                if (isset($_POST['addHeroButton']))
                {
                    if ($result == 1)
                        echo "<p>Hero added!</p>";
                    else if ($result == -1)
                        echo "<p>An error on the database occured!</p>";
                    else
                        echo "<p>Unexpected result...{$result}</p>";
                }
                ?>
                <p>
                    <label for="heroName">Hero name</label>
                    <input type="text" name="heroName" id="heroName" required maxlength="50">
                </p>
                <p>
                    <label for="heroDomain">Domain</label>
                    <input type="text" name="heroDomain" id="heroDomain" required maxlength="20">
                </p>
                <p>
                    <label for="aligment">Alignment</label>
                    <input type="text" name="alignment" id="alignment" required maxlength="10">
                </p>
                <p>
                    <label for="eyeColor">Eye color</label>
                    <input type="text" name="eyeColor" id="eyeColor" required maxlength="50">
                </p>
                <p>
                    <label for="hairColor">Hair color</label>
                    <input type="text" name="hairColor" id="hairColor" required maxlength="50">
                </p>
                <p>
                    <label for="photoUrl">Photo URL</label>
                    <input type="text" name="photoUrl" id="photoUrl" required maxlength="100">
                </p>
                <p>
                    <label for="abilityName">Ability Name</label>
                    <input type="text" name="abilityName" id="abilityName" required maxlength="20">
                </p>
                <p>
                    <label for="backgroundUrl">Background URL</label>
                    <input type="text" name="backgroundUrl" id="backgroundUrl" required maxlength="100">
                </p>
                <p>
                    <label for="identity">Identity</label>
                    <input type="text" name="identity" id="identity" required maxlength="10">
                </p>
                <p>
                    <label for="realName">Real name</label>
                    <input type="text" name="realName" id="realName" required maxlength="20">
                </p>
                <input type="submit" value="Add hero" id="addHeroButton" name="addHeroButton">
            </fieldset>
        </form>
        <br><br>
        <form action="" method="POST">
            <fieldset>
                <legend>Add admin user</legend>
                <?php
                if (isset($_POST['addAdminButton']))
                {
                    if ($result == 1)
                        echo "<p>Admin added!</p>";
                    else if ($result == -1)
                        echo "<p>Failed to add admin!</p>";
                    else
                        echo "<p>Unexpected result...{$result}</p>";
                }
                ?>
                <p>
                    <label for="adminUsername">Username</label>
                    <input type="text" name="adminUsername" id="adminUsername" required maxlength="50">
                </p>
                <p>
                    <label for="adminPassword">Password</label>
                    <input type="password" name="adminPassword" id="adminPassword" required maxlength="50">
                </p>
                <input type="submit" value="Add" id="addAdminButton" name="addAdminButton">
            </fieldset>
        </form>
    </main>
</body>

</html>