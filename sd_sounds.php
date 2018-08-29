<?php
    include('php_handler_init.php');
    
    $sound = new Sound;
    $sound_ids = $sound->getAll();
    $rand_key = array_rand($sound_ids);
    if( $_POST['sid'] ){
        $sound_id = $_POST['sid'];
    }   else {
        $sound_id = $sound_ids[$rand_key];
    }
    $mySound = new Sound($sound_id);
    if(! strlen( $mySound->GetField('description')) ){
        $sound_id = $sound_ids[$rand_key];
        $mySound = new Sound($sound_id);
    }
    if($mySound->GetField('has_mp3')){
        $s_m = new Sound_MP3_file;
        $s_m_ids = $s_m->findByAttribute('sound_id',$sound_id);
        $s_m_id = $s_m_ids[0];
        $s_m = new Sound_MP3_file($s_m_id);
        $mp3_file_id = $s_m->GetField('mp3_file_id');
        $myMP3_file = new MP3_file($mp3_file_id);
    }
    echo json_encode(array(array(
             'sound_id' =>   $mySound->GetId(),
             'description' =>   $mySound->GetField('description'),
             'path' =>   $myMP3_file->GetField('path'),
             'filename' =>   $myMP3_file->GetField('filename'),
             'sid' =>   $_POST['sid']
    )));


?>
