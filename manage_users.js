function labelizer(ob,text){
    theLab = new Element('label',{
        "html" : text,
        "styles" : {
            "display" : "block"
        }   
    }).inject(ob,"before");

}
window.addEvent('domready',function(){
 //   $('gamma').empty();
    
    updateForms = $$(".manage_users");
    
    inputs = $$(".manage_users INPUT");
    inputs.push( $$(".manage_users TEXTAREA"));
    inputs.each(function(val,key){
        val.store('original_value',val.value);
    }); 
    inputs.addEvent('change',function(ev){
            myInput = ev.target;

            this.getNext('div').set({
                "html":"<< modified",
                "styles":{
                    "color":"#0000ff"
                }
            });

    });
    $each(updateForms,function(val,key){
        val.addEvent('submit',function(ev){
            ev.stop();
            myJSON = new Request.JSON({
                "url" : "handle_manage_users.php",
                "data" : val,
                "method" : "post",
                "onSuccess" : function(xml,text){
                    val.removeClass("changed");
                    val.addClass("saved");
                    tinputs = val.getElements('.qres-input');
                //    tinputs.push(val.getElements('textarea.qres-input'));
                    i = 0;
                    tinputs.each(function(tval,tkey){
                        tfield = tval.name;
                        var lookfor = "SET " + tfield; 
                //        tdiv = tval.getNext('div').set('html',"<< saved");

                        xml.each(function(xval,xkey){
                            if ( xval.success == "1"  ){
                                if(xval.query.contains(lookfor)){
                                    tinputs[tkey].getNext('div').set('html',"<< modification saved");
                                } else {
                                    tinputs[tkey].getNext('div').set('html',"");
                                }
                            }
                          
                        });
                    
                    });

                }
            }).send();
        });
        
    });
    var myForm = new Element('form',{
        "method" : "post",
        "action" : "handle_manage_users.php"
    }).inject($('delta'));
    var username = new Element( 'input', {
        'name':'username',
        'type':'text',    
        'styles':{
            'width':'auto'
        },
    }).inject(myForm);
    labelizer(username,"Username");
    var Pwd = new Element( 'input', {
        'name':'password',
        'type':'password',       
        'styles':{
            'width':'auto'
        },
    }).inject(myForm);
    labelizer(Pwd,"Password");
    var Name = new Element( 'input', {
        'name':'name',
        'type':'text',      
        'styles':{
            'width':'auto'
        },
    }).inject(myForm);
    labelizer(Name,"Name");
    var email = new Element( 'input', {
        'name':'email',
        'type':'text',   
        'styles':{
            'width':'auto'
        },
    }).inject(myForm);
    labelizer(email,"Email Address");
    var userType = new Element( 'input', {
        'name':'user_type',
        'type':'text',  
        'styles':{
            'width':'auto'
        },
    }).inject(myForm);
    labelizer(userType,"User Type");
    var institution = new Element( 'textarea', {
        'name':'institution',  
        'styles':{
            'width':'auto'
        },
    }).inject(myForm);
    labelizer(institution,"Institution");
    var addUser = new Element('input',{
        "type" : "hidden",
        "name" : "add_user",
        "value" : "1"
    }).inject(myForm);
    var Submit = new Element("input",{
        "type" : "submit",
        "value" : "Add User",
        'styles' : {
        
        },
       /*
        'events' : {
            "click" : function(ev){
                ev.stop();
                addUser = new Request.JSON({
                    "url" : myForm.action,
                    "method" : myForm.method,
                    "data" : myForm
                }).send();               
            }
        }
       */ 
    }).inject(myForm);
 
});
