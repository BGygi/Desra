window.addEvent("domready",function(){
    // get textblock ids by classname textblock_content
    textblock_ids = [];
    $$(".textblock_content").each(function(val,key){
        textblock_ids.push( val.id.split("textblock_content_")[1]);
    });
    options = {
            url : "handle_image_sticker.php",
            textblock_ids : textblock_ids
        };
    ebireSticker = new ImageSticker(options);
    console.log(ebireSticker);    
});
