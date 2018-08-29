<?php
    include("php_handler_init.php");
    function clean_staging(){
        $sql = "TRUNCATE `pages`;
                TRUNCATE`pages_javascript_files`;
                TRUNCATE `pages_css_files`;
                TRUNCATE `css_files`;
                TRUNCATE `javascript_files`;
                TRUNCATE `smarty_templates`;
                TRUNCATE `pages_smarty_templates`;
                TRUNCATE `pages_metatags`;
                TRUNCATE `textblocks`;
                TRUNCATE `textblocks_links`;
                TRUNCATE `links`;";
        $db = new DB;
        $stmt = $db->prepare($sql);
        $stmt->execute();

        
        $dir = "./";
       return scandir($dir);
        
    }

?>
<form method="post" action="clean_staging.php">
    <input type="hidden" value="1" name="clean_staging" />
    <input type="submit" value="submit" />
</form>
<?php
    if($_POST['clean_staging']=="1"){
            $protected = array('classes.php','init.php','edit.php','form_prototype.php','php_handler_init.php','miniinit.php','handle_classmaker.php','clean_staging.php');
        $deleted = array();
        $fils = clean_staging();
        foreach($fils as $fil){
           if(! in_array($fil,$protected) && is_file($fil)){
                array_push($deleted,$fil);
                unlink($fil);
           }
        }
        $new_fileloc = SITE_ROOT.SITE_DIRECTORY_NAME."/"."staging"."/templates/";
        foreach(scandir($new_fileloc) as $fil){
                if($smarty->template_exists($new_fileloc.$fil)){
                    array_push($deleted,$new_fileloc.$fil);
                    unlink($new_fileloc.$fil);
                }
        }
        $inc_fileloc = SITE_ROOT.SITE_DIRECTORY_NAME."/"."staging"."/templates/inc/";
        foreach(scandir($inc_fileloc) as $fil){
            if($smarty->template_exists($inc_fileloc.$fil)){
                array_push($deleted,$inc_fileloc.$fil);
                unlink($inc_fileloc.$fil);
            }
        }
    }
    echo "FILES DELETED";
    echo "<br />";
   $smarty->clear_compiled_tpl();
    print_r($deleted);
?>
