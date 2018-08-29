<?php
    include("php_handler_init.php");
    $ret = array();
    $myWav_id = $_POST['wav_id'];
    $mySound_id = $_POST['sound_id'];
    $sql = "SELECT id FROM channels WHERE wav_file_id = :id";
    $db = new DB;
    $stmt = $db->prepare($sql);
    $stmt->BindParam(':id',$myWav_id,PDO::PARAM_INT);
    $stmt->execute();
    $myChannels = array();
    while($row = $stmt->fetch()){
        $myChannel = new Channel($row['id']);
        $rawFields = $myChannel->GetAllFields();
        $myGO = new GenericObject();
        $newFields = $myGO->CleanNumericKeys($rawFields);
        array_push($myChannels,$newFields);
    }
    $ret['channels']=$myChannels;
    $sql = "SELECT id FROM autocorrelation_peaks WHERE wav_file_id = :id";
    $db = new DB;
    $stmt = $db->prepare($sql);
    $stmt->BindParam(':id',$myWav_id,PDO::PARAM_INT);
    $stmt->execute();
    $myAutocorrelation_peaks = array();
    while($row = $stmt->fetch()){
        $myAutocorrelation_peak = new Autocorrelation_peak($row['id']);
        $rawFields = $myAutocorrelation_peak->GetAllFields();
        $myGO = new GenericObject();
        $newFields = $myGO->CleanNumericKeys($rawFields);
        array_push($myAutocorrelation_peaks,$newFields);
    }
    $ret['autocorrelation_peaks']=$myAutocorrelation_peaks;
   // $myCitations = array();
    $myCitation = new Citation;
    $myCitations = array();
   
    $myCitation_ids = $myCitation->findByAttribute('sound_id',$mySound_id);
    if(@count($myCitation_ids)){
        foreach($myCitation_ids as $key=>$value){
            $innerCitation = new Citation($value);
            $innerCitation->fields = $innerCitation->Clean( $innerCitation->CleanNumericKeys($innerCitation->GetAllFields()));
            array_push($myCitations,$innerCitation);
        }
    }
    
    $ret['citations']=$myCitations;
    echo json_encode($ret);
?>
