
var landscape;
var width_landscape;
var height_landscape;



function find_landscape(){
	landscape =  document.getElementById('landscape');
}


function retrieve_landscape_width_height(){
	width_landscape = landscape.getBoundingClientRect().width;
	height_landscape = landscape.getBoundingClientRect().height;
	
}

function set_ground(){
	var ground = document.getElementById('ground');	
	ground.style.width = width_landscape+ 'px';
	ground.style.height = height_landscape * 0.4 +'px';
	ground.style.top = height_landscape * 0.6 + 'px';
}


function set_mountains(){
	var mountains = document.getElementsByClassName('mountains');
	mountains[0].style.height = .70 * height_landscape + 'px';
	mountains[0].style.width = 'auto';
	mountains[0].style.top =.15 * height_landscape + 'px';


	mountains[1].style.height = 1.2* height_landscape + 'px';
	mountains[1].style.width = 'auto';
	mountains[1].style.left = height_landscape +'px';
	mountains[1].style.top = 0+'px';

	mountains[2].style.height = 1.2* height_landscape+'px';
	mountains[2].style.width = 'auto';
	mountains[2].style.left = width_landscape -(height_landscape *0.70)+ 'px';
	mountains[2].style.top = -40 +'px';	
}





function set_transform_state(icon,stateValue){
	icon.style.webkitTransform = stateValue;				
	icon.style.MozTransform = stateValue;
	icon.style.msTransform = stateValue;
	icon.style.OTransform = stateValue;
	icon.style.transform = stateValue;	
}



function update_anim_frame(){
	update_stars();
	update_birds();
	update_trees_windy();
	if(class_displayed != null)update_attr_display();	
}



var interval = 10;
function start_landscape_anim(){
	window.setInterval(update_anim_frame,interval);
}


function set_up_custom_landscape(){
	find_landscape();
	retrieve_landscape_width_height();
	set_ground();
	set_mountains();
	set_Trees();
	set_stars();
	set_birds();	
	set_mouse_commands();
	start_landscape_anim();
}





