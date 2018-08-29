window.addEvent('domready',function(){
    myEls = $('form1').children;
    $each( myEls, function(val, key){
        val.setStyles({
            "width" : "400px"
        });  
    });
    function getData(f){
        console.log(f.elements);
    }
    $('submit_button').addEvent('click',function(){
       myJSON = new Request.JSON({
        
            "url" : "handle_request_account.php",
            "method" : "post",
            "data" : {
                "name" : $('name').value,
                "email" : $('email').value,
                "institution" : $('institution').value
            },
            "onSuccess" : function(xml,text){
                var txt = "<br />";
                var lines = 
                $each(xml, function(val,key){
                    txt += key + " : " + val + "<br />";
                });
                $('form1').fade();
                var pos = $('gamma').getPosition();
                var size = $('gamma').getSize()
                myThanksWrapper = new Element('div',{
                    "id" : "thanks",
                    "class" : "fadeout",
                    "styles" : {
                        "z-index" : "10000",
                        "width" : size.x + "px",
                        "height" : size.y + "px",
                        "background-color" : "#fff",
                        "position" : "absolute",
                        "left" : pos.x + "px",
                        "top" : pos.y + "px",
                        "display" : "none"
                    }
                }).inject($('gamma')).reveal();     
                MyThanks = new Element('div',{
                    "styles" : {
                        "width" : "360px",
                        "margin" : "50px"
                    },
                    "html" : "Thanks! We've accepted your request with the following information:" + txt
            
                }).inject(myThanksWrapper);
            }
        }).send();
    
    });
});
