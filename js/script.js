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
//var ctx = canvas.getContext('2d');
var branches = [];
var completedCount = 0;

var container, stats;
var camera, scene, renderer, particles, geometry, material, i, h, color, colors = [], sprite, size;
var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var angleOffset = toRadians(50);



function init(){

	var vertex = new THREE.Vector3();
	vertex.x = 2000 * Math.random() - 1000;
	vertex.y = 2000 * Math.random() - 1000;
	vertex.z = 2000 * Math.random() - 1000;

	colors[ i ] = new THREE.Color( 0xffffff );
	colors[ i ].setHSV( ( vertex.x + 1000 ) / 2000, 1, 1 );
	var trunk = new Branch({
		vert: vertex,
		rad: startRadius,
		generation: 1,
		color: 'rgb(0,0,0)',
		angle: toRadians(90)
	});
	branches.push(trunk);

	container = document.createElement( 'div' );
	document.body.appendChild( container );

	scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2( 0x000000, 0.0009 );

	camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 3000 );
	camera.position.z = 1400;
	scene.add( camera );

	geometry = new THREE.Geometry();

	sprite = THREE.ImageUtils.loadTexture( "textures/sprites/ball.png" );

	// for ( i = 0; i < 5000; i ++ ) {

	// 	var vertex = new THREE.Vector3();
	// 	vertex.x = 2000 * Math.random() - 1000;
	// 	vertex.y = 2000 * Math.random() - 1000;
	// 	vertex.z = 2000 * Math.random() - 1000;

	// 	geometry.vertices.push( vertex );

	// 	colors[ i ] = new THREE.Color( 0xffffff );
	// 	colors[ i ].setHSV( ( vertex.x + 1000 ) / 2000, 1, 1 );

	// }

	geometry.colors = colors;

	material = new THREE.ParticleBasicMaterial( { size: 85, map: sprite, vertexColors: true } );
	material.color.setHSV( 1.0, 0.2, 0.8 );

	particles = new THREE.ParticleSystem( geometry, material );
	particles.sortParticles = true;

	scene.add( particles );

	//

	renderer = new THREE.WebGLRenderer( { clearAlpha: 1 } );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );

	//

	// stats = new Stats();
	// stats.domElement.style.position = 'absolute';
	// stats.domElement.style.top = '0px';
	// container.appendChild( stats.domElement );

	//

	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'touchstart', onDocumentTouchStart, false );
	document.addEventListener( 'touchmove', onDocumentTouchMove, false );
	window.addEventListener( 'resize', onWindowResize, false );
}


function renderLoop(){

	for (var i in branches){
		var b = branches[i];
		if(b.rad > .3){
			//if(renderCircles) drawSection(b.x, b.y, b.rad,b.color);
			var v = b.vect;
			console.log(b);	
			var previousPos = {x:v.x,y:v.y,z:v.z};

			v.x -= Math.cos(b.angle)+getRandom(-roughness,roughness);
			v.y -= b.rad+Math.sin(b.angle)+getRandom(-roughness,roughness);//getRandom(0,2)
			if(renderLines)drawLine(v.x, v.y, previousPos.x, previousPos.y);

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
				var vertex = new THREE.Vector3();
				vertex.x = 2000 * Math.random() - 1000;
				vertex.y = 2000 * Math.random() - 1000;
				vertex.z = 2000 * Math.random() - 1000;

				colors[ i ] = new THREE.Color( 0xffffff );
				colors[ i ].setHSV( ( vertex.x + 1000 ) / 2000, 1, 1 );	

				var nb = new Branch({
					vert: vertex,
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
			//drawSection(b.x,b.y,budSize,b.color)
			//drawSection(b.x,b.y,budSize-2,'#000');

		}
	}

	var time = Date.now() * 0.00005;

	camera.position.x += ( mouseX - camera.position.x ) * 0.05;
	camera.position.y += ( - mouseY - camera.position.y ) * 0.05;

	camera.lookAt( scene.position );

	h = ( 360 * ( 1.0 + time ) % 360 ) / 360;
	material.color.setHSV( h, 0.8, 1.0 );

	renderer.render( scene, camera );
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

function onDocumentMouseMove( event ) {

	mouseX = event.clientX - windowHalfX;
	mouseY = event.clientY - windowHalfY;

}

function onDocumentTouchStart( event ) {

	if ( event.touches.length == 1 ) {

		event.preventDefault();

		mouseX = event.touches[ 0 ].pageX - windowHalfX;
		mouseY = event.touches[ 0 ].pageY - windowHalfY;

	}
}

function onDocumentTouchMove( event ) {

	if ( event.touches.length == 1 ) {

		event.preventDefault();

		mouseX = event.touches[ 0 ].pageX - windowHalfX;
		mouseY = event.touches[ 0 ].pageY - windowHalfY;

	}

}

function onWindowResize( event ) {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

//

function animate() {

	requestAnimationFrame( animate );

	renderLoop();
	//stats.update();

}




init();
animate();
//setInterval(renderLoop, growRate);
//renderLoop();





//_______________  CLASSES _________________________


function Branch(configObj){
	this.vert = configObj.vert;
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

