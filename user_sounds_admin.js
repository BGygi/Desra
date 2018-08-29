var i = 0;
function accordionFunction(obj){
    i++;
    var mySound = this.data[obj.row].sound;
    var myMP3 = this.data[obj.row].sound.mp3_files[0];
    var myWav = this.data[obj.row].sound.wav_files[0];
    var myKeywords = this.data[obj.row].sound.keywords;
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
     
     
    Playlist.loadSound( myMP3.fields.path + myMP3.fields.filename , options );

    soundInfoWrapper = new Element('div',{
        'class' : 'soundInfoWrapper',
        'styles' : {
            'border' : '1px solid #ccc',
            'width' : '520px'
        
        },
    }).inject(obj.parent);

    if( $type(myMP3.fields) == 'object' ){
        mp3_container = new Element('div',{
            'class' : 'soundInfoCol',
            styles : {
                    'float':'right',
            },
        }).inject(soundInfoWrapper);       

        myHeader = new Element('h3',{
                    html : 'MP3 File Info',
                    'class' : 'soundInfoCol',
        }).inject(mp3_container,'top');
    
        mp3_info = new Element('div',{
            styles : {
                'font-size' : 'inherit'
            }
        }).inject(mp3_container);
        var mp3_props = $H({'Path': myMP3.fields.path ,'Byterate' : myMP3.fields.wave_byterate,'Framerate': myMP3.fields.wave_framerate ,'Wave_id': myMP3.fields.wave_id , 'Compression' : myMP3.fields.wave_compression, 'Filesize': myMP3.fields.filesize});

        mp3_props.each(function(value,key){ 
            this.el = new Element('div',{
                html : key + " : "+value,
                styles : {
                    'font-size' : 'inherit'
                }
            }).inject(mp3_container);
        
        },this);
         
        if($type(myKeywords) == 'array'){
            keyword_wrapper = new Element('div',{
                'class' : 'soundInfoCol',               
                styles : {
                    'float' : 'left'
                }
            }).inject(soundInfoWrapper);
                   
            myWavDiv = new Element('div',{
                'class':'soundInfoCol',
                'styles':{
                    'margin-left':'175px',
                    'margin-right':'175px'
                }
            }).inject(soundInfoWrapper);
            if($defined(myWav)){
               msg = myWav.fields.filename;
            } else {
               msg = "No associated .wav file.";
            }
            myWavDiv.set('html',msg);
            addWav = new Element('a',{
                'html': '<p>Add/Replace Wav File</p>',
                'href' : 'upload_wav_file.php?sid='+mySound.fields.id,
                'class': 'soundInfoCol'
            }).inject(myWavDiv);
            wavHeader = new Element('h3',{
                'html' : "Wav File Info",
                styles : {
                        'font-size' : '11px',
                        'background-color' : '#333',
                        'color':'#eee',
                        'border':'0px solid #eee',
                        'width':'165px',
                        'text-align':'center'
                    }            
             }).inject(myWavDiv,'top');
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
                
                myX = new Element('img',{
                    'styles' : {
                        'float' : 'right',
                        'cursor' : 'pointer'
                    },
                    'src' : './images/12-em-cross.png',
                    events : {
                        'click' : function(event){
                            myRequest = new Request.JSON({
                                'url': 'keyword_handler.php',
                                    'method' : 'post',
                                    'data' : {
                                    'keyword_id' : value.fields.id,
                                    'sound_id' : mySound.fields.id,
                                    'action' : 'remove'
                                },
                                onSuccess : function(responseText,responseXML){
                                    
                                }
                        
                            }).send();
                            $('keyword'+value.fields.id+"_"+mySound.fields.id).destroy();
                        }.bind(this)
                    }
                }).inject(myKeyword);
                myX.store('sound_id',mySound.id);
            
               myEd = new Element('img',{
                    'id' : 'keyword_edit_img'+value.fields.id+"_"+mySound.fields.id,
                    'styles' : {
                        'float' : 'right',
                        'cursor' : 'pointer',
                        'margin-right' : '16px'
                    },
                    events:{
                        'click' : function(e){
                         //   console.log(e);
                          //  console.log($())
                            myInput = new Element('input',{
                                type : 'text',
                                id : 'keyword_edit_input'+value.fields.id+"_"+mySound.fields.id,
                                value : value.fields.keyword,
                                styles : {
                                    color : '#333'
                                },
                                events: {
                                 /*
                                    'click' : function(){
                                        $('keyword_edit_input'+value.fields.id+"_"+mySound.fields.id).set('value','');
                                        $('keyword_edit_input'+value.fields.id+"_"+mySound.fields.id).setStyles({color:'#333'});
                                   
                                    },
                                    */
                                    'change' : function(){

                                            myRequest = new Request.JSON({
                                                    'url': 'keyword_handler.php',
                                                    'method' : 'post',
                                                    'data' : {
                                                    'keyword_id' : value.fields.id,
                                                    'sound_id' : mySound.fields.id,
                                                    'keyword' : this.value,
                                                    'action' : 'edit'
                                                },
                                       
                                                onSuccess : function(responseText,responseXML){
                                                    
                                                  datagrid.refresh();
                                                
                                        
                                                }
                        
                                            }).send();
                                      //      console.log(this.id);
                                       //     console.log(this.value); 
                                    }
                                }
                            }).replaces($('keyword'+value.fields.id+"_"+mySound.fields.id));
                         //   console.log(this.id);
                        }
                    },
                    'src' : './images/12-em-pencil.png',
                }).inject(myKeyword);
                
            }); // end of keywords.each
        add_one_container = new Element('div',{'width':'160px','float':'right'}).inject(keyword_wrapper);
        addOne = new Element( 'input', {
            'value' : 'add another',
            'styles' : {
                'font-size': '10px',
                'width' : '130px',
                'color' : '#999',
                'margin' : '5px'           
            },
            'events' : {
                'change' : function(event){
                    sound_id = mySound.fields.id;
                    addKeyword(sound_id,this.value);
                    
                },
       
                'focus' : function(event){
                    this.set('value','');
                    this.set('styles',{'color':'#333'});
                }
            }       
        }).inject(add_one_container);
        plusSign = new Element('img',{
            src : './images/12-em-plus.png',
            styles : {
                'cursor':'pointer'
            },
            events : {
                'click' : function(event){ event.preventDefault() },
                'mouseover' : function(){}
                
            }
        }).inject(add_one_container);
    } // end if keywords array

    myClear = new Element('div',{
        styles : {
            'width' : '520px',
            'border-top' : '1px solid #ccc',
            'clear' : 'both'
        }
    }).inject(soundInfoWrapper);
    // makes keywords sortable drag and drop
    var mySortables = new Sortables($$('.kw_ul'), {
            revert: { duration: 500, transition: 'elastic:out' }, 
            onComplete : function(element){
                    classname = element.get('class');
                    if(classname.contains('master_tag')||classname.contains('erow')){
                       classname = classname.replace(' master_tag','');
                       classname = classname.replace(' erow','');
                    }
                    var els = $$("."+classname);
                    var send_array = [];
                    var nels = [];
                    els.each(function(value,index){
                        nels.push(value.id);
                        var sound_id = value.id.split('_')[1];
                        var keyword_id = value.id.split('_')[0].replace('keyword','');
                        send_array.push([sound_id,keyword_id,index])
        
                    });
                  //  console.log(nels);
                if($defined($(nels[0]))){
                element.removeClass('master_tag');
                $(nels[0]).addClass('master_tag');
                    myJSON = new Request.JSON({
                        'url' : 'keyword_handler.php',
                            'method' : 'post',
                            'data' : {
                                'action' : 'reorder_keywords',
                                'send_array' : send_array,                        
                            },
                        
                    }).send();
                }
            }
        });
   

    }
 //   obj.parent.adopt(myDiv);
    
} // end accordionFunction

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
         datagrid.search( $('searchterm').value );
     }
  
     function clearSearchGrid() {
         datagrid.clearSearch();
         $('searchterm').set('value', '');
     }
    

    var cmu = [            

            {
               header: "Description",
               dataIndex: 'description',
               dataType:'string',
               width:150
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
                width:75
            },
            {
                header: "Has MP3",
                dataIndex: 'has_mp3',
                dataType: 'string',
                width:75
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
               width:75
            }
             ];	
    
window.addEvent("domready", function(){

    Playlist = new Playlist();

            $('searchbt').addEvent("click", searchGrid);
            $('clearsearchbt').addEvent("click", clearSearchGrid);         
	        datagrid = new omniGrid('mygrid', {
	        columnModel: cmu,
	        buttons : [
	      
              {name: 'Add To Selection Set', bclass: 'add_to_set', onclick : gridButtonClick},
	      //    {name: 'Delete', bclass: 'delete', onclick : gridButtonClick},
	        //  {separator: true},
	        //  {name: 'Duplicate', bclass: 'duplicate', onclick : gridButtonClick}
                {separator : true}
	        ],
	        url:"user_sounds_data.php",
	        perPageOptions: [6,12,24],
	        perPage:6,
	        page:1,
	        pagination:true,
	        serverSort:true,
	        showHeader: true,
	        alternaterows: true,
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
        var myEl = $('selection_set_select');
        myEl.addEvent('change',function(event){
            myJSON = new Request.JSON({
                url: 'selection_set_handler.php',
                method : 'post',
                data : {
                  selection_set_id : myEl.getSelected()[0].value
                },
                onSuccess : function(responseText,responseXML){
                        $('selected_set').empty();
                        responseText.sounds.each( function (value,index){
                        myX = new Element('img',{
                            src : './images/12-em-cross.png',
                            alt : 'Remove from set',
                            styles : {
                                'float': 'right',
                                
                                'cursor' : 'pointer'                        
                            },
                            events : {
                                'click' : function(event){
                                    confirm('Remove?');
                                    sound_id = value.fields.id;
                                    ss_id =  $('selection_set_select').getSelected().get('value')[0];
                                    deleteSoundFromSet(sound_id,ss_id);                                    
                                }                      
                            }
                        });
                       innerEl = new Element('div',{
                            styles: {
                                'font-size' : '10px',
                                'font-weight' : 'bold',
                                'border-bottom' : '1px solid #aaa',
                                'width' : '175px'
                        },
                        html: value.fields.description
                    });
                    myX.inject(innerEl);
                    innerEl.inject($('selected_set'));
                      
                      
                    });         
                }
            });
            myJSON.send();
        });
        
    });
