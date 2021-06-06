<?php
/**
 * Singleton class that handles the connection with the cloud database (deployed on Heroku).
 */
class DbConnection 
{
    // Class instance
    private static $instance;

    private static $con;

    private function __construct()
    {
        session_start();

        $host = "ec2-54-155-254-112.eu-west-1.compute.amazonaws.com";
        $database = "d25t20s246crpl";
        $user = "yppeytwutymvbr";
        $password = "996400dff3458655d0805f8a723d3a07c837cc2fc5ffa03215cb2437b43c4e4d";

        self::$con = pg_connect("host={$host} dbname={$database} user={$user} password={$password}");
        
        if (!self::$con) {
            echo "Error connecting to the database!";
            die;
        }
    }

    public static function getInstance()
    {
        if (self::$instance == null)  {
            self::$instance = new DbConnection();
        }
        return self::$instance;
    }
    
    /**
     * Public method for registering a new user into the database.
     * @return: an integer from the following list:
     *          - 1, if the registration was successful
     *          - 0, if the username already existed
     *          - -1, if an internal error occured when inserting the value
     */
    public function registerUser(string $username, string $first_name, string $last_name, string $email, string $password) : int
    {
        $existsUser = pg_query(self::$con, "select * from users where username = '{$username}'");
        $numberOfRows = pg_num_rows($existsUser);

        // Does the user already exist?
        if ($numberOfRows != 0) 
            return 0;

        $newUser['username'] = $username;
        $newUser['first_name'] = $first_name;
        $newUser['last_name'] = $last_name;
        $newUser['email'] = $email;
        $newUser['password_hash'] = md5($password);

        // Check if the pg_insert has failed
        if (!pg_insert(self::$con, "users", $newUser)) 
            return -1;
        return 1;
    }

    /**
     * Public method for registering a new admin into the database.
     * @return: an integer from the following list:
     *          - 1, if the registration was successful
     *          - 0, if the username already existed
     *          - -1, if an internal error occured when inserting the value
     */
    public function registerAdmin(string $username, string $password) : int
    {
        $existsAdmin = pg_query(self::$con, "select * from admins where username = '{$username}'");
        if (pg_num_rows($existsAdmin) != 0)
            return 0;

        $newAdmin['username'] = $username;
        $newAdmin['password_hash'] = md5($password);

        if (!pg_insert(self::$con, "admins", $newAdmin))
            return -1;
        return 1;
    }

    /**
     * Public method that checks if the provided login info is correct.
     * @return: an integer from the following list:
     *          - -2, if an internal error occures
     *          - -1, if the user does not exist
     *          - 0, if the user exists but he is banned
     *          - 1, if the user exists and he is not banned
     */
    public function checkUserLoginInfo(string $username, string $password) : int
    {
        $password_hash = md5($password);

        // pg_query returns the row if it exists, or FALSE otherwise
        $existsUser = pg_query(self::$con, "select * from users where username = '{$username}' and password_hash = '{$password_hash}'");
        if (!$existsUser)
            return -2;
        if (pg_num_rows($existsUser) == 0)
            return -1;
        $is_banned = pg_fetch_result($existsUser, "is_banned");
        if ($is_banned == 1)
            return 0;
        return 1;
    }

    /**
     * Public method for setting the ban status of a user
     * @return: 1 if the user exists and the ban_status was set, 
     *          0 if the user does not exist,
     *          -1 if an internal error occured when updating the value.
     */
    public function setBanStatus(string $username, int $ban_status) : int
    {
        $user = pg_query(self::$con, "select * from users where username = '{$username}'");
        if (pg_num_rows($user) == 0)
            return 0;
        
        $updateValue['is_banned'] = $ban_status;
        $updateCondition['username'] = $username;
        
        $result = pg_update(self::$con, "users", $updateValue, $updateCondition);
        return $result ? 1 : -1;
    }

    /**
     * Public method that checks if the provider admin login info is correct.
     * @return: 1 if it is correct, 0 otherwise.
     */
    public function checkAdminLoginInfo(string $username, string $password) : int
    {
        $password_hash = md5($password);
        $admin = pg_query(self::$con, "select * from admins where username = '{$username}' and password_hash = '{$password_hash}'");

        return $admin ? 1 : 0;
    }

    /**
     * Public method for inserting a new entry (or overriding the lowest score) into the leaderboard table.
     * @return: 1 if the entry was added with success,
     *          -1 otherwise.
     */
    public function addEntryIntoLeaderboard(string $username, int $score, string $hero)
    {
        $newEntry['username'] = $username;
        $newEntry['score'] = $score;
        $newEntry['hero'] = $hero;

        $numberOfRows = pg_query(self::$con, "select * from leaderboard");
        if (pg_num_rows($numberOfRows) < 100)
        {
            pg_insert(self::$con, "leaderboard", $newEntry);
            return 1;
        }

        $lowestScore = pg_query(self::$con, "select min(score) from leaderboard limit 1");
        
        $result = pg_update(self::$con, "leaderboard", $newEntry, $lowestScore);

        return $result ? 1 : -1;
    }

    /**
     * Public method for getting all entries from the leaderboard in descending order (based on their score).
     * @return: a descending array of all the entries from the leaderboard,
     *          0 if an error occured.
     */
    public function getLeaderboardSorted()
    {
        $result = pg_query(self::$con, "select * from leaderboard");
        
        // It is not tested!
        if (!$result)
        {
            return 0;
        }

        $arrayOfScores = pg_fetch_all($result);

        do
        {
            $ok = 0;
            for ($i = 0; $i < count($arrayOfScores) - 1; $i++)
            {
                if ($arrayOfScores[$i]['score'] < $arrayOfScores[$i + 1]['score'])
                {
                    $aux = $arrayOfScores[$i]['score'];
                    $arrayOfScores[$i]['score'] = $arrayOfScores[$i + 1]['score'];
                    $arrayOfScores[$i + 1]['score'] = $aux;
                    $ok = 1;
                }
            }
        } while ($ok == 1);

        return $arrayOfScores;
    }

    /**
     * Public method for inserting a new question into the database.
     * @return: 1 if the insert is successful,
     *          -1 otherwise
     */
    public function addQuestion(string $domain, string $difficulty, string $content, string $answer_a, string $answer_b, string $answer_c, string $answer_d, string $correct_answer) : int
    {
        $question['domain'] = $domain;
        $question['difficulty'] = $difficulty;
        $question['content'] = $content;
        $question['a'] = $answer_a;
        $question['b'] = $answer_b;
        $question['c'] = $answer_c;
        $question['d'] = $answer_d;
        $question['correct_answer'] = $correct_answer;

        if (!pg_insert(self::$con, "questions", $question))
            return -1;
        return 1;
    }

    /**
     * Public method for requesting a set of 10 questions from a specific domain
     * This function should be called only after inserting at least 10 questions into the database!
     * @return: an array of 10 questions
     */
    public function getSetOfQuestionsFromDomain(string $domain)
    {
        $result = pg_query(self::$con, "select * from questions where domain='{$domain}'");

        $rowsSet = pg_fetch_all($result);

        for ($i = 0; $i < 10; $i++)
        {
            while (true)
            {
                $rows[$i] = rand(0, count($rowsSet) - 1);
                $exists = false;
                for ($j = 0; $j < $i; $j++)
                {
                    if ($rows[$i] == $rows[$j])
                    {
                        $exists = true;
                        break;
                    }
                }

                if (!$exists)
                {
                    break;
                }
            } 
        }

        for ($i = 0; $i < 10; $i++)
        {
            $setOfQuestions[$i] = $rowsSet[$rows[$i]];
        }
        return $setOfQuestions;
    }

    /**
     * Public method for requesting a set of 10 questions with a specific difficulty
     * This function should be called only after inserting at least 10 questions of the requiered difficulty into the database!
     * @return: an array of 10 questions
     */
    public function getSetOfQuestionsWithDifficulty(string $difficulty)
    {
        $result = pg_query(self::$con, "select * from questions where difficulty='{$difficulty}'");

        $rowsSet = pg_fetch_all($result);

        for ($i = 0; $i < 10; $i++)
        {
            while (true)
            {
                $rows[$i] = rand(0, count($rowsSet) - 1);
                $exists = false;
                for ($j = 0; $j < $i; $j++)
                {
                    if ($rows[$i] == $rows[$j])
                    {
                        $exists = true;
                        break;
                    }
                }

                if (!$exists)
                {
                    break;
                }
            } 
        }

        for ($i = 0; $i < 10; $i++)
        {
            $setOfQuestions[$i] = $rowsSet[$rows[$i]];
        }
        return $setOfQuestions;
    }

    /**
     * Public method for inserting a new hero into the database.
     * @return: 1 if the insert is successful,
     *          -1 otherwise
     */
    public function addHero(string $hero_name, string $domain, string $alignment, string $eye_color, string $hair_color, 
                            string $photo_url, string $ability_name, string $background_url, string $identity, string $real_name) : int
    {
        $hero['hero_name'] = $hero_name;
        $hero['domain'] = $domain;
        $hero['alignment'] = $alignment;
        $hero['eye_color'] = $eye_color;
        $hero['hair_color'] = $hair_color;
        $hero['photo_url'] = $photo_url;
        $hero['ability_name'] = $ability_name;
        $hero['background_url'] = $background_url;
        $hero['identity'] = $identity;
        $hero['real_name'] = $real_name;

        if (!pg_insert(self::$con, "heroes", $hero))
            return -1;
        return 1;
    }

    /**
     * Public method for inserting a new hero for a given username into the database.
     * @return: 1 if the insert is successful,
     *          -1 otherwise
     */
    public function addNewHeroForUser(string $username, string $hero_name) : int 
    {
        $entry['user_pk'] = $username;
        $entry['hero_pk'] = $hero_name;

        if (!pg_insert(self::$con, "users_heroes_list", $entry))
            return -1;
        return 1;
    }


    /**
     * Public method for adding a new session into the database.
     * @return: 1 if the insert was successful,
     *          -1 otherwise
     */
    public function addSession(string $username, string $token) : int 
    {
        $entry['username'] = $username;
        $entry['token'] = $token;

        if (!pg_insert(self::$con, 'sessions', $entry))
            return -1;
        return 1;
    }

    /**
     * Public method which checks whether or not a session already exists in the database.
     * @return: true if it exists,
     *          false otherwise
     */
    public function checkSession(string $username, string $token)
    {
        $res = pg_query(self::$con, "SELECT * FROM sessions WHERE username = '{$username}' and token = '{$token}'");
        if (pg_num_rows($res) == 0) {
            return false;
        }
        return true;
    }

    /**
     * Public method for retrieving a token for a given username.
     * @return: the token if the session exists,
     *          an empty string otherwise
     */
    public function getTokenForUsername(string $username)
    {
        $res = pg_query(self::$con, "SELECT * FROM sessions WHERE username = '{$username}'");
        if (pg_num_rows($res) == 0) {
            return "";
        }

        return pg_fetch_array($res)['token'];
    }

    /**
     * Public method for deleting a session from the database.
     * @return: 1 if the deletion was successful,
     *          -1 otherwise
     */
    public function removeSession(string $username, string $token) : int 
    {
        $entry['username'] = $username;
        $entry['token'] = $token;

        if (!pg_delete(self::$con, 'sessions', $entry))
            return -1;
        return 1;
    }

    /**
     * Public method for adding a new session into the database.
     * @return: 1 if the insert was successful,
     *          -1 otherwise
     */
    public function addSessionForAdmins(string $username, string $token) : int 
    {
        $entry['username'] = $username;
        $entry['token'] = $token;

        if (!pg_insert(self::$con, 'sessions_admin', $entry))
            return -1;
        return 1;
    }

    /**
     * Public method which checks whether or not a session already exists in the database.
     * @return: true if it exists,
     *          false otherwise
     */
    public function checkSessionForAdmins(string $username, string $token)
    {
        $res = pg_query(self::$con, "SELECT * FROM sessions_admin WHERE username = '{$username}' and token = '{$token}'");
        if (pg_num_rows($res) == 0) {
            return false;
        }
        return true;
    }

    /**
     * Public method for retrieving a token for a given username.
     * @return: the token if the session exists,
     *          an empty string otherwise
     */
    public function getTokenForUsernameForAdmins(string $username)
    {
        $res = pg_query(self::$con, "SELECT * FROM sessions_admin WHERE username = '{$username}'");
        if (pg_num_rows($res) == 0) {
            return "";
        }

        return pg_fetch_array($res)['token'];
    }

    /**
     * Public method for deleting a session from the database.
     * @return: 1 if the deletion was successful,
     *          -1 otherwise
     */
    public function removeSessionForAdmins(string $username, string $token) : int 
    {
        $entry['username'] = $username;
        $entry['token'] = $token;

        if (!pg_delete(self::$con, 'sessions_admin', $entry))
            return -1;
        return 1;
    }

    /**
     * Returns a hero specified by their name.
     * @return: a hero specified by their name, or the empty string if the name is invalid
     */
    public function getHeroByName(string $heroName)
    {
        $res = pg_query(self::$con, "SELECT * FROM heroes WHERE hero_name = '{$heroName}'");
        if (pg_num_rows($res) == 0) {
            return "";
        }
        return pg_fetch_object($res);
    }
}