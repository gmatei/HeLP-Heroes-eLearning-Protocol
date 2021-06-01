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
$data = json_decode(file_get_contents("php://input"));

if (!isset($data)) {
    echo json_encode(array(
        "result" => "no-body-found"
    ));
    exit;
}

$resultValue = $instance->registerUser($data->username, $data->first_name, $data->last_name, $data->email, $data->password);


// Return a JSON Object detailing the result
if ($resultValue == -1) {
    echo json_encode(array("result" => "server-fatal-error"));
}
else if ($resultValue == 0) {
    echo json_encode(array("result" => "username-already-exists"));
}
else {
    echo json_encode(array("result" => "registration-successful"));
}