let scene, camera, renderer, cube, mesh1, mesh2, mesh3, mesh4, controls;
let particlesArray;

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function init() {
	scene  = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);
	renderer = new THREE.WebGLRenderer({ antialias: true , alpha: true});
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);
	
	
	const geometry = new THREE.SphereGeometry( 10, 20, 17 );
	const material = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('img/paper.jpg') , side: THREE.DoubleSide});
	cube = new THREE.Mesh(geometry, material);
	scene.add(cube);


	const texture_ring = new THREE.TextureLoader().load('img/zloto.jpg');
	geometry1 = new THREE.RingGeometry( 22, 21.5, 32 );
	material1 = new THREE.MeshBasicMaterial( { map: texture_ring, side: THREE.DoubleSide} );
	
	mesh1 = new THREE.Mesh( geometry1, material1 );
	scene.add( mesh1 );
	mesh1.rotation.x = (Math.random() * 100) - 2;
	mesh1.rotation.y = (Math.random() * 100) - 2;
	
	mesh2 = new THREE.Mesh( geometry1, material1 );
	scene.add( mesh2 );
	mesh2.rotation.x = (Math.random() * 100) - 2;
	mesh2.rotation.y = (Math.random() * 100) - 2;

	mesh3 = new THREE.Mesh( geometry1, material1 );
	scene.add( mesh3 );
	mesh3.rotation.x = (Math.random() * 100) - 2;
	mesh3.rotation.y = (Math.random() * 100) - 2;
	
	mesh4 = new THREE.Mesh( geometry1, material1 );
	scene.add( mesh4 );
	mesh4.rotation.x = (Math.random() * 100) - 2;
	mesh4.rotation.y = (Math.random() * 100) - 2;
	
	camera.position.z = 70;
	
	var ambientLight = new THREE.AmbientLight ( 0x123456,1.0)
	scene.add(ambientLight)
	
}



class Particle {
	constructor(x,y, directionX, directionY, size, color) {
		this.x = x;
		this.y = y;
		this.directionX = directionX;
		this.directionY = directionY;
		this.size = size;
		this.color = color;
	}
	
	draw() {
		ctx.beginPath();
		ctx.arc(this.x,this.y,this.size,0,Math.PI * 2, false);
		ctx.fillStyle = '#8C5523';
		ctx.fill();
	}
	
	update() {
		if( this.x > canvas.width || this.x < 0 ) {
			this.directionX = -this.directionX;
		}
		
		if( this.y > canvas.height || this.y < 0 ) {
			this.directionY = -this.directionY;
		}
	
	
		
		this.x += this.directionX;
		this.y += this.directionY;
		
		this.draw();
	}
}

function init2() {
	particlesArray = [];
	let numberOfParticles = (canvas.height * canvas.width) / 9000;
	for ( let i = 0; i < numberOfParticles; i++) {
		let size = (Math.random() * 5) + 1;
		let x = (Math.random() * ((innerWidth - size*2) - (size * 2)) + size * 2 );
		let y = (Math.random() * ((innerHeight - size*2) - (size * 2)) + size * 2 );
		let directionX = (Math.random() * 4) - 2;
		let directionY = (Math.random() * 4) - 2;
		let color = '#8C5523';
		
		particlesArray.push(new Particle(x,y,directionX,directionY,size,color));
	}
}

function connect() { 
	let opacityValue = 1;
	for (let a =0; a<particlesArray.length; a++) {
		for (let b = a; b < particlesArray.length; b++) {
			let distance = (( particlesArray[a].x - particlesArray[b].x)
				 * ( particlesArray[a].x - particlesArray[b].x))
				+ (( particlesArray[a].y - particlesArray[b].y)
				 * ( particlesArray[a].y - particlesArray[b].y))
			
			if(distance < (canvas.width/7) * (canvas.height/7)) {
				opacityValue = 1 - (distance/20000)
				ctx.strokeStyle = 'rgba(140,85,31,' + opacityValue + ')';
				ctx.lineWidth = 1;
				ctx.beginPath();
				ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
				ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
				ctx.stroke();
			}
		}
	}
}

function animate() {
	requestAnimationFrame(animate);
	
	ctx.clearRect(0,0,innerWidth,innerHeight);
	
	for (let i = 0; i< particlesArray.length; i++) {
		particlesArray[i].update();
	}
	connect()

	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;
	
	mesh1.rotation.x += 0.01;
	mesh1.rotation.y += 0.01;
	
	mesh2.rotation.x -= 0.01;
	mesh2.rotation.y -= 0.01;
	
	mesh3.rotation.x -= 0.01;
	mesh3.rotation.y -= 0.01;
	
	mesh4.rotation.x += 0.01;
	mesh4.rotation.y += 0.01;
	
	
	renderer.render(scene, camera);
}

window.addEventListener('resize',onWindowResize,false);
function onWindowResize(){
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
	
	canvas.width = innerWidth;
	canvas.height = innerHeight;
	init2();
}

	
init();
init2();
animate();