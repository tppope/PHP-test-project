<?php

class Book implements \JsonSerializable
{

    private string $isbn;
    private string $name;
    private float $price;
    private string $authorName;
    private string $categoryName;

    public function jsonSerialize()
    {
        return get_object_vars($this);
    }

}