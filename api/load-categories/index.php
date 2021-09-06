<?php
header('Content-Type: application/json');
require_once(__DIR__ . "/../controllers/CategoryController.php");
$categoryController = new CategoryController();
try {
    if ($_SERVER["REQUEST_METHOD"] == 'GET')
        echo json_encode($categoryController->loadCategories());
} catch (Exception $exception){
    echo json_encode(array("error"=>true));
}