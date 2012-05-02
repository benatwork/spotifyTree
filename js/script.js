/* Author: Ben Roth */




//_____________ global configs _______________
var maxBranches = 200;
var growRate = 5;
var roughness = 0;
var startRadius = 10
var renderCircles = true;
var renderCircleFills = true;
var renderLines = false;




//__________________end global configs _____
var canvas = document.getElementById('treeCanvas');
var ctx = canvas.getContext('2d');
var branches = [];
var completedCount = 0;

var angleOffset = toRadians(50);



function init(){
	var trunk = new Branch({
		x: 400,
		y: 800,
		rad: startRadius,
		generation: 1,
		color: 'rgb(0,0,0)',
		angle: toRadians(90)
	});
	branches.push(trunk);
}


function renderLoop(){
	
	for (var i in branches){
		var b = branches[i];
		if(b.rad > .3){
			if(renderCircles) drawSection(b.x, b.y, b.rad,b.color);
			var previousPos = {x:b.x,y:b.y};

			b.x -= Math.cos(b.angle)+getRandom(-roughness,roughness);
			b.y -= b.rad+Math.sin(b.angle)+getRandom(-roughness,roughness);//getRandom(0,2)
			if(renderLines)drawLine(b.x, b.y, previousPos.x, previousPos.y);

			if(b.x > 400) {
				b.angle -= toRadians(getRandom(-30,30));
			} else {
				b.angle += toRadians(getRandom(-30,30));
			}
			b.rad *= getRandom(970,998)/1000;

			var branchProbability = getRandom(0,100);
			if(branchProbability > 98 && branches.length <= maxBranches){
				//create a new Branch
				var colorString = 'rgb('+getRandomColor()+','+getRandomColor()+','+getRandomColor()+')';
				var nb = new Branch({
					x: b.x,
					y: b.y,
					rad: b.rad,
					generation: b.generation+1,
					color: colorString,
					angle: b.angle + toRadians(getRandom(-30,30)) 
				});
				branches.push(nb);
				//console.log(' new branch!', branches.length, colorString);
			}

		} else if (!b.completed) {
			b.completed = true;
			var budSize = getRandom(3,10)
			drawSection(b.x,b.y,budSize,b.color)
			//drawSection(b.x,b.y,budSize-2,'#000');

		}
	}
	requestAnimationFrame(renderLoop);
}




function drawSection(x,y,rad,color){
	ctx.save();
	//ctx.scale(0.75, 1);
	ctx.beginPath();
	ctx.strokeStyle = color;
	ctx.fillStyle = color;
	ctx.arc(x, y, rad, 0, Math.PI*2, false);
	ctx.stroke();
	ctx.closePath();
	if(renderCircleFills)ctx.fill();
	ctx.restore();
}
function drawLine(newX,newY,oldX,oldY){
	ctx.beginPath();
	ctx.moveTo(oldX,oldY);
	ctx.lineTo(newX,newY);
	ctx.closePath()
	ctx.stroke();

}



init();
//setInterval(renderLoop, growRate);
renderLoop();





//_______________  CLASSES _________________________


function Branch(configObj){
	this.x = configObj.x;
	this.y = configObj.y;
	this.rad = configObj.rad;
	this.generation = configObj.generation;
	this.color = configObj.color;
	this.angle = configObj.angle;
	this.completed = false;
	

	////if( startRadius >= '.3') drawBranch(xPos,yPos,startRadius);

}



//________________  UTILS ____________________________


function getRandom (min, max) {
    return Math.random() * (max - min) + min;
}
function getRandomColor(){
	return Math.floor(getRandom(0,230));
}

function toRadians(degrees){
	return degrees * (Math.PI/180);
}
function toDegreees(radians){
	return radians * (180/Math.PI);
}

