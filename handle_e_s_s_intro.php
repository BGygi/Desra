<?php
    include('php_handler_init.php');
    class message{
          function setMessage($msg){
                $this->msg = $msg;
          }
    }
    $e = new message;
    if(isset($_POST['return_code'])){
        $returncode = $_POST['return_code'];
        $ex = new Exitcode();
        $exes = $ex->findByAttribute('code',$returncode);
        if($exes){
        $ex = new Exitcode($exes[0]);
            $user_id = $ex->GetField('user_id');
            $e->setMessage($user_id);

        } else {

            $e->setMessage("NO USER ID");

        }
        // has return key, needs to be returned where they left
        echo json_encode($e);
    } else {
        // get the hearing questionaire
        if(isset($_POST['show_hearing_questionaire'])){
            include('./inc/hearing_questionaire.php');
            $myForm = "<h3>Hearing Questionaire</h3>";
        //    $myForm .= $smarty->fetch('./inc/hearing_form.inc');
            $myForm .= $smarty->fetch('db:hearing_form.inc');
            echo $myForm;
        }
    }
?>
