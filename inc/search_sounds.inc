<?php
    $sounds_keywords = null;
    if(isset($_POST['keyword']) && is_array($_POST['keyword'])){
        $sql = "SELECT `sounds`.`id` as 'sound_id',`keywords`.`id` as 'keyword_id' FROM sounds,keywords,sounds_keywords";
        $incrementer = 1;
        
        foreach($_POST['keyword'] as $key=>$keyword){
            if($incrementer >1){
                $sql .= " OR `keywords`.`keyword` LIKE '".$keyword."'";
                $sql .= " AND `sounds_keywords`.`keyword_id` = `keywords`.`id`";
                $sql .= " AND `sounds`.`id` = `sounds_keywords`.`sound_id`";
            } else {
                $sql .= " WHERE `keywords`.`keyword` LIKE '".$keyword."'";
                $sql .= " AND `sounds_keywords`.`keyword_id` = `keywords`.`id`";
                $sql .= " AND `sounds`.`id` = `sounds_keywords`.`sound_id`";
            }
            $incrementer++;
        }
        $result = DataManager::DBQuery( $sql );
        $sounds_keywords = array();
        while($row = $result->fetch_array(MYSQL_BOTH)){
            $sound = new Sound($row['sound_id']);
            $sound->fields = $sound->GetAllFields();
            $keyword = new Keyword($row['keyword_id']);
            $keyword->fields = $keyword->GetAllFields();
            array_push($sounds_keywords,array($sound,$keyword));
        }
        $smarty->assign('sounds_keywords',$sounds_keywords);
    }
    $smarty->assign('sounds_keywords',$sounds_keywords);
?>
