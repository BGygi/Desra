<?php
    include('php_handler_init.php');
    $username = $_SESSION['username'];
    $user = new User;
    $uids = $user->FindByAttribute('username',$username);
    $user_account = new Account;
    $ua_ids = $user_account->FindByAttribute('user_id',$uids[0]);
    $user_account = new Account($ua_ids[0]);
    if( $user_account->GetField('password') != $_POST['old_password']){
      //  header('Location:change_password.php?error=opnm');
            echo(json_encode('Old password doesn\'t match, please try again.'));
    } else {
        $user_account->SetField('password',$_POST['new_password']);
        $user_account->Save();
            echo(json_encode('Password Successfully Changed.'));
      //  header('Location:change_password.php?success=password_changed');
    }
    
?>
