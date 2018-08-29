<?php
    include("php_handler_init.php");
    $ret = array();
    
    if($_POST['action'] == "add"){
        $sound_id = $_POST['sound_id'];
        $newword = $_POST['keyword'];
        $keyword = new Keyword;
        $keyword->SetField('keyword',$newword);
        $keyword->Save();
        $stmt = "SELECT `id` FROM $keyword->table_name WHERE `keyword` = '".$newword."'";
        $result = DataManager::DBQuery($stmt);
        $row = $result->fetch_array(MYSQLI_BOTH);
        $ret['keyword_id'] = $keyword_id = $row['id'];
        $sk = new Sound_Keyword;
        $stmt = "SELECT `id` FROM $sk->table_name WHERE `sound_id` = $sound_id AND `keyword_id` = $keyword_id";
        $result = DataManager::DBQuery($stmt);
        if($result->num_rows > 0){
            $ret['msg'] = "failure to add";
        } else {
            $sk->SetField('sound_id',$sound_id);
            $sk->SetField('keyword_id',$keyword_id);
            $sk->SetField('order_number',999);
            $sk->Save();
            $ret['msg'] = $newword . " added to " . $sound_id;
        }
    }
    if($_POST['action'] == "remove"){
            
    
            $sound_id = $_POST['sound_id'];

                $keyword_id_to_remove = $_POST['keyword_id'];
                $sk = new Sound_Keyword();
                $ret['msg'] = $keyword_id_to_remove . " removed from " . $sound_id;
                $stmt = "DELETE FROM $sk->table_name WHERE sound_id = $sound_id ";
                $stmt .= "AND keyword_id = $keyword_id_to_remove LIMIT 1";
                $result = DataManager::DBQuery($stmt);

    }
    if($_POST['action'] == "edit"){
                $keyword_id_to_edit = $_POST['keyword_id'];
                $kw = new Keyword($keyword_id_to_edit);
                $ret['msg'] = $keyword_id_to_edit . " edited to " . $_POST['keyword'];
                $kw->SetField('keyword',$_POST['keyword']);
                $kw->Save();
                $ret['edit']=$_POST['keyword_id'];
    }
    
    if($_POST['action'] == "reorder_keywords"){
             $ret = $_POST;
             $ret = array();
             if (is_array($_POST['send_array'])){
                foreach($_POST['send_array'] as $key=>$value){
                    $ret[$key] = $value;
                    if(is_array($value)){
                        $sound_id = $value[0];
                        $keyword_id = $value[1];
                        $order_number = $value[2];
                         $sk = new Sound_Keyword;
                $ret[$key] = $sk->reorder_keywords($sound_id,$keyword_id,$order_number);
                    }
                }
             }
            
    }
    echo json_encode($ret);
?>
