
var display_attr_freq_adj = 100;
var display_attr_count ;
function update_attr_display(){

	if(++display_attr_count%display_attr_freq_adj != 0 )return;
	else if(class_displayed == 'birds')update_bird_display_attr();
	else if(class_displayed == 'trees')update_trees_display_attr();

}

var currentTarget;
function set_mouse_commands(){
	var birds = document.getElementsByClassName('birds');
	var trees = document.getElementsByClassName('trees');	

	for(var i = 0  ; i<birds.length; i++){
		birds[i].onmouseover  = function(e){
			mouse_over_display_attr(e.currentTarget);				
		};
	}
	for(var i = 0  ; i<trees.length; i++){
		trees[i].onmouseover  = function(e){
			mouse_over_display_attr(e.currentTarget);			
		};
	}

	
	document.getElementById('content_container_2').onclick = function(){
		click_disapper_display_attr();
	};
	
}

function mouse_over_display_attr(new_target){
	if(currentTarget != null)
		currentTarget.style.background ='transparent';
	currentTarget = new_target;
	currentTarget.style.background = '#CCBFBFBF';	
	idx_display = parseInt(new_target.id);
	class_displayed = new_target.className;	
	display_attr_count = -1;	
}


function click_disapper_display_attr(){
	currentTarget.style.background = 'transparent';
	currentTarget = null;
	class_displayed = null;
	attr_val_array.length = 0;
	display_attr_count = -1;
	idx_display = -1;
	update_element_attributes_display();
}



var idx_display = -1; 
var class_displayed ='' ;


function update_bird_display_attr(){
	console.log('update bird idx:'+idx_display);
	var birds = document.getElementsByClassName('birds');
	attr_val_array.length = 0;
	attr_val_array.push('Element:'+birds[idx_display].id);
	attr_val_array.push('left:'+birds[idx_display].style.left);	
	attr_val_array.push('top:'+birds[idx_display].style.top);
	attr_val_array.push('rotateY:'+Math.round(birds_rotateY_curr[idx_display]*100)/100+' deg');
	
	update_element_attributes_display();
}
function update_trees_display_attr(){
	
	var trees = document.getElementsByClassName('trees');
	attr_val_array.length = 0;
	attr_val_array.push('Element:'+trees[idx_display].id);
	attr_val_array.push('skewY:'+Math.round(trees_skewXY[idx_display]*100)/100+' deg');		
	
	update_element_attributes_display();
}


var attr_val_array =[];
var attribute_val_display=  document.getElementById('attribute_val_display');


function update_element_attributes_display(){	
	
	for(var i =0; i <attribute_val_display.children.length; i++){

		if(i < attr_val_array.length){
			attribute_val_display.children[i].innerHTML  = attr_val_array[i];
			attribute_val_display.children[i].style.flex = '1';
		}else{
			attribute_val_display.children[i].innerHTML  = '';
			attribute_val_display.children[i].style.flex = '0';
		}
		
	}
}