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
        $stmt = "SELECT `sounds`.`id` FROM `selection_set_sounds`,`selection_sets`,`sounds` ";
        $stmt .= "WHERE `selection_set_id` = $ss_id AND `selection_sets`.`id` = ";
        $stmt .= " `selection_set_sounds`.`selection_set_id` AND `sounds`.`id` = ";
        $stmt .= " `selection_set_sounds`.`sound_id` ORDER BY `sounds`.`description`";
        $result = DataManager::DBQuery($stmt);
        $all_sounds = array();
       /*
        while ($row = $result->fetch_object()){
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
            array_push($all_sounds,$tmpsound);
        }
        */
        // get array of all sounds in selection set
        $use_sound_ids = array();
        $all_sound_ids = array();
        while ($row = $result->fetch_object()){
         //   $ss_s = new Selection_set_Sound($ss_s_id);
            array_push($use_sound_ids,$row->id);
            array_push($all_sound_ids,$row->id);
        }

        // shuffle the array, then slice it to total sounds needed;
        // this should be a randomized array of the right length
       shuffle($use_sound_ids);
       $use_sound_ids = array_slice($use_sound_ids,0,$total_sounds);
       $master_tags = array();
       foreach($use_sound_ids as $sound_id){
            $s = new Sound($sound_id);
            $sound_keyword = new Sound_Keyword;
            $sound_keyword_ids = $sound_keyword->FindByAttributeOrder('sound_id',$sound_id,'order_number');
            $sound_keyword = new Sound_Keyword($sound_keyword_ids[0]);
            $keyword_id = $sound_keyword->GetField('keyword_id');
            $keyword = new Keyword($keyword_id);
            $master_tags[$sound_id] = $keyword->GetField('keyword');
       }
       //
        $acv = array_count_values($master_tags);
        function overOne($value){
            return $value > 1;
        }
        // filter the array_count_values for any results greater than 1
        $acv_f = array_filter($acv,'overOne');
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
            array_push($all_sounds,$tmpsound);
        }
        
        $played_sounds = array();
        $stmt = "SELECT sound_id FROM rounds WHERE user_id = ".$_GET['pid'];
        $result = DataManager::DBQuery($stmt);
        while($row = $result->fetch_object()){
            array_push($played_sounds,$row->sound_id);
        }
     //   $myUser->ss_s_ids = $ss_s_ids;
        $myUser->all_sounds = $all_sounds;
        $myUser->use_sound_ids = $use_sound_ids;
        $myUser->acv_f = array_keys($acv_f);
        $use_sounds = array();
        $i = 0;
        function getGoodID(){
            return 899;
        }
        foreach($use_sound_ids as $use_sound_id){
            $s = new Sound($use_sound_id);
            $checkword = $s->GetMasterTag();
            if(array_key_exists($checkword,$acv_f)){
                array_splice($use_sound_ids,$i,1,getGoodID());
            }
            $i++;
        }
     //   $use_sound_ids = array_filter($use_sound_ids,'inDupes');
        $myUser->filtered_use_sounds = $use_sound_ids;
        $myUser->played_sounds = $played_sounds;
        $myUser->master_tags =   json_encode($master_tags);
        $smarty->assign('myUser',json_encode($myUser));
        $smarty->assign('round_number',$round_number);
    //      print_r($sounds); 
    }
    ?>