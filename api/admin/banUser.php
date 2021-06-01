<?php

 // These headers will be sent to the client
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: *');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
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

// If the username is not passed as a parameter...
if (!isset($_GET['username'])) {
    echo json_encode(array("result" => "no-username"));
    exit;
}

// If the ban status is not passed as a parameter...
if (!isset($_GET['status'])) {
    echo json_encode(array("result" => "no-status"));
    exit;
}
$result = $instance->setBanStatus($_GET['username'], $_GET['status']);

if ($result == -1) {
    // internal error
    echo json_encode(array("result" => "server-internal-error"));
}
else if ($result == 0) {
    // username not found
    echo json_encode(array("result" => "username-not-found"));
}
else {
    // status set successfully
    echo json_encode(array("result" => "status-set"));
}