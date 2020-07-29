let confirmedHeight = false;
let height = 0;
let angle = Math.PI / 2;
let kostka;
let rownia;
let accepted_h = false;
let accepted_a = false;
let frame = 100;
let force_s = 0;
let first_time = true;
let mass = 1;

function degrees_to_radians(degrees) {
    var pi = Math.PI;
    return degrees * (pi / 180);
}

function setup() {
    myCanvas = createCanvas(1100, 600);
    myCanvas.parent('main');
    img = loadImage('img/wykres.png');
    frameRate(100);
    frame = 100;
    beginShape();
    noFill();
    kostka = new Brick(104, 500, 1);
    rownia = new Inclined(55, 550, 55, 550, 55, 550);
}

function draw() {
    background(img);
    rownia.second = createVector(55, 550 - height);
    rownia.third = createVector(55 + 1 / Math.tan(angle) * height, 550);
    rownia.display();
    force = createVector(0, kostka.mass * 9.81);
    force.rotate(-((PI/2)-angle));
    force.mult(Math.sin(angle));
    if (accepted_a && accepted_h) {
        if (first_time) {
            kostka.position.x = 55;
            kostka.position.y = 550 - height - kostka.wymiar;
            kostka.rotationAngle = angle;
            kostka.mass = mass;
            first_time = false;
        }
        kostka.checkEdges(rownia);
        kostka.addForce(force);
        kostka.update();
        kostka.display();
    }

}

function confirm_h() {
    first_time = true;
    height = document.getElementById('height').value;
    height = height.replace(",", ".");
    let reg = /\d+(\.\d+)?/;
    if (reg.test(height) && height > 0 && height <= 5) {
        document.getElementById('info_heigth').style.color = 'black';
        accepted_h = true;
    } else {
        document.getElementById('info_heigth').style.color = 'red';
        accepted_h = false;
        height = 0;
        return;
    }
    height *= 97;
}

function confirm_a() {
    first_time = true;
    angle = document.getElementById("angle").value;
    angle = angle.replace(",", ".");
    let reg = /\d+(\.\d+)?/;
    if (reg.test(angle) && angle > 0 && angle <= 90) {
        document.getElementById('info_angle').style.color = 'black';
        accepted_a = true;
    } else {
        document.getElementById('info_angle').style.color = 'red';
        let angle = Math.PI / 2;
        accepted_a = false;
        return;
    }
    angle = degrees_to_radians(angle);
}

function confirm_m() {
    first_time = true;
    mass = document.getElementById("mass").value;
    mass = mass.replace(",", ".");
    let reg = /\d+(\.\d+)?/;
    if (reg.test(mass) && mass > 0 && mass <= 1000) {
        document.getElementById('info_mass').style.color = 'black';
        accepted_a = true;
    } else {
        document.getElementById('info_mass').style.color = 'red';
        let mass = 1;
        accepted_a = false;
        return;
    }
}

function Brick(x, y, mass) {
    this.mass = mass;
    this.position = createVector(x, y);
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.rotationAngle = 0;
    this.wymiar = 50;
}

Brick.prototype.checkEdges = function (rownia) {
    if (this.position.x > 1600 || this.position.x < 0 || this.position.y > 600 || this.position.y < 0 || this.position.x > rownia.third.x)
    {
        this.velocity.mult(0);
    }
    if(this.position.x > rownia.third.x)
    {
        this.rotationAngle=0;
    }
}
Brick.prototype.display = function () {
    push();
    fill(255, 15, 206);
    translate(this.position.x, this.position.y + this.wymiar);
    rotate(this.rotationAngle);
    square(0, -this.wymiar, this.wymiar);
    pop();
}
Brick.prototype.addForce = function (force) {
    let f = force.copy();
    f.div(this.mass);
    this.acceleration.add(f);
}
Brick.prototype.update = function () {
    let acceleration_c = this.acceleration.copy();
    let velocity_c = this.velocity.copy();
    acceleration_c.div(10);
    velocity_c.div(10);
    this.velocity.add(acceleration_c);
    this.position.add(velocity_c);
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
    point(this.first.x, this.first.y);
    point(this.second.x, this.second.y);
    point(this.third.x, this.third.y);
    strokeWeight(this.size);
    triangle(this.first.x, this.first.y, this.second.x, this.second.y, this.third.x, this.third.y);
}