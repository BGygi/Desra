window.addEvent('domready',function(){
    var query_wrapper = $('query');
    var myButton = $('run');
    myButton.addEvent('click',function(){
        myJSON = new Request.JSON({
            "url" : "run_query.php",
            "method" : "post",
            "data" : {
                "query" : query_wrapper.value,
            },
            "onSuccess" : function(responseText,responseJSON){
                var myRows = JSON.decode(responseJSON);
                $('gamma').empty();
                myRows.each(function(obj){
                    var tDiv = new Element('div',{
                    }).inject($('gamma'));
                    $each(obj,function(item,key){
                       
                            tSpan = new Element('span',{
                                'html' : key + " : " + item + " | ",
                            }).inject(tDiv)
                        
                    
                    })
                    bSpan = new Element('div',{
                                'html' : "<br />",
                    }).inject(tDiv)
                });
            }
        }).send();
    
    });
});
