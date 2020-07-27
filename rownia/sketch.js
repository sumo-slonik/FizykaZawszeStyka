let confirmedHeight = false;
let height = 100;

function setup() {
    myCanvas = createCanvas(1100, 600);
    myCanvas.parent('main');
    img = loadImage('img/wykres.png');
    frameRate(100);
    beginShape();
}

function Brick(x, y, mass) {
    this.mass = mass;
    this.position = createVector(x, y);
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
}

Brick.prototype.display = function () {
    square(this.x, this.y, this.mass*10);
}

function draw() {
    strokeWeight(10);
    background(img);
    point(104, 500);
    point(104,500-height);

}

function confirm_h() {
    height = document.getElementById('height').value;
    height *=  87;

}
