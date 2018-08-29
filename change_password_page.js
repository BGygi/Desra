window.addEvent('domready', function(){
    if(user_type != "user"){
        $('form1').addEvent('submit',function(e){
         errors = "";
         old_p = $('old_password');
         new_p= $('new_password');
         p2 = $('password2');
         if(! old_p.value.length){
              errors += "Please fill in your current password.\n";
         }
         if(! new_p.value.length){
              errors += "Please fill in your new password.\n";
         }
         if(! p2.value.length){
              errors += "Please repeat your new password.\n";
         }
         if( old_p.value.length && new_p.value.length && p2.value.length){
            if( new_p.value != p2.value ){
    
                  errors += "The repeated password must match the new password."
             }
         }
          
         if(! errors.length){
                e.stop();
                myRequest = new Request.JSON({
                            'url': 'change_password_handler.php',
                            'method' : 'post',
                            'data' : {
                            'old_password' : old_p.value,
                            'new_password' : new_p.value,
                            'password2' : p2.value,
                        },
               
                        onSuccess : function(responseText,responseXML){   
                            if(responseText == 'Password Successfully Changed.'){
                                $('change_password_header').set('styles',
                                    {
                                        color: 'green',
                                        'background-color' : ''
                                    }
                                ); 
                            } else {
                                $('change_password_header').set('styles',
                                    {
                                        color: 'red',
                                        'background-color':'#000'
                                    }
                                );
                            }
                            $('change_password_header').set('html',responseText);

                            
                        }

                    }).send();

              
              
                //  $('form1').send();
                } else {
                    alert(errors);
                    return false;
                }


            });
        }  else  {
            $('form1').addEvent('submit',function(e){
             errors = "";
             u_name = $('username');
             p_word = $('password');
             if(! u_name.value.length){
                  errors += "Please fill in your username.\n";
             }
             if(! p_word.value.length){
                  errors += "Please fill in your password.\n";
             }
              
             if(! errors.length){
                e.stop();
                myRequest = new Request.JSON({
                            'url': 'password_handler.php',
                            'method' : 'post',
                            'data' : {
                            'username' : u_name.value,
                            'password' : p_word.value,
                        },
               
                        onSuccess : function(responseText,responseXML){   
                            if(responseText == 'Password doesn\'t match, please try again.'){

                            } else {
                                if(responseText == 'Logged In'){
                                    window.location = "change_password.php";
                                } else { 
                                   
                                }
                            }
                            $('change_password_header').set('html',responseText);

                            
                        }

                    }).send();

              
              
                //  $('form1').send();
                } else {
                    alert(errors);
                    return false;
                }


            });     
        
        }
});
