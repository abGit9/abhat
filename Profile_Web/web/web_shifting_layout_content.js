
function set_container_width_height_attributes (){

	var content_containers = document.getElementsByClassName('content_container');
	for(var i = 0; i <content_containers.length; i++){
		content_containers[i].style.width =  width_container +'px';
		content_containers[i].style.height = height_container+'px';
	}
}


var width_container;
var height_container; 
function set_width_height_container(){
	width_container = 1.5 * base_width;
	height_container =1.5 * base_height;
}



function set_left_top_container(){
	//console.log('****content----set_left_top_container');
	var content_containers = document.getElementsByClassName('content_container');

	for(var i = 0 ; i <content_containers.length; i++){
		if(left_changes[i])
			content_containers[i].style.left = (w_curr[i] - width_container)+'px';
		if(top_changes[i])
			content_containers[i].style.top = (h_curr[i] - height_container)+'px';

	}
}



function set_dimensions_container_content(){
	set_left_top_container();
}






function set_up_layout_content(){
	set_width_height_container();
	set_container_width_height_attributes();
	set_left_top_container();
}


