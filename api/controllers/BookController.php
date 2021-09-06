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

    public function addBook($name, $isbn, $price, $authorName, $category): array
    {
        $checkEmptyValues = $this->checkEmptyValues($name, $isbn, $price, $authorName);
        if (!empty($checkEmptyValues))
            return array("error" => true, "emptyValues" => $checkEmptyValues);

        try {
            $authorId = $this->getAuthorId($authorName);
            if ($authorId === false)
                $authorId = $this->insertAuthor($authorName);

        } catch (Exception $exception) {
            return array("error" => true);
        }


        try {
            $this->insertBook($name, $isbn, floatval($price), $authorId, $category);
        } catch (PDOException $PDOException) {
            return array("error" => true, "isbnError" => true);
        }

        return array("error" => false);
    }

    private function checkEmptyValues($name, $isbn, $price, $authorName)
    {
        $emptyValues = [];

        if (empty($name)) {
            array_push($emptyValues, 'book-name');
        }

        if (empty($isbn)) {
            array_push($emptyValues, 'isbn');
        }

        if (empty($price)) {
            array_push($emptyValues, 'price');
        }

        if (empty($authorName)) {
            array_push($emptyValues, 'author-name');
        }

        return $emptyValues;
    }

    private function getAuthorId($name): int|bool
    {
        $statement = $this->mysqlDatabase->prepareStatement("SELECT author.id
                                                                    FROM author
                                                                    WHERE author.name = :name");
        $statement->bindValue(':name', $name, PDO::PARAM_STR);
        $statement->execute();
        return $statement->fetchColumn();
    }

    private function insertAuthor($name): int
    {
        $statement = $this->mysqlDatabase->prepareStatement("INSERT INTO author (name)
                                                                    VALUES (:name)");
        $statement->bindValue(':name', trim($name), PDO::PARAM_STR);
        $statement->execute();
        return $this->mysqlDatabase->getConnection()->lastInsertId();
    }

    private function insertBook($name, $isbn, $price, $authorId, $category): void
    {
        $statement = $this->mysqlDatabase->prepareStatement("INSERT INTO book (name,isbn,price,author,category)
                                                                    VALUES (:name, :isbn, :price, :author, :category)");
        $statement->bindValue(':name', $name, PDO::PARAM_STR);
        $statement->bindValue(':isbn', $isbn, PDO::PARAM_STR);
        $statement->bindValue(':price', $price, PDO::PARAM_STR);
        $statement->bindValue(':author', $authorId, PDO::PARAM_INT);
        $statement->bindValue(':category', $category, PDO::PARAM_INT);
        $statement->execute();
    }

}