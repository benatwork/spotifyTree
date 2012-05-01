/* Author: Ben Roth */




//_____________ global configs _______________
var maxBranches = 150;
var growRate = 10;



//__________________end global configs _____
var canvas = document.getElementById('treeCanvas');
var ctx = canvas.getContext('2d');
var branches = [];

var angleOffset = toRadians(50);



function init(){
	var trunk = new Branch({
		x: 400,
		y: 800,
		rad: 50,
		generation: 1,
		color: 'rgb(0,0,0)',
		angle: toRadians(90)
	});
	branches.push(trunk);
}


function renderLoop(){

	for (var i in branches){
		var b = branches[i];
		if(b.rad > '.3'){
			drawSection(b.x, b.y, b.rad,b.color);
		
			b.x += getRandom(-b.generation,b.generation)+Math.cos(b.angle);
			b.y -= getRandom(-b.generation,b.generation)+ Math.sin(b.angle)//getRandom(0,2)
			b.rad *= getRandom(994,998)/1000;

			var branchProbability = getRandom(0,100);
			if(branchProbability > 99.4 && branches.length <= maxBranches){
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
	ctx.fill();
	ctx.restore();
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

