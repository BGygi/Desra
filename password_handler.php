<?php
    include("php_handler_init.php");
    $username = $_POST['username'];
    $user = new User;
    $uids = $user->FindByAttribute('username',$username);
    if(count($uids)){
        $user= new User($uids[0]);
        $user_account = new Account;
        $ua_ids = $user_account->FindByAttribute('user_id',$uids[0]);
        $user_account = new Account($ua_ids[0]);
        if( $user_account->GetField('password') != $_POST['password']){
          //  header('Location:change_password.php?error=opnm');
                echo(json_encode('Password doesn\'t match, please try again.'));
        } else {
            session_start();
            $_SESSION['username'] = $_POST['username'];
            $_SESSION['auth'] = crypt($_SESSION['username'],SESSION_AUTH_KEY);
            $_SESSION['usertype'] = $user_account->GetField('user_type');
            $_SESSION['user_type'] = $user_account->GetField('user_type');
            $_SESSION['user_id'] = $user->GetId();
            echo(json_encode('Logged In'));
        }
    } else {
        echo json_encode('We have no user by that name');
    }
?>
