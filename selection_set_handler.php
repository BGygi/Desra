<?php
    include("php_handler_init.php");
    $ret = array();
    $selection_set = new Selection_set;
    $stmt = 'SELECT * FROM ' . $selection_set->table_name . ' where 1 order by id';
    $result = DataManager::DBQuery($stmt);
    $selection_sets = array();
    while ($row = $result->fetch_object()){
        array_push($selection_sets,$row);
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
    }
    if(isset($_POST['selection_set_id'])){
            $ss_id = $_POST['selection_set_id'];
            if(isset($_POST['delete'])){
                $sound_to_delete = $_POST['delete'];
                $sss = new Selection_set_Sound();
                $stmt = "DELETE FROM $sss->table_name WHERE sound_id = $sound_to_delete ";
                $stmt .= "AND selection_set_id = $ss_id LIMIT 1";
                $result = DataManager::DBQuery($stmt);
            }
            
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
                $stmt = "SELECT * FROM `sounds` WHERE id = $sound_idt";
                $result = DataManager::DBQuery($stmt);
                if($result->num_rows){
                    $soundt = new Sound($sound_idt);
                    $soundt->fields = $soundt->GetAllFields();
                    array_push($sounds,$soundt);
                    array_push($sound_ids,$sound_idt);
                }
            }
        */
            $stmt = "SELECT sound_id FROM sounds,selection_set_sounds WHERE sounds.id = selection_set_sounds.sound_id AND selection_set_sounds.selection_set_id = $ss_id ORDER BY sounds.description";
            $result = DataManager::DBQuery($stmt);
            while($row = $result->fetch_array(MYSQLI_BOTH)){
                array_push($sound_ids,$row['sound_id']);
                $tsound = new Sound($row['sound_id']);
                $tsound->fields = $tsound->GetAllFields();
                array_push($sounds,$tsound);
            }
            $ret['sound_ids'] = $sound_ids;
            $ret['sounds'] = $sounds;

    }
    
    echo json_encode($ret);
     
?>
