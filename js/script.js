/* Author:

*/
var canvas = document.getElementById('treeCanvas');
var ctx = canvas.getContext('2d');
var branches = [];



function init(){
	var trunk = new Branch(400,800,100,1,'rgb(0,0,0)');
	branches.push(trunk);
}


function renderLoop(){

	for (var i in branches){

		var b = branches[i];
		if(b.rad > '.3'){

			drawSection(b.x, b.y, b.rad,b.color);
			b.x += getRandom(-b.generation,b.generation);
			b.y -= getRandom(0,2);
			b.rad *= getRandom(990,994)/1000;
			var branchProbability = getRandom(0,100);
			if(branchProbability > 99.5	){
				var colorString = 'rgb('+getRandomColor()+','+getRandomColor()+','+getRandomColor()+')';
				branches.push(new Branch(b.x,b.y,b.rad,b.generation + 1, colorString));
				console.log(' new branch!', branches.length, colorString);
			}
		}
	}
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
setInterval(renderLoop, 10);





//_______________  CLASSES _________________________


function Branch(startX, startY,startRad,generation,color){
	this.x = startX;
	this.y = startY;
	this.rad = startRad;
	this.generation = generation;
	this.color = color;
	

	////if( startRadius >= '.3') drawBranch(xPos,yPos,startRadius);

}



//________________  UTILS ____________________________


function getRandom (min, max) {
    return Math.random() * (max - min) + min;
}
function getRandomColor(){
	return Math.floor(getRandom(0,100));
}




