var Testrun = new Class({
    Implements:[Playlist],
    options: {
            'trials' : []
    }
});
    var Waitscreen = new Class({
        Implements : [Events,Options],
        KillWaiter : function(){
          //  console.log(this.el);
            this.el.dispose();
        },
        Restore : function(){
            this.el.destroy()
            this.initialize(this.options)
        },
        initialize : function(options){ 
            this.setOptions(options);
            this.options.cover_element.setStyles({'position':'relative'});
            var h = this.options.cover_element.getSize().y;
            var w = this.options.cover_element.getSize().x;
            this.el = new Element('div',{
                styles : {
                    'border' : '0px solid transparent',
                    'height' : h,
                    'width' : w,
                    'position' : 'absolute',
                    'background' : this.options.background,
                    'text-align' : 'center',
                    'z-index' : '5000'                                   
                }
            });
            var sp_left = w/2 - (this.options.spinner_w/2);
            var sp_top = this.options.spinner_h/2;
            sp_top = (h/2-sp_top);
            sp_top += 'px';
            if($defined(this.options.spinner)){
                this.spinner = new Element('img',{
                    'src' : this.options.spinner,
                    'height' : this.options.spinner_h,
                    'width' : this.options.spinner_w,
                    styles : {
                        'position' : 'relative',
                        'top' : sp_top
                    }                    
                }).inject(this.el);
            }
            this.el.inject($(this.options.cover_element),'top');
        }
    });// end of class

        var Trial = new Class({
            Implements: [Sound],
            options : {
                trial_number : 0,
                sound_id : 0,
                sound_start_timer : $empty,
                answer_timer : $empty,
            },
            Reset : function(){
                    var keyed = '';
                    if($defined(tableWaiter)){
                        tableWaiter.Restore();
                    }
                    this.play_button_label.set('html','Play Sound');
                    myTrial.play_button_label.setStyles({'visibility':'visible'});
                    this.play_button.setStyles({'visibility':'visible'});
                    this.rate_familiarity.setStyles({'visibility':'hidden'});
                    this.next_button.setStyles({'visibility':'hidden'});
                    this.setOptions({plays : 0 });
                    mySlider.set(0);
                    $('rating_percent').set('html','--');  
            },
            Increment : function(){
                return this.options.trial_number++;  
            },
            initialize: function(options) {
                this.setOptions(options);
                this.wrapper = $('wrapper_2');
                this.rate_familiarity = $('rateFamiliarity');
                this.rate_familiarity.setStyles({
                    'position':'absolute',
                    'visibility':'hidden',
                    'background-color':'#ccc',
                    'border' : '1px solid #eee',
                    'z-index' : 6000,
                    'min-height' : '50px',
                    'text-align' : 'center',
                    'width' : '796px',
                    'top' : '10px',
                    'left' : '1px'
                    });
                this.wrapper.setStyles({'position':'relative'});
                this.el = new Element('div',{
                    id : 'trial_play_'+this.options.trial_number,
                    styles : {
                        'width' : 'auto',
                        'border' : '1px solid #aaa',
                        'min-height' : '70px',
                        'text-align' : 'center',
                        'background-color' : '#eee'
                    }
                }).inject($('gamma'),'top');
                this.play_button_wrapper = new Element('div',{
                });
                this.play_button_label = new Element('div',{
                    id : 'play_button_label',
                    html : 'Play Sound',
                    styles : {
                        'padding-top' : '10px'
                    }
                }).inject(this.play_button_wrapper);
                
                var PlayTrialSound = function(){
                    if($defined(tableWaiter)){
                        tableWaiter.KillWaiter();
                    }
                    var myMP3 = this.options.sound_list[this.options.trial_number].mp3_file.fields;
                    var SoundID = this.options.sound_list[this.options.trial_number].fields.id;
                    var SoundDescription = this.options.sound_list[this.options.trial_number].fields.description;
                    var mySound = Testrun.getSound(myMP3.path + myMP3.filename);
                    mySound.start(0);
                    return [SoundID,SoundDescription];
                }.bind(this);
                this.play_button = new Element('input',{
                    id : 'p',
                    type:'image',
                    src:"images/play.png",
                    styles : {
                    'margin':'5px'
                    },
                    events : {
                        // desired functionality:
                        // three states to play button label:
                        // "Play Sound", "Play Again" and "Limit Reached"
                        // If we let them click we will play the sound
                        // If the limit is reached we hide the button
                          'click' : function(event){
                                Testrun.stopSounds();
                                var s = PlayTrialSound();
                                
                                
                                if(this.options.trial_number <= this.options.sound_list.length){
                                // if not incremented plays is less than max       
                                    if( ! (++ this.options.plays < this.options.max_plays) ){ 
                                    // incremented plays has reached max
                                     
                                        $('play_button_label').set({
                                            'html':'Limit Reached',
                                         });
                                         this.play_button.setStyles({
                                            'visibility' : 'hidden'  
                                         });
                                         this.SayTrial();
                                       //  this.options.plays = 0;
                                    } else {

                                        $('play_button_label').set('html','Play Again');
                                        this.play_button.store('sound_id',s[0]);
                                        this.play_button.store('sound_description',s[1]);     
                                        
                                    }

                                } else {
                                    window.location = "environmental_sounds_study.php?pid=22&ok";
                                }                      
                           }.bind(this) // end button click event
                            
                        } // end options
                    });
                    this.next_button = new Element('div',{
                        'type' : 'button',
                        'class' : 'greenbutton',
                        'styles' : {
                            'visibility':'hidden',
                            'position':'relative',
                            'font-weight':'bold',
                            'cursor' : 'pointer',
                            'margin-right':'auto',
                            'margin-left': 'auto'
                        },
                        'html' : 'Next!',
                        events : {
                            'mouseover' : function(){
                                this.setStyles({'border-bottom':'2px solid #aaa','border-right':'2px solid #aaa','margin-bottom':'4px','margin-left':'auto','margin-right':'auto'});
                              },
                            'mouseout' : function(){
                                this.setStyles({'border':'1px solid #ccc','margin':'5px','margin-left':'auto','margin-right':'auto'});
                            },
                            'click' : function(event){
                            
                            
                            if(this.play_button.retrieve('sound_id') == this.play_button.retrieve('answer_id')){
                                alert('Correct!');
                            } else {
                                alert('Incorrect');
                            }
                            this.rate_familiarity.setStyles({'visibility':'hidden'});
                            this.next_button.setStyles({'visibility':'hidden',                            'margin-right':'auto','margin-left': 'auto'});
                            this.play_button_label.set('html','Play Sound');
                            // no waiter for safari
                            if(! Browser.Engine.webkit){
                                options = {
                                    cover_element : this.el,
                                    background : 'url(./images/1px_trans_gray.png)',
                                    spinner : './images/spinner.gif',
                                    spinner_h : '16'
                                }                      
                                myWaiter = new Waitscreen(options);
                            }
                            var elapsed_time = this.play_button.retrieve('answer_timer')-this.play_button.retrieve('sound_play_timer');
                            myJSON = new Request.JSON({
                                'url' : './handle_trials.php',
                                'method' : 'post',
                                'data' : {
                                    user_id : this.options.user_id,
                                    plays : this.play_button.retrieve('plays'),
                                    trial_number : this.options.trial_number + 1, // change from zero index
                                                                                  //  to integers
                                    sound_id : this.play_button.retrieve('sound_id'),
                                    sound_description : this.play_button.retrieve('sound_description'),
                                    answer_id : this.play_button.retrieve('answer_id'),
                                    answer_description :this.play_button.retrieve('answer_description'),
                                    elapsed_time : elapsed_time,
                                    familiarity_rating : this.play_button.retrieve('familiarity_rating')
                                },
                                'onSuccess' : function(){
                                    myTrial.Increment();           
                                    myTrial.Reset();
                                    if(! Browser.Engine.webkit){
                                        myWaiter.KillWaiter();
                                    }
                                }    
                            }).send();

                        }.bind(this)
                    }
                });
                    
                this.play_button_wrapper.inject(this.el);
                this.play_button.inject(this.play_button_wrapper);   
	            this.next_button.inject(this.el);
              }
        }); // end of class

Array.implement({
    cleanShuffle : function(){
        var ret = [];
        var discard = this.clean();
        for(var i = 0; i < this.length; i++){ 
            var item = discard.getRandom();
            discard.erase(item);
            ret.push(item);
        }           
        return ret;
}});
// gup function from netlobo.com
// http://www.netlobo.com/url_query_string_javascript.html
function gup( name )
{
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( window.location.href );
  if( results == null )
    return "";
  else
    return results[1];
}
window.addEvent('domready', function(){
    
    var nogrid = false;
    if(Browser.Engine.trident || Browser.Engine.webkit){
         nogrid = true;
      //  alert('ie');
    }
  
  //  var user_id = location.search.split('=')[1];
    var user_id = gup('pid');
    $('delta').setStyles({display:'none'});
    $('wrapper_2').setStyles({
             'background-image':'url(./images/blank.png)',
             'border' : '1px solid #eee'        
    });
    $('banner_wrapper').setStyles({
            'background-image':'url(./images/blank.png)',
            'border-bottom' : '0px solid #fff',
            'height' : '0px',
            'min-height' : '0px'
    });
    $('gamma').setStyles({'margin-left':'0px',width:'100%'});
    Testrun = new Testrun();
 
    var Sounds = myUser.sounds;

    
   // console.log(myUser.ret);
    var TrialNumber = parseInt(myUser.trial_number);
    
    function sortSounds(a,b){
        return a.fields.description > b.fields.description;
    }
    // var SSounds = Sounds.sort(sortSounds);
    Sounds.sort(sortSounds);
  Sounds.each(function(value,index){
     //  console.log(value.fields.id);
   });
  // console.log("Sounds count : "+Sounds.length);
    if ($chk(TrialNumber)){
    
    } else {
        TrialNumber = 0;
    }
  //  var shuffledSounds = Sounds;
    
    var shuffledSounds = Sounds.cleanShuffle();
    shuffledSounds.each(function(value,index){
    //    console.log(value.fields.id);
    });
   // console.log("shuffledSounds count : "+shuffledSounds.length);
   // This is where a returning users array is filtered to
   // remove sounds played in any previous visits   
   // with anonymous function inside the filter
    shuffledSounds = shuffledSounds.filter(function(item,index){
        if(! myUser.played_sounds.contains(item.fields.id)){
            return true;
        }  
    });
  //  console.log("filtered shuffledSounds count : "+shuffledSounds.length);
   // leave this for debugging, shows list of shuffled sounds
  //  for users visit
    myUser.played_sounds.each(function(value,index){
       // console.log(value);
        }
    );
   /* 
   console.log("played sounds count : "+myUser.played_sounds.length);
   console.log(myUser.played_sounds);
   console.log("------");
    */
    
   // init value
    // will change if user is returning
        var options = {
            'user_id' : user_id,
            'sound_id' : shuffledSounds[TrialNumber].fields.id,
            'trial_number' : TrialNumber,
            'sound_description' : shuffledSounds[TrialNumber].fields.description,
            'sound_list' : shuffledSounds,
            'plays' : 0,
            'max_plays' : 3,
        }
    // myTrial is inialized once
    // per visit, not for each trial
    // afterwards trial_number is incremented
    // but no new Trial objects    
    myTrial = new Trial();
    myTrial.setOptions(options);
    var table_surround = new Element('div',{
        'id' : 'table_surround',
        styles : {
            'border' : '1px solid #aaa',
            'margin-top' : '2px'            
        }
    }).inject($('gamma'));
    // this get used about 35 lines down
    // as the trial number of a user who
    // chooses to use the exit button
    // you can't post a zero value, subs -1
    var exit_tag = function(){
        if(myTrial.options.trial_number > 0){
            return myTrial.options.trial_number
        } else {
            return -1;
        }
    }
    var exit = new Element('input',{
        'type' : 'button',
        'name' : 'exitcode',
        'value' : 'Get Exit/Return Code',
        'class' : 'greenbutton',
        'styles' : {
            'position' : 'absolute',
            'left' : '630px',
            'top' : '0px',
            'z-index' : 10000,
            'width' : '160px'           
        },
        'events' : {
            'click' : function(){
                myRequest = new Request.JSON({
                    'url' : 'handle_trials.php',
                    'method' : 'post',
                    data : {
                        'user_id' : myTrial.options.user_id,
                        'exit_trial_number' : exit_tag()
                    },
                    'onSuccess' : function(response){
                        alert('we successfully saved your session with a return code of '+ response.code);
                        myTrial.wrapper.set('html','Please make a note of your return code: ' + response.code + "<div>This Page will close in 1 minute</div>" );
                        myDelayedFunc = function (){
                            myTrial.wrapper.set('html','');
                            newEl = new Element('div',{});
                            newEl.set('html','thanks!');
                            newEl.replaces(myTrial.wrapper);
                        }.delay(60000);
                    }
                })
                if(confirm('Do you want the system to issue you a code so you can resume your identifications later?')){
                    myRequest.send();
                }

            }
        }
    }).inject($('gamma'),'top');
    if(! (nogrid)){
        var gridToggle = exit.clone();
        gridToggle.set('value','Hide Accessability Tags');
        gridToggle.setStyles({
                'position' : 'absolute',
                'z-index' : 10000,
                'top' : '22px'            
            });    
        gridToggle.inject($('gamma'),'top');
        gridToggle.addEvent('click', function(){
                    if(gridToggle.get('value') == 'Hide Accessability Tags'){
                        gridToggle.set('value','Show Accessability Tags');
                        $$('.show_grid').setStyles({'display' : 'none'});
                    } else {
                        gridToggle.set('value','Hide Accessability Tags');
                        $$('.show_grid').setStyles({'display' : 'block'});
                    }
        });
    }
    myTable = new Element('table',{
            width : '796',
            columns : '4',
            cellspacing : '0',
            cellpadding : '0',
            border : '0',
            styles : {
                'background-color' : '#eeffee',
                'padding-left' : '14px'
            }    
        });
    myRow = new Element('tr',{
    }).inject(myTable);
        myTD = new Element('td',{
            id : 'column1',
            'valign' : 'top'             
        }).inject(myRow);
        myTD = new Element('td',{
            id : 'column2',
            'valign' : 'top'                   
        }).inject(myRow);
        myTD = new Element('td',{
            id : 'column3',
            'valign' : 'top'                   
        }).inject(myRow);
        myTD = new Element('td',{
            id : 'column4',
            'valign' : 'top'                   
        }).inject(myRow);       
        myTable.inject(table_surround);
    var incrementer = 0;
    var incrementer2 = 0;
    var i = 0;
    var row_numbers = [1];
    var row_number=1;
    var row_incrementer = 0;
    Sounds.each(function (value,index){
        var injectIn = 'column';
        if(incrementer++ == 4){
            row_numbers.push(++row_number);
            incrementer = 1;
        }
        column_lim = (Sounds.length/4).ceil();               
        var column_num = 1;
        ++incrementer2;
        if( (incrementer2 > column_lim )&&( incrementer2 <= column_lim * 2 ) ){column_num = 2};
        if( (incrementer2 > column_lim * 2 )&&( incrementer2 <= column_lim * 3) ){column_num = 3};
        if( incrementer2 > column_lim * 3 ){column_num = 4};
    //  switch between horizontal and vertical filled grid by
    //    commenting out one of the following
    //    first one shows vertical 
        var column_map = {column1:'a',column2:'b',column3:'c',column4:'d'};
        if(row_incrementer++ >= column_lim){
            row_incrementer = 1;
        }
        var injectIn = injectIn + column_num;
        ;
    //     var injectIn = injectIn + incrementer; // row fill
        var gridtag = column_map[injectIn] + row_incrementer; // column fill

    // HERES WHERE THE SOUNDS ALL GET LOADED INTO THE PLAYLIST
        temppath = value.mp3_file.fields.path + value.mp3_file.fields.filename;
        i++;
        options = {
            'positionInterval' : '100',      
            // JB Hack to make flash play of sounds nicer
            // otherwise they seem to hang at the end
            'onPosition': function(position,duration) {
                var percent = (position/duration*100).round(2);
                if ( position.round()/duration.round() * 100 > 99 ){
                  // console.log('onPosition : '+ position + ' duration : ' + duration);
                   this.stop();
                }
            },
            'onPlay' : function(){
                if(myTrial.options.plays < 1){  // this happens before the play number is incremented
                    myTrial.play_button.store('sound_play_timer',$time());
                }
            },
            'onProgress' : function (){
            },
            'gridtag' : gridtag,
            'inject_in' : injectIn,
            'onRegister' : function(){
              // a div to hold the button
                this.el = new Element('div',{
                        styles : {
                            'position' : 'relative'                        }         
                        
                    }).inject(injectIn);
              // individual sound answer buttons
                // no gridtags for explorer or safari
                if(! (nogrid)){
                this.gridtag = new Element('div',{
                    html : gridtag,
                    'class' : 'show_grid',
                    styles : {
                            'position' : 'absolute',
                            'padding' : '1px',
                            'left' : '0px',
                            'top' : '0px',
                            'font-size' : '10px',
                            'font-weight' : 'normal',
                            'color' : '#666',
                            'background-color': '#ffe',
                            'border' : '1px solid #ccc'
                        }
                    }).inject(this.el);
                
                  //  this.gridtag.setStyles({'display':'none'});
                }
                this.answer_button = new Element('input',{
                            'class' : 'greenbutton',
                            'type' : 'button',
                            'value' : value.fields.description,
                            'id' : gridtag,
                            events : {
                                'mouseover' : function(){
                                    this.setStyles({'border-bottom':'2px solid #aaa','border-right':'2px solid #aaa','margin-bottom':'4px','margin-right':'4px'});
                                  },
                                'mouseout' : function(){
                                    this.setStyles({'border':'1px solid #ccc','margin':'5px'});
                                },
                                'click' : function(){
                                    if($defined(tableWaiter)){
                                        tableWaiter.Restore();
                                    }
                                    Testrun.stopSounds();
                                    var t = $time();
                                    myTrial.play_button.store('answer_description',value.fields.description);                                           
                                    myTrial.play_button.store('answer_id',value.fields.id);
                                    myTrial.play_button.store('answer_timer',t);
                                    myTrial.play_button.store('plays',myTrial.options.plays);
                                    myTrial.play_button_label.setStyles({'visibility':'hidden'});
                                    myTrial.play_button.setStyles({'visibility':'hidden'});
                                    $('familiarity_label').set('html',"Please rate how familiar you are with the sound of <strong>" + this.value +"?</strong>");
                                    $('rateFamiliarity').setStyles({'visibility':'visible'});
                                  //  $('rating_percent').focus();
                                    $('rating_percent').set('value','');
                                }
                            }
                }).inject(this.el);
                
            }
        }; // end of options to be loaded into the Testrun    
        Testrun.loadSound(temppath,options);        
    }); // end of sounds each
    /* slider adapted from mootools demo 
       note : seems to fail in IE8 if divs aren't
       present at domready (in the template)
    */
    var familiarity = $('rateFamiliarity');
	var el = $('myElement');
    var el_label = $('familiarity_label');
    var el_percent = $('rating_percent');
// this makes the text above the slider non-selectable
// at least in Mozilla
    el_label.addEvent('mousedown',function(event){return false});
    el.setStyles({
        'margin-right':'auto',
        'margin-left' : 'auto'
    });
	// Create the new slider instance
	mySlider = new Slider(el, el.getElement('.knob'), {
		steps: 100,	// There are 100 steps
		range: [0],	// Minimum value is 0
		onChange: function(value){
                // update the familiarity rating
                $('rating_percent').set('html',value);
                el_percent.addEvent('change',function(){
                mySlider.set(el_percent.value); myTrial.next_button.setStyles({'visibility':'visible','margin-right':'auto','margin-left': 'auto'});
             //   el_percent.focus();
           });
           myTrial.play_button.store('familiarity_rating',value)
		},
	}).set(0); 
    $('rateFamiliarity').addEvent('mouseup',function(){
        myTrial.next_button.setStyles({'visibility':'visible'})
    });
    $('rateFamiliarity').addEvent('mouseout',function(){
        myTrial.next_button.setStyles({'visibility':'visible'})
    });
    $('rating_percent').set('html','--');
    /*
    KEYBOARD INTERFACE
        only works in Firefox
    */
    if(!nogrid){
        var keyed = '';
        var fam_rate = '';
        window.addEvent('keyup',function(event){
         //   console.log(event);
         //   console.log(keyed);
            event.stopPropagation();
            if(event.key == 'enter'){
                    if($(keyed) != null){
                        $(keyed).fireEvent('click');
                        return false;
                    }
                    keyed = '';
            } else {
                switch(event.key){
                    case 'p' :
                        myTrial.play_button.fireEvent('click');
                        keyed = '';
                    break;
                    case 'n' :
                   //     console.log('n');
                        myTrial.next_button.fireEvent('click');
                        keyed = '';
                    break;
                    case 'f' :
                    // up pops a text input element for non-slider entry
                        var rating_percent_input = new Element('input',{
                            'id' : 'rating_percent_input',
                            type : 'text',
                            styles : {
                                width: '50px'
                            }
                        }).inject( $('rating_percent'), 'after' );          
                        $('rating_percent_input').focus();
                        $('rating_percent_input').addEvent('change',function(){
                            mySlider.set(rating_percent_input.value);
                            myTrial.play_button.store('familiarity_rating',rating_percent_input.value);
                            myTrial.next_button.setStyles({'visibility':'visible'});
                            rating_percent_input.dispose();                           
                        });
                        keyed = ''; 
                        break;   
                    default :
                
                    keyed = keyed += event.key;
                }
                /*
                // JB for debugging the event
                console.log(event.key);
                console.log(keyed);
                */
            }
        });
    }
    var options = {
        cover_element : table_surround,
        background : 'url(./images/1px_trans_pink.png)',
    }                      
    tableWaiter = new Waitscreen(options);
    var options = {'table':myTable};
    myTrial.setOptions(options);
}); // end of window add event
