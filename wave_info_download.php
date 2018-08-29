<?php
    include("php_handler_init.php");
    $mySound = new Sound($_GET['sid']);
    if(is_numeric($_GET['mid'])){
        $myMP3 = new MP3_file($_GET['mid']);
    }
    if(is_numeric($_GET['wid'])){
        $myWav = new Wav_file($_GET['wid']);
    }
    $mySound->fields = $mySound->GetAllFields();
    $filename = $mySound->GetField('id').".json";
    header("Content-disposition: attachment; filename=$filename");
    header('Content-type: application/json');
    $args = array("mp3"=>true,"wav"=>true,"channels"=>true,"citations"=>true,"autocorrelation_peaks"=>true);
    $ret['sound']=$mySound->CleanNumericKeys($mySound->GetWithFilesEtc());
    if(is_object($myMP3)){
        $mp3_file = $myMP3->CleanNumericKeys($myMP3->GetAllFields());
        foreach($mp3_file as $key=>$value){
            if($key == "path"){
               unset( $mp3_file[$key] );
            }
        }
        $ret['mp3_file']=$mp3_file;
    }
    if(is_object($myWav)){
        $wav_file = $myWav->CleanNumericKeys($myWav->GetAllFields());
        foreach($wav_file as $key=>$value){
            if($key == "path"){
               unset( $wav_file[$key] );
            }
        }
        $ret['wav_file']=$wav_file;
        $channels = array();
        $channel = new Channel;
        $channel_ids = $channel->FindByAttribute('wav_file_id',$myWav->GetId());
        foreach($channel_ids as $channel_id){
            $t_channel = new Channel($channel_id);
            $channeldata = $t_channel->CleanNumericKeys($t_channel->GetAllFields());
            
            
            array_push($channels,$channeldata);
        }
        $ret['channels'] = $channels;

    }
    $autocorrelation_peaks = array();
    $a_peak = new Autocorrelation_peak;
    $a_peaks = $a_peak->findByAttribute('wav_file_id',$myWav->GetId());
    foreach($a_peaks as $a_peak_id){
            $t_autocorrelation_peak = new Autocorrelation_peak($a_peak_id);
            $autocorrelation_peakdata =     $t_autocorrelation_peak->CleanNumericKeys($t_autocorrelation_peak->GetAllFields());
            array_push($autocorrelation_peaks,$autocorrelation_peakdata);
        }
        $ret['autocorrelation_peaks'] = $autocorrelation_peaks;
    $citations = array();
    $citation = new Citation;
    $citation_ids = $citation->FindByAttribute('sound_id',$mySound->GetId()) ;
    foreach($citation_ids as $citation_id ){
       $t_citation = new Citation($citation_id);
        array_push($citations, $t_citation->CleanNumericKeys($t_citation->GetAllFields()));
    }
    $ret['citations'] = $citations;
    echo json_encode($ret);
?>