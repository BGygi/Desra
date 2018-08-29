window.addEvent('domready', function(){
      $('drop_down_menu').getElements('li.menu').each( function( elem ){
		var list = elem.getElement('ul.links');
		var myFx = new Fx.Slide(list).hide();
		elem.addEvents({
			'mouseenter' : function(){
				myFx.cancel();
				myFx.slideIn();
			},
			'mouseleave' : function(){
				myFx.cancel();
				myFx.slideOut();
			}
		});
	});
        var login_wrapper = new Element('div',{
             'id' : 'universal_log',
        }).inject($('wrapper_2'));
       var login_msg = "log-in";
       if(user_type != 'user'){
            var login_msg = "log-out";                             
       }
       
       var toggle = new Element('a',{
            'html' :login_msg,
             'styles' : {
                    'text-decoration' : 'none',
                    'color' : '#ff3333',
                   'cursor':'pointer',
                   'margin-left':'550px'
              },
              'events' : {
                   'mouseenter': function(){
                        // console.log(user_type);
                    },
                    'click' : function(){
                           if(user_type != "user"){
                              location = './login_handler.php?logout=1';
                                
                           } else {
                             location = "./login.php";
                           } 
                    }
              }
       }).inject(login_wrapper);
       if(user_type != 'user'){
            var login_msg = "User logged in as: ";
               login_msg += user_type + " : " + username;
                var mySpan = new Element('span',{
                       'html' : login_msg,
                       'styles' : {
                                'float':'left'
                        }
                 }).inject(login_wrapper,'top');
       }
       // hide the auth links
      
      var authlinks = $$(".auth");
       authlinks.each( function(item,key){
              item.setStyles({display:"none"});          
        });
   
      var myToggle = new Element('a',{
            "html" : "toggle editor links",
            "href" : "#",
            "styles" : {
                             "color":"#666"
                         },
            events : {
                 "click" : function(){
                               var authlinks = $$(".auth");
                               var display_style = authlinks[0].getStyle('display');
                               if(display_style == "none"){
                                   authlinks.reveal();
                                } else {
                                   authlinks.dissolve();
                                } 
                 }
            } 
       });
       if ($defined( $('authmenu') ) ){
          myToggle.inject($("authmenu"),"top");
       }
        
       if ($defined( $('authmenu') ) ){
          myToggle.inject($("authmenu"),"top");
          var Togglewrapper = new Element('div',{
                 styles : { width : "140px",
                              "border" : "1px solid #ccc",
                              "padding" : "3px" 
                             }
          }).wraps(myToggle);

       }
       
});
