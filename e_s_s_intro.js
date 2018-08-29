var myUser = $H({});
var userErrors = $H({});

function validateHearingQuestionaire(){
    errorMsg = "";
    userErrors.fields = [];
    ob = document.forms.hearing;
   
    myUser.birthyear = $("birthyear").value;

    for(var i = 0; i < ob.gender.length; i++){
        if(ob.gender[i].checked){
            myUser.gender = ob.gender[i].value;
        }
    }
    for(var i = 0; i < ob.hearing_loss.length; i++){
        if(ob.hearing_loss[i].checked){
            myUser.hearing_loss = ob.hearing_loss[i].value;
        }
    }
    for(var i = 0; i < ob.symmetry.length; i++){
        if(ob.symmetry[i].checked){
            myUser.symmetry = ob.symmetry[i].value;
        }
    }
  
    myUser.country = $('country').value;
    myUser.native_language = $('native_language').value;
    myUser.primary_language = $('primary_language').value;
    if(! myUser.birthyear.length){
        userErrors.fields.push('birthyear');    
    } else {
        var re = new RegExp("\\d{4}\\b");
        if(! myUser.birthyear.match(re)){
            userErrors.fields.push('birthyear');
            errorMsg += "Birthyear must be a four-digit number.\n";
          //  alert("Birthyear must be a four-digit number");
        } else {
            if((myUser.birthyear < 1900)||(myUser.birthyear > 2000)){
                userErrors.fields.push('birthyear');
                errorMsg += "Birthyear must be between 1900 and 2000.\n";
                //  alert("Birthyear must be between 1900 and 2000, sorry!");
            
            } 
        }
    }
    if(! $defined(myUser.gender) ){
        userErrors.fields.push('gender');    
    }
    if(! $defined(myUser.hearing_loss) ){
        userErrors.fields.push('hearing_loss');    
    }
    if(! $defined(myUser.symmetry) ){
        userErrors.fields.push('symmetry');    
    }
    if(!(myUser.native_language.length) ){
        userErrors.fields.push('native_language');    
    }
    
    if(!(myUser.primary_language.length) ){
        userErrors.fields.push('primary_language');    
    }
    if( myUser.country == 0 ){
        userErrors.fields.push('country');    
    }
    
    $$('label').each(function(value){value.setStyles({color:'black'})});
    userErrors.fields.each( function(value){
        
        $(value + "_label").setStyles({color:'red'});
    
    });
    if(userErrors.fields.length == 0){
        var myFunction = function(){if($defined($('submit_button')))$('submit_button').set('disabled',0);};
        $('submit_button').set('disabled',1);
        myFunction.delay(2000);
        var props = {
            'show_thanks_message' : true
                    };
        myUser.extend(props);
        myRequest = new Request.JSON({
            url : 'handle_hearing_form.php',
            method : 'post',
            data : myUser,
            onSuccess : function(responseText){
            
                var myFunc = function(){
                    loc = 'environmental_sounds_study.php?pid='
                    loc += responseText.user_id;
                    window.location = loc;
                }
                $('gamma').set('html',responseText.thanks_msg);
                myFunc.delay(1000);     
        }}).send();
    
    } else {   
        var myFunction = function(){ $('submit_button').set('disabled',0) };
        $('submit_button').set('disabled',1);
        alert("Please correct the higlighted items. \n" +errorMsg);
        myFunction.delay(2000)
        return false; 
    }


}
window.addEvent('domready', function(){
 
    $('gamma').setStyles({'min-height':'400px'});
    $('gamma').set('overflow','auto');

    myIFrame = new Element('iframe', {
        styles : {
            border : '1px solid #aaa',
            width : '500px',
            height : '100px',
            'background-color':'#ffffff'
        },
            overflow : 'auto',
            src : 'tmp.php'
     }).inject($('gamma'));
     myDiv = new Element('div',{
        html : 'I have read the terms and conditions'
     }).inject($('gamma'));
     myCheckbox = new Element('input',{
        id : 'terms_and_conditions',
        type : 'checkbox',
        styles: {
            'margin-right':'5px'
        },
        value : 'term_and_conditions_accepted'
     }).inject(myDiv,'top');
    myEl = new Element('a',{
        html : 'Show the hearing questionnaire',
        href : '#'
    }).inject($('gamma'));
    
    myEl.addEvent('click', function(event){
        if($('terms_and_conditions').checked){
            myUser.term_and_conditions_accepted = true;
            myRequest = new Request({
                url: './handle_e_s_s_intro.php',
                    method : 'post',
                    data : {
                    show_hearing_questionaire : true            
                },
                onSuccess : function(responseText){
                    $('gamma').set('html',responseText);
                }
            }).send();

        } else {
            alert ('The terms and conditions must be accepted');
        }
    });// end of show questionaire add event
    
    myDiv2 = myDiv.clone();
   
    myDiv2.set('html','I have a return code');
    myDiv2.inject($('gamma'));
    myInput = new Element('input',{
        'value':'',
        'type':'text',
        'id':'return_code'
    }).inject($('gamma'));
   
    myInput.addEvent('change',function(){
        myRequest = new Request.JSON({
            url : 'handle_e_s_s_intro.php',
            method : 'post',
            data : {
               // 'return_code': myInput.value,
                'return_code' : myInput.value                
            },
            'onSuccess' : function(responseText){
                if(responseText.msg == "NO USER ID"){
                    myMessage = new Element('div',{
                        html : "No return code like that on file. Sorry."    
                    }).inject($('gamma'));
                } else {
                    user_id = responseText.msg;
                    window.location = "environmental_sounds_study.php?pid="+user_id;                
                }
            }        
         }).send();
    });
     
});
