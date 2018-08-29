<?php
   // echo(json_encode($_POST));
    include('php_handler_init.php');
    function stringGenerator($length) {

    	// mix some letters and some digits
    	$alphanumerics   = array_merge(range('A', 'Z'), range(2, 9));
    	$alphanumerics_len = count($alphanumerics) - 1;
    
    	$gen_string = '';
    	for ($i = 0; $i < $length; $i++) {
    		$gen_string .= $alphanumerics[mt_rand(0, $alphanumerics_len)];
    	}
    	return $gen_string;
    }
    
    if(isset($_POST['trial_number'])){
        $trial = new Trial();
        foreach($_POST as $key=>$value){
            $trial->setField($key,$value);
        }
        $trial->Save();
    }
    
    if(isset($_POST['exit_trial_number'])){
        $ret = false;
        $xc = new Exitcode();
        $xc->SetField('user_id',$_POST['user_id']);
        $code = stringGenerator(5);
        $xc->SetField('code',$code);
        $xc->Save();
        $ret['code'] = $code;
        $ret = json_encode($ret);
        echo $ret;
    }
?>
