<?php
include("/data/32/1/102/102/1102754/user/1155640/cgi-bin/speechandhearing/configs/init.php");
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
    // we extract the page name from
    // its address and use that to get
    // the page id used to locate all
    // the dynamic content etc.
    // only works with one flat directory
    $count = count($sfarray);
    for($i = 0;$i < $count;$i++ ){
        if($sfarray[$i] == $webroot){
            $new = array_slice($sfarray,$i,$count-$i-1);
            $path = implode("/", $new);
            $filename = $sfarray[$count-1];
            $sql = "SELECT `id` FROM `pages` ";
            $sql .= "WHERE `filename` = '".$filename."' ";
       //     $sql .= "AND `path` = '".$path."'"
            $result = DataManager::DBQuery($sql);
            $row = $result->fetch_row();
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
            $db = new DB;
            $sql = "SELECT id FROM smarty_templates ";
            $sql .= "WHERE name= :tpl_name";
            $stmt = $db->prepare($sql);
            $stmt->BindValue(':tpl_name',$tpl_name);
            $stmt->execute();
            if($stmt->rowCount()){
                $row=$stmt->fetch(PDO::FETCH_BOTH);
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
            $db = new DB;
            $sql = "select id from smarty_templates where name=:tpl_name";
            $stmt = $db->prepare($sql);
            $stmt->BindValue('tpl_name',$tpl_name);
            $stmt->execute();
         //   $result = DataManager::DBQuery($sql);
            if ($stmt->rowCount()) {
                $row = $stmt->fetch(PDO::FETCH_BOTH);
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
    $pagevars = array('master','wrapper_1','pre_alpha','alpha','post_alpha','pre_beta','beta','post_beta','pre_gamma','gamma','post_gamma','pre_delta','delta','post_delta','pre_epsilon','epsilon','post_epsilon','pre_zeta','zeta','post_zeta');
    foreach($pagevars as $pagevar){
        $$pagevar = null;
    }
    $smarty->assign('myclass',null);
    $smarty->assign('classname',null);
    $php_includes = getPageObjects($Page->GetID(),'Page_PHP_include','id',$smarty);
    $smarty->assign('php_includes',$php_includes);
    foreach($php_includes as $php_include){
        
        $code = $php_include->GetField('code');
        if(strlen($code) > 0){
            eval($code);
        } else {
           if(strlen($php_include->GetField('filename'))>0 ){ include_once($php_include->GetField('path').$php_include->GetField('filename')  );
            }
        }
    }
    
    
    $classes = getClasses();
    $smarty->assign('classes',$classes);
    $smarty->assign('javascript_files',getPageObjects($Page->GetID(),'Page_Javascript_file','javascript_file_id' ));
    $smarty->assign('metatags',getPageObjects($Page->GetID(),'Page_Metatag','id' ));

    $smarty->assign('css_files',getPageObjects($Page->GetID(),'Page_Css_file','id' ));
    $smarty->assign('page_title',$Page->GetField('show_as'));
/*
    $smarty->assign("master_templates",getAssociatedObjects ($Page->GetID(),'Page_Master_template'));
    $master_templates = getAssociatedObjects ($Page->GetID(),'Page_Master_template');
    if(count($master_templates) > 0){
        $master_template = $master_templates[0];
    }
*/
    $master_template = getMasterTemplate($Page);
// Before Assigning Textblocks in templates
// assign templates that don't have textblocks associated
// ei: no textblock_description attribute
    $db = new DB;
    $sql = "SELECT * FROM pages_smarty_templates";
    $sql .= " WHERE ISNULL(textblock_description)";
    $sql .= " AND page_id = :page_id";
    $stmt = $db->prepare($sql);
    $stmt->BindValue(":page_id",$Page->GetId(),PDO::PARAM_INT);
    $stmt->execute();
  //  $result = DataManager::DBQuery($sql);
    while($row = $stmt->fetch(PDO::FETCH_BOTH)){
        $pst = new Page_Smarty_template($row['id']);
        
        $st = new Smarty_template($pst->GetField('smarty_template_id'));
        $pagevar_string = $pst->GetField('pagevar');
   //     $user_type = $pst->GetField('user_type');
        $filename = $st->GetField('name');
        $code = $st->GetField('code');
        $newlink=null;
        
        if($_SESSION['auth'] == crypt($_SESSION['username'],SESSION_AUTH_KEY)&&($_SESSION['user_type']=='developer')&&($pst->GetField('smarty_template_id')!='68')){
     
                $newlink = "<div class='auth'>template <a class='devlink'  href='editor.php?classname=smarty_template&id=".$pst->GetField('smarty_template_id')."'>";
                $newlink .= $pst->GetField('smarty_template_id');
                $newlink .= "</a></div>";
                
        }
        if(strlen($newlink)){
             $$pagevar_string .= $newlink;
        }
        if(strlen($code)){
            $fst = $smarty->fetch("db:".$st->GetField('name'));
        } else {
            $fst = $smarty->fetch($st->GetField('path').$st->GetField('name'));
        }
        $$pagevar_string .= $fst;
    }
/*
    $sql = "SELECT * FROM pages_smarty_templates";
    $sql .= " WHERE ISNULL(textblock_description)";
    $sql .= " AND page_id = '".$Page->GetId()."'";
    $result = DataManager::DBQuery($sql);
    while($row = $result->fetch_array(MYSQLI_BOTH)){
        $pst = new Page_Smarty_template($row['id']);
        
        $st = new Smarty_template($pst->GetField('smarty_template_id'));
        $pagevar_string = $pst->GetField('pagevar');
        $user_type = $pst->GetField('user_type');
        $filename = $st->GetField('name');
        $code = $st->GetField('code');
        $newlink=null;
        
        if($_SESSION['auth'] == crypt($_SESSION['username'],SESSION_AUTH_KEY)&&($_SESSION['user_type']=='developer')&&($pst->GetField('smarty_template_id')!='68')){
     
                $newlink = "<div class='auth'>template <a class='devlink'  href='editor.php?classname=smarty_template&id=".$pst->GetField('smarty_template_id')."'>";
                $newlink .= $pst->GetField('smarty_template_id');
                $newlink .= "</a></div>";
                
        }
        if(strlen($newlink)){
             $$pagevar_string .= $newlink;
        }
        if(strlen($code)){
            $fst = $smarty->fetch("db:".$st->GetField('name'));
        } else {
            $fst = $smarty->fetch($st->GetField('path').$st->GetField('name'));
        }
        $$pagevar_string .= $fst;
    }
*/

    // Sample procedure for assigning textblocks 
    // First create the variable name and assign the textblock objects
/*
    $page_banners = getTextblocksLike('page_banner');
    // Smarty assignments for variables used
    // in the textblocks_section.inc template
    $smarty->assign('section_name','page_banners');
    $smarty->assign('section_loop',$page_banners);
    // Smarty fetch command parses the template and variables
    // Parsed code assigned to the variable that
    // determines where this is to be used
    $alpha = $smarty->fetch('./inc/textblocks_section.inc');
*/
// translating that into a loop through the page vars.          
//    $textblock_contents = array();

   foreach($pagevars as $var){
        $sql =  "SELECT `smarty_templates`.`path` AS 'smarty_template_path', ";
        $sql .= " `smarty_templates`.`name` AS 'smarty_template_filename', ";
        $sql .= " `smarty_templates`.`code` AS 'code', ";
        $sql .= " `smarty_templates`.`id` AS 'smarty_template_id', ";
        $sql .= " `textblocks`.`id` AS 'textblock_id', ";
        $sql .= " `textblocks`.`description` AS 'textblock_description', ";
        $sql .= " `textblocks`.`content` AS 'textblock_content' ";
        $sql .= "FROM pages, textblocks, smarty_templates, ";
        $sql .= "pages_smarty_templates";
        $sql .= " WHERE pages_smarty_templates.page_id = '".$Page->GetId()."'";
        $sql .= " AND textblocks.description LIKE  CONCAT(pages_smarty_templates.textblock_description,'%') ";
        $sql .= " AND smarty_templates.id = pages_smarty_templates.smarty_template_id";
        $sql .= " AND pages_smarty_templates.pagevar  = '$var'";
        $sql .= " AND `pages_smarty_templates`.`page_id` = `pages`.`id`";
        $sql .= " ORDER BY `textblocks`.`description`";
        $result = DataManager::DBQuery($sql);
        $textblocks_like = array();
        $textblocks_contents = array();
        $it_paths = array();
        $it_filenames = array();
        $it_ids = array();
        if(is_object($result)){

            while($row = $result->fetch_array(MYSQLI_ASSOC) ){
                 $textblocks_like[$row['textblock_id']]=$row['textblock_description'];
                 $textblocks_contents[$row['textblock_id']] = $row['textblock_content'];
         //        $it_paths[$row['textblock_id']]= $row['smarty_template_path'];
                if(isset($row['code']) && strlen($row['code'])){
                   //  $it_filenames[$row['textblock_id']]= "db:";
                   $it_paths[$row['textblock_id']]= "";
                     $it_filenames[$row['textblock_id']] = "db:". $row['smarty_template_filename'];
                    $it_ids[$row['textblock_id']] = $row['smarty_template_id'];
                    
                } else {
                    $it_paths[$row['textblock_id']]= $row['smarty_template_path'];
                    $it_filenames[$row['textblock_id']]=$row['smarty_template_filename'];
                    $it_ids[$row['textblock_id']] = $row['smarty_template_id'];
                }
            }

        }
        $incrementer = 1;
        foreach( array_unique($textblocks_like) as $key=>$value){
            $section_textblocks = getTextblocksLike($textblocks_like[$key],$smarty);
            $smarty->assign('section_name', 'section_'.$var.'_'.$incrementer  );
            $smarty->assign('section_loop',$section_textblocks);
      
            if($_SESSION['auth'] == crypt($_SESSION['username'],SESSION_AUTH_KEY)&&$_SESSION['user_type']=='developer'){
     
                $newlink = "template <a class='devlink' href='editor.php?classname=smarty_template&id=".$it_ids[$key]."'>";
                $newlink .= $it_ids[$key];
                $newlink .= "</a>";
                $$var .= $newlink;
            }
            $$var .= $smarty->fetch($it_paths[$key].$it_filenames[$key]);
     
            $textblock_content[$var] = $section_textblocks;
            $incrementer++;
        }
        

    }; // end of the foreach($pagevars as $var) loop
    if(! $smarty->template_exists('db:head.inc')){
        $head = $smarty->fetch('./inc/head.inc');
    } else {
        $head = $smarty->fetch('db:head.inc');
    }
    if(! $smarty->template_exists('db:head_extra.inc')){
        
    } else {
        $head .= $smarty->fetch('db:head_extra.inc');
    }
    $smarty->assign('head',$head);
    $smarty->assign('page',$Page->GetAllFields());
    for($i = 0; $i < count($pagevars); $i++){
      //  if(isset($$pagevars[$i])){
            $smarty->assign($pagevars[$i],$$pagevars[$i]);
      //  }
    }
//    $smarty->assign($_SESSION);
    if(isset($master_template)){
      
    // disable debugging if blank.tpl is
    // the master template
        if($master_template->getField('name') == "blank.tpl"){
            $smarty->debugging=false;
        }
        $smarty->assign('session_vars',$_SESSION);
      //  $smarty->debugging=true;
        $hascode = false;
        $master_template_id = $master_template->GetID();
        $smarty->assign('master_template_id',$master_template_id);
        if( strlen($master_template->GetField('code'))){
            $hascode = true;
        }
        
        if($hascode){
           
            $master_template_name = "db:";
            $master_template_name .=  $master_template->GetField('path');
            $master_template_name .= $master_template->GetField('name');
            $smarty->display($master_template_name);
        } else {
 $smarty->display($master_template->GetField('path').$master_template->GetField('name'));
        }
    }
//        $smarty->display('var_content1.tpl');
// functions etc
/////////////////////////////////////////////////////////////////////
/*
    class assosiations have classes like 'Page_Javascript_file',
    have a first attribute id, a second in this case is always
    the page_id, the third is the id of the class associated,
    and below, field classname2.
    
    Below that we check for a class associating classname2 with
    an authorization level on this page. For javascript files,
    this would be Javascript_file_User_auth, others in the same
    form. The javascript files create interface objects that should
    only be exposed to users authorized to use them and many unused
    lines of code will not be sent.
*/

function getPageObjects($pageID,$assoc_classname,$orderby){
    $c = new $assoc_classname;
    $sql = "SELECT * FROM $c->table_name WHERE page_id = '$pageID' ORDER BY $orderby";
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
                if(isset($row['user_type']) && strlen($row['user_type'])){
                   if($row['user_type'] == $_SESSION['user_type']){
                        array_push($ret,$returnitem);
                    }
                } else {
                    array_push($ret,$returnitem);
                }
            }
        }
     //   $c->fields = $c->GetAllFields();
        
    }
    return $ret;
    
}
function getTextblocksLike($description){
    $str = "%";
    $description = str_replace('_','\_',$description);
    $description = $str . $description . $str;
    $sql = "SELECT id FROM `textblocks` WHERE description LIKE '".$description."';";
 //   $sql .= " ORDERBY description";
    $result = DataManager::DBQuery($sql);
    $textblocks = array();
    // transform the textblock by substituting links
    // and included textblocks as assigned by
    // Textblock_Included_template and Textblock_Link
    
    while($row = $result->fetch_array(MYSQLI_ASSOC)){
      //  $transformed = new Textblock();
        $transformed_textblock = new Textblock($row['id']);
        $transformed_textblock->fields = $transformed_textblock->GetAllFields();
    //    $ttemp->fields = $ttemp->GetAllFields();

// Get the links that are associated with the textblcok
// Get the images associated with the textblock
        $transformed_content = $transformed_textblock->GetField('content');
        $sql2 = "SELECT `textblocks_links`.`id` as link_id";
        $sql2 .= " FROM textblocks_links";
        $sql2 .= " WHERE `textblocks_links`.`textblock_id` = '";
        $sql2 .=    $transformed_textblock->GetId();
        $sql2 .=  "'";
        $innerresult = DataManager::DBQuery($sql2);
        if($innerresult->num_rows){
           $textblock_links = array();
           $textblock_included_templates = array();
            while($innerrow = $innerresult->fetch_array(MYSQLI_BOTH)){
                if(isset($innerrow['link_id'])){
                    $textblock_link = new Textblock_Link($innerrow['link_id']);
                    $textblock_link->fields = $textblock_link->GetAllFields();
                    if(isset($textblock_link->fields['id'])){
                        $textblock_links[$textblock_link->fields['id']] = $textblock_link;
                    }
                }
            }
            foreach($textblock_links as $key=>$textblock_link){
                $link = new Link($textblock_link->GetField('link_id'));
                $show_as = $link->GetField('show_as');
                $highlight_string = $textblock_link->GetField('highlight_string');
           //     str_replace($replace_string,$link->GetField('href'),$transformed_content);
                $newlink= "";
                if ($_SESSION['auth'] == crypt($_SESSION['username'],SESSION_AUTH_KEY)){
                    $newlink .= "link <a href='editor.php?classname=link&id=".$link->GetID()."'>";
                    $newlink .= $link->GetID();
                    $newlink .= "</a> ";
                }
                $newlink .= "<a href='".$link->GetField('href')."'>";
                $newlink .= $show_as;
                $newlink .= "</a>";
                $transformed_content = str_replace($highlight_string,$newlink,$transformed_content);
            //    $transformed_textblock->SetField('content',$transformed_content);
                
                
            }
        }
        $transformed_content = insertTextblockImages($transformed_textblock,$transformed_content);
        $transformed_textblock->fields['content'] ="<!-- dynamic textblock start -->" .$transformed_content . "<!-- dynamic textblock end -->";
        array_push($textblocks,$transformed_textblock);
    }
   
    return $textblocks;
}

function insertTextblockImages($textblock,$content){
    $str = "";
    $transformed_textblock = null;
    $sql = "SELECT `textblocks_images`.`id` as textblock_image_id FROM "; 
    $sql .= "`textblocks_images` WHERE `textblocks_images`.`textblock_id` = '";
    $sql .= $textblock->GetId()."'";
    $result = DataManager::DBQuery($sql);
    if($result->num_rows > 0){
        while($row = $result->fetch_array(MYSQLI_BOTH)){
            $textblock_image = new Textblock_Image($row['textblock_image_id']);
            $image = new Image($textblock_image->GetField('image_id'));
            $replace_string = $textblock_image->GetField('replace_string');
            $href = $image->GetField('path').$image->GetField('filename');
            $str .= "<img src='";
          //  $str .= $href;
      //      $str .= "images/protosaur_banner.gif";
            $str .= "'/>";
            $content = str_replace($replace_string,$str,$content);
        }
    }

    return $content;
}
function getLinksLike($description){
    $description = str_replace('_','\_',$description);
    $sql = "SELECT id FROM `textblocks` WHERE description LIKE '".$description."%';";
    $result = DataManager::DBQuery($sql);
    $textblocks = array();
    while($row = $result->fetch_array(MYSQLI_BOTH)){
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
                $classes[$value]= plural($value);
           }
        }
    }
    array_multisort($classes,SORT_STRING);
    return $classes;
}

function plural($str){
    $ret = "";
    $ar = str_split($str);
    $k = @count($ar)-1;
    if($ar[$k] == "s"){
        $ret = $str . "es";
    } else {
        $ret = $str . "s";
    }
    return $ret;
}

function getAll($ob,$orderby){
    $items = array();
    $temp = new $ob;
    $table_name = $temp->table_name;
    $sql = "SELECT id FROM $table_name WHERE 1 ";
    if(isset($orderby)){
        $sql .= "ORDER BY ".$orderby;
    }
    $result = DataManager::DBQuery($sql);
     while($row = $result->fetch_array(MYSQLI_BOTH)){
        $ttemp = new $ob($row['id']);
         $ttemp->fields = $ttemp->GetAllFields();
        array_push($items,$ttemp);
     }
    return $items;
}

function getMasterTemplate($page){
    $sql = "SELECT id FROM pages_smarty_templates WHERE page_id = '".$page->GetId();
    $sql .= "' AND pagevar = 'master' LIMIT 1";
    $result = DataManager::DBQuery($sql);
    $row = $result->fetch_array(MYSQLI_ASSOC);
    $pst = new Page_Smarty_template($row['id']);
    $template_id = $pst->GetField("smarty_template_id");
    $template = new Smarty_template($template_id);
    if($result->num_rows){
        return $template;
    } else {
        return null;
    }
}
?>
