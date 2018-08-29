<?php
if(isset($_FILES['upload'])){
        $myfilename =  $_FILES['upload']['tmp_name'];
        $AF = new AudioFile;
        $AF->wave_filename = $myfilename;
        $AF->mp3info();
        if($AF->wave_id == 'MPEG'){
            $byterate = explode(' Kbit/sec',$AF->wave_byterate);
            $folder = $byterate[0].'_Kbit';
            if (! $_FILES['upload']['error'] ){

                $handle = new Upload($_FILES['upload']);

                $handle->Process("./sounds/uploads/".$folder);
                $sound = new Sound;
                $sound->setField('description',addslashes($_POST['description']));
                $sound->setField('filename',$handle->file_dst_name);
                $sound->Save();
                $sound->setField('path',"./sounds/uploads/".$folder."/");
                $sound->setField('wave_id',$AF->wave_id);
                $sound->setField('wave_compression',$AF->wave_compression);
                $sound->setField('wave_framerate',$AF->wave_framerate);
                $sound->setField('wave_byterate',$AF->wave_byterate);
                $sound->setField('wave_length',$AF->wave_length);
                $sound->Save();
                $sound_id = getSoundID($sound);
                foreach($_POST['keyword'] AS $key=>$value){
                    if(strlen($value)){
                        $keyword = new Keyword;
                        $keyword->SetField('keyword',$keyword->keyword = $value);
                        $keyword->Save();
                        $keyword_id = $keyword->GetID();
                    
                        if(isset($keyword_id)){
                            $sound_keyword = new Sound_Keyword;
                            $sound_keyword->SetField('sound_id',$sound_id);
                            $sound_keyword->SetField('keyword_id',$keyword_id);
                            $sound_keyword->Save(); 
                        }
                    }
                }
            
           } else {
                echo "File Save Error";
           }
            header('Location:./editor.php?classname=Sound');
        } else {
            echo "Not an MPEG type file.";
        }
    }
?>