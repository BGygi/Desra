<?php
    include("php_handler_init.php");
    if($_SESSION['user_type'] != "developer"){
        echo "not logged in";
    } else {
        $db = new DB;
        $sql = stripslashes($_POST['query']);
        $stmt = $db->prepare($sql);
        $ret = $stmt->execute();
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    }
?>
