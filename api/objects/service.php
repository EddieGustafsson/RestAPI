<?php
class Service{
 
    // database connection and table name
    private $conn;
    private $table_name = "tjanst";
 
    // object properties
    public $id;
    public $anvandarId;
    public $titel;
    public $privat;
 
    // constructor with $db as database connection
    public function __construct($db){
        $this->conn = $db;
    }
}
?>