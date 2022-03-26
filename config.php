<?php

$server = "localhost";
$dbuser = "root";
$dbpass = "";
$database = "my_db";

$conn = mysqli_connect($server, $dbuser, $dbpass, $database);

if (!$conn) {
    die("<script>alert('Connection Failed.')</script>");
}

$base_url = "http://localhost/VSN/docstore.php"; // Website url

?>
