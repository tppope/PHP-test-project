<?php
header('Content-Type: application/json');
require_once(__DIR__ . "/../controllers/AuthorController.php");
$categoryController = new AuthorController();
try {
    if ($_SERVER["REQUEST_METHOD"] == 'GET')
        echo json_encode($categoryController->loadAuthors($_GET["name"]));
} catch (Exception $exception) {
    echo json_encode(array("error" => true));
}