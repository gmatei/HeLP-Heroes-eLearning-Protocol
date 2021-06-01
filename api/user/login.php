<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    echo json_encode(array(
        "result" => "invalid-method"
    ));
    exit;
}

include_once "../../utility/database_connection.php";

// Get a reference to the database connection
$instance = DbConnection::getInstance();

// Read the username and password from the URL
$username = isset($_GET['username']) ? $_GET['username'] : die();
$password = isset($_GET['password']) ? $_GET['password'] : die();

// Check to see if the provided credentials are correct
$result = $instance->checkUserLoginInfo($username, $password);

if ($result != 1) {
    echo json_encode(array("result" => $result));
}
else {

    // Create the 128 chars random token
    $chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    $randomToken = '';
    for ($i = 0; $i < 255; $i++) {
        $randomToken = $randomToken . $chars[rand(0, strlen($chars) - 1)];
    }

    if (-1 == $instance->addSession($username, $randomToken)) {
        echo json_encode(array("result" => -3));
        exit;
    }

    // Construct the response array
    $response = array(
        "result" => $result,
        "username" => $username,
        "token" => $randomToken
    );

    echo json_encode($response);
}