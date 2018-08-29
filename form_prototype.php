<?php
    include("init.php");
        if(!( $_SESSION[user_type] == "developer" || $_SESSION[user_type] == "administrator" )){
        header("Location:index.php");
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
    
    if(isset($_POST['update'])){
        $class_itemid = $_POST['update'];
        $vals = explode("_",$class_itemid);
        $myinstance = new $vals[0]($vals[1]);
        foreach($_POST AS $key=>$value){
            if($key == 'id' || $key == 'update'){
            
            } else {
                $myinstance->SetField($key,trim(stripslashes($value)));
                
            }
        }
        $myinstance->Save();
    }
    // get a list of the class
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
        $myitem='';
    }
    $smarty = new Generic_Smarty;
    $smarty->assign('pagename','Form Prototyper - '.$classname);
    if (isset($c)){ 
        $smarty->assign('myclass',$c);
    }
    if (isset($items)){ 
        $smarty->assign('items',$items);
    }
    if (isset($myitem)){ 
        $smarty->assign('myitem',$myitem);
    }

    $smarty->debugging=true;
    $smarty->display('form_prototype.tpl');
?>
