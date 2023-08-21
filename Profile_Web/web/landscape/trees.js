
var trees_height= [60,70,80,50,75,60,55,65,75,50,75,60];
var trees_top;
var trees_left;

function set_Trees(){

	var trees = document.getElementsByClassName('trees');
	trees_top = [height_landscape * 0.65,height_landscape * 0.50 ,height_landscape*0.6,height_landscape *0.45,
	height_landscape *0.5,height_landscape *0.75 ,height_landscape *0.4,height_landscape *0.45,height_landscape *0.65,height_landscape * 0.70 ,height_landscape*0.6,height_landscape *0.6 ];



	trees_left = [width_landscape * 0.05,width_landscape *0.1,width_landscape * 0.15 ,width_landscape*0.25,width_landscape *0.28,width_landscape *0.3,width_landscape *0.55,width_landscape * 0.62,width_landscape *0.65,width_landscape *0.75,width_landscape*0.8,width_landscape *0.9 ];
	
	
	for(var i =0 ;i<trees.length;i++){
		trees[i].style.height = trees_height[i]+'px';
		trees[i].style.width = 'auto';
		trees[i].style.top = trees_top[i] +'px';
		trees[i].style.left = trees_left[i] +'px';
	}

	for(var i = 0 ; i < trees.length; i++){
		var height = trees[i].getBoundingClientRect().height;

		trees_skewXY.push(0);		
		trees_skewXY_dir.push(true);		
	}
	
}
var trees_skewXY_left = [-9,-10,-10,-9,-10,-9,-7,-10,-9,-10,-7,-10];
var trees_skewXY_right = [0,0,0,0,0,0,0,0,0,0,0,0];
var trees_skewXY = [];
var trees_skewXY_delta = [0.10,0.15,0.12,0.13,0.14,0.15,0.13,0.12,0.15,0.13,0.14,0.12];

var trees_skewXY_dir =[];
function update_trees_windy(){
	var trees = document.getElementsByClassName('trees');
	for(var i = 0; i < trees.length; i++){
		trees_skewXY[i] = trees_skewXY_dir[i]?
		Math.min(trees_skewXY_right[i],trees_skewXY[i]+trees_skewXY_delta[i]):
		Math.max(trees_skewXY_left[i],trees_skewXY[i]-trees_skewXY_delta[i])	
		//var state = 'skew('+trees_skewXY[i]+'deg,'+trees_skewXY[i]+'deg)';	
		//var state = 'skew('+trees_skewXY[i]+'deg)';		
		var state = 'skew('+0+'deg,'+trees_skewXY[i]+'deg)';		
		set_transform_state(trees[i],state);
		if(trees_skewXY[i] == trees_skewXY_right[i] )trees_skewXY_dir[i] =false;
		if(trees_skewXY[i] == trees_skewXY_left[i] )trees_skewXY_dir[i] =true;
	}

}
