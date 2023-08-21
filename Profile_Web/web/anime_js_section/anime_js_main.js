var elements_btwn_nodes = 35;//Should be odd number
/*Node	Nodes are points where a wave crosses the line of zero-displacement. The nodes of a water wave occur where the height of the wave is exactly equal to the level of the undisturbed water. Looking only at a node, an observer would not notice the wave.*/
var num_waves = 3;
var total_elements;
var total_Height = 100;	
var min_Height = 10;
var array_anims = [];;
var peak_idx;
var wave_duration;
var coeff;
var color_array =['#4ECDC4','#F7FFF7','#FF6B6B','#FFE66D','#9F9FED','#736CED','#FFA69E','#AA4465','#F28123',
'#9B9ECE'];
var wave_container;

var delay_unit = 50;
var max_duration_element_anim  = 800;

function set_up_anime_js(){			
	find_wave_container();
	set_height_wave_container();
	calculate_total_elements();
	add_children_wave_container();
	set_rate_parameters();
	calulate_entire_wave_duration();
	set_up_wave_animations();	
}

function set_rate_parameters(){	
	peak_idx = Math.floor(elements_btwn_nodes/2);
	coeff = (min_Height  - total_Height)/(peak_idx *peak_idx);
}
function calculate_end_height_element(idx){
	var x = idx%elements_btwn_nodes - peak_idx;//relative distance from y-axis
	var ht = coeff*x*x + total_Height;//Parabolic
	return ht;		
}

function set_height_wave_container(){
	wave_container.style.height = (total_Height *2)+'px'; 
}
function find_wave_container(){
	wave_container = document.getElementById('wave_container');
}

function calculate_total_elements(){
	total_elements = num_waves*elements_btwn_nodes;	
}
function add_children_wave_container(){

	for(var i = 0; i < total_elements; i++){
		var child = document.createElement("DIV");
		child.className = 'wave_elements';
		var idx_color =  Math.round(Math.random() * (color_array.length-1));
		child.style.background = color_array[idx_color]
		wave_container.appendChild(child);
	}
}
function calculate_duration_element_anim(idx){
	return max_duration_element_anim *((total_elements - (idx%elements_btwn_nodes))/total_elements);
}
function calulate_entire_wave_duration(){
	wave_duration = ((total_elements - 1)*delay_unit)+max_duration_element_anim;
}
function set_up_wave_animations(){		
	
	var wave_count = 0;	
	border_radius_top = '6px 6px 0px 0px';
	border_radius_bottom = '0px 0px 6px 6px';

	for(var i = 0; i < total_elements; i++){		
		var height_element = calculate_end_height_element(i);		
		var top = 	height_element/2.0;	
		var delay = i*delay_unit;			
		var duration = calculate_duration_element_anim(i);		
		
		top = wave_count%2===0?top*-1:top;
	
		wave_container.children[i].style.borderRadius = wave_count%2===0?border_radius_top:
		border_radius_bottom; 
		
		var anim = anime ({		
				targets: wave_container.children[i],
				height:[{value:height_element }], 	
				top:[{value:top}],						
				easing:'linear',
				autoplay:false,
				duration:duration,
				delay: delay
			});	

		array_anims.push(anim);

		if(i%elements_btwn_nodes === elements_btwn_nodes -1 )
			wave_count++;			
		
	}
}
function start_anim_wave(){
	run_anim();
	window.setInterval(run_anim, wave_duration);
}


function run_anim(){	
	
	for( var i = 0; i <array_anims.length; i++){
		array_anims[i].restart();	
	}
	

}


function animate_title_anime_js(){

	anime({
		targets:'#title_anime_js',
		color:[{value:'#77878B'},{value:'#FFE66D'},{value:'#FFA69E'},{value:'#9B9ECE'},{value:'#736CED'},{value:'#F8F1FF'}],
		duration:1000,
		easing:'linear',
		duration:4000,
		loop:true,		
	});
}


