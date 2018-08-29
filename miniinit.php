<?php
include("/data/23/1/102/102/1102754/user/1155640/cgi-bin/speechandhearing/configs/init.php");

// functions etc
/////////////////////////////////////////////////////////////////////


function getAssociatedObjects($pageID,$assoc_classname){
    $c = new $assoc_classname;
    $sql = "SELECT * FROM $c->table_name WHERE page_id = '$pageID'";
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
                    $newlink .= "<a href='editor.php?classname=link&id=".$link->GetID()."'>";
                    $newlink .= $link->GetID();
                    $newlink .= "</a>";
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
            $str .= "images/protosaur_banner.gif";
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
    return $template;
}
?>

