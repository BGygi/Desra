<?php
    include("init.php");

    /* example code sql

DROP TABLE IF EXISTS `jbeller_lolasfinefooddevelopment`.`textblocks` ;

CREATE TABLE `jbeller_lolasfinefooddevelopment`.`textblocks` (
`id` int( 16 ) NOT NULL AUTO_INCREMENT ,
`author` varchar( 30 ) NOT NULL default '',
`citation` varchar( 30 ) NOT NULL default '',
`header` varchar( 60 ) NOT NULL default '',
`content` longtext NOT NULL ,
`timestamp` timestamp NOT NULL default CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP ,
`description` varchar( 30 ) NOT NULL default '',
PRIMARY KEY ( `id` )
) ENGINE = MYISAM DEFAULT CHARSET = latin1;

INSERT INTO `jbeller_lolasfinefooddevelopment`.`textblocks`
SELECT * FROM `jbeller_lolasfinefoodstaging`.`textblocks` ;

    
    */
    
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
     //         echo $sql;
        
      //        echo "<br>-------<br>";
        
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
                $myinstance->SetField($key,stripslashes($value));
                
            }
        }
        $myinstance->Save();
    }
    
    if(isset($_POST['update']) && isset($_POST['id'])){
    $class_name = $_POST['update'];
     //   $vals = explode("_",$class_itemid);
        $myinstance = new $class_name($_POST['id']);
        foreach($_POST AS $key=>$value){
            if($key == 'id' || $key == 'update'){
            
            } else {
                $myinstance->SetField($key,trim(stripslashes($value)));
                
            }
        }
        $myinstance->Save();
    }

    // get a list
    if(isset($_GET['classname'])){
        $classname = $_GET['classname'];
        $c = new $classname;
        $c->fields = $c->GetFieldsUnloaded();
        $c->classname = $classname;
        $sql = "SELECT `id` FROM ".$c->table_name;

        $result = DataManager::dbQuery($sql);

        $items = array();

        while($row = $result->fetch_assoc()){
            $item = new $classname($row['id']);
            $item->fields = $item->GetAllFields();
            $item->id = $item->GetId();
            array_push($items,$item);
        }
    }
    
    if(isset($_GET['id'])){
        $id = $_GET['id'];
        $myitem = new $classname($id);
        $myitem->fields = $myitem->GetAllFields();
    } else {
        $myitem = '';
    }
    $smarty = new Generic_Smarty;
    $head = $smarty->fetch('./inc/head.inc');
   
//    $smarty->assign( $_SESSION );
//    $smarty->assign('welcome_messages',getWelcomeMessages());
//    $smarty->assign('stores',getStores());
    $smarty->assign('classes',getClasses());
    $smarty->assign('copyrights',getTextblocksLike('copyright'));
    $smarty->assign('myclass',$c);
    $smarty->assign('myitem',$myitem);
    $smarty->assign('items',$items);
    $delta =  $smarty->fetch('./inc/left_menu.inc');
    $delta .=  $smarty->fetch('./inc/edit_form.inc');
    $delta .=  $smarty->fetch('./inc/admin_form.inc');
    $gamma =  $smarty->fetch('./inc/edit_list.inc');
    $zeta = $smarty->fetch('./inc/copyright.inc');
    $smarty->assign('result',$result);
    if(isset($classes)){
        $smarty->assign('classes',$classes);
    }
    $smarty->assign('head',$head);
    if(isset($alpha)){
        $smarty->assign('alpha',$alpha);
    }
    $smarty->assign('delta',$delta);
    $smarty->assign('gamma',$gamma);
    $smarty->assign('zeta',$zeta);
    if(isset($table)){
        $smarty->assign('table',$table);
    }
    $smarty->display('var_content.tpl');
// functions etc

function getTextblocksLike($description){
    $description = str_replace('_','\_',$description);
    $sql = "SELECT id FROM `textblocks` WHERE description LIKE '".$description."%';";
    $result = DataManager::DBQuery($sql);
    $textblocks = array();
    while($row = $result->fetch_array(MYSQL_BOTH)){
        $ttemp = new Textblock($row['id']);
        $ttemp->fields = $ttemp->GetAllFields();
        array_push($textblocks,$ttemp);
    }
    return $textblocks;
}


function getClasses(){
    $allclasses = get_declared_classes();
    $classes = array();
    foreach($allclasses AS $key=>$value){
        if(is_subclass_of($value,'GenericObject')){
            if ( $value != 'Classmaker'){
                $classes[$value]= new $value;
            }
        }
    }
    return $classes;
}
?>