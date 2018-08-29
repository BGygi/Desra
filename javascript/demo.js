window.addEvent('domready', function(){
	// First Example
	var el = $('myElement'),
        init = 0;
	    el2 = $('anotherElement');
	// Create the new slider instance
	new Slider(el, el.getElement('.knob'), {
		steps: 100,	// There are 35 steps
		range: [0],	// Minimum value is 8
		onChange: function(value){
			// Everytime the value changes, we change the font of an element
			
            el2.set('html',value/10);
		}
	}).set(0);
	

	// Second Example
	var el = $('setColor'), color = [0, 0, 0];
	
	var updateColor = function(){
		// Sets the color of the output text and its text to the current color
		el.setStyle('color', color).set('text', color.rgbToHex());
	};
	
	// We call that function to initially set the color output
	updateColor();
	
	$$('div.slider.advanced').each(function(el, i){
		var slider = new Slider(el, el.getElement('.knob'), {
			steps: 255,  // Steps from 0 to 255
			wheel: true, // Using the mousewheel is possible too
			onChange: function(){
				// Based on the Slider values set an RGB value in the color array
				color[i] = this.step;
				// and update the output to the new value
				updateColor();
			}
		}).set(0);
	});
});
