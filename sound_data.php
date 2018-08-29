<?php
    include("php_handler_init.php");
    $db = new DB; // this is the PDO version of the data manager
    $pagination = false;
	if ( isset($_REQUEST["page"]) )
	{
		$pagination = true;
		
		$page = intval($_REQUEST["page"]);
		$perpage = intval($_REQUEST["perpage"]);
	}
	// this variables Omnigrid will send only if serverSort option is true
    if(isset($_REQUEST['sorton'])){
       $sorton = $_REQUEST["sorton"];
    } else {
        $sorton = 'description';
    }
    if(isset($_REQUEST['sortby'])){
	   $sortby = $_REQUEST["sortby"];
    } else {
        $sortby = "ASC";
    }

	$n = ( $page -1 ) * $perpage;
	
    $statement_number = null;
    if (isset($_POST['search']) && isset($_POST['searchColumns'])) {
        $term = strtolower($_POST['search']);
        $query = "SELECT COUNT(`sounds`.`id`) as rowcount ";
        $query .= "FROM `sounds`, `sounds_mp3_files`,";
        $query .= "`mp3_files`,`keywords`,`sounds_keywords` ";
        $query .= "WHERE `sounds`.`id` = `sounds_mp3_files`.`sound_id` ";
        $query .=  "AND `mp3_files`.`id` = `sounds_mp3_files`.`mp3_file_id`";
        $query .=  "AND `keywords`.`id` = `sounds_keywords`.`keyword_id` ";
        $query .=  "AND `sounds`.`id` = `sounds_keywords`.`sound_id` ";
        
        $query .= "AND `keywords`.`keyword` LIKE CONCAT('%',:term,'%') ";

  //      $db = new DB;  // instantiated above
        $stmt = $db->prepare($query);
        if(isset($term)){
            $stmt->BindParam(':term',$term,PDO::PARAM_STR,strlen($term));
        }
        $stmt->execute();
        $statement_number = '1';
    	$total = $stmt->fetchColumn(0);
      //  $total = $r->rowcount;
        $limit = "";
    	if ( $pagination ) {
    		$limit = "LIMIT :n, :perpage";
    	}

        $query = "SELECT `sounds`.`id`,`sounds`.`description`,`sounds`.`timestamp`,`sounds`.`user_id`,`mp3_files`.`wave_length`,`mp3_files`.`filename`, `mp3_files`.`wave_byterate`,`mp3_files`.`wave_framerate` ";
        $query .= "FROM `sounds`, `sounds_mp3_files`,";
        $query .= "`mp3_files`,`keywords`,`sounds_keywords` ";
        $query .= "WHERE `sounds`.`id` = `sounds_mp3_files`.`sound_id` ";
        $query .=  "AND `mp3_files`.`id` = `sounds_mp3_files`.`mp3_file_id`";
        $query .=  "AND `keywords`.`id` = `sounds_keywords`.`keyword_id` ";
        $query .=  "AND `sounds`.`id` = `sounds_keywords`.`sound_id` ";
        
        $query .= "AND `keywords`.`keyword` LIKE CONCAT('%',:term,'%') ";
        $query .= "GROUP BY `sounds`.`id` ORDER BY $sorton $sortby $limit";
      
      /*
        if(isset($sorton)){
            $query .= "ORDER BY :sorton :sortby ";
        }
        $query .=  $limit;
     */
     //     
      
        $statement_number = '2';
        $stmt = $db->prepare($query);
        if(isset($sorton)){
         //    $stmt->BindParam(':sorton',$sorton, PDO::PARAM_STR,strlen($sorton));
          //   $stmt->BindParam(':sortby',$sortby, PDO::PARAM_STR,strlen($sortby));
        }
        if(isset($term)){
            $stmt->BindParam(':term',$term,PDO::PARAM_STR,strlen($term));
        }
        $stmt->BindParam(':perpage',$perpage, PDO::PARAM_INT);
        $stmt->BindParam(':n',$n, PDO::PARAM_INT);
        
        $statement_handler = 'DB';
        $stmt->execute();
        
     //   $total - $stmt->RowCount();
     //   $result = DataManager::DBQuery($stmt);
    	$ret = array();
    	while ($row = $stmt->fetch(PDO::FETCH_OBJ)) {
    		$sound = new Sound($row->id);
            $sound->fields = $sound->CleanNumericKeys ( $sound->GetAllFields() );
                        /* add wav info */
            $sound->wav_files = array();
            $s_w = new Sound_Wav_file;
            $s_w_ids = $s_w->findByAttribute('sound_id',$sound->GetId());
            foreach($s_w_ids as $s_w_id){
                $s_w = new Sound_Wav_file($s_w_id);
                $wav = new Wav_file($s_w->GetField('wav_file_id'));
    
                $wav->fields = $wav->Clean( $wav->CleanNumericKeys( $wav->GetAllFields() ));
                array_push($sound->wav_files,$wav);
            } 
    
            $sound->mp3_files = array();
            $s_m = new Sound_MP3_file;
            $s_m_ids = $s_m->findByAttribute('sound_id',$sound->GetId());
    
            foreach($s_m_ids as $s_m_id){
                $s_m = new Sound_MP3_file($s_m_id);
                $mp3 = new MP3_file($s_m->GetField('mp3_file_id'));
    
                $mp3->fields = $mp3->Clean( $mp3->CleanNumericKeys($mp3->GetAllFields()));
                array_push($sound->mp3_files,$mp3);
            }
    
            $sound->keywords = array();
         
            $s_k = new Sound_Keyword;
            $order_hash = array();
            $order_hash['order_number'] = "ASC";
            $order_hash['keyword_id'] = "DESC";
            $s_k_ids = $s_k->findByAttributeMultiOrder('sound_id',$sound->GetId(),'order_number,keyword_id DESC');
            
            foreach(array_unique($s_k_ids) as $s_k_id){
                $s_k = new Sound_Keyword($s_k_id);
                $keyword = new Keyword($s_k->GetField('keyword_id'));
    
              $keyword->fields = $keyword->GetAllFields();
          //        $keyword->fields = array('id'=>'1','0'=>'1','keyword'=>'word','1'=>'word');
                
            
                array_push($sound->keywords,$keyword);
            }
            
            $row->sound = $sound;
            array_push($ret, $row);
    	}

    } else {  // no search term
        

        $query = "SELECT COUNT(*) AS count FROM `sounds` , `sounds_mp3_files` , `mp3_files`
        WHERE `sounds`.`id` = `sounds_mp3_files`.`sound_id`
        AND `mp3_files`.`id` = `sounds_mp3_files`.`mp3_file_id`";
        $stmt = $db->prepare($query);
//        $result = DataManager::DBQuery($stmt);
    	$stmt->execute();
        $total = $stmt->fetchColumn(0);
    	$limit = "";
    	
    	if ( $pagination ) {
    		$limit = "LIMIT $n, $perpage";
    	}
        if( isset($sorton) ){
        
       
         //    $stmt = "SELECT * FROM sounds ORDER BY $sorton $sortby $limit";
 
      $query = "SELECT `sounds`.`id`,`sounds`.`timestamp`, `sounds`.`description`,`sounds`.`user_id`, `mp3_files`.`wave_length`,`mp3_files`.`filename`,`mp3_files`.`wave_byterate`,`mp3_files`.`wave_framerate`
    FROM `sounds` , `sounds_mp3_files` , `mp3_files`
    WHERE `sounds`.`id` = `sounds_mp3_files`.`sound_id`
    AND `mp3_files`.`id` = `sounds_mp3_files`.`mp3_file_id` ORDER BY $sorton $sortby $limit";
$statement_number = "3";
   
        } else {
        

          
    $query = "SELECT `sounds`.`id`,`sounds`.`timestamp`, `sounds`.`description`,`sounds`.`user_id`, `mp3_files`.`wave_length`,`mp3_files`.`filename`,`mp3_files`.`wave_byterate` 
    FROM `sounds` , `sounds_mp3_files` , `mp3_files`
    WHERE `sounds`.`id` = `sounds_mp3_files`.`sound_id`
    AND `mp3_files`.`id` = `sounds_mp3_files`.`mp3_file_id` $limit";
        $statement_number = "4";
        }
    
    $statement_handler = "DM";
    $stmt = $db->prepare($query);
    $stmt->execute();
	$ret = array();
	while ($row = $stmt->fetch(PDO::FETCH_OBJ)) {
		$sound = new Sound($row->id);
        $sound->fields = $sound->Clean($sound->CleanNumericKeys ( $sound->GetAllFields() ) );
                    /* add wav info */
        $sound->wav_files = array();
        $s_w = new Sound_Wav_file;
        $s_w_ids = $s_w->findByAttribute('sound_id',$sound->GetId());
        foreach($s_w_ids as $s_w_id){
            $s_w = new Sound_Wav_file($s_w_id);
            $wav = new Wav_file($s_w->GetField('wav_file_id'));

            $wav->fields = $wav->Clean( $wav->CleanNumericKeys( $wav->GetAllFields() ));
            array_push($sound->wav_files,$wav);
        } 
        $sound->mp3_files = array();
        $s_m = new Sound_MP3_file;
        $s_m_ids = $s_m->findByAttribute('sound_id',$sound->GetId());

        foreach($s_m_ids as $s_m_id){
            $s_m = new Sound_MP3_file($s_m_id);
            $mp3 = new MP3_file($s_m->GetField('mp3_file_id'));

            $mp3->fields = $mp3->Clean( $mp3->CleanNumericKeys($mp3->GetAllFields()));
        //         $mp3->fields = $s_m_id;
            array_push($sound->mp3_files,$mp3);
        }

        $sound->keywords = array();
     
        $s_k = new Sound_Keyword;
        $order_hash = array();
        $order_hash['order_number'] = "ASC";
        $order_hash['keyword_id'] = "DESC";
        $s_k_ids = $s_k->findByAttributeMultiOrder('sound_id',$sound->GetId(),'order_number,keyword_id DESC');
        
        foreach(array_unique($s_k_ids) as $s_k_id){
            $s_k = new Sound_Keyword($s_k_id);
            $keyword = new Keyword($s_k->GetField('keyword_id'));

          $keyword->fields = $keyword->Clean($keyword->GetAllFields());
      //        $keyword->fields = array('id'=>'1','0'=>'1','keyword'=>'word','1'=>'word');
            
        
            array_push($sound->keywords,$keyword);
        }
        
        $row->sound = $sound;
        array_push($ret, $row);
	}
}
    // massage the rows after
    // search
    function extract_number($string)
    {
        preg_match_all('/([\d]+)/', $string, $match); 
        $ar = $match[0];
        return $ar[0];
    }

    foreach($ret as $row){
      $sound = $row->sound;
      $description = $row->description;
/* JBDEBUG 
    Some mp3 files report zero wave_length using the mp3 class.
    Not sure why.
    Subbing an N/A in this case
*/
      if($row->wave_length == "0"){
        $row->wave_length = "N/A";
      }
      $id = $row->id;
      $dt = strtotime($row->timestamp);
      $row->timestamp =  date('Y-m-d',$dt);
      if(@count($sound->wav_files)){
            $row->has_wav = '<img src="./images/12-em-check.png" />';
      } else {
            $row->has_wav = '';
      }
      if(@count($sound->mp3_files)){
            $row->has_mp3 = '<img id="'.$id.'" onload="mp3Click(this)" class="mp3_check" src="./images/12-em-check.png" />';
      } else {
            $row->has_mp3 = '';
      }
      $row->wave_byterate = extract_number($row->wave_byterate);
   /*
      $row->description = "<img onclick=\"return infoClick(this);\" class='sound_info' id=\"s_info_".$row->id."\"  src=\"./images/16-info.png\" />" . $description;
    */
    
    }
	$ret = array("page"=>$page,'n'=>$n, "total"=>$total, "data"=>$ret, 'stmt'=>$stmt, 'sorton'=>$sorton,'sortby'=>$sortby,'statement_number'=>$statement_number,'statement_handler'=>$statement_handler);

	echo json_encode($ret);

//	$sql = "SELECT COUNT(*) AS count FROM sounds";
# if (isset($_POST['search']) && isset($_POST['searchColumns'])) {
#     $search = mysql_real_escape_string($_POST['search']);
#     $columns = explode(',', $_POST['searchColumns']);
# }
    
//	mysql_free_result($result);
?>
