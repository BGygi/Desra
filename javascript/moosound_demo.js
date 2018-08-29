var mp3_base_dir = './sounds/uploads/320_Kbit/';
//  var moos = ['duck','goose','chicken','ostrich','dodo','turkey']
var moos = ['Cymbal2_70_1ft.mp3','Zipper1_51_3in.mp3','Birds1_57_40ft.mp3','IceInGlass5_68_6in.mp3','Airplane4_60_600ft_1.mp3','Scissors1_53_3in.mp3'];
moos.each( function(value,index){
     moos[index] = mp3_base_dir + value;
});
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
            this.playEl       = new Element('img', {'class':'play',  src:'images/play.png',id:'play'+i }).inject(this.controls);
            this.stopEl       = new Element('img', {'class':'stop',  src:'images/stop.png',id:'stop'+i }).inject(this.controls);
            this.pauseEl      = new Element('img', {'class':'pause', src:'images/pause.png',id:'pause'+i}).inject(this.controls);
            this.stopEl.addEvent('click', function() { this.stop(); }.bind(this));
            this.playEl.addEvent('click', function() { this.start(); }.bind(this));
            this.pauseEl.addEvent('click', function() { this.pause(); }.bind(this));
            this.seekbar.addEvent('click', function(e) {
                var coords = this.seekbar.getCoordinates();
                var ms = ((e.page.x - coords.left)/coords.width)*this.duration;
                this.jumpTo(ms);
            }.bind(this));
            this.el.inject($('playlist'));
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
          //  Playlist.playRandom.delay(100, Playlist);
        }
    };
   /*
    var options = {
        'onRegister': function() {
            i++;
            this.soundid = "sound_"+i;
            this.el = new Element('div', {'class':'song'})
            this.el.set('id',this.url);
            this.title        = new Element('h3', {'class':'title', text:this.url}).inject(this.el);
            this.controls     = new Element('div', {'class':'controls'}).inject(this.el);
            this.seekbar      = new Element('div', {'class': 'seekbar'}).inject(this.el);
            this.position     = new Element('div', {'class':'position'}).inject(this.seekbar);
            this.seekbar.set('tween', {duration:this.options.progressInterval, unit:'%', link: 'cancel'});
            this.position.set('tween', {duration:this.options.positionInterval, unit:'%', link: 'cancel'});
            this.playEl       = new Element('img', {'class':'play',  src:'images/play.png',id:'play'+i }).inject(this.controls);
            this.stopEl       = new Element('img', {'class':'stop',  src:'images/stop.png',id:'stop'+i }).inject(this.controls);
            this.pauseEl      = new Element('img', {'class':'pause', src:'images/pause.png',id:'pause'+i}).inject(this.controls);
            this.stopEl.addEvent('click', function() { this.stop(); }.bind(this));
            this.playEl.addEvent('click', function() { this.start(); }.bind(this));
            this.pauseEl.addEvent('click', function() { this.pause(); }.bind(this));
            this.seekbar.addEvent('click', function(e) {
                var coords = this.seekbar.getCoordinates();
                var ms = ((e.page.x - coords.left)/coords.width)*this.duration;
                this.jumpTo(ms);
            }.bind(this));
            this.el.inject($('playlist'));
        },
        'onLoad': function() { },
        'onPause': function() { },
        'onPlay': function() {
           
            this.el.addClass('playing');
         //   Playlist.sounds.erase(this.url);
          //  sounds.erase(this.url);   */
          /*  var str = 
            $('running').set('html',$('running').get('html') + "<br /><a href=\"#\" id='"+this.soundid+"'>"+this.url+"</a>");
          */
         
         //   $('playlist').empty();
         //   Playlist.loadSounds(sounds,options);
     /*       
         },
        'onStop': function() { this.el.removeClass('playing'); },
        'onProgress': function(loaded, total) {
            var percent = (loaded / total*100).round(2);
            this.seekbar.get('tween').start('width', percent * .85);
        },
        'onPosition': function(position,duration) {
            var percent = (position/duration*100).round(2);
           this.position.get('tween').start('left', percent);
       //     this.seekbar.set('html',percent + "%");
        },
        'onID3': function(key, value) {
            if (key == "TIT2") { this.title.set('text', value); }
        },
        'onComplete': function() {
          //    Playlist.sounds.erase(this.url);
              
        //    $str = $('running').get('html');
         //   $('running').html.set(str + "<br />" +this.url);
         //   Playlist.playRandom.delay(100, Playlist);
        }
    };
    */
    // reorder the moos array before assigning it to songs
  
    var newmoos = $unlink(moos);
    moos.each(function(value,index){
        myVar = newmoos.getRandom();
        newmoos.erase(myVar);
        moos[index] = myVar;
    });
    var sounds = moos;
    Playlist = $H(new Playlist());
    Playlist.loadSounds(sounds,options);
 //     Playlist.loadSounds(['./sounds/uploads/320_Kbit/Cymbal2_70_1ft.mp3'],options);
    $('play').addEvent('click', function(e) {
        e.stop();
        Playlist.playRandom(); //Hm, I wonder what it will end up being.
    });
    $('next').addEvent('click', function(e) {
        e.stop();
        mySound = Playlist.getSound('./sounds/uploads/320_Kbit/IceInGlass5_68_6in.mp3');
        alert($type(mySound));
        Playlist.stopSounds();
        mySound.start(0);
        
    });  

     
}); // end domready function