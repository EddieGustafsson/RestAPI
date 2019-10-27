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

    // search products
    function search($keywords){
    
        // select all query
        $query = "SELECT * FROM `anvandare`
                FROM
                    " . $this->table_name . "
                WHERE
                    anamn LIKE ? OR id LIKE ? OR email LIKE ?
                ORDER BY
                    id DESC";
    
        // prepare query statement
        $stmt = $this->conn->prepare($query);
    
        // sanitize
        $keywords=htmlspecialchars(strip_tags($keywords));
        $keywords = "%{$keywords}%";
    
        // bind
        $stmt->bindParam(1, $keywords);
        $stmt->bindParam(2, $keywords);
        $stmt->bindParam(3, $keywords);
    
        // execute query
        $stmt->execute();
    
        return $stmt;
    }
}
?>