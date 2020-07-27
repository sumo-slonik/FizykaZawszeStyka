let confirmedHeight = false;
let height = 0;
let angle = 90;
function degrees_to_radians(degrees)
{
    var pi = Math.PI;
    return degrees * (pi/180);
}
function setup() {
    myCanvas = createCanvas(1100, 600);
    myCanvas.parent('main');
    img = loadImage('img/wykres.png');
    frameRate(100);
    beginShape();
    noFill();
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
let kostka = new Brick(10,10,10);
function draw() {
    strokeWeight(10);
    background(img);
    point(104, 500);
    point(104,500-height);
    point(104+1/Math.tan(degrees_to_radians(angle))*height,500);
    strokeWeight(4);
    triangle(104, 500,104,500-height,104+1/Math.tan(degrees_to_radians(angle))*height,500);

}

function confirm_h() {
    height = document.getElementById('height').value;
    height = height.replace(",",".");
    let reg = /\d+(\.\d+)?/;
    if(reg.test(height) && height > 0 && height <= 5){
        document.getElementById('info_heigth').style.color = 'black';
    }
    else{
        document.getElementById('info_heigth').style.color = 'red';
        return;
    }
    height *=  97;
}
function confirm_a() {
    angle = document.getElementById("angle").value;
    angle = angle.replace(",",".");
    if(reg.test(height) && height > 0 && height <= 5){
        document.getElementById('info_angle').style.color = 'black';
    }
    else{
        document.getElementById('info_angle').style.color = 'red';
        return;
    }
}