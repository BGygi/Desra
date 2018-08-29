<?php
    include("php_handler_init.php");
    $ret = array();
    $account_array = array("password","user_id","user_type");
    $user_array = array("name", "username", "email","institution");
    if($_POST['add_user'] == "1"){
        $myUser = new User;
        $myAccount = new Account;
        $incrementer = 0;
        foreach($_POST as $key=>$value){
            if(in_array( $key, $user_array ) ){
                $incrementer++;
                $myUser->SetField($key,$value);
            }
            if(in_array( $key, $account_array )){
                $myAccount->SetField($key,$value);
            }
        }
        if ($incrementer){
            $user_return = $myUser->Save();
            $user_id = $user_return['insert_id'];
            $ret[user_id]=$user_id;
            $myAccount->SetField('user_id',$user_id);
            $account_return = $myAccount->Save();
            $ret[user]=$user_return;
            $ret[account]=$account_return;
            header("Location:manage_users.php");
        } else {
            die("Failure to save");
        }
    } else {
        foreach($_POST as $key=>$value){
            if(in_array( $key, $user_array ) ){
                $myUser = new User($_POST['user_id']);
                $myUser->SetField($key,$value);
                $user = $myUser->Save();
                array_push($ret,$user);
            }
            if(in_array( $key ,$account_array ) ){
                $myAccount = new Account($_POST['account_id']);
                $myAccount->SetField($key,$value);
                $account = $myAccount->Save();
                array_push($ret,$account);
            }
            if($key == "delete_user"){
                $deleteUser = new User($_POST['delete_user']);
                $deleteAccount = new Account($_POST['delete_account']);
                 $deleteUser->destroy();
                 $deleteAccount->destroy();
                 header("Location:manage_users.php?deleted=1");
            }
        }
    }
    echo json_encode($ret);
?>
