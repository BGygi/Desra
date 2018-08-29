
function echoToHiddenTab(tab_id){
  el2 =  document.getElementById('hidden_tab');
  el2.value = tab_id;
  return true;
}


function iframeIndexNav(classname,tab){
   ob = $('inner_list');
   str = classname + " " +tab;
 //  alert(str);
   loc = "./inner_list.php";
   loc += "?classname=" + classname;
   loc += "&index=" + tab;
   ob.src = loc;
  
   return false;
}  
/*  
ajax form submit
*/
window.addEvent('domready', function() {
    var mySlide = new Fx.Slide($('log_res'),{duration: '1000'});
    
	$('myForm').addEvent('submit', function(e) {
//Empty the log and show the spinning indicator.
        
     //   $('log_res').empty();
        
        /*    $('inner_list_wrapper').addClass('ajax-loading');
          */
       // var log = $('log_res');
        var log = $('log_res').empty().addClass('ajax-loading');
	//	var log = $('log_res');
        //Prevents the default submit event from loading a new page.
	    
        e.stop();
		//Set the options of the form's Request handler. 
		//("this" refers to the $('myForm') element).
		this.set('send', {onComplete: function(response) { 
		mySlide.hide();
        log.removeClass('ajax-loading');
            
	    log.set('html', response);

        mySlide.slideIn();

            
        }});
		//Send the form.
		this.send();
        
         
	});

    
});

