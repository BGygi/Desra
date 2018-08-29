<?php
    include('php_handler_init.php');
    if(isset($_POST)){
        @$mysqli = new mysqli(DB_HOST,DB_USER,DB_PASSWORD,DB_DATABASE);
        // test it
        if(! $mysqli){
            die ("could not connect: ". $mysqli->error);
        }
       $stmt = "SET AUTOCOMMIT = 0";
       $mysqli->query($stmt);
       $stmt = "LOCK TABLES `users` WRITE,`hearing_questionaires` WRITE,`users_hearing_questionaires` WRITE;";
        $mysqli->query($stmt);
        $stmt = "INSERT INTO `users` (id,username) VALUES (NULL, 'participant');";
        $mysqli->query($stmt);
    
        $stmt = "SELECT LAST_INSERT_ID() FROM `users`";
    //    $stmt = "SELECT MAX(id) FROM `users`";
        $result = $mysqli->query($stmt);
        $a = $result->fetch_array();
        $user_id = $a[0];
        $stmt = "INSERT INTO `hearing_questionaires` (`birthyear`,`gender`,`hearing_loss`,`symmetry`,`native_language`,`primary_language`,";
        $stmt .= "`country`) VALUES ( '$_POST[birthyear]','$_POST[gender]','$_POST[hearing_loss]','$_POST[symmetry]','$_POST[native_language]','$_POST[primary_language]','$_POST[country]');";
        $result = $mysqli->query($stmt);
        $stmt = "SELECT LAST_INSERT_ID() FROM `hearing_questionaires`;";
        $result = $mysqli->query($stmt);
        $a = $result->fetch_array();
        $hearing_questionaire_id = $a[0];
        $stmt = "INSERT INTO `users_hearing_questionaires` (`user_id`,`hearing_questionaire_id`,`completed`) VALUES ('$user_id','$hearing_questionaire_id','1');";
        $result = $mysqli->query($stmt);
        $stmt = "SELECT LAST_INSERT_ID() FROM `users_hearing_questionaires`;";
        $result = $mysqli->query($stmt);
        $a = $result->fetch_array();
        $result->close();
        $stmt = "COMMIT;";
        $result = $mysqli->query($stmt);
        $stmt = "UNLOCK TABLES";
        $mysqli->query($stmt);
        $mysqli->close();
        $u_hq_id = $a[0];
        $u_hq = new User_Hearing_questionaire($u_hq_id);
        $u_hq->classname = 'User_Hearing_questionaire';
        $u_hq->fields = $u_hq->GetAllFields();
      //  $result->close();
        
        $u = new User_Experiment();
        $u->SetField('user_id',$user_id);
        $u->SetField('experiment_id','10');
        $u->Save();
    }
  //  echo json_encode($u_hq);
    echo json_encode(array('user_id'=>$user_id,'thanks_msg'=>'<h3>Thanks!</h3>In a few seconds you will start the environmental sound study.'));
?>