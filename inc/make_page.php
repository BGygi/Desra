<?php
if(isset($_POST['page_name'])){
  $pagename=$_POST['page_name'];
  $new_page = new Page;
  $new_page->SetField('filename',$pagename);
  $new_page->Save();
  $page_id = $new_page->GetId();
  if(isset($_POST['javascript_file_id']) && $_POST['javascript_file_id'] > 0){
    foreach($_POST['javascript_file_id'] as $javascript_file_id){
        $pjf = new Page_Javascript_file;
        $pjf->SetField('page_id',$page_id);
        $pjf->SetField('javascript_file_id',$javascript_file_id);
        $pjf->Save();
    }
  }
  if(isset($_POST['css_file_id']) && $_POST['css_file_id']>0){
    foreach($_POST['css_file_id'] as $css_file_id){
        $pcf = new Page_CSS_file;
        $pcf->SetField('page_id',$page_id);
        $pcf->SetField('css_file_id',$css_file_id);
        $pcf->Save();
    }
  }
    $handle = fopen("empty_page.php", "r");
    $contents = fread($handle, filesize($filename));
    fclose($handle);
    $handle = fopen($pagename,"w");
    fwrite($handle,$contents);
    fclose($handle);
    $master_template_id = $_POST['master_template_id'];
    $pst = new Page_Smarty_template;
    $pst->SetField('page_id',$page_id);
    $pst->SetField('smarty_template_id',$master_template_id);
    $pst->SetField('pagevar','master');
    $pst->Save();
};



$master_templates = array();
$master_templates['26']='var_content1.tpl';
$master_templates['40']='blank.tpl';
$smarty->assign('master_templates',$master_templates);
$css = array();
$sql = "SELECT * FROM css_files WHERE 1";
$result = DataManager::DBQuery($sql);
while($row = $result->fetch_array(MYSQLI_BOTH)){
   $css[$row['id']] = $row['path'];
}
$smarty->assign('css',$css);
$js_files = array();
$sql = "SELECT * FROM javascript_files WHERE 1";
$result = DataManager::DBQuery($sql);
while($row = $result->fetch_array(MYSQLI_BOTH)){
   $js_files[$row['id']] = $row['path'];
}
$smarty->assign('js_files',$js_files);
?>
