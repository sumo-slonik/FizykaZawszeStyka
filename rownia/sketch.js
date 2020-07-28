let confirmedHeight = false;
let height = 0;
let angle = Math.PI/2;
let kostka;
let rownia;
let accepted_h=false;
let accepted_a=false;
let frame = 1;
let force_s=0;
let first_time=true;
function degrees_to_radians(degrees) {
    var pi = Math.PI;
    return degrees * (pi / 180);
}

function setup() {
    myCanvas = createCanvas(1100, 600);
    myCanvas.parent('main');
    img = loadImage('img/wykres.png');
    frameRate(100);
    frame=100;
    beginShape();
    noFill();
    kostka = new Brick(104, 500, 1);
    rownia = new Inclined(55,550,55,550,55,550);
}

function draw() {
    background(img);
    rownia.second=createVector(55,550-height);
    rownia.third=createVector(55 + 1 / Math.tan(angle) * height,550);
    rownia.display();
    force=createVector(0,kostka.mass*9.81);
    force.rotate(angle);
    force.mult(Math.sin(angle));
    if (accepted_a && accepted_h)
    {
        if (first_time)
        {
            kostka.position.x=55;
            kostka.position.y=550-height-100;
            first_time=false;
        }
        kostka.display();
        kostka.position.x+=1;
    }

}

function confirm_h() {
    first_time=true;
    height = document.getElementById('height').value;
    height = height.replace(",", ".");
    let reg = /\d+(\.\d+)?/;
    if (reg.test(height) && height > 0 && height <= 5) {
        document.getElementById('info_heigth').style.color = 'black';
        accepted_h=true;
    } else {
        document.getElementById('info_heigth').style.color = 'red';
        accepted_h=false;
        return;
    }
    height *= 97;
}

function confirm_a() {
    first_time=true;
    angle = document.getElementById("angle").value;
    angle = angle.replace(",", ".");
    let reg = /\d+(\.\d+)?/;
    if (reg.test(angle) && angle > 0 && angle <= 90) {
        document.getElementById('info_angle').style.color = 'black';
        accepted_a=true;
    } else {
        document.getElementById('info_angle').style.color = 'red';
        let angle = Math.PI/2;
        accepted_a=false;
        return;
    }
    angle=degrees_to_radians(angle);
}

function Brick(x, y, mass) {
    this.mass = mass;
    this.position = createVector(x, y);
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
}

Brick.prototype.display = function () {
    push();
    translate(this.position.x,this.position.y+100);
    rotate(angle);
    square(0,-100, 100);
    pop();
}
Brick.prototype.addForce = function(force)
{
    let f = force.copy();
    f.div(this.mass);
    this.acceleration.add(f);
}
Brick.prototype.update = function()
{
    this.velocity.add(this.acceleration.div(frame));
    this.position.add(this.velocity.div(frame));
    this.acceleration.mult(0);
}

function Inclined(x1, y1, x2, y2, x3, y3, friction = 0, stroke = 4,) {
    this.first = createVector(x1, y1);
    this.second = createVector(x2, y2);
    this.third = createVector(x3, y3);
    this.size = stroke;
    this.friction = friction;
}

Inclined.prototype.display = function () {
    strokeWeight(10);
    point(this.first.x,this.first.y);
    point(this.second.x,this.second.y);
    point(this.third.x,this.third.y);
    strokeWeight(this.size);
    triangle(this.first.x,this.first.y,this.second.x,this.second.y,this.third.x,this.third.y);
}