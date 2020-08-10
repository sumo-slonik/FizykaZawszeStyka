const canvas = document.getElementById("tlo_czasteczki");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray;
let noConectParticlesArray;
//pozycja myszki
let mouse = {
    x: null,
    y: null,
    radius: (canvas.height / 80) * (canvas.width / 80) / 2
};


window.addEventListener('mousemove',
    function (event) {
        let rect = canvas.getBoundingClientRect();
        mouse.x = event.x - rect.left;
        mouse.y = event.y - rect.top;
    }
);

//tworzenie cząsteczki
class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }

    //metoda odpowiedzialna za rysowanie cząsteczki
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    //funckja sprawdzająca położenie myszki i cząsteczek
    update() {
        //zderzenia z krawędziami ekranu
        if (this.x > canvas.width || this.x < 0) {
            this.directionX *= -1;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.directionY *= -1;
        }
        //zderzenia z myszką
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
            if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                this.x += 10;
            }
            if (mouse.x > this.x && this.x > this.size * 10) {
                this.x -= 10;
            }
            if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                this.y += 10;
            }
            if (mouse.y > this.y && this.y > this.size * 10) {
                this.y -= 10;
            }
            //przesunięcie cząsteczki o prędkość;
        }
        this.x += this.directionX;
        this.y += this.directionY;
        //narysowanie cząsteczki
        this.draw();
    }
}

//tworzenie bazy cząsteczek
function init() {
    particlesArray = [];
    noConectParticlesArray = [];
    //to ile ma być cząsteczek
    let numberParticles = (canvas.height * canvas.width) / 9000;
    let nuberOfNoConect = (canvas.height * canvas.width) / 4000;
    for (let i = 0; i < numberParticles; i++) {
        let size = (Math.random() * 5) + 1;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 5) - 2.5;
        let directionY = (Math.random() * 5) - 2.5;
        let color = '#8C5523';
        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
    for (let i = 0; i < nuberOfNoConect; i++) {
        let size = (Math.random() * 3) + 1;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 5) - 2.5;
        let directionY = (Math.random() * 5) - 2.5;
        let color = '#8c5923';
        noConectParticlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

//funkcja odpowiedzialna za animowanie tła
function animate() {
    requestAnimationFrame(animate);

    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (let i = 0; i < noConectParticlesArray.length; i++) {
        noConectParticlesArray[i].update();
    }
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }


    connect()
}

function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a += 1) {
        for (let b = 0; b < particlesArray.length; b += 1) {
            let dx = particlesArray[a].x - particlesArray[b].x;
            let dy = particlesArray[a].y - particlesArray[b].y;
            let distance = dx * dx + dy * dy;
            if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                opacityValue = 1 - distance / 20000;
                ctx.strokeStyle = "rgba(140,85,31," + opacityValue + ')';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

//zmiana wielkości ekranu żeby się nie psuło
window.addEventListener('resize',
    function () {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        mouse.radius = (canvas.height / 80) * (canvas.width / 80) / 2;
        init();
    }
)

document.body.style.background = 'url(' + canvas.toDataURL() + ')';
init();
animate();