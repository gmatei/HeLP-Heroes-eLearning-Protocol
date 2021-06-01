<?php

 // These headers will be sent to the client
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: *');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');
header('Content-Type: application/json');

// Default request is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(array(
        "result" => "invalid-method"
    ));
    exit;
}

if (!isset($_SERVER['HTTP_X_AUTH_TOKEN']) || !isset($_SERVER['HTTP_X_AUTH_USERNAME'])) {
    echo json_encode(array(
        "result" => "missing-headers"
    ));
    exit;
}

$token = $_SERVER['HTTP_X_AUTH_TOKEN'];
$username = $_SERVER['HTTP_X_AUTH_USERNAME'];

include_once "../../utility/database_connection.php";

$instance = DbConnection::getInstance();

// If the session credentials (username and session token) don't exit in the database, send a error.
if (!$instance->checkSessionForAdmins($username, $token)) {
     echo json_encode(array("result" => "invalid-session"));
     exit;
}

// Get the question from the request's body
$question = json_decode(file_get_contents("php://input"));

$result = $instance->addQuestion($question->domain, 
                                $question->difficulty, 
                                $question->content, 
                                $question->answer_a,
                                $question->answer_b, 
                                $question->answer_c, 
                                $question->answer_d, 
                                $question->correct_answer);

echo json_encode(array("result" => $result));