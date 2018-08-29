var mp3_base_dir = './sounds/uploads/320_Kbit/';
function playMe(filename){
var mp3_base_dir = './sounds/uploads/320_Kbit/';
    var mp3 = mp3_base_dir + filename;
   // var mySound = Playlist.getSound(filename);
  //  console.log(Playlist.loadSound(filename));
  //  console.log(mySound = Playlist.getSound(filename));
  //  mySound = Playlist.getSound(filename);
  //   console.log(mySound.start(0));
    
    options = {
        
        'onLoad': function(){ console.log(mp3 + " loaded") },
        'onPosition': function(position,duration){ 
            if ( position/duration * 100 > 99 ){
               Playlist.stopSounds();
            } 
        }
    }
   
    Playlist.stopSounds();
    Playlist.loadSounds([mp3],options);
    mySound = Playlist.getSound(mp3);
    mySound.start(0);
}
   /*
window.addEvent('domready', function() {

    var i = 0;
    var options = {
        'onRegister': function() {
            i++;
            this.el = new Element('div', {'class':'song'});
            this.title        = new Element('h3', {'class':'title', text:this.url}).inject(this.el);
            this.controls     = new Element('div', {'class':'controls'}).inject(this.el);
            this.seekbar      = new Element('div', {'class': 'seekbar'}).inject(this.el);
            this.position     = new Element('div', {'class':'position'}).inject(this.seekbar);
            this.seekbar.set('tween', {duration:this.options.progressInterval, unit:'%', link: 'cancel'});
            this.position.set('tween', {duration:this.options.positionInterval, unit:'%', link: 'cancel'});
            this.playEl       = new Element('img', {'class':'play',  src:'./images/play.png',id:'play'+i }).inject(this.controls);
            this.stopEl       = new Element('img', {'class':'stop',  src:'./images/stop.png',id:'stop'+i }).inject(this.controls);
            this.pauseEl      = new Element('img', {'class':'pause', src:'./images/pause.png',id:'pause'+i}).inject(this.controls);
            this.stopEl.addEvent('click', function() { this.stop(); }.bind(this));
            this.playEl.addEvent('click', function() { this.start(); }.bind(this));
            this.pauseEl.addEvent('click', function() { this.pause(); }.bind(this));
            this.seekbar.addEvent('click', function(e) {
                var coords = this.seekbar.getCoordinates();
                var ms = ((e.page.x - coords.left)/coords.width)*this.duration;
                this.jumpTo(ms);
            }.bind(this));
          //  this.el.inject($('playlist'));
        },
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
        },
        'onID3': function(key, value) {
            if (key == "TIT2") { this.title.set('text', value); }
        },
        'onComplete': function() {
            Playlist.playRandom.delay(100, Playlist);
        }
    };
    
});
*/
var i = 0;
function accordionFunction(obj){
    myFields = this.data[obj.row].sound.mp3_files[0].fields;
    i++;
    if(myFields){
        mp3 = myFields.filename;
        myDiv = new Element('div',{
         'id' : mp3,
         'html' : mp3
        });
        myDiv.set('styles',{'cursor': 'pointer',
                            'text-decoration': 'underline',
                            'color': 'blue',
                            });
        myDiv.onclick = function(){
        
           options = {
                'swfLocation': './swf/MooSound.swf',
                'onLoad': function(){ console.log(mp3 + " loaded") },
                'onPosition': function(position,duration){ 
                    if ( position/duration * 100 > 99 ){

                        Playlist.stopSounds();
                    } 
                }
            }
          
            mp3 = mp3_base_dir + this.id;
            Playlist.stopSounds();
            Playlist.loadSounds([mp3],options);
            console.log(Playlist.sounds);
            console.log(mp3);
            mySound = Playlist.getSound(mp3);
            console.log(mySound);
            mySound.start(0);
        };
        var controls = new Element('div', {
        
        });
    } else { 
        myDiv = new Element('div',{
            'html': 'no valid MP3!',
            'class': 'here', 
        });
    }

    obj.parent.adopt(myDiv);
    
}

function accordionFunctionBAK(obj)
	{
 //   var mp3_base_dir = './sounds/uploads/320_Kbit/';
     
     myTable = "<table border='0'>";
     myTable += "<tr>";
     myTable += "<td>";
       myDiv = "<div style='padding:5px;'>";
         
        if(this.data[obj.row].sound.mp3_files[0].fields){
           
            myDiv += "<ul>MP3 - ";
		    myfields = this.data[obj.row].sound.mp3_files[0].fields;
     //       mp3 = mp3_base_dir + myfields.filename;
           mp3 = myfields.filename;
        //    mySound = Playlist.getSound(mp3_base_dir + myfields.filename);
        //    mySound.start(0);
            myDiv += "<li>";
            myDiv += "Filename: <a onclick='playMe(\"";
            myDiv += mp3;
            myDiv += "\");' href='javascript:;'>" + myfields.filename;
            myDiv += "</a></li>";
            myDiv += "<li>";
            myDiv += "Byterate: " + myfields.wave_byterate;
            myDiv += "</li>";
            myDiv += "<li>";
            myDiv += "Framerate: " + myfields.wave_framerate;
            myDiv += "</li>";
            myDiv += "<li>";
            myDiv += "Length: " + myfields.wave_length;
            myDiv += "</li>";
            myDiv += "<li>";
            myDiv += "<div id='playlist'></div>";
            myDiv += "</li>";            
        } else {
          myDiv += "Empty";
        }
          myDiv += "</div>";
          myTable += myDiv;
          myTable += "</td>";
          myTable += "<td>";
          myList = "<ul>Keywords:<br />";
          
          if( this.data[obj.row].sound.keywords ){
                if(this.data[obj.row].sound.keywords.length > 0){
                     this.data[obj.row].sound.keywords.each(function(value,index){
                          if(value.fields != null){
                          myList += "<li>"+value.fields.keyword+"</li>";
                          }
                
                     }),this;
                }
          }
          myList += "</ul>";
          myTable += myList;
          myTable += "</td>";
          myTable += "</tr>";
          myTable += "</table>";
                   
         obj.parent.set('html',myTable);
}


function gridButtonClick(button, grid)
	{
	//	alert(button);
	}	

	function onGridSelect(evt)
	{
	// 		console.log('click ' +evt.target+' '+evt.indices+' '+evt.row);
		Playlist.stopSounds();
	console.log( 'row: '+evt.row+' indices: '+evt.indices+' id: '+evt.target.getDataByRow(evt.row).id );
	}
	
	function onGridDblClick(evt)
	{
		//console.log('dblclick '+evt.target+' '+evt.row);
	}
	
	function filterGrid()
	{
		datagrid.filter( $('filter').value );
	}
	
	function clearFilter()
	{
		datagrid.clearFilter();
	}
	
	function getSelectedIndices()
	{
		var indices = datagrid.getSelectedIndices();

		if (indices.length == 0)
		{
			alert('No selection.');
			return;
		}

		var str = '';
		for (var i=0; i<indices.length; i++)
		{
			str += 'row: '+indices[i]+' data: '+datagrid.getDataByRow(indices[i])+'\n' ;
		}
			
		alert(str);
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
               header: "ID",
               dataIndex: 'id',
               dataType:'number',
               width:40
            },
            {
               header: "Description",
               dataIndex: 'description',
               dataType:'string',
               width:240
            } ,
            {
               header: "Length",
               dataIndex: 'wave_length',
               dataType:'number',
               width:80
            } ];	
    
    window.addEvent("domready", function(){
        Playlist = new Playlist();
		/*
        	$('refreshbt').addEvent("click", refresh);	
			$('filterbt').addEvent("click", filterGrid);
			$('clearfilterbt').addEvent("click", clearFilter);
			$('setdatabt').addEvent("click", setDataFirstRow);
			
            $('getselectionbt').addEvent("click", getSelectedIndices);
      */
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
	        url:"sound_data.php",
	        perPageOptions: [10,15,20,25,50,100],
	        perPage:10,
	        page:1,
	        pagination:true,
	        serverSort:true,
	        showHeader: true,
	        alternaterows: true,
	        showHeader:true,
	        sortHeader:true,
	        resizeColumns:true,
	        multipleSelection:true,
	        
	        // uncomment this if you want accordion behavior for every row
	    
	        accordion:true,
	        accordionRenderer:accordionFunction,
	        autoSectionToggle:true,
	       
            			
	        width:580,
	        height: 400,
                clickedrow:false
	    });
	    
	    datagrid.addEvent('click', onGridSelect);
	    		
     });
