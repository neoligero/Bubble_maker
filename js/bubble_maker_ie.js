var _SPEED = 2.5;

var Bubble = function(id, top, left, size, grow, text, url, target) {
	if(typeof target == 'undefined') target = false;
	this.id = id;
	this.top = top;
	this.left = left;
	this.size = size;
	this.grow = grow;
	this.text = text;
	this.url = url;
	this.target = target;
}

/*
** Generates the menu from the array "bubbles"
*/
function generator(array_bubbles, container) {
	for (var i = 0 ; i < array_bubbles.length ; i++){
		var b = document.createElement('div');
		var content = document.createElement('div');
		var cover = document.createElement('div');
		
		b.setAttribute('id', array_bubbles[i].id);
		b.setAttribute('class', 'circle01');
		b.setAttribute('style', 'width:' + array_bubbles[i].size + 'px; height:' + array_bubbles[i].size + 'px; margin-top:' + array_bubbles[i].top + 'px; margin-left:' + array_bubbles[i].left + 'px;');
		
		content.setAttribute('class', 'text_circle');
		content.innerHTML = array_bubbles[i].text;
		
		cover.setAttribute('id', array_bubbles[i].id + ":hover");
		cover.setAttribute('class', 'circle02');
		cover.setAttribute('style', 'width:' + array_bubbles[i].size + 'px; height:' + array_bubbles[i].size + 'px; top: 0px; left: 0px;');
		var array = 
		cover.setAttribute('onmouseover', 'animate(' + JSON.stringify(array_bubbles) + ', document.getElementById("' + array_bubbles[i].id + '"))');
		cover.setAttribute('onmouseout', 'reorder(' + JSON.stringify(array_bubbles) + ')');
		if( array_bubbles[i].target )
			cover.setAttribute('onclick', 'window.open("' + array_bubbles[i].url + '");');
		else
			cover.setAttribute('onclick', 'location.href="' + array_bubbles[i].url + '";');
		
		b.appendChild(content);
		b.appendChild(cover);
		container.appendChild(b);
	}
}

/*
** Generates aleatory bubbles and returns an array object

function masive_generator(container) {
	var size = 30;
	var amount = 20;
	var x = 0;
	var y = 0;
	var array = new Array();
	
	for (var i = 0 ; i < amount; i++){
		var b1 = document.createElement('div');
		b1.setAttribute('id', i+'e');
		b1.setAttribute('class', 'circle01');
		b1.setAttribute('style', 'width:' + size + 'px; height:' + size + 'px; margin-top:' + y + 'px; margin-left:' + x + 'px;');
		b1.setAttribute('onmouseover', 'animate(bubbles, this)');
		b1.setAttribute('onmouseout', 'reorder(bubbles)');
		
		array[i] = new Bubble(i+'e', y, x, size, size*2, '', '#', false);
		
		container.appendChild(b1);
		x += size;
		if(i % 20 == 0)
			y += size;
	}
	return array;
}*/

/*
** Animates the given bubble and look for collisions
*/
function animate(array_bubbles, dom_circle) {
	for(var i = 0; i < array_bubbles.length; i++) {
		if(array_bubbles[i].id == dom_circle.id) {
			dom_circle.setAttribute("style","width:" + (array_bubbles[i].size + array_bubbles[i].grow) + "px; height:" + (array_bubbles[i].size + array_bubbles[i].grow) + "px; border-radius:50%; margin-top: " + (dom_circle.offsetTop - array_bubbles[i].grow/2) + "px; margin-left: " + (dom_circle.offsetLeft - array_bubbles[i].grow/2) + "px;");
			//For the cover
			var dom_circle_hover = document.getElementById(array_bubbles[i].id + ':hover');
			dom_circle_hover.setAttribute("style","width:" + (array_bubbles[i].size + array_bubbles[i].grow) + "px; height:" + (array_bubbles[i].size + array_bubbles[i].grow) + "px; border-radius:50%; top: 0px; left: 0px;");
		
			retard(array_bubbles, array_bubbles[i], new Bubble(-1, 1, 1, 1, 1, '', '', false), 200);
		}
	}
}

/*
** Reorganize all bubbles
*/
function reorder(array_bubbles) {
	for (var i = 0 ; i < array_bubbles.length ; i++){
		var dom_circle = document.getElementById(array_bubbles[i].id);
		dom_circle.setAttribute("style", "margin-top:" + array_bubbles[i].top + "px; margin-left:" + array_bubbles[i].left + "px; width:" + array_bubbles[i].size+ "px; height:" + array_bubbles[i].size + "px;");
		//For the cover
		var dom_circle_hover = document.getElementById(array_bubbles[i].id + ':hover');
		dom_circle_hover.setAttribute("style", "width:" + array_bubbles[i].size+ "px; height:" + array_bubbles[i].size + "px; top: 0px; left: 0px;");
	}
}

/*
** Check up collisions recursively omitting given bubbles
*/
function collisions(array_bubbles, origin, omitted) {
	if( typeof arguments[2] == 'undefined' ) { var omitted = new Bubble(-1, 1, 1, 1, 1, '', '', false);}
	
	var divs = new Array();
	var divs_hover = new Array();
	for (var i = 0 ; i < array_bubbles.length ; i++){
		divs[i] = document.getElementById( array_bubbles[i].id );
		divs_hover[i] = document.getElementById( array_bubbles[i].id + ":hover" );
		divs[i].size = array_bubbles[i].size;
	}
	
	var cols = new Array();
	for (var i=0; i < divs.length; i++) {
		if( divs[i].id != origin.id  && divs[i].id != omitted.id )  {
		
			var circle = document.getElementById(origin.id);
			var distance = hasCollision(circle, divs[i]);
			if ( distance > 0 ) {
				distance *= _SPEED;
				
				var mov_x = origin.left - divs[i].offsetLeft;
				if(mov_x < 0) {mov_x = mov_x * -1;}
				var mov_y = origin.top - divs[i].offsetTop;
				if(mov_y < 0) {mov_y = mov_y * -1;}
				var total_mov = mov_x + mov_y;
				var percent_x = ( mov_x * 100 ) / total_mov;
				var percent_y = 100 - percent_x;
				var dist_x = ( percent_x * distance ) / 100;
				var dist_y = ( percent_y * distance ) / 100;
				
				document.getElementById('info').innerHTML += mov_x + "&nbsp;&nbsp;&nbsp;" + mov_y + "--";
				
				if( (circle.offsetTop + circle.offsetWidth/2) <= (divs[i].offsetTop + divs[i].offsetWidth/2) && (circle.offsetLeft + circle.offsetWidth/2) <= (divs[i].offsetLeft + divs[i].offsetWidth/2) ) {
					divs[i].setAttribute("style","margin-top: " + (divs[i].offsetTop + dist_y) + "px; margin-left:  " + (divs[i].offsetLeft + dist_x) + "px; width:" + divs[i].size+ "px; height:" + divs[i].size + "px;");
					divs_hover[i].setAttribute("style","width:" + divs[i].size+ "px; height:" + divs[i].size + "px;");
				}
				else if( (circle.offsetTop + circle.offsetWidth/2) > (divs[i].offsetTop + divs[i].offsetWidth/2) && (circle.offsetLeft + circle.offsetWidth/2) < (divs[i].offsetLeft + divs[i].offsetWidth/2) ) {
					divs[i].setAttribute("style","margin-top: " + (divs[i].offsetTop - dist_y) + "px; margin-left:  " + (divs[i].offsetLeft + dist_x) + "px; width:" + divs[i].size+ "px; height:" + divs[i].size + "px;");
					divs_hover[i].setAttribute("style","width:" + divs[i].size+ "px; height:" + divs[i].size + "px;");
				}
				else if( (circle.offsetTop + circle.offsetWidth/2) < (divs[i].offsetTop + divs[i].offsetWidth/2) && (circle.offsetLeft + circle.offsetWidth/2) > (divs[i].offsetLeft + divs[i].offsetWidth/2) ) {
					divs[i].setAttribute("style","margin-top: " + (divs[i].offsetTop + dist_y) + "px; margin-left:  " + (divs[i].offsetLeft - dist_x) + "px; width:" + divs[i].size+ "px; height:" + divs[i].size + "px;");
					divs_hover[i].setAttribute("style","width:" + divs[i].size+ "px; height:" + divs[i].size + "px;");
				}
				else {
					divs[i].setAttribute("style","margin-top: " + (divs[i].offsetTop - dist_y) + "px; margin-left:  " + (divs[i].offsetLeft - dist_x) + "px; width:" + divs[i].size+ "px; height:" + divs[i].size + "px;");
					divs_hover[i].setAttribute("style","width:" + divs[i].size+ "px; height:" + divs[i].size + "px;");
				}
				//Passing the actual bubble to be omitted
				retard(array_bubbles, array_bubbles[i], circle, 200);
			}
		}
	}
}

function retard(array_bubbles, origin, omitted, time) {
	setTimeout( function(){
		collisions(array_bubbles, origin, omitted);
	}, time);
}

function getDistance(obj1,obj2){
	Obj1Center=[obj1.offsetLeft+obj1.offsetWidth/2,obj1.offsetTop+obj1.offsetHeight/2];
	Obj2Center=[obj2.offsetLeft+obj2.offsetWidth/2,obj2.offsetTop+obj2.offsetHeight/2];
	
	var distance=Math.sqrt( Math.pow( Obj2Center[0]-Obj1Center[0], 2)  + Math.pow( Obj2Center[1]-Obj1Center[1], 2) )

	return distance;
}

function hasCollision(obj1,obj2){ 
	return  (obj1.offsetWidth/2 + obj2.offsetWidth/2) - getDistance(obj1,obj2) ;
}