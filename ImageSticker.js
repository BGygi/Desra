var ImageSticker = new Class({
    Implements: [Events,Options],
    initialize : function(options){ 
            this.setOptions(options);
            this.loadData();
    },
    loadData : function(){
        this.options.textblock_ids.each(function(tb_id,key){
            var request = new Request.JSON({
                url:this.options.url,
                data: {
                    "textblock_id" : tb_id,
                },
                onSuccess : function(xml){  // the return value
                                            // array of images to insert into
                                            // the textblock
                    var image_locs = {};
                    var myText;
                    xml.each(function(val){
                        console.log(val);
                        var textblock_image = val.fields;
                        var image =  val.image.fields;
                        var character_at = textblock_image.character_at;
                        var float_type = textblock_image.float_type;
                        var myTextblock = $("textblock_content_"+textblock_image.textblock_id);
                        
                        // if there is a character_at, split the text into two spans
                        if($defined(character_at)){
                            var myText = myTextblock.get("text");
                            var text_before_image = new Element('span',{
                                text : myText.substr(0,character_at)
                            }); 
                            var text_after_image = new Element('span',{
                                text : myText.substr(character_at,myText.length)
                            });
                        }
                       
                        
                        var stickImage = new Element("img",{
                            src : image.path + image.filename,
                            height : image.height,
                            width : image.width,
                            alt : image.caption,
                            styles : {
                                display : "none"
                            }
                        });
                        myTextblock.empty();
                        text_before_image.inject(myTextblock);
                        stickImage.inject(myTextblock).reveal();
                        text_after_image.inject(myTextblock);
                        if($defined(textblock_image.float_type) && textblock_image.float_type== "left"){
                            stickImage.setStyles({"float":textblock_image.float_type,"padding-right":"8px"});
                        }
                        if($defined(textblock_image.float_type) && textblock_image.float_type== "right"){
                            stickImage.setStyles({"float":textblock_image.float_type,"padding-left":"8px"});
                        }
                        if($defined(textblock_image.display)){
                            stickImage.setStyles({"display":textblock_image.display});
                        }   
                    })
                   
                }.bind(this) // end of onSuccess function
            }).send();
        }); // end of textblock_ids.each
    } // end of loadData

});
