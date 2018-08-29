<?php
    include("miniinit.php");
        if(!( $_SESSION[user_type] == "developer" || $_SESSION[user_type] == "administrator" )){
        header("Location:index.php");
    }
    $allclasses = get_declared_classes();
    $classes = array();
    $positions = array();
    foreach($allclasses AS $key=>$value){
        if(is_subclass_of($value,'GenericObject')){
            $classes[$value]=$value;
        }
    }
    if(isset($_GET['classname'])){
        $classname = $_GET['classname'];
        $myclass = new $classname;
        $myclass->fields = $myclass->GetFieldsUnloaded();
        foreach($myclass->fields as $key=>$value){
            $positions["After ".$value['Field']] = "After ".$value['Field'];
        }
    } else {
        $classname = '';
    }
    $attribute_types = array();
    
    $attribute_types[0]='----';
    $attribute_types['int']='int';
    $attribute_types['varchar']='varchar';
    $attribute_types['timestamp']='timestamp';
    $attribute_types['datetime']='datetime';
    $attribute_types['text']='text';
    $attribute_types['longtext']='longtext';
    $attribute_types['float']='float';
    

    $smarty = new Generic_Smarty;
    $smarty->assign('attribute_types',$attribute_types);
    $smarty->assign('classes',$classes);
    $smarty->assign('positions',$positions);
        $smarty->assign('page_title',"CLASSES");
    if(isset($classname)){
        $smarty->assign('classname',$classname);
    }
    if(isset($myclass)){
        $smarty->assign('myclass',$myclass);
    }
    $smarty->display('classmaker.tpl');
?>