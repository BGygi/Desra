$classname;
$index;
$classname = $_GET['classname'];
$index = $_GET['index'];

$myclass = new $classname;
$cids = $myclass->findByFirstChars($index);

$items = array();
foreach($cids as $cid){
    $item = new $classname($cid);
    $item->fields = $item->GetAllFields();
    array_push($items,$item);
}
$sounds = $items;
foreach($sounds as $sound){
   $sound->keywords = getAssociatedObjects($sound->GetId(),'Sound_Keyword');
   $sound->mp3_files = getAssociatedObjects($sound->GetId(),'Sound_MP3_file');
}
$smarty->assign('myclassname',$myclass);
$smarty->assign('sounds',$sounds);

function getAssociatedObjects($soundID,$assoc_classname){
    $c = new $assoc_classname;
    $sql = "SELECT * FROM $c->table_name WHERE sound_id = '$soundID' ORDER BY id";
    $result = DataManager::DBQuery($sql);
    $ret = array();
    while($row = $result->fetch_array(MYSQLI_BOTH)){
        $c = new $assoc_classname($row['id']);
        $innersql = "SELECT id FROM class_associations ";
        $innersql .= "WHERE table_name = '".$c->table_name."' LIMIT 1";
        $innerresult = DataManager::DBQuery($innersql);
        $innerrow = $innerresult->fetch_array(MYSQL_BOTH);
        $ca = new Class_association($innerrow['id']);
        if ($ca->GetField('classname1') == "Sound"){
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