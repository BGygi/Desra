<?php
    include("php_handler_init.php");
    $myMP3 = new MP3_file($_GET['mid']);
    $downloads = $myMP3->GetField('downloads');
    $myMP3->SetField('downloads',$downloads + 1);
    $myMP3->Save();
    $filename = $myMP3->GetField('original_filename');
    header("Content-disposition: attachment; filename=$filename");
    header("Content-Type: audio/mpeg");
    readfile($myMP3->GetField('path').$myMP3->GetField('filename'));
?>
