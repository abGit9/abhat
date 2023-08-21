

var overlay =  document.getElementsByClassName('overlay');

function reveal_layout(idx){
	

	anime({
		targets:overlay[idx],
		opacity:[{value:0.0}],
		duration:400,
		easing:'linear'	,
		complete: function(){
			overlay[idx].style.visibility = 'hidden';
		}
	});

	var cover = [];

	for( var i = 0; i<overlay.length;i++){
		if(idx != i){
			overlay[i].style.visibility = 'visible';
			cover.push(overlay[i]);
		}
	}
	anime({
		targets:cover,
		opacity:[{value:0.5}],
		duration:400,
		easing:'linear'
	});
}