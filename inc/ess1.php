<?php
if(isset($_GET['pid'])){
        $myUser = new User($_GET['pid']);
        $myUser->fields = $myUser->GetAllFields();
        $round_number = $myUser->get_round_number();
        $myUser->round_number = $round_number;
        $experiment_id = $myUser->get_experiment();
        $myExperiment = new Experiment($experiment_id);
        $total_sounds = $myExperiment->GetField('total_sounds');
        $total_rounds = $myExperiment->GetField('total_rounds');
        $ess = new Experiment_Selection_set;
        $ess_ids = $ess->FindByAttribute('experiment_id',$experiment_id);
        $ess = new Experiment_Selection_set($ess_ids[0]);
        $ss_id = $ess->GetField('selection_set_id');
        $sql = "SELECT `sounds`.`id` FROM `selection_set_sounds`,`selection_sets`,`sounds` ";
        $sql .= "WHERE `selection_set_id` = $ss_id AND `selection_sets`.`id` = ";
        $sql .= " `selection_set_sounds`.`selection_set_id` AND `sounds`.`id` = ";
        $sql .= " `selection_set_sounds`.`sound_id` ORDER BY `sounds`.`description`";
        $db = new DB;
        $stmt = $db->prepare($sql);
        $stmt->execute();

        $sounds = array();
        
        $sids_w_kws = array();
        while($row = $stmt->fetch()){
            $mySound = new Sound($row[0]);
            array_push($sids_w_kws,array($mySound->GetId(),$mySound->GetMasterTag()));
        }
        /*
            $sids_w_kws formed like:
            array(array(sound_id,master_tag),array(sound_id,master_tag),array(sound_id,master_tag))
        
        
        */
        $ret = array();

        while(count($ret) < $total_sounds){
            $test = array_rand($sids_w_kws); // returns integer from zero-indexed keys of array
            if(! in_array($sids_w_kws[$test],$ret)){ // have we put it into $ret already?
              //  $ret[$test] = $sids_w_kws[$test]; // if not
                    array_push($ret,$sids_w_kws[$test]);
            }
        }
        foreach($ret as $sid_w_kw){
            
            $tmpsound = new Sound($sid_w_kw[0]);
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
        /*
        $sql = "SELECT `sounds`.`id` FROM `selection_set_sounds`,`selection_sets`,`sounds` ";
        $sql .= "WHERE `selection_set_id` = $ss_id AND `selection_sets`.`id` = ";
        $sql .= " `selection_set_sounds`.`selection_set_id` AND `sounds`.`id` = ";
        $sql .= " `selection_set_sounds`.`sound_id` ORDER BY `sounds`.`description`";
        $db = new DB;
        $stmt = $db->prepare($sql);
        $stmt->execute();
        while ($row = $stmt->fetch(PDO::FETCH_LAZY)){
         //   $ss_s = new Selection_set_Sound($ss_s_id);
            $tmpsound = new Sound($row->id);
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
        
        shuffle($sounds);
      //  array_multisort($sounds);
        */
        $user_id = $_GET['pid'];
        $played_sounds = array();
        $sql = "SELECT sound_id FROM rounds WHERE user_id = ?";
        $stmt = $db->prepare($sql);
        $stmt->execute(array($user_id));
      //  $result = DataManager::DBQuery($stmt);
        while($row = $stmt->fetch()){
             array_push($played_sounds,$row[0]);
          //  array_push($played_sounds,$row);
        }
     //   $myUser->ss_s_ids = $ss_s_ids;
        $myUser->sounds = $sounds;

      //  $myUser->ret = $ret;
        $myUser->played_sounds = $played_sounds;
        $smarty->assign('myUser',json_encode($myUser));
        $smarty->assign('round_number',$round_number);
    //      print_r($sounds); 
    }
    ?>