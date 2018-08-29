<?php
    include("php_handler_init.php");
    $myWav = new Wav_file($_GET['wid']);
    $downloads = $myWav->GetField('downloads');
    $myWav->SetField('downloads',$downloads + 1);
    $myWav->Save();
    $filename = $myWav->GetField('original_filename');
    header("Content-disposition: attachment; filename=$filename");
    header("Content-Type: audio/wav");
    readfile($myWav->GetField('path').$myWav->GetField('filename'));
?>
