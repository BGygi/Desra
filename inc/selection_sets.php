<?php
    $ret = array();
    $db = new DB;
    $selection_set = new Selection_set;
    $query = 'SELECT * FROM ' . $selection_set->table_name . ' where 1 order by id';
    $stmt = $db->prepare($query);
    $stmt->execute();
    function GetSoundCount($ss_id){
        $db = new DB;
        $sql = "SELECT count(`sounds`.`id`) FROM ";
        $sql .= "`selection_sets`,`sounds`,`selection_set_sounds` WHERE ";
        $sql .= "`selection_set_sounds`.`selection_set_id` = $ss_id ";
        $sql .= " AND `sounds`.`id` = `selection_set_sounds`.`sound_id` ";
        $sql .= " AND `selection_sets`.`id` = `selection_set_sounds`.`selection_set_id`";
        $stmt = $db->prepare($sql);
        $stmt->execute();
        $r = $stmt->fetch();
        return $r[0];
    }
    $selection_sets = array();
    $selection_sets[0] = '------Selection Sets------';
    while ($row = $stmt->fetch()){
        $ss = new Selection_set($row['id']);
        $ss_id = $ss->GetID(); 
        $selection_sets[$ss_id]= $ss->GetField('description')." ( ".GetSoundCount($ss_id)." sounds)";
    }
    $ret['selection_sets'] = $selection_sets;

    if ( isset($_POST['selection_set_ids']) && isset($_POST['sound_ids']) && count($_POST['selection_set_ids']) == 1 && count($_POST['sound_ids']) > 0 ){
        // only one $ss_id
        $ss_id = $_POST['selection_set_ids'][0];
        foreach(array_unique($_POST['sound_ids']) as $key=>$value){
            $sound_id = $value;
            $sss = new Selection_set_Sound;
            // checkDupes should return true if it is a duplicate entry
            if( ! $sss->checkDupes($ss_id,$sound_id)  ){ // don't add it if it's there already
                $sss->SetField('sound_id',$sound_id);
                $sss->SetField('selection_set_id',$ss_id);
                $sss->Save();
            }
        }
        if(isset($ss_id)){
            $ss = new Selection_set($ss_id);
            $ss->fields = $ss->GetAllFields();
            $ret['selection_set'] = $ss;
            $sound_ids = array();
            $sounds = array();
        /*
            $sss = new Selection_set_Sound();
            $ssses = $sss->FindByAttributeOrder('selection_set_id',$ss_id,'sound_id');
            foreach($ssses as $sss_id){
                $ssst = new Selection_set_Sound($sss_id);
                $sound_idt = $ssst->GetField('sound_id');
                array_push($sound_ids, $sound_idt);
                $soundt = new Sound($sound_idt);
                $soundt->fields = $soundt->GetAllFields();
                array_push($sounds,$soundt);
            }
            $ret['sound_ids'] = $sound_ids;
            $ret['sounds'] = $sounds;
        */
            $stmt = "SELECT sound_id FROM sounds,selection_set_sounds WHERE sounds.id = selection_set_sounds.sound_id AND selection_set_sounds.selection_set_id = $ss_id ORDER BY sounds.description";
            $result = DataManager::DBQuery($stmt);
            while($row = $result->fetch_array(MYSQLI_BOTH)){
                array_push($sound_ids,$row['sound_id']);
                $tsound = new Sound($row['sound_id']);
                array_push($sounds,$tsound);
            }
            $ret['sound_ids'] = $sound_ids;
            $ret['sounds'] = $sounds;
        }
    }
    $smarty->assign('selection_set_data',$ret);
?>
