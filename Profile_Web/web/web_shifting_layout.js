var in_progress = false;
var timer;

var base_width;
var base_height;

var scalable_containers;

//current width and height of element
w_curr = [];
h_curr = [];
l_curr = [];
t_curr = [];

l_end = [];
t_end = [];
w_end = [];
h_end = [];

w_delta = [];
h_delta = [];

var rate_w_open_px = 10;
var rate_h_open_px = 10;

var timing_interval =  1;

var width_dir_array;
var height_dir_array;

var ref_diff;

var current_Target;

var left_changes = [];
var top_changes = [];

function set_left_top_changes(){	
	left_changes[0] = false;
	top_changes[0] = false; 
	left_changes[1] = true;
	top_changes[1] = false; 
	left_changes[2] = false;
	top_changes[2]= true; 
	left_changes[3] = true;
	top_changes[3] = true; 	
}

function calculate_open_container_scaling_differences(idx,w_scale,h_scale){	
	
	var wid_diff = (w_scale*base_width) - w_curr[idx];
	var hei_diff = (h_scale*base_height) - h_curr[idx];
	ref_diff =  Math.max( wid_diff,hei_diff);
	
}


function set_up_container_shifting(){
	//console.log('set_up_container_shifting');
	find_scalable_group();
	initialize_container_dimensions_layout();	
	initialize_dimensional_progress_data();
	set_left_top_changes();	
	set_up_layout_content();			
	set_onmouseover_listeners();	
}

function find_scalable_group(){
	scalable_containers = document.getElementsByClassName('scalable_container');
}

function initialize_container_dimensions_layout () {



	var half_width = window.innerWidth * 0.5 
	var half_height = window.innerHeight * 0.5;
	base_width = half_width;
	base_height = half_height;


	for(var i = 0 ; i <scalable_containers.length; i++){
		scalable_containers[i].style.width = half_width+'px';
		scalable_containers[i].style.height = half_height+'px';
		scalable_containers[i].style.left = 0+'px';	
		scalable_containers[i].style.top =  0+'px';

	}	
	scalable_containers[1].style.left = half_width+'px';	
	scalable_containers[2].style.top =  half_height+'px';	
	scalable_containers[3].style.left = half_width+'px';	
	scalable_containers[3].style.top =  half_height+'px';
}

function start_timer(){
	timer = window.setInterval(update_layouts, timing_interval);
	in_progress = true;
}
function stop_timer(){
	window.clearInterval(timer);	
	in_progress = false;	
}

function print_values(i){

	
	console.log('-------------------------------i:'+i);
	console.log('w_curr'+w_curr[i]);
	console.log('h_curr'+h_curr[i]);
	console.log('w_end'+w_end[i]);
	console.log('h_end'+h_end[i]);
	console.log('w_delta'+w_delta[i]);
	console.log('h_delta'+h_delta[i]);	
	console.log('l_curr'+l_curr[i]);
	console.log('t_curr'+t_curr[i]);
	


}

function print_element_values(idx){
	console.log('---------------------idx values:'+idx);
	console.log('left:'+scalable_containers[idx].style.left);
	console.log('right:'+scalable_containers[idx].style.right);
	console.log('top:'+scalable_containers[idx].style.top);
	console.log('bottom:'+scalable_containers[idx].style.bottom);
	console.log('width:'+scalable_containers[idx].style.width);
	console.log('height:'+scalable_containers[idx].style.height);

}

function initialize_dimensional_progress_data(){
	//print_element_values(3)
	for(var i = 0; i < scalable_containers.length; i++){
		w_curr.push(parseInt(scalable_containers[i].style.width));
		h_curr.push(parseInt(scalable_containers[i].style.height));
		w_end.push(parseInt(scalable_containers[i].style.width));
		h_end.push(parseInt(scalable_containers[i].style.height));		
		l_curr.push(parseInt(scalable_containers[i].style.left));
		t_curr.push(parseInt(scalable_containers[i].style.top));
		l_end.push(parseInt(scalable_containers[i].style.left));
		t_end.push(parseInt(scalable_containers[i].style.top));
		w_delta.push(0.0);
		h_delta.push(0.0);
		//print_values(i);
	}
}

function open_main_0(){
	calculate_open_container_scaling_differences(0,1.5,1.5);
	set_end_values_and_rates(0, 1.5, 1.5);
	set_end_values_and_rates(1, 0.5, 0.5);
	set_end_values_and_rates(2, 1.5, 0.5);
	set_end_values_and_rates(3, 0.5, 1.5);	
	if(!in_progress)start_timer();
}
function open_main_1(){
	calculate_open_container_scaling_differences(1,1.5,1.5);
	set_end_values_and_rates(0, 0.5, 1.5);
	set_end_values_and_rates(1, 1.5, 1.5);
	set_end_values_and_rates(2, 0.5, 0.5);
	set_end_values_and_rates(3, 1.5, 0.5);	
	if(!in_progress)start_timer();
}
function open_main_2(){
	calculate_open_container_scaling_differences(2,1.5,1.5);
	set_end_values_and_rates(0, 1.5, 0.5);
	set_end_values_and_rates(1, 0.5, 1.5);
	set_end_values_and_rates(2, 1.5, 1.5);
	set_end_values_and_rates(3, 0.5, 0.5);	
	if(!in_progress)start_timer();
}
function open_main_3(){
	calculate_open_container_scaling_differences(3,1.5,1.5);
	set_end_values_and_rates(0, 0.5, 0.5);
	set_end_values_and_rates(1, 1.5, 0.5);
	set_end_values_and_rates(2, 0.5, 1.5);
	set_end_values_and_rates(3, 1.5, 1.5);	
	if(!in_progress)start_timer();
}



function set_end_values_and_rates(idx, w_scale, h_scale){

	w_end[idx] = w_scale * base_width;
	h_end[idx] = h_scale * base_height;

	var w_diff = w_end[idx] - w_curr[idx];
	var h_diff = h_end[idx] - h_curr[idx];
	w_delta[idx] = w_diff === 0 ? 0: w_diff/Math.abs(ref_diff)*rate_w_open_px;
	h_delta[idx] = h_diff === 0 ? 0: h_diff/Math.abs(ref_diff)*rate_h_open_px;	
	//w_delta and h_delta will be equal to left and top deltas respectively
	
	if(left_changes[idx])l_end[idx] = window.innerWidth - w_end[idx];
	if(top_changes[idx])t_end[idx] = window.innerHeight - h_end[idx];
}
function update_curr_values(idx){
	//a change in the width and/or height correspond with a change in the left and top properties respectively
	var updated = false;
	if(update_width_containers(idx))	
		updated = true;	
	if(update_left_values(idx))		
		updated = true;	
	if(update_height_containers(idx))		
		updated = true;	
	if(update_top_values(idx))		
		updated = true;
	return updated;	
}

function update_width_containers(idx){	
	if(w_curr[idx] === w_end[idx])return false;
	w_curr[idx] += w_delta[idx];	
	w_curr[idx] = w_delta[idx] >= 0?Math.min(w_curr[idx],w_end[idx])
	:Math.max(w_curr[idx],w_end[idx]);
	return true;
}

function update_height_containers(idx){	
	if(h_curr[idx] === h_end[idx])return false;
	h_curr[idx] += h_delta[idx];
	h_curr[idx] = h_delta[idx] >= 0?Math.min(h_curr[idx],h_end[idx])
	:Math.max(h_curr[idx],h_end[idx]);	
	return true;
}

function update_left_values(idx){
	if(l_curr[idx] === l_end[idx])return false;	
	l_curr[idx] -= w_delta[idx]; 
	l_curr[idx] = w_delta[idx] >= 0?Math.max(l_curr[idx],l_end[idx])
	:Math.min(l_curr[idx],l_end[idx]);	
	return true;	
}

function update_top_values(idx){	
	if(t_curr[idx] === t_end[idx])return false;
	t_curr[idx] -= h_delta[idx]; 
	t_curr[idx] = h_delta[idx] >= 0?Math.max(t_curr[idx],t_end[idx])
	:Math.min(t_curr[idx],t_end[idx]);	
	return true;	
}


function update_layouts(){
	set_dimensions_layout_containers();
	set_dimensions_container_content();
}
function set_dimensions_layout_containers(){
	//console.log('****set_dimensions_layout_containers');

	var done = true;		
	for(var i = 0 ; i < scalable_containers.length; i++){
		if(update_curr_values(i))done = false;
		else continue;		
		set_element_dimensions_and_position(i);		
	}


	if(done)stop_timer();
	//STOP!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!	
	
}


function set_element_dimensions_and_position(idx){	
	scalable_containers[idx].style.width = w_curr[idx] +'px';
	scalable_containers[idx].style.height = h_curr[idx]+'px';
	scalable_containers[idx].style.left = l_curr[idx]+'px';
	scalable_containers[idx].style.top = t_curr[idx]+'px';

}


function set_onmouseover_listeners(){

	scalable_containers[0].onmouseover  = function(e){						
		if( e.currentTarget.id === current_Target)return;
		current_Target =  e.currentTarget.id;			
		if(in_progress)	stop_timer();			
		open_main_0();	
		reveal_layout(0);		
	}
	scalable_containers[1].onmouseover  = function(e){			
		if( e.currentTarget.id === current_Target)return;			
		current_Target=  e.currentTarget.id;
		if(in_progress)	stop_timer();			
		open_main_1();	
		reveal_layout(1);				
	}
	scalable_containers[2].onmouseover  = function(e){			
		if( e.currentTarget.id === current_Target)return;
		current_Target =  e.currentTarget.id;
		if(in_progress)	stop_timer();			
		open_main_2();
		reveal_layout(2);		
	}
	scalable_containers[3].onmouseover  = function(e){						
		if( e.currentTarget.id === current_Target)return;
		current_Target =  e.currentTarget.id;
		if(in_progress)stop_timer();			
		open_main_3();		
		reveal_layout(3);			
	}
}




