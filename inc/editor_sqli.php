<?php
if (get_magic_quotes_gpc()) {
    function stripslashes_deep($value)
    {
        $value = is_array($value) ?
                    array_map('stripslashes_deep', $value) :
                    stripslashes($value);

        return $value;
    }

    $_POST = array_map('stripslashes_deep', $_POST);
    $_GET = array_map('stripslashes_deep', $_GET);
    $_COOKIE = array_map('stripslashes_deep', $_COOKIE);
    $_REQUEST = array_map('stripslashes_deep', $_REQUEST);
}
   // synchronizing the databases
    // default we are in production
if(isset($_POST['synchronize'])){
    if($_POST['synchronize'] == 'Synchronize'){
        // get the tablename
        $ob = new $_POST['classname'];
        $table_name = $ob->table_name;
        $sql = "DESCRIBE `$table_name`";
        $result = DataManager::DBQuery($sql);
        $table = array();
        while($row = $result->fetch_assoc()){
            array_push($table,$row);
        }
        $synch_to = "staging";
        if( SITE_VERSION == 'staging' ){
            $synch_to = SITE_DATABASE_PREFIX.SITE_DIRECTORY_NAME.SITE_DATABASE_VERSION_SEPARATOR."production";
            $synch_from = SITE_DATABASE_PREFIX.SITE_DIRECTORY_NAME.SITE_DATABASE_VERSION_SEPARATOR."staging";
        }
        if( SITE_VERSION == 'production' ){
            $synch_to = SITE_DATABASE_PREFIX.SITE_DIRECTORY_NAME.SITE_DATABASE_VERSION_SEPARATOR."staging";
            $synch_from = SITE_DATABASE_PREFIX.SITE_DIRECTORY_NAME.SITE_DATABASE_VERSION_SEPARATOR."production";
        }
        if( SITE_VERSION == 'development' ){
            $synch_to = SITE_DATABASE_PREFIX.SITE_DIRECTORY_NAME.SITE_DATABASE_VERSION_SEPARATOR."staging";
            $synch_from = SITE_DATABASE_PREFIX.SITE_DIRECTORY_NAME.SITE_DATABASE_VERSION_SEPARATOR."development";
        }
        $sql = "DROP TABLE IF EXISTS `$synch_to`.`$table_name`";
         //     echo $sql;
        
          //    echo "<br>-------<br>";
        
    $result= DataManager::DBQuery($sql);
        $sql = "CREATE TABLE IF NOT EXISTS `$synch_to`.`$table_name` ";
        $primary_key = "PRIMARY KEY ( `";
        $sql .= "(";
        foreach($table as $row){
            foreach($row as $key=>$value){
                $fieldname = $row['Field'];
                $type = $row['Type'];
                switch($key){
                    case 'Field':
                    case 'Type':
                    case 'Collation':
                    case 'Extra':
                    case 'Attributes':
                        $sql .= $value;
                        $sql .= " ";
                    break;
                    case 'Key':
                        if ($value == "PRI"){
                            $primary_key .= $fieldname;
                            $primary_key .= "` )";
                        }
                    break;
                    case 'Null':
                    if ($value = 'No'){
                      $sql .= "NOT NULL";
                    } else {
                        $sql .= "NULL";
                    }
                    break;
                    case 'Default':
        
                    if (!strlen($value)){
                        if( count_chars( strstr(  $type, 'int'))){
        
                        } else {
                            $sql .= " DEFAULT ";
                            $sql .= "''";
                        }
                    } else {
                        $sql .= " DEFAULT ";
                        $sql .= $value;
                    }
                    break;
                }
                $sql .= " ";
            }
            $sql .= ",";
        }
        
        $sql .= $primary_key;
        $sql .= ") ";
        $sql .= "ENGINE = MYISAM DEFAULT CHARSET = latin1;";

        $result= DataManager::DBQuery($sql);
        $sql = "INSERT INTO `".$synch_to."`.`".$table_name."`
    SELECT * FROM `".$synch_from."`.`".$table_name."` ;";
       $result= DataManager::DBQuery($sql);
      //   echo $sql;
    }
}


// textblock editing
    if(isset($_GET['destroy'])){
        $temp = new $_GET['classname']($_GET['id']);
        $temp->destroy();
    }
    if(isset($_POST['insert'])){
    
        $classname = $_POST['insert'];
        $myinstance = new $classname;
     // save from the post
        foreach($_POST AS $key=>$value){
            if($key == 'id' || $key == 'insert'){
            
            } else {
                $myinstance->SetField($key,trim($value));
                
            }
        }
         $myinstance->Save();
    }

    if(isset($_POST['update']) && isset($_POST['id']) && (!isset($_POST['clone']) )){
    $class_name = $_POST['update'];
     //   $vals = explode("_",$class_itemid);
        $myinstance = new $class_name($_POST['id']);
        foreach($_POST AS $key=>$value){
            if($key == 'id' || $key == 'update'){
            
            } else {
                if(isset($value)){
                   $text_flag = false;
                   $s = new sqli();
                   // escape code with the real escape string;
                   $stmt = "DESCRIBE $myinstance->table_name";
                   $s->query($stmt);
                   $hash = $s->get_table_hash();
                   foreach($hash as $row){
                        if(($row['Type'] == "text")&&($row['Field']==$key))
                        $text_flag = true;
                   }
                   if($text_flag == true){
                        $value = $s->real_escape_string($value);
                   }
                   $myinstance->SetField($key,trim($value));
                }

            }
        }
        $myinstance->Save();
    }
    if(isset($_POST['clone'])){
        // make a new instance with the original's attributes
        $classname1 = $_POST['update'];
        $original = new $classname1($_POST['id']);
        $fields = $original->GetAllFields();
        $clone = new $classname1;
        foreach($fields as $key=>$value){
            if(!is_numeric($key) ){
               if($key != 'id'){
                    $clone->SetField($key,$value);;
                }
            }
        }
        $clone->Save();
     //   echo $clone->GetID();
        // determine associated classes
        $cloned_objects = cloneAssociations($original,$clone);
        // foreach associated class, create a new instance
        // with the clone's id for classname1 and the originals 
        // values for classname2 and any other values;
      /*
        foreach($association_classes as $association_class){
            copyToTable($association_class,$original->GetID(),$clone->GetId());
        }
       */
    }
    // get a list
    if(isset($_GET['classname'])){
        $classname = $_GET['classname'];
        $c = new $classname;
        $c->fields = $c->GetFieldsUnloaded();
        $c->classname = $classname;
        $sql = "SELECT `id` FROM ".$c->table_name ." ORDER BY `id` DESC";
        
        
        $result = DataManager::dbQuery($sql);

        $items = array();

        while($row = $result->fetch_assoc()){
            $item = new $classname($row['id']);
            $item->fields = $item->GetAllFields();
            $item->id = $item->GetId();
            array_push($items,$item);
        }
        $smarty->assign('myclass',$c);

        if(isset($_GET['id'])){
            $id = $_GET['id'];
            $myitem = new $classname($id);
            $myitem->fields = $myitem->GetAllFields();
        } else {
            $myitem = '';
        }
        $smarty->assign('myitem',$myitem);
        $smarty->assign('items',$items);
    
    }

    $smarty->assign('lt_string','&lt;');
    $smarty->assign('gt_string','&gt;');
// functions    
    function getAssociatedClasses($original){
        $classname1 = get_class($original);
        $sql = "SELECT * FROM class_associations WHERE ";
        $sql .= " classname1 = '".$classname1."'";
        $result= DataManager::DBQuery($sql);
        $classes = array();
        if($result->num_rows > 0){
            
            while($row = $result->fetch_array(MYSQLI_ASSOC)){
                $association_classname = ucfirst($classname1);
                $association_classname .= "_";
                $association_classname .= ucfirst($row['classname2']);
                
                $ac = new $association_classname;
                
                array_push($classes,$ac);
            }
            
        }
        return $classes;
    }
    /*
        function cloneAssociations($original,$clone){
        $associated_classes = getAssociatedClasses($original);
        $inners = array();
        foreach($associated_classes as $associated_class){
            $table = $associated_class->table_name;
            $fields = $associated_class->GetFieldsUnloaded();
            $lim = count($fields);
            
            for($i =1; $i < $lim; $i++){
                $sql = "SELECT ".$fields[$i][0]." FROM $table";
                $sql .= " WHERE ".$fields[1][0]." = ";
                $sql .= $original->GetID();
                $result = DataManager::DBQuery($sql);
                if($result->num_rows > 0){
                    while($row = $result->fetch_assoc()){
                        $inners[$fields[$i][0]]= $row;
                    }
                }
            }

            
        }
        $incrementer = 0;
        $sql = "INSERT INTO $table (";
        foreach($inners as $key=>$value){
            $sql .= $key.",";
        }
        // chop last comma
        $sql = substr($sql,0,strlen($sql)-1);
        $sql .= ") VALUES (";
        foreach($inners as $key=>$value){
            $sql .= "'".$value[$key]."',";
        }
        $sql = substr($sql,0,strlen($sql)-1);
        $sql .= ")";
        echo $sql;
        echo "<br>";
    }
    
    */
    
    function cloneAssociations($original,$clone){
        $associated_classes = getAssociatedClasses($original);
        foreach($associated_classes as $associated_class){
            cloneAssociation($associated_class,$original,$clone);
        }
    }
    
    function cloneAssociation($association_class,$original,$clone){
        $return = array();
        $table=$association_class->table_name;
        $attribute = strtolower(get_class($original));
        $attribute .= "_id";
        $ids = $association_class->findByAttribute($attribute,$original->GetID());
        foreach($ids as $id){

            $ac = new $association_class($id);
            $fields = $ac->GetAllFields();
            $lim = count($fields);
            $nc = new $association_class;
            
            $class_assoc = new Class_Association;
            $sql = "SELECT * FROM class_associations WHERE table_name = '";
            $sql .= $association_class->table_name."'";
            $result = DataManager::DBQuery($sql);
            if($result->num_rows == 1){
                $row = $result->fetch_array(MYSQLI_BOTH);
            }
            $classname2 = $row['classname2'];
            $classname1 = $row['classname1'];
            
            foreach($fields as $key=>$value){
                if(! is_numeric($key)){
                    if($key == 'id'){

                    } else {
                        if($key == strtolower($classname1)."_id"){

                            $nc->SetField($key,$clone->GetID());
                        } else {
                            if( isset($key) && isset($value)){

                                $nc->SetField($key,$value);
                            }
                        }
                    }
                }
            /*
                echo "<br> ".strtolower($classname2)."_id <br>";
                echo $clone->GetId();
                
                echo "<br>key = ";
                echo $key;
                echo "<br>value = ";
                echo $value;
            */
            }
          //   print_r($nc);
            $nc->Save();
        }
        
    }
?>
