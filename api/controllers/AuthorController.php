<?php
require_once(__DIR__ . "/DatabaseController.php");

class AuthorController extends DatabaseController
{
    public function loadAuthors($name)
    {
        $statement = $this->mysqlDatabase->prepareStatement("SELECT author.name FROM author WHERE LOWER(name) LIKE CONCAT(:name, '%')");
        $statement->bindValue(':name', $name, PDO::PARAM_STR);
        $statement->execute();
        return array("error" => false, "authors" => $statement->fetchAll(PDO::FETCH_COLUMN));
    }

}