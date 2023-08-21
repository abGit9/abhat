

var lang_graphic =  document.getElementsByClassName('language_graphic');

var color_arrays =["#B8A800","#2900A3","#A36700"];

var duration =[1500,1000,900];

function animate_graphics_colors(){

	for( var i = 0; i < lang_graphic.length; i++){	
		anime({
			targets:lang_graphic[i],		
			fill:[{value:color_arrays[i]}],
			duration:duration[i],				
			loop:true,		
			easing:'linear',
			direction:'alternate'	
		});
	}

}