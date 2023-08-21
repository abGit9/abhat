

function update_birds(){
	update_birds_rotation();
	update_birds_horizontal_location();	
}


function update_birds_rotation(){

	var birds = document.getElementsByClassName('birds');

	for(var i = 0 ; i < birds.length; i++){
		
		birds_rotateY_curr[i] = birds_dir_rotation[i]?
		Math.max(birds_rotateY_end[i],birds_rotateY_curr[i] - birds_rotate_y_delta[i]):
		Math.min(birds_rotateY_start[i],birds_rotateY_curr[i] + birds_rotate_y_delta[i]);


		if(birds_rotateY_curr[i] == birds_rotateY_end[i])birds_dir_rotation[i]=false;
		if(birds_rotateY_curr[i] == birds_rotateY_start[i])birds_dir_rotation[i]= true;
		var stateValue = 'rotateY('+birds_rotateY_curr[i]+'deg)';
		
		set_transform_state(birds[i],stateValue);
	}

}




function update_birds_horizontal_location(){

	var birds = document.getElementsByClassName('birds');
	
	for(var i = 0 ; i < birds.length; i++){
		
		birds_loc_left[i] = birds_dir_horizontal[i]?
		Math.min(width_landscape,birds_loc_left[i] +birds_horizontal_delta[i]):
		Math.max(-birds_width[i],birds_loc_left[i] -birds_horizontal_delta[i]);

		birds[i].style.left = birds_loc_left[i]+'px';
		
		if(birds_dir_horizontal[i] && birds_loc_left[i] == width_landscape)
			birds_loc_left[i] = -birds_width[i];			
		if(!birds_dir_horizontal[i] && birds_loc_left[i] == -birds_width[i])
			birds_loc_left[i] = width_landscape+birds_width[i];
		

	}

}
var birds_dir_rotation = [true,true,true,true,true,true,true,true,true,true,true,true];
var birds_width= [25,25,25,25,25,25,25,25,25,25,25,25];
var birds_dir_horizontal = [true,false,true,false,true,false,true,false,true,false,true,false];
var birds_rotate_y_delta =[1.6,0.7,1.2,0.7,0.9,1.1,1.5,1.4,1.1,0.9,0.5,1.1];
//var birds_rotate_x_delta =[2.4,3.0,1.2,1.5,0.9];
var birds_rotateY_curr =[];
var birds_rotateY_start =[];
var birds_rotateY_end = [];
var birds_loc_left =[];
//var birds_loc_top =[20,20,20,20,20,20,20,20,20,20,,20,20];
var birds_loc_top =[0,5,15,30,40,60,80];
//var birds_loc_top =[68,15,25,50,80,35,5,60,45,40,15,55];
//var birds_horizontal_delta =[0.5,0.45,0.4,0.550.3];
var birds_horizontal_delta =[1.2,1.1,1.3,0.9,1.2,1.0,1.5,1.3,1.0,0.9,0.8,1.1];

function set_birds(){
	var birds =  document.getElementsByClassName('birds');
	birds_loc_left.length =  birds.length;
	birds_rotateY_curr.length =  birds.length;
	birds_rotateY_start.length =  birds.length;
	birds_rotateY_end.length =  birds.length;

	for(var i = 0 ; i < birds.length; i++){
		birds[i].style.width = birds_width[i]+'px';
		birds[i].style.height = 'auto';	
		if(!birds_dir_horizontal[i]){
			set_transform_state(birds[i],'rotateY(180deg)');	
			birds_loc_left[i] = width_landscape;
			birds_rotateY_curr[i] = 180;
			birds_rotateY_start[i] = 180;
			birds_rotateY_end[i] = 130;
		}else {
			birds_loc_left[i] = -birds_width[i];
			birds_rotateY_curr[i] = 0;
			birds_rotateY_start[i] = 0;
			birds_rotateY_end[i] = -50;
		}	
		birds[i].style.left = birds_loc_left[i] +'px';
		birds[i].style.top = birds_loc_top[i] +'px';	
		birds[i].style.transformOrigin = '90% 0% 0';			
	}
}


