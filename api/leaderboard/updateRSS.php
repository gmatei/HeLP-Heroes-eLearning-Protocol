<?php

// Headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(array(
        "result" => "invalid-method"
    ));
    exit;
}

include_once "../../utility/database_connection.php";

// Get a reference to the database connection
$instance = DbConnection::getInstance();

// This retrieves the body
$rss = json_decode(file_get_contents("php://input"));

if (!isset($rss)) {
    echo json_encode(array(
        "result" => "no-body-found"
    ));
    exit;
}

$resultValue = $instance->updateRSS($rss);
// echo json_encode($resultValue);
// exit;
if ($resultValue == false) {
    echo json_encode(array(
        "result" => "failure"
    ));
} else {
    echo json_encode(array(
        "result" => "success"
    ));
}