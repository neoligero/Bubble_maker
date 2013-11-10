var _SPEED = 1.3;

var Bubble = function(id, top, left, size, grow) {
	if(typeof size == 'undefined') size = 100;
	if(typeof grow == 'undefined') grow = 100;
	this.id = id;
	this.top = top;
	this.left = left;
	this.size = size;
	this.grow = grow;
}

function generator(array_bubbles, container) {
	for (var i = 0 ; i < array_bubbles.length ; i++){
		var b1 = document.createElement('div');
		b1.setAttribute('id', array_bubbles[i].id);
		b1.setAttribute('class', 'circle01');
		b1.setAttribute('style', 'width:' + array_bubbles[i].size + 'px; height:' + array_bubbles[i].size + 'px; margin-top:' + array_bubbles[i].top + 'px; margin-left:' + array_bubbles[i].left + 'px;');
		b1.setAttribute('onmouseover', 'animate(bubbles, this)');
		b1.setAttribute('onmouseout', 'reorder(bubbles)');
		b1.innerHTML = '<span style="line-height: ' + array_bubbles[i].size + 'px;">' + array_bubbles[i].text + '</span>';
		
		container.appendChild(b1);
	}
}

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
		
		array[i] = new Bubble(i+'e', y, x, size, size*2);
		
		container.appendChild(b1);
		x += size;
		if(i % 20 == 0)
			y += size;
	}
	return array;
}

function animate(array_bubbles, circle) {
	for(var i = 0; i < array_bubbles.length; i++) {
		if(array_bubbles[i].id == circle.id) {
			circle.setAttribute("style","width:" + (array_bubbles[i].size + array_bubbles[i].grow) + "px; height:" + (array_bubbles[i].size + array_bubbles[i].grow) + 
			"px; border-radius:50%; margin-top: " + (circle.offsetTop - array_bubbles[i].grow/2) + "px; margin-left: " + (circle.offsetLeft - array_bubbles[i].grow/2) + "px;");
			circle.innerHTML = '<span style="line-height: ' + (array_bubbles[i].size + array_bubbles[i].grow) + 'px; pointer-events: none;">' + array_bubbles[i].text + '</span>';
			
			setTimeout( function(){collisions(array_bubbles, circle);}, 200);
		}
	}
}

function reorder(array_bubbles) {
	for (var i = 0 ; i < array_bubbles.length ; i++){
		var dom_circle = document.getElementById(array_bubbles[i].id);
		dom_circle.setAttribute("style", "margin-top:" + array_bubbles[i].top + "px; margin-left:" + array_bubbles[i].left + "px; width:" + array_bubbles[i].size+ "px; height:" + array_bubbles[i].size + "px;");
		dom_circle.innerHTML = '<span style="line-height: ' + array_bubbles[i].size  + 'px;">' + array_bubbles[i].text + '</span>';
	}
}

function collisions(array_bubbles, circle, omitir) {
	var divs = new Array();
	
	for (var i = 0 ; i < array_bubbles.length ; i++){
		divs[i] = document.getElementById( array_bubbles[i].id );
		divs[i].size = array_bubbles[i].size;
	}
	
	if( typeof arguments[2] == 'undefined' ) {
		omitir = {'ìd': -1};
	}
	
	for (var i=0; i < divs.length; i++)
		{
			if( divs[i].id != circle.id  && divs[i].id != omitir.id )  {
			
				var distance = hasCollision(circle, divs[i]);
				
				if ( distance > 0 ) {
					distance *= _SPEED;
					
					if( circle.offsetTop < divs[i].offsetTop && circle.offsetLeft < divs[i].offsetLeft ) {
						divs[i].setAttribute("style","margin-top: " + (divs[i].offsetTop + distance) + "px; margin-left:  " + (divs[i].offsetLeft + distance) + "px; width:" + divs[i].size+ "px; height:" + divs[i].size + "px;");
					}
					else if( circle.offsetTop > divs[i].offsetTop && circle.offsetLeft < divs[i].offsetLeft ) {
						divs[i].setAttribute("style","margin-top: " + (divs[i].offsetTop - distance) + "px; margin-left:  " + (divs[i].offsetLeft + distance) + "px; width:" + divs[i].size+ "px; height:" + divs[i].size + "px;");
					}
					else if( circle.offsetTop < divs[i].offsetTop && circle.offsetLeft > divs[i].offsetLeft ) {
						divs[i].setAttribute("style","margin-top: " + (divs[i].offsetTop + distance) + "px; margin-left:  " + (divs[i].offsetLeft - distance) + "px; width:" + divs[i].size+ "px; height:" + divs[i].size + "px;");
					}
					else {
						divs[i].setAttribute("style","margin-top: " + (divs[i].offsetTop - distance) + "px; margin-left:  " + (divs[i].offsetLeft - distance) + "px; width:" + divs[i].size+ "px; height:" + divs[i].size + "px;");
					}
					var n = i;
					setTimeout( function(){collisions(array_bubbles, divs[n], circle);}, 200);
				}
			}
		}
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