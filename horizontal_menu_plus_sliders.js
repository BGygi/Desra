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
       if(user_type == 'developer' || user_type == 'administrator' || user_type == 'contributor'){
            var login_msg = "User logged in as: ";
               login_msg += user_type + " : " + username;
                var mySpan = new Element('span',{
                       'html' : login_msg,
                       'styles' : {
                                'float':'left'
                        }
                 }).inject(login_wrapper,'top');
       }

 
});
