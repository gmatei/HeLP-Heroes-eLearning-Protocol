<?php
 // These headers will be sent to the client
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: *');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');
header('Content-Type: application/json');

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
if (!$instance->checkSession($username, $token)) {
     echo json_encode(array("result" => "invalid-session"));
     exit;
}

$hero = json_decode(file_get_contents("php://input"));

if (!isset($hero)) {
    echo json_encode(array(
        "result" => "no-body-found"
    ));
    exit;
}

$result = $instance->addHero($hero->name, $hero->domain, $hero->alignment, $hero->eye_color, $hero->hair_color, $hero->photo_url, $hero->ability_name);

echo json_encode(array(
    "result" => $result
));