var i = 0;
function accordionFunction(obj){
    i++;
    var mySound = this.data[obj.row].sound;
    // mp3s and wavs are actually arrays but we
    // only use the first one
    var myMP3 = this.data[obj.row].sound.mp3_files[0];
    var myWav = this.data[obj.row].sound.wav_files[0];
    
    var myKeywords = this.data[obj.row].sound.keywords;
    if($type(myWav) != "object"){
        myWav = {
            "fields": {
                "filename":null
            }
        };
    }
    options = {
        'swfLocation': './swf/MooSound.swf',
        'onRegister' : function(e){
            this.el = new Element('div',{
                    'styles' : {
                    'width' : '510px',
                    'border' : '1px solid #ccc'
                }
            });

            this.controls = new Element('div', {
                styles : {
                    'cursor' : 'pointer', 
                    'width' : '50px',
                    'padding-top' : '5px',
                    'float' : 'left'
                }         
            }).inject(this.el);
            this.playEl       = new Element('img', {'class':'play',  src:'images/16-play.png',id:'play'+i }).inject(this.controls);
            this.stopEl       = new Element('img', {'class':'stop',  src:'images/16-stop.png',id:'stop'+i }).inject(this.controls);
            this.pauseEl      = new Element('img', {'class':'pause', src:'images/16-pause.png',id:'pause'+i}).inject(this.controls);
            this.seekbar      = new Element('div', { styles : {'margin-left' : '60px'},'class': 'seekbar'}).inject(this.el);

            this.position     = new Element('div', {'class':'position'}).inject(this.seekbar);


            this.playEl.addEvent('click', function() { this.start(); }.bind(this));
            this.stopEl.addEvent('click', function() { this.stop(); }.bind(this));
            this.pauseEl.addEvent('click', function() { this.pause(); }.bind(this));
            this.seekbar.addEvent('click', function(e) {
            var coords = this.seekbar.getCoordinates();
            var ms = ((e.page.x - coords.left)/coords.width)*this.duration;
            this.jumpTo(ms);
            }.bind(this));
            this.seekbar.set('tween', {duration:this.options.progressInterval, unit:'%', link: 'cancel'});
            this.position.set('tween', {duration:this.options.positionInterval, unit:'%', link: 'cancel'});
  
            obj.parent.adopt(this.el);
            obj.parent.setStyles({'background-color':'#ececee'});
        }, // end of onRegister
        positionInterval: 100,
        progressInterval: 500,
        'onLoad': function() { },
        'onPause': function() { },
        'onPlay': function() { this.el.addClass('playing');    },
  
        'onStop': function() { this.el.removeClass('playing'); },
   
        'onProgress': function(loaded, total) {
            var percent = (loaded / total*100).round(2);
            this.seekbar.get('tween').start('width', percent * .85);
        },
        'onPosition': function(position,duration) {
            var percent = (position/duration*100).round(2);
            this.position.get('tween').start('left', percent);
            if ( position.round()/duration.round() * 100 > 99 ){
                    this.stop();
            }
         },
 
        'onID3': function(key, value) {
            if (key == "TIT2") { this.title.set('text', value); }
        },
        'onComplete': function() {
          //  Playlist.playRandom.delay(100, Playlist);
        }
    
    
    
    
    }// end of options
     
//    var mp3_player = "./mp3_playback.php?sid=" + mySound.fields.id; 
    Playlist.loadSound( myMP3.fields.path + myMP3.fields.filename , options );
//       Playlist.loadSound( mp3_player , options );
    var soundInfoWrapper = new Element('div',{
        'class' : 'soundInfoWrapper',
    }).inject(obj.parent);
    var actionWrapper = new Element('div',{
        'id': 'actionWrapper_'+mySound.fields.id,
        'styles':{
            'width':'540px',
            'background-color':'#ccc'
        }
    }).inject(obj.parent);
    var rateLink = new Element('a',{
        'styles':{
            'width':'200px'
        },
        'text' : 'Rate the sound, '+mySound.fields.description,
        'href' : 'rate_sounds.php?sid='+mySound.fields.id,
  //  }).inject(actionWrapper);
    }) // don't inject link, can't get this to work in IE

     var myMask = new Mask();

    if( $type(myMP3.fields) == 'object' ){
        mp3_container = new Element('div',{
            'class' : 'soundInfoCol',
            styles : {
                    'float':'right',
            },
        }).inject(soundInfoWrapper);       
        myHeader = new Element('h3',{
                 html : 'MP3 File',
                //      "html" : myMP3.fields.original_filename,
               //     'html' : get(myMP3.fields.original_filename),
                 'class' : 'soundInfoCol',
        }).inject(mp3_container,'top');
    
        mp3_info = new Element('div',{
            styles : {
                'font-size' : 'inherit'
            }
        }).inject(mp3_container);

     /* cut down props since in show sound info 
        var mp3_props = $H({'Path': myMP3.fields.path ,'Byterate' : myMP3.fields.wave_byterate,'Framerate': myMP3.fields.wave_framerate ,'Wave_id': myMP3.fields.wave_id , 'Compression' : myMP3.fields.wave_compression, 'Filesize': myMP3.fields.filesize});
    */
        this.el = new Element('div',{
                'html' : myMP3.fields.original_filename,
                styles : {
                    'font-size' : 'inherit'
                }
        }).inject(mp3_container);
        var mp3_props = $H({'Filesize': myMP3.fields.filesize ,'Downloads': myMP3.fields.downloads});
        if ( $type(mp3_props.Downloads) != "string"){
            mp3_props.Downloads = "0";
        } 
        mp3_props.each(function(value,key){ 
            this.el = new Element('div',{
                'html' : key + " : "+value,
                'styles' : {
                    'font-size' : 'inherit'
                }
            }).inject(mp3_container);
        
        },this);
        myDL = new Element('a',{
                "html" : "download",
                "href" : $empty,
                "events" : {
                    "click" : function(ev){
                        ev.stop();
                        window.location = "mp3_file_download.php?mid=" + myMP3.fields.id;
                    }
                
                }
        }).inject(mp3_container);
            keyword_wrapper = new Element('div',{
                'class' : 'soundInfoCol',               
                styles : {
                    'float' : 'left'
                }
            }).inject(soundInfoWrapper);
                   
        myWavDiv = new Element('div',{
            'class':'soundInfoCol',
            'styles':{
                'margin-left':'185px',
                'margin-right':'175px',
                'width' : '165px'
            }
        }).inject(soundInfoWrapper);
    if($defined(myWav)){
   /*
               var msg = myWav.fields.original_filename;
               msg += "<br />" + myWav.fields.filesize;
               msg += "<br />" + myWav.fields.duration;
            } else {
               var msg = "No associated .wav file.";
            }
            myWavDiv.set('html',msg);
    */
        this.el = new Element('div',{
            'html' : myWav.fields.original_filename,
            styles : {
                'font-size' : 'inherit'
            }
        }).inject(myWavDiv);
        var wav_props = $H({'Filesize': myWav.fields.filesize ,'Duration': myWav.fields.duration,'Downloads': myWav.fields.downloads});
        if ($type(wav_props.Downloads)!= "string"){
            wav_props.Downloads = "0";
        }
        wav_props.each(function(value,key){ 
            this.el = new Element('div',{
                html : key + " : "+value,
                styles : {
                'font-size' : 'inherit'
            }
            }).inject(myWavDiv);
    
        },this); 
        myDL = new Element('a',{
            "html" : "download",
            "href" : $empty,
            "styles" : {
                "display" : "block",
                "width" : "120px"
            },
            "events" : {
                "click" : function(ev){
                    ev.stop();
                    location = "wav_file_download.php?wid=" + myWav.fields.id;
                }
            
            }
        }).inject(myWavDiv);
         /*
            addWav = new Element('a',{
                'html': '<p>Add/Replace Wav File</p>',
                'href' : 'upload_wav_file.php?sid='+mySound.fields.id,
                'class': 'soundInfoCol'
            }).inject(myWavDiv);
         */
        wavHeader = new Element('h3',{
            'html' : "Wav File",
            'class' : 'soundInfoCol',            
         }).inject(myWavDiv,'top');
      } // end of if($defined(myWav))
            keyword_container = new Element('ul',{
                'class' : 'kw_ul',
                styles : {
                    'width': '160px',
                    'font-size':'10px',
                    'background-color': '#ccc'
                },
                events : {
                    'click' : function (event){
                  
                }}
            }).inject(keyword_wrapper);
            myHeader = new Element('h3',{
                    'html' : 'Keywords',
                    'class' : 'soundInfoCol'
                    
            }).inject(keyword_wrapper,'top');
            var k = 0;

            myKeywords.each(  function(value,index){
                k++;
              //  console.log(value.fields.keyword);
                myKeyword = new Element('li',{
               //     id : 'keyword'+value.fields.id+"_"+mySound.fields.id,
                    'id' : 'keyword'+value.fields.id+"_"+mySound.fields.id,
                    'class' : 'sound' + mySound.fields.id, 
                    'styles' : {
                        'width' : '152px',
                        'background-color' : '#ccc',
                        'font-size': '10px',
                        'cursor':'pointer',
                        'padding-left':'5px'
                    },
                    'events' : {
                        'mouseover' : function(){
                            
                                this.setStyles({
                                    'background-color':"#dddddd",
                                    'color' : '#000000'
                                });
                            
                        },
                        'mouseout' : function(){
                           
                                this.setStyles({
                                    "background-color":"#cccccc",
                                    "color" : "#000000"
                                });
                            
                        }
                    },
                    
                    'html' :  value.fields.keyword
                    }).inject(keyword_container);
             //   }).inject(keyword_container).addClass('sound'+mySound.fields.id);
            
                if(k == 1){
                    
                    myKeyword.addClass('master_tag');

                }
                
               
                
            }); // end of keywords.each
         var myClear = new Element('div',{
            styles : {
                'width' : '520px',
                'border-top' : '1px solid #ccc',
                'clear' : 'both'
            }
        }).inject(soundInfoWrapper);
        var soundActionWrapper = new Element("h3",{
            "class" : "soundInfoCol",
            "styles" : { 
                "width" : "auto",
                "border" : "0px solid #ccc"
            }
        }).inject(soundInfoWrapper)
        var waveInfoLink = new Element("a",{
            "styles" : {
                "width":"240px",
    
            },
            "events" : {
                "click" : function(ev){
                  //  allow page to jump to top on show wave info
                  //  ev.stop();
                    showWaveInfo(myWav,mySound,myMP3,myKeywords);
                }
            },
            "text" : "Show Sound Data",
            "href" : "#"
        }).inject(soundActionWrapper,'bottom');
        var waveInfoDL = new Element("a",{
            "styles" : {
                "width":"240px",
                "margin-left" : "30px"        
            },
            "events" : {
                        "click" : function(ev){
                            ev.stop();
                            var loc = "wave_info_download.php?sid=" + mySound.fields.id;
                            loc += "&wid=" + myWav.fields.id;
                            loc += "&mid=" + myMP3.fields.id;
                            window.location = loc;
                        }
                    
            },
            "text" : "Download Sound Data",
            "href" : $empty
        }).inject(soundActionWrapper,'bottom');
    

   }
 //   obj.parent.adopt(myDiv);
    
} // end accordionFunction

function showWaveInfo(wavOb,soundOb,mp3Ob,keywordAr){
    var myMask = new Mask();
    myMask.show();
    i = 0;
    var pos = $('wrapper_2').getPosition();
    var size = $('wrapper_2').getSize();
    WavInfo = new Element('div',{
        "id" : "wav_info",
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
    }).inject($('wrapper_2')).reveal();
    WavInner = new Element('div',{
        "styles" : {
            "text-align" : "left",
            "background-color" : "#eee",
            "width":"250px",
            "margin-left" : "270px",
            "padding" : "5px"
        }       
    }).inject(WavInfo);

    SoundInner = new Element('div',{

         "styles" : {
            "text-align" : "left",
            "background-color" : "#eee",
            "width":"250px",
            "float":"left",
            "padding" : "5px"
        }
    }).inject(WavInfo,"top");
    Column3Inner = new Element('div',{
        "styles" : {
            "text-align" : "left",
            "background-color" : "#eee",
            "width":"250px",
            "float" : "right",
            "padding" : "5px"
        }
    }).inject(WavInfo,"top");
    incrementer = 0
    $each(soundOb.fields,function(val,key){

            if( val != null && val.length > 0 ){
                var attributeDiv = new Element('div',{
                    "html" : key + " : " + val
                }).inject(SoundInner);
                if( key == "channels"){
                    var newDiv = new Element('div',{
                        "id" : key,
                        "styles" : {
                            "border" : "1px solid #ccc",
                            "width" : "auto",                        
                        }
                    }).inject(SoundInner)
                }
            } else {
                var attributeDiv = new Element('div',{
                    'html' : key + " : N/A"
                }).inject(SoundInner); 
           //     var txt = WavInfo.get('html'); 
           //     WavInner.set('html',txt + key + " : N/A" + "<br />");
            }
                 
    });
    $each(wavOb.fields,function(val,key){

            if( val != null && val.length > 0 ){
                var attributeDiv = new Element('div',{
                    "html" : key + " : " + val
                }).inject(WavInner);
                if( key == "channels"){
                    var newDiv = new Element('div',{
                        "id" : key,
                        "styles" : {
                            "border" : "1px solid #ccc",
                            "width" : "250px",
                            "overflow-x" : "auto"
                                                    
                        }
                    }).inject(WavInner)
                }
            } else {
                var attributeDiv = new Element('div',{
                    'html' : key + " : N/A"
                }).inject(WavInner); 
           //     var txt = WavInfo.get('html'); 
           //     WavInner.set('html',txt + key + " : N/A" + "<br />");
            }
                 
    });
    var newDiv = new Element('div',{
        "id" : "autocorrelation_peaks",
        "styles" : {
            "border" : "1px solid #ccc",
            "width" : "auto",                        
        }
    }).inject(WavInner);
    $$('.fadeout').addEvent('click', function(){
        this.nix();
        myMask.hide();
     //   $('wav_info').destroy();
    }),this;
    myWavJSON = new Request.JSON({
        "url" : "extended_wav_info.php",
        "method" : "post",
        "data" : {
            "wav_id" : wavOb.fields.id,
            "sound_id" : soundOb.fields.id
        },
        "onSuccess" : function(xml,txt){
        //    console.log($('channels'));
            
         //   $('channels').set('html',txt);
            incrementer = 0;
            var description_row = ["description :"];
            var level_row = ["level :"];
            var peak_row = ["peak"];
            var dc_offset_row = ["dc_offset :"];

            if(xml.channels.length){
                $each(xml.channels,function(val,key){
                /*
                    var channellink = "<a href='editor.php?classname=Channel&id=";
                    channellink += val.id;
                    channellink += "'>";
                    channellink += val.description;
                    channellink += "</a>";
                    description_row.push(channellink);
                    level_row.push(val.level);
                    peak_row.push(val.peak);
                    dc_offset_row.push(val.dc_offset);
                */
                    
                    description_row.push(val.description);
                    level_row.push(val.level);
                    peak_row.push(val.peak);
                    dc_offset_row.push(val.dc_offset);
                });

                var channelTable = new HtmlTable({
                    "properties" : {
                    "cellspacing" : "0px",
                    "cellpadding" : "2px",
                    "border" : "0",
                    "width" : xml.channels.length * 125
                    },
                    "rows" : [description_row,level_row,peak_row,dc_offset_row]           
                }).inject($('channels'));
           }
           if(xml.autocorrelation_peaks.length){
                var acpdesc = new Element('div',{
                    "html" : "autocorrelation_peaks :"
                }).inject($('autocorrelation_peaks'));
                var rows = [];
                $each(xml.autocorrelation_peaks,function(val,key){
                  /*
                    var peaklink = "<a href='editor.php?classname=Autocorrelation_peak&id=";
                    peaklink += val.id;
                    peaklink += "'>";
                    peaklink += val.frequency;
                    peaklink += "</a>";
                    var frequency_row = ["frequency :"];
                  //  frequency_row.push(val.frequency);
                    frequency_row.push(peaklink);
                  */
                    var frequency_row = ["frequency :"]; 
                    frequency_row.push(val.frequency);
                    rows.push(frequency_row);                   
                });
                var acpTable = new HtmlTable({
                    "properties" : {
                    "cellspacing" : "2px",
                    "cellpadding" : "2px",
                    "border" : "0"
                    },
                    "rows" : rows     
                }).inject($('autocorrelation_peaks'));
           }
           if(xml.citations.length){
               CiteH = new Element('h3',{
                    "html":"Citations"
                }).inject(Column3Inner);
                var rows = [];
                $each(xml.citations,function(val,key){
                    var citation_row = [val.fields.citation];
                    
                 //     console.log(val);
                  rows.push(citation_row);                   
                });
                var citationTable = new HtmlTable({
                    "properties" : {
                    "cellspacing" : "2px",
                    "cellpadding" : "2px",
                    "border" : "0"
                    },
                    "rows" : rows     
                }).inject(Column3Inner);
           }
           if(keywordAr.length){
               KeyH = new Element('h3',{
                    "html":"Keywords"
                }).inject(Column3Inner);
                var rows = [];
                $each(keywordAr,function(val,key){
                    var keyword_row = [val.fields.keyword];
                    
                 //     console.log(val);
                  rows.push(keyword_row);                   
                });
                var keywordTable = new HtmlTable({
                    "properties" : {
                    "cellspacing" : "2px",
                    "cellpadding" : "2px",
                    "border" : "0"
                    },
                    "rows" : rows     
                }).inject(Column3Inner);
           }
        }
    }).send();
    var wav_id = wavOb.fields.id;
    var mp3_id = mp3Ob.fields.id;
    var sound_id = soundOb.fields.id;
    WavH = new Element('h3',{
        "html":"Wav File"  
    }).inject(WavInner,"top");
    SoundH = new Element('h3',{
        "html":"Sound File"
    }).inject(SoundInner,"top");
    Mp3H = new Element('h3',{
        "html":"MP3 File"
    }).inject(Column3Inner,"top");
    $each(mp3Ob.fields,function(val,key){

            if( val != null && val.length > 0 ){
                var attributeDiv = new Element('div',{
                    "html" : key + " : " + val
                }).inject(Column3Inner);
               
            } else {
                var attributeDiv = new Element('div',{
                    'html' : key + " : N/A"
                }).inject(Column3Inner); 
           //     var txt = WavInfo.get('html'); 
           //     WavInner.set('html',txt + key + " : N/A" + "<br />");
            }
                 
    });

};

function addKeyword(sound_id,keyword){

    myRequest = new Request.JSON({
        'url' : 'keyword_handler.php',
         'method' : 'post',
         data : {
            'keyword' : keyword,
            'sound_id' : sound_id,
            'action' : 'add'
         },
         onSuccess : function(responseText,responseXML){
            datagrid.refresh();
         }                                
    }).send();
                    
}



function deleteSoundFromSet(sound_id,ss_id){
    
    
    myRequest = new Request.JSON({
            url: 'selection_set_handler.php',
            method : 'post',
            data : {
         /*
            sound_ids : ret.sound_ids,
            selection_set_ids : ret.selection_set_ids,
            selection_set_id : ret.selection_set_ids[0]
          */
            'delete' : sound_id,
            'selection_set_id' : ss_id
        },
        onSuccess : function(responseText,responseXML){
            $('selected_set').empty();
            responseText.sounds.each( function (value,index){
                myX = new Element('div',{
                    styles : {
                        'float': 'right',
                        'color' : 'red',
                        'width' : '10px',
                        'font-size' : '10px',
                        'font-weight' : 'bold',
                        'cursor' : 'pointer'                        
                    },
                    events : {
                        'click' : function(event){
                            sound_id = value.fields.id;
                            ss_id =  $('selection_set_select').getSelected().get('value')[0];
                            deleteSoundFromSet(sound_id,ss_id);                                    
                        }                      
                    },
                    html : "X"
                });
                myEl = new Element('div',{
                    styles: {
                        'font-size' : '10px',
                        'font-weight' : 'bold',
                        'border-bottom' : '1px solid #aaa',
                        'width' : '175px'
                },
                html: value.fields.description
            });
            myX.inject(myEl);
            
            myEl.inject('selected_set');
             
        });         
        }
    }).send();
      //  console.log('sound: '+ sound_id);
     //   console.log('sel_set: ' + ss_id);
}

    function gridButtonClickBAK(button, grid)
    {
        indices = this.getSelectedIndices();
        indices.each(
            function(value,index){
               myEl = new Element('div', {
                    'html' : grid.getDataByRow(value).description
               })
               myRequest = new Request.JSON(
                    {
                        url: 'selection_set_handler.php',
                        method : 'post',
                        data : {
                            sound_id : grid.getDataByRow(value).id,
                            selection_set_id : $('selected_set').getSelected().get('value')
                        },
                        onSuccess : function(responseText,responseXML){
                            myEl = new Element('select', {
                                width : '180px',                           
                            });
                            responseText.selection_sets.each( function(value,index){
                                    myOption = new Element('option',{
                                        value : value.id,
                                        text : value.description                                        
                                    });
                                    myOption.inject(myEl);
                                }
                            );                      
                        }
                    }
               );
               myRequest.send(
               );
          //     $('selection_set').adopt(myEl);
               
        });

    }	

    function gridButtonClick(button, grid)
    {
        ret = [];
        ret.sound_ids = [];
        ret.selection_set_ids = [];
        this.getSelectedIndices().each( function(value,index){
            ret.sound_ids.push( grid.getDataByRow(value).id );
        });
        $('selection_set_select').getSelected().each ( function(value,index){
            ret.selection_set_ids.push( value.value );
        });
        if(ret.selection_set_ids[0] > 0){
        myRequest = new Request.JSON({
                url: 'selection_set_handler.php',
                method : 'post',
                data : {
                sound_ids : ret.sound_ids,
                selection_set_ids : ret.selection_set_ids,
                selection_set_id : ret.selection_set_ids[0]
            },
            onSuccess : function(responseText,responseXML){
                $('selected_set').empty();
                responseText.sounds.each( function (value,index){
                    myX = new Element('div',{
                        styles : {
                            'float': 'right',
                            'color' : 'red',
                            'width' : '10px',
                            'font-size' : '10px',
                            'font-weight' : 'bold',
                            'cursor' : 'pointer'                        
                        },
                        events : {
                            'click' : function(event){
                                sound_id = value.fields.id;
                                ss_id =  $('selection_set_select').getSelected().get('value')[0];
                                deleteSoundFromSet(sound_id,ss_id);                                    
                            }                      
                        },
                        html : "X"
                    });
                    myEl = new Element('div',{
                        styles: {
                            'font-size' : '10px',
                            'font-weight' : 'bold',
                            'border-bottom' : '1px solid #aaa',
                            'width' : '175px'
                    },
                    html: value.fields.description
                });
                myX.inject(myEl);
                
                myEl.inject('selected_set');
          //    console.log(value.fields.description);  
            });         
            }
       }).send();
       }
    }	
    

    
	function onGridSelect(evt)
	{
        
        Playlist.stopSounds();
    
	 	//	console.log('click ' +evt.target+' '+evt.indices+' '+evt.row);
	//	Playlist.stopSounds();
//	console.log( 'row: '+evt.row+' indices: '+evt.indices+' id: '+evt.target.getDataByRow(evt.row).id );
	}
	
	function onGridDblClick(evt)
	{
    	// console.log('dblclick '+evt.target+' '+evt.row);
	}
	
	function filterGrid()
	{
		datagrid.filter( $('filter').value );
	}
	
	function clearFilter()
	{
		datagrid.clearFilter();
	}

	function setDataFirstRow()
	{
    /*
		datagrid.setDataByRow(1, {option_id:0, option_name:'ds', blog_id:1});
	*/
        datagrid.setDataByRow(1, {option_id:0, option_name:'ds', blog_id:1});
    }
	

	function deleteSelectedRow()
	{
		var indices = datagrid.getSelectedIndices();
		
		for (var i=0; i<indices.length; i++)
		{
			datagrid.deleteRow(indices[i]);
		}		
	}
	
	function refresh()
	{
        datagrid.refresh();
	}

	 function searchGrid() {
        datagrid.options.page = 1;
         datagrid.search( $('searchterm').value );
     }
  
     function clearSearchGrid() {
         datagrid.clearSearch();
         $('searchterm').set('value', '');
     }
    // example of how to stop the row click accordian function
     function mp3Click(ob){
        $(ob).addEvent('click',function(ev){
            ev.stop();
          //  console.log(ob.id);
        });
     }
    var cmu = [            

            {
               header: "Description",
               dataIndex: 'description',
               dataType:'string',
               width:175
            } ,
            {
               header: "Length",
               dataIndex: 'wave_length',
               dataType:'number',
               width:60
            },
            {
                header: "Has WAV",
                dataIndex: 'has_wav',
                dataType: 'string',
                width:70
            },
            {
                header: "Has MP3",
                dataIndex: 'has_mp3',
                dataType: 'string',
                width:70
            },
            {
                header: "Kbit/Sec",
                dataIndex: 'wave_byterate',
                dataType: 'number',
                width:75
            },  
            {
               header: "Samples/Sec",
               dataIndex: 'wave_framerate',
               dataType:'number',
               width:90
        
            },
       
            {
               header: "U",
               dataIndex: 'user_id',
               dataType:'string',
               width:20
            }
         
             ];	
    
window.addEvent("domready", function(){

    Playlist = new Playlist();

            $('searchbt').addEvent("click", searchGrid);
            $('clearsearchbt').addEvent("click", clearSearchGrid);         
	        datagrid = new omniGrid('mygrid', {
	        columnModel: cmu,
	        buttons : [], // no buttons
	        url:"sound_data.php",
	        perPageOptions: [6,12,24],
	        perPage:6,
	        page:1,
	        pagination:true,
	        serverSort:true,
	        showHeader: true,
	        alternaterows: false,
	        showHeader:true,
	        sortHeader:true,
	        resizeColumns:false,
	        multipleSelection:true,
	        
	        // uncomment this if you want accordion behavior for every row
	    
	        accordion:true,
	        accordionRenderer:accordionFunction,
	        autoSectionToggle:true,
	       
            			
	        width:570,
	        height: 320,
            clickedrow:false
	    });
        
        
    });
