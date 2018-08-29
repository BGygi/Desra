<?php
if(isset($_GET['index']){

   $myclass = new $myclassname;
   $ids = $myclass->findByFirstChars($index); // like duh
    
    
    
    
    
    $smarty->assign('index',$_GET['index']);
    
    
    
}
?>
