<?php
    $ret = array();
    include("php_handler_init.php");
    $semantic_pair = new Semantic_pair;
   // echo $semantic_pair->JSONAll('direct');
    $ids = $semantic_pair->GetAll();
    $s_pairs = array();
    foreach($ids as $id){
        $temp = new Semantic_pair($id);
        $temp = $temp->GetAllFields();
        array_push($s_pairs,$temp);
    }
    $ret['terms'] = $s_pairs;
    $sound = new Sound;
    $sounds = array();
    $ids = $sound->GetAll();
	foreach ($ids as $id) {
		$sound = new Sound($id);
        $sound = $sound->GetAllFields();
      //  $sound->mp3_files = array();
   
        $s_m = new Sound_MP3_file;
        $s_m_ids = $s_m->findByAttribute('sound_id',$id);

        foreach($s_m_ids as $s_m_id){
            $s_m = new Sound_MP3_file($s_m_id);
            $mp3 = new MP3_file($s_m->GetField('mp3_file_id'));

            $mp3 = $mp3->GetAllFields();
         //   array_push($sound->mp3_files,$mp3);
            $sound['mp3_file'] = $mp3;
        }
     
        array_push($sounds, $sound);
	}
    $ret['sounds']=$sounds;
    
    echo json_encode($ret);
?>