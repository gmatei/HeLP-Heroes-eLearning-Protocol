<?php

 // These headers will be sent to the client
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: *');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');
header('Content-Type: application/json');

// Default request is GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
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
if (!$instance->checkSession($username, $token)) {
     echo json_encode(array("result" => "invalid-session"));
     exit;
}

$result = $instance->getLeaderboardSorted();

if ($result == 0) {
    // some kind of error occured...
    echo json_encode(array("result" => 0));
    exit;
}
echo json_encode(array("result" => 1, "data" => $result));