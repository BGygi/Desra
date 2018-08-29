<?php
    include("init.php");
    if($process = $_GET['process']){
        $pa = explode("-",$process);

        $object_name = $pa[2];
        $o = new $object_name;
        $table_name = $o->table_name;
        
        if($pa[0] == "remove"){
            $field = $pa[1];
            $sql = "ALTER TABLE `$table_name`
  DROP `$field`;";
            DataManager::DBQuery($sql);
            header('Location:classes.php?classname='.$object_name);
        }
        if($pa[0] == "destroy" && ($pa[2]!="Classmaker")){
            $object_name = $pa[2];
            $o = new $object_name;
            $table_name = $o->table_name;
    // drop the table
            $sql = 'DROP TABLE '.$table_name;
            DataManager::DBQuery($sql);
            $filename = PATH_TO_PHP_CLASSES."all_classes.php";
            $str = file_get_contents($filename);
            $filename = PATH_TO_PHP_CLASSES."class.".$object_name.".php";
    // delete the class file
            unlink($filename); 
            $line = "include('class.".$object_name.".php');";
            $ar = explode($line,$str);
            $str = $ar[0].trim($ar[1]);
            $handle = fopen(PATH_TO_PHP_CLASSES.'all_classes.php','w');
    // new contents of all_classes
            fwrite($handle,$str);
            fclose($handle);
            header('Location:classes.php');
        }
    }
    // adding attribute
    if($classname = $_GET['classname']){
        if($_GET['attribute']){
            $c = new $classname;
            $table_name = $c->table_name;
            
            $sql = "ALTER TABLE `".$table_name."` ADD `".strtolower($_GET['attribute'])."` ".$_GET['attribute_type'];
            switch($_GET['attribute_type']){
                case 'varchar':
                case 'int':
                case 'float':
                $sql .= "( ".$_GET['length']." )";
                break;
            }
            
            $sql .=  " NOT NULL";
            if($_GET['position']){
                $sql .= " ". $_GET['position'];
            }     
            DataManager::DBQuery($sql);
        }
        header("Location:classes.php?classname=".$classname);
    }

$classfile_text = "<?php
class ".ucfirst($_POST['classname'])." extends GenericObject {
    public function __construct(){
        \$this->table_name = \"".strtolower($_POST['tablename'])."\";
        if (\$args = func_get_args()){
            \$id = \$args[0];
            \$this->initialize(\$this->table_name,\$id);
        } else {
            \$this->initialize(\$this->table_name);
        }
    }
}
?>
";
    if($_POST['jimbee']=='311'){
        $filename = "class.";
        $filename .= ucfirst($_POST['classname']);
        $filename .= ".php";
        $file = PATH_TO_PHP_CLASSES .$filename;
        $handle = fopen($file,'w');
        $str = stripslashes($classfile_text);
        fwrite($handle,$str);
        fclose($handle); 
    $sql = "CREATE TABLE IF NOT EXISTS `".strtolower($_POST['tablename'])."` (
  `id` int(16) NOT NULL auto_increment,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=10 ;";
    $result = DataManager::DBQuery($sql);
        $filename = PATH_TO_PHP_CLASSES."all_classes.php";
        $str = file_get_contents($filename);
        $search = "// end additional classes";
        $str1 = "include('class.".ucfirst($_POST['classname']).".php');";
        $suff = <<<EOT
        
// end additional classes
EOT;
        $str1 .= $suff;
        $str = str_replace($search,$str1,$str);
        $handle = fopen($filename,'w');
        rewind($handle);
        fwrite($handle,$str);
        fclose($handle);
    //    echo $str;
      //  fwrite($handle,$str);
      header("Location:classes.php");
    }
?>
