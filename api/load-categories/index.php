<?php
header('Content-Type: application/json');
require_once(__DIR__ . "/../../controllers/CategoryController.php");
$controller = new CategoryController();
echo json_encode($controller->getLocationInfo($_GET["lat"], $_GET["long"], $_GET["timestamp"], $_GET["portal"]));