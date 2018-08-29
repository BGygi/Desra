var rating_grid = new Class({
    Implements: [Events,Options],
    initialize : function(options){ 
            this.setOptions(options);
            this.loadData();
    },
    resetForm : function(ev){
        
    },
    drawPage : function(){
        var terms = this.options.data.terms;
        var sounds = this.options.data.sounds;
        var controller = this.options.controller;
        var wrapper = $(this.options.wrapper);
        var play_wrapper = $(this.options.play_wrapper);
        var i = 0;
        var options = {
       
        progressInterval: 10, 
		positionInterval: 10,
        'onRegister': function() {
            i++;
            this.el = new Element('div', {
                'class':'song',
                'styles' : {
                    'width' : '180px',
                    'background-color':'#ffccff'
                }
             });
              
        //    this.title        = new Element('h3', {'class':'title', text:this.url}).inject(this.el);

            this.seekbar  = new Element('div', {
                'class': 'seekbar',
                'styles' : {
                    'width':'130px',
                    'float':'right',
                    'display':'block'
                }
            }).inject(this.el);
            this.controls     = new Element('div', {
                'class':'controls',
                'styles':{
                    'width':'48px',
                }
            }).inject(this.el);

            this.position     = new Element('div', {'class':'position'}).inject(this.seekbar);
            this.seekbar.set('tween', {duration:this.options.progressInterval, unit:'%', link: 'cancel'});
            this.position.set('tween', {duration:this.options.positionInterval, unit:'%', link: 'cancel'});
            this.playEl       = new Element('img', {'class':'play',  src:'images/16-play.png',id:'play'+i }).inject(this.controls);
            this.stopEl       = new Element('img', {'class':'stop',  src:'images/16-stop.png',id:'stop'+i }).inject(this.controls);
            this.pauseEl      = new Element('img', {'class':'pause', src:'images/16-pause.png',id:'pause'+i}).inject(this.controls);
            this.stopEl.addEvent('click', function() { this.stop(); }.bind(this));
            this.playEl.addEvent('click', function() { this.start(); }.bind(this));
            this.pauseEl.addEvent('click', function() { this.pause(); }.bind(this));
            this.seekbar.addEvent('click', function(e) {
                var coords = this.seekbar.getCoordinates();
                var ms = ((e.page.x - coords.left)/coords.width)*this.duration;
                this.jumpTo(ms);
            }.bind(this));
  //          this.el.inject($('playlist'));
            
       //     this.el.inject($('delta'),'top');
            this.el.inject(play_wrapper,'top');
            this.headerEl = new Element('h3',{
                'id' : 'description',
                'html' : mySound.description
            }).inject(play_wrapper,'top');
        },
        'onLoad': function() {},
        'onPause': function() { },
        'onPlay': function() { 
            this.el.addClass('playing');
                
         },
  
        'onStop': function() { 
            this.el.removeClass('playing'); 
        },
   
        'onProgress': function(loaded, total) {
            var percent = (loaded / total*100).round(3);
          //  this.seekbar.get('tween').start('width', percent * .85);
        },
        'onPosition': function(position,duration) {
            if($type(duration) != "number"){
                var fudge_factor = 90;
            } else {
                var fudge_factor = 90;
           //     console.log(duration % 1.00);
                if(duration >= 10){fudge_factor = 99};
                
                if(duration <= 5){fudge_factor = 98};
                
                if(duration <= 3){fudge_factor = 95};
                if(duration <= 2){fudge_factor = 93};
                if(duration <= 1){fudge_factor = 90};
                
              //  console.log([position,duration,fudge_factor]);
                var percent = (position/duration*100).round();
               
            }
            this.position.get('tween').start('left', percent);
            if ( position/duration * 100 > fudge_factor ){
               Playlist.stopSounds();
            }

        },
 
        'onID3': function(key, value) {
            if (key == "TIT2") { this.title.set('text', value); }
        },
        'onComplete': function() {
          //  Playlist.playRandom.delay(100, Playlist);
        }
    }; // end of options
    Playlist = new Playlist();
    myURI = new URI(window.location);
    var usound_id = myURI.getData().sid;
    if($type(usound_id) == "number") {
        var sid = usound_id;
    } else {
        var sid = usound_id;
    }
    var udata = $H({'sid':sid});
    var filteredSounds = sounds.filter(function(item,index){
        if(item.id == sid) return true;
    
    });
        var i = 0;
        
        sounds.each( function (val,ky){
            i++;
            var soundlink = new Element('a',{
                 'text' : val.description,
                 'href' : './rate_sounds.php?sid='+val.id,
                 'styles' : {
                    'display':'block',
                    'width' : '180px',
                 
                    'overflow' : 'auto',
                 
                    'text-decoration' : 'none',
                    'color' : '#333',
                    'font-weight' : 'bolder'
                 }
            }).inject(play_wrapper);

        });
       
    if(filteredSounds.length > 0){
       
        var mySound = filteredSounds.getRandom();
    } else {
        
        var mySound = sounds.getRandom();
    }
                        
//       var mp3_player = "./mp3_playback.php?sid=" + usound_id; 
 Playlist.loadSounds([mySound.mp3_file.path + mySound.mp3_file.filename],options);
   
  //  Playlist.loadSounds([mp3_player],options);
    
  
        var form1 = new Element('form',{
            'id' : 'form1',
            'method' : 'post',
            'action' : 'rate_sounds_handler.php',
        }).inject(wrapper);
        wrapper.setStyles(
            {
               'padding-top':'20px'
            
            }
        );
        var userID = new Element('input',{
            'type' : 'hidden',
            'name' : 'user_id',
            'value' : user_id,
        }).inject(form1);       
        terms.each(function(val,ky){
            var slider_id = 'slider'+ky;
            var linewrapper = new Element('div',{
                styles :  {
                    'width' : '450px',
                    'border' : '1px solid white',
                    'margin-left' : '50px',
                },
            }).inject(form1);

            var right_el = new Element('div',{
                styles :  {
                    'width' : '100px',
                    'border' : '3px solid #333',
                    'float' : 'right',
                    'background-color' : '#333',
                    'color' : '#ffffff',
                    'font-size' : '12px',
                    'font-weight' : 'bolder',
                },
                text : val.right_term
            }).inject(linewrapper);
            var right_input = new Element('input',{
                'type':'hidden',
                'name':'right_term[]',
                'value' : val.right_term,
            }).inject(linewrapper);
            var left_input = new Element('input',{
                'type':'hidden',
                'name' : 'left_term[]',
                'value' : val.left_term,
            }).inject(linewrapper);
            var axis_input = new Element('input',{
                'type':'hidden',
                'name' : 'axis[]',
                'value' : val.axis,
            }).inject(linewrapper);
            
            var left_el = new Element('div',{
                styles :  {
                    'width' : '100px',
                    'border' : '3px solid #333',
                    'background-color' : '#333',
                    'color' : '#ffffff',
                    'font-size' : '12px',
                    'font-weight' : 'bolder',
                    'float' : 'left',
                    'text-align' : 'right',
                },
                text : val.left_term
            }).inject(linewrapper);

            var slider_wrapper = new Element('div',{
                'class' : 'slider_wrapper',
                styles :  {
                    'width' : '200px',
              //      'border' : '1px solid blue',
                    'margin-right' : '120px',
                    'margin-left' : '120px',
                    'text-align' : 'center',
                },
            }).inject(linewrapper);
           
            var slider_el = new Element('div',{
                'id' : 'slider_' + ky,
                'class' : 'slider',
                styles :  {
                    'width' : '200px',
                },
            }).inject(slider_wrapper);
            var knob_el = new Element('div',{
                'id' : 'knob_' + ky,
                'class' : 'knob',
            }
            ).inject(slider_el);
            var slider_value_id = 'slider_value_'+ky;
            var slider_value = new Element('input',{
                'id' : slider_value_id,
                'name' : "slider_value[]",
                'class' : 'slider_value',
                'value' : "--",
                'styles' : {
                    'width': '25px',
                    'cursor':'crosshair',
                    'border' : '2px solid #333'                
                }
            }).inject(knob_el);
            
            var slider_id = new Slider($(slider_el.id),$(knob_el.id),
                {
                    'steps' : '201',
                    'range' : [0,50],
                    'snap' : 'true',
                    'onChange' : function(value){
                       $('slider_value_' + ky).set('value',(value-25)/5);
                     }
                }
            ).set(25);

            knob_el.addEvent('mousedown',function(ev){
                 if($(slider_value_id).value == "--"){
                   $(slider_value_id).set('value','0');
                 }
            });
            $$('.slider_value').each(function(val){
                val.set('value','--');
            });
           
        });

         myButton = new Element ('input',{
                'type' : 'button',
                'value' : 'Submit Selections',
         }).inject(form1);
         myButton.addEvent('click',function(ev){
            form1.send();
            var myURI = new URI(window.location);
          //  window.location = "./rate_sounds.php";
            
        });
            var myHiddenInput = new Element('input',{
                'name' : 'sound_id',
                'value' : mySound.id,
                'type' : 'hidden'
            }).inject($('form1'));
            var myHiddenInput = new Element('input',{
                'name' : 'description',
                'value' : mySound.description,
                'type' : 'hidden'
            }).inject($('form1'));
    }, // end of drawPage()
    onloadData : function(data){
	
      //  this.setData(data);
		// API
	//	this.fireEvent("loadData", {target:this});
    },
    loadData : function(){
        var data = {};
        var request = new Request.JSON({
            url:this.options.url,
            onSuccess : function(data){
                this.sounds = data.sounds;
                this.terms = data.terms;
                this.options.data = data;
              //  this.drawPage(this.options.data);
                this.drawPage();
            }.bind(this)
        }).send();
        
    },

});



