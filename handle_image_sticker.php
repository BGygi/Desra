<?php
    include("php_handler_init.php");
    if($_POST['textblock_id']){
        $image_ids = array();
        $myTextblock_Image = new Textblock_Image;
        $ti_ids = $myTextblock_Image->FindByAttribute("textblock_id",$_POST['textblock_id']);
    }
    $textblock_images = array();
    foreach($ti_ids as $ti_id){
        $myTextblock_Image = new Textblock_Image($ti_id);
        $myTextblock_Image->fields = $myTextblock_Image->GetAllFields();
        if(isset($myTextblock_Image->fields['image_id'])){
            
            $tempImage =  new Image($myTextblock_Image->fields['image_id']);
            $tempImage->fields = $tempImage->GetAllFields();
            $myTextblock_Image->image = $tempImage;
        }
        array_push($textblock_images,$myTextblock_Image);
    }
    echo json_encode($textblock_images);
?>
