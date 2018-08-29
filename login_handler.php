<?php
    include("php_handler_init.php");
    session_start();
    if($_GET['logout']==1){
        $_SESSION = array();
        header("Location:index.php");
    } else {
        $query = "SELECT * FROM users,accounts ";
        $query .= "WHERE `users`.`username` = '";
        $query .= $_POST['username'];
        $query .= "' AND `accounts`.`password` = '";
        $query .= $_POST['password'];
        $query .= "' AND `users`.`id` = ";
        $query .= "`accounts`.`user_id`";
  //      $result = DataManager::DBQuery($sql);
        $db = new DB;
        $stmt = $db->prepare($query);
        $stmt->execute();
        if(! ($stmt->rowCount() > 0 )){
        
    
            $_SESSION['auth'] = false;
            $_SESSION['errors'] = "Login Failed, please check your username and password";
            header("Location:login.php");
        } else {
            $row = $stmt->fetch(PDO::FETCH_OBJ);

         //   $_SESSION = array();
         //   $_SESSION['username'] = $_POST['username'];
           
            $_SESSION['username'] = $row->username;
            $_SESSION['auth'] = crypt($_SESSION['username'],SESSION_AUTH_KEY);
            $_SESSION['usertype'] = $row->user_type;
            $_SESSION['user_type'] = $row->user_type;
            $_SESSION['user_id'] = $row->user_id;
            header("Location:index.php");
            
        }
    }
?>

