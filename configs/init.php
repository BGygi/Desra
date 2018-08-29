<?php
define('SITE_DATABASE_PREFIX','');
define('SITE_DATABASE_ROOTNAME','sound_library');
define('SITE_DIRECTORY_NAME','');
define('SITE_CONFIG_NAME','ebire');
define('SITE_ROOT','/data/23/1/102/102/1102754/user/1155640/cgi-bin/speechandhearing/');
define('SITE_DATABASE_VERSION_SEPARATOR','_');
// this is a default if not reset below
$site_version = "production";
// get the current working directory
$cwd = strstr( getcwd(),'staging');

if($cwd == 'staging'){
    $site_version = 'staging';
}
$cwd = strstr( getcwd(),'development');
if($cwd == 'development'){
    $site_version = 'development';
    
}
// define the constant
define('SITE_VERSION',$site_version);
// concat the database name
define("SITE_DATABASE_NAME",SITE_DATABASE_PREFIX.SITE_DATABASE_ROOTNAME.SITE_DATABASE_VERSION_SEPARATOR.SITE_VERSION);
// if we aren't in production then we need to be logged in
// this is used as a crypt key 'salt'
define('SESSION_AUTH_KEY',"badgers and tigers boogie");
session_start();  
    if(! isset($_SESSION['auth']) ){
        $_SESSION['auth'] = "not-auth";
    }
    if(! isset($_SESSION['username']) ){
        $_SESSION['username'] = "anonymous";
    }
    if(! isset($_SESSION['user_type'])){
        $_SESSION['user_type'] = 'user';
    }
    if($_SESSION['user_type']=='developer'){
        
    }
    if($_SESSION['user_type']=='administrator'){
        
    }
    if($_SESSION['user_type']=='contributor'){
        
    }

/*
if($site_version != 'production'){
    if($_SESSION['auth'] != crypt($_SESSION['username'],SESSION_AUTH_KEY)){
        // use the apache env and strstr to parse the current filename
        if(strstr(apache_getenv('SCRIPT_FILENAME'),'login.php') != 'login.php' ){
            header('Location:../index.php?error=booted');
        }
    }
}
*/



ini_set("include_path",SITE_ROOT.SITE_DIRECTORY_NAME."/".SITE_VERSION."/php_classes:/".SITE_ROOT.SITE_DIRECTORY_NAME."/".SITE_VERSION."/configs:".SITE_ROOT.SITE_DIRECTORY_NAME."/".SITE_VERSION."/smarty/libs");
define("PATH_TO_CONFIG",SITE_ROOT.SITE_DIRECTORY_NAME."/".SITE_VERSION."/configs");
define("PATH_TO_COMPILED_TEMPLATES",SITE_ROOT.SITE_DIRECTORY_NAME."/".SITE_VERSION."/templates_c");
define("PATH_TO_TEMPLATES",SITE_ROOT.SITE_DIRECTORY_NAME."/".SITE_VERSION."/templates");
define("PATH_TO_CACHE",SITE_ROOT.SITE_DIRECTORY_NAME."/".SITE_VERSION."/cache");
define("PATH_TO_SMARTY",SITE_ROOT.SITE_DIRECTORY_NAME."/".SITE_VERSION."/smarty");
define("PATH_TO_PHP_CLASSES",SITE_ROOT.SITE_DIRECTORY_NAME."/".SITE_VERSION."/php_classes/");
   if($site_version == "development"){
    define('DB_HOST','mysqlv9');
    define('DB_PASSWORD','jh!098lhA');
    define('DB_USER','badger1001');
  }
  if($site_version == "staging"){
    define('DB_HOST','mysqlv16');
    define('DB_PASSWORD','jh!098lhA');
    define('DB_USER','badger1002');
  } 
    
    define('DB_DATABASE',SITE_DATABASE_NAME);
    include(PATH_TO_PHP_CLASSES."all_classes.php");
    require(PATH_TO_SMARTY.'/Smarty.class.php');
    function br2nl($str) {
        $str = preg_replace("/(\r\n|\n|\r)/", "", $str);
        return preg_replace("=<br */?>=i", "\n", $str);
    }
    
    function make_label($fieldname){
        $ar = explode("_",$fieldname);
        
        if(isset($ar[0]) && ($ar[0] == 'id')){
            $label = 'ID';
        } else {
            $label = ucfirst($ar[0]);
        }
        if(isset($ar[1])){
            if($ar[1] == "id"){
                $label = $label . " " . "ID";
            } else {
                $label = $label . " " . ucfirst($ar[1]);
            }
        }
        if(isset($ar[2])){
            if($ar[2] == "id"){
                $label = $label . " " . "ID";
            } else {
                $label = $label . " " . ucfirst($ar[2]);
            }
        }

        return $label;
    }
   function in_array_bool($arg1,$arg2){
        $ret = false;
        if(in_array($arg1,$arg2)){
            $ret = true;
        }
        return $ret;
   }
   function isset_bool($arg1){
        $ret = "";
        if(isset($arg1)){
            $ret = true;
        }
        return $ret;
   }
   
    class Generic_Smarty extends Smarty{
    
        function Generic_Smarty(){

                       $this->Smarty();
            $this->config_dir=PATH_TO_CONFIG;
            $this->template_dir=PATH_TO_TEMPLATES;
            $this->compile_dir=PATH_TO_COMPILED_TEMPLATES;
            $this->cache_dir = PATH_TO_CACHE;
            $this->config_load(SITE_CONFIG_NAME.'.conf');
            $this->register_modifier('array_push','array_push');
            $this->register_modifier('make_label','make_label');
            $this->register_modifier('strpos','strpos');
            $this->register_modifier('in_array_bool','in_array_bool');
            $this->register_modifier('br2nl','br2nl');
            $this->assign('metatags',array());
            $this->assign('css_files',array());
            $this->assign('javascript_files',array());
      //     $this->clear_compiled_tpl();
        if(isset($_POST['update']) && strtolower( $_POST['update'] )=="smarty_template"){
            $this->clear_compiled_tpl();
        }
    $pagevars = array('pre_alpha','alpha','post_alpha','pre_beta','beta','post_beta','pre_gamma','gamma','post_gamma','pre_delta','delta','post_delta','pre_epsilon','epsilon','post_epsilon','pre_zeta','zeta','post_zeta');
            for($i = 0; $i < count($pagevars); $i++){
                $this->assign($pagevars[$i],NULL);
            }
            $this->assign('classname',NULL);
            $this->assign('myclass',NULL);
            $this->assign('myitem',NULL);
            $this->debugging=false;
          
            if(SITE_VERSION == 'development'){
             //   $this->debugging=true;
              //  $this->debug_tpl='debug2.tpl';
            }
           
            if(isset($_GET['debugging'])){
                if($_GET['debugging'] == '311'){
                    $this->debugging=true;
                }
            }

        }

    }

?>