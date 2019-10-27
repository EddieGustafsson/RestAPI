<?php
class Users{
 
    // database connection and table name
    private $conn;
    private $table_name = "anvandare";
 
    // object properties
    public $id;
    public $anamn;
    public $email;
    public $aktiv;
 
    // constructor with $db as database connection
    public function __construct($db){
        $this->conn = $db;
    }

    // read products
    function read(){
    
        // select all query
        $query = "SELECT * FROM `anvandare`";
    
        // prepare query statement
        $stmt = $this->conn->prepare($query);
    
        // execute query
        $stmt->execute();
    
        return $stmt;
    }
}
?>