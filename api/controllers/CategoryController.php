<?php
require_once(__DIR__ . "/DatabaseController.php");
require_once(__DIR__ . "/../models/Category.php");

class CategoryController extends DatabaseController
{
    public function loadCategories(): array
    {
        $statement = $this->mysqlDatabase->prepareStatement("SELECT * FROM category");
        $statement->setFetchMode(PDO::FETCH_CLASS, "Category");
        $statement->execute();
        return array("error" => false, "categories" => $statement->fetchAll());
    }

}