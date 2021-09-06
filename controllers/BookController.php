<?php
require_once(__DIR__ . "/DatabaseController.php");
require_once(__DIR__ . "/../models/Book.php");

class BookController extends DatabaseController
{
    public function loadBooks(): array
    {
        $statement = $this->mysqlDatabase->prepareStatement("SELECT book.isbn as isbn, book.name as name, book.price as price, category.name AS categoryName, author.name AS authorName FROM book INNER JOIN author on book.author = author.id INNER JOIN category on book.category = category.id");
        $statement->setFetchMode(PDO::FETCH_CLASS, "Book");
        $statement->execute();
        return array("error" => false, "books" => $statement->fetchAll());
    }

}