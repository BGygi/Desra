<?php
if(isset($_GET['pid'])){
        $myUser = new User($_GET['pid']);
        $myUser->fields = $myUser->GetAllFields();
        $round_number = $myUser->get_round_number();
        $myUser->round_number = $round_number;
        $experiment_id = $myUser->get_experiment();
        $myExperiment = new Experiment($experiment_id);
        $myExperiment->fields = $myExperiment->GetAllFields();
        $total_sounds = $myExperiment->GetField('total_sounds');
        $total_rounds = $myExperiment->GetField('total_rounds');
        $myUser->experiment = $myExperiment; 
        $ess = new Experiment_Selection_set;
        $ess_ids = $ess->FindByAttribute('experiment_id',$experiment_id);
        $ess = new Experiment_Selection_set($ess_ids[0]);
        $ss_id = $ess->GetField('selection_set_id');
        // result is all sounds in the selection set;
        $query = "SELECT `sounds`.`id` FROM `selection_set_sounds`,`selection_sets`,`sounds` ";
        $query .= "WHERE `selection_set_id` = $ss_id AND `selection_sets`.`id` = ";
        $query .= " `selection_set_sounds`.`selection_set_id` AND `sounds`.`id` = ";
        $query .= " `selection_set_sounds`.`sound_id` ORDER BY `sounds`.`description`";
        $db = new DB;
        $stmt = $db->prepare($query);
        $stmt->execute();
        $sids_w_kws = array();
        $sounds = array();
        while($row = $stmt->fetch()){
            $mySound = new Sound($row[0]);
            $sids_w_kws[$row[0]] = $mySound->GetMasterTag();
        }
        $ret = array();
        while(count($ret) < $total_sounds){
            $test = array_rand($sids_w_kws);
            if(! in_array($sids_w_kws[$test],$ret)){
                array_push($ret,$test);
            }
        }
        foreach($ret as $sound_id){
            $tmpsound = new Sound($sound_id);
            $tmpsound->fields = $tmpsound->GetAllFields();
            $s_mp3 = new Sound_MP3_file;
            $s_mp3_ids = $s_mp3->FindByAttribute('sound_id',$tmpsound->GetId());
            $s_mp3 = new Sound_MP3_file($s_mp3_ids[0]);
            $mp3_id = $s_mp3->GetField('mp3_file_id');
            $mp3_file = new MP3_file($mp3_id);
            $mp3_file->fields = $mp3_file->GetAllFields();
            $tmpsound->mp3_file = $mp3_file;
            array_push($sounds,$tmpsound);
        }
        $myUser->sounds = $sounds;
        /*
        while(count($sounds) < $total_sounds){
            $test = array_rand($sids_w_kws);
            if(! in_array($test, $sounds)){
                $tmpsound = new Sound($test);
                $tmpsound->fields = $tmpsound->GetAllFields();
                $s_mp3 = new Sound_MP3_file;
                $s_mp3_ids = $s_mp3->FindByAttribute('sound_id',$tmpsound->GetId());
                $s_mp3 = new Sound_MP3_file($s_mp3_ids[0]);
                $mp3_id = $s_mp3->GetField('mp3_file_id');
                $mp3_file = new MP3_file($mp3_id);
                $mp3_file->fields = $mp3_file->GetAllFields();
                $tmpsound->mp3_file = $mp3_file;
                array_push($sounds,$tmpsound);
            }
        }
        $myUser->sounds = $sounds;
        */
        /*
        foreach($sound_ids as $sound_id){
            $tmpsound = new Sound($sound_id);
            $tmpsound->fields = $tmpsound->GetAllFields();
            $s_mp3 = new Sound_MP3_file;
            $s_mp3_ids = $s_mp3->FindByAttribute('sound_id',$tmpsound->GetId());
            $s_mp3 = new Sound_MP3_file($s_mp3_ids[0]);
            $mp3_id = $s_mp3->GetField('mp3_file_id');
            $mp3_file = new MP3_file($mp3_id);
            $mp3_file->fields = $mp3_file->GetAllFields();
            $tmpsound->mp3_file = $mp3_file;
            array_push($sounds,$tmpsound);
        }
        */
        $played_sounds = array();
        $stmt = "SELECT sound_id FROM rounds WHERE user_id = ".$_GET['pid'];
        $result = DataManager::DBQuery($stmt);
        while($row = $result->fetch_object()){
            array_push($played_sounds,$row->sound_id);
        }
        $myUser->played_sounds = $played_sounds;
        $smarty->assign('myUser',json_encode($myUser));
        $smarty->assign('round_number',$round_number);
    //      print_r($sounds); 
    }
    ?>