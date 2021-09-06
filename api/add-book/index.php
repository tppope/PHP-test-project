<?php
require_once __DIR__ . "/../controllers/BookController.php";
header('Content-Type: application/json; charset=utf-8');
$controller = new BookController();

if ($_SERVER["REQUEST_METHOD"] == 'POST')
    echo json_encode($controller->addBook(trim($_POST["book-name"]), trim($_POST["isbn"]), trim($_POST["price"]), trim($_POST["author-name"]),$_POST["category"]));
