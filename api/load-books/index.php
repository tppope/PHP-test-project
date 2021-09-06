<?php
header('Content-Type: application/json');
require_once(__DIR__ . "/../controllers/BookController.php");
$categoryController = new BookController();
try {
    if ($_SERVER["REQUEST_METHOD"] == 'GET')
        echo json_encode($categoryController->loadBooks());
} catch (Exception $exception) {
    echo json_encode(array("error" => true));
}