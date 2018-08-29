<?php
include("/data/23/1/102/102/1102754/user/1155640/cgi-bin/speechandhearing/configs/init.php");
     // assign the page based
    // on the url found in server var SCRIPT_FILENAME
    $script_filename = $_SERVER["SCRIPT_FILENAME"];
    $sfarray = explode("/",$script_filename);
 // NOTE: THIS MUST LOCATE THE WWW ROOT DIRECTORY
 // IF NOT WWW OR HTDOCS FOLDER NAME MUST BE ADDED
    if(in_array('www',$sfarray)){
        $webroot = 'www';
    }
    if(in_array('htdocs',$sfarray)){
        $webroot = 'htdocs';
    }
    
    $count = count($sfarray);
    for($i = 0;$i < $count;$i++ ){
        if($sfarray[$i] == $webroot){
            $new = array_slice($sfarray,$i,$count-$i-1);
            $path = implode("/", $new);
            $filename = $sfarray[$count-1];
            $sql = "SELECT `id` FROM `pages` ";
            $sql .= "WHERE `filename` = :filename ";
       //     $sql .= "AND `path` = '".$path."'"
            $db = new DB;
            $stmt = $db->prepare($sql);
            $stmt->BindValue(':filename',$filename);
            $stmt->execute();
            $row = $stmt->fetch();
            $Page = new Page($row[0]);
        }
    }
    $smarty = new Generic_Smarty;
// put these function somewhere in your application
// note - taken from Smarty.org docs
// JBDebug - move this to the init file in /configs
    function db_get_template ($tpl_name, &$tpl_source, &$smarty_obj){
            // do database call here to fetch your template,
            // populating $tpl_source
            
            $result = DataManager::DBQuery("select id
                           from smarty_templates
                          where name='$tpl_name'");
            if ($result->num_rows) {
                $row = $result->fetch_array(MYSQLI_BOTH);
                $t = new Smarty_template($row['id']);
                
                $tpl_source = $t->GetField('code');
                return true;
            } else {
                return false;
            }
        }
        
        function db_get_timestamp($tpl_name, &$tpl_timestamp, &$smarty_obj)
        {
            // do database call here to populate $tpl_timestamp.
            
            
            $sql = "select id from smarty_templates where name='$tpl_name'";
            $result = DataManager::DBQuery($sql);
            if ($result->num_rows) {
                $row = $result->fetch_array(MYSQLI_BOTH);
                $t = new Smarty_template($row['id']);
                $tpl_timestamp = $t->GetField('tpl_timestamp');
                
                return true;
            } else {
                return false;
            }
        }
        
        function db_get_secure($tpl_name, &$smarty_obj)
        {
            // assume all templates are secure
            return true;
        }
        
        function db_get_trusted($tpl_name, &$smarty_obj)
        {
            // not used for templates
        }
        
        // register the resource name "db"
        $smarty->register_resource("db", array("db_get_template",
                                               "db_get_timestamp",
                                               "db_get_secure",
                                               "db_get_trusted"));
/*
    

*/
    
    $php_includes = getPageObjects($Page->GetID(),'Page_PHP_include');

    foreach($php_includes as $php_include){
        
        $code = $php_include->GetField('code');
        if(strlen($code) > 0){
            eval($code);
        } else {
           if(strlen($php_include->GetField('filename'))>0 ){ include_once($php_include->GetField('path').$php_include->GetField('filename')  );
            }
        }
    }

//        $smarty->display('var_content1.tpl');
// functions etc
/////////////////////////////////////////////////////////////////////


function getPageObjects($pageID,$assoc_classname){
    $c = new $assoc_classname;
    $sql = "SELECT * FROM $c->table_name WHERE page_id = '$pageID' ORDER BY id";
    $result = DataManager::DBQuery($sql);
    $ret = array();
    while($row = $result->fetch_array(MYSQLI_BOTH)){
        $c = new $assoc_classname($row['id']);
        $innersql = "SELECT id FROM class_associations ";
        $innersql .= "WHERE table_name = '".$c->table_name."' LIMIT 1";
        $innerresult = DataManager::DBQuery($innersql);
        $innerrow = $innerresult->fetch_array(MYSQL_BOTH);
        $ca = new Class_association($innerrow['id']);
        if ($ca->GetField('classname1') == "Page"){
            $classname2 = $ca->GetField('classname2');
            $returnitem = new $classname2($row[2]); // the third item should be the associated class id
            $returnitem->fields = $returnitem->GetAllFields();
            if(is_object($returnitem)){
                array_push($ret,$returnitem);
            }
        }
     //   $c->fields = $c->GetAllFields();
        
    }
    return $ret;
    
}

?>
