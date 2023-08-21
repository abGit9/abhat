
var num_stars = 35;
var star_width_height =7;
var star_classes = ['stars_0','stars_1','stars_2'];
var stars_dir = [true,true, true];
var stars_rates = [0.005,0.002,0.0008];

function set_stars(){

	var height_range = 0.5 * height_landscape;
	var width_range = width_landscape;		
	
	for(var i = 0; i < num_stars; i++ ){

		var child = document.createElement("DIV");
		child.style.width = star_width_height +'px';
		child.style.height = star_width_height +'px';		
		child.style.top = height_range * Math.random()+ 'px';
		child.style.left =  width_range * Math.random()+ 'px';
		child.className = star_classes[i%star_classes.length];
		child.style.opacity = '0.0';		
		landscape.insertBefore(child, landscape.childNodes[0]);	
	}	

}

function update_stars(){
	for(var i = 0 ; i < star_classes.length; i++)update_stars_class(i);	
}

function update_stars_class(stars_idx){
	stars = document.getElementsByClassName('stars_'+stars_idx);	
	var opacity = stars_dir[stars_idx]?
	Math.min(1.0,parseFloat(stars[stars_idx].style.opacity)+stars_rates[stars_idx]):
	Math.max(0.0,parseFloat(stars[stars_idx].style.opacity)-stars_rates[stars_idx]);

	for(var i = 0 ; i<stars.length; i++){		
		stars[i].style.opacity = opacity.toString();		
	}	
	if(opacity == 1.0)stars_dir[stars_idx] = false;
	if(opacity == 0.0)stars_dir[stars_idx] = true;	
}
