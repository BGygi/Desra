window.addEvent('domready',function(){
    
   var options = {
        url:'sd_pairs.php',
        wrapper : 'gamma',
        play_wrapper : 'delta',
        controller : 'slider'
   };
    var rg = new rating_grid(options);
   // console.log(rg);

     
}); // end domready function