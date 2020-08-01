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
let getDown = false;
let startedAnimation = false;
let gravity = 9.81;
let frictionParametr = 0;
let accepted_f = false;
let showForce = true;

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
    rownia = new Inclined(55, 550, 55, 550, 55, 550,frictionParametr);
}

function draw() {
    buttonCheck();
    $('#angle')[0].value = Math.round($('#rangeAngle')[0].value/1.12);
    background(img);
    rownia.second = createVector(55, 550 - height);
    rownia.third = createVector(55 + 1 / Math.tan(angle) * height, 550);
    rownia.friction=frictionParametr;
    rownia.display();
    if (accepted_a && accepted_h) {
        if (first_time) {
            kostka.position.x = 55;
            kostka.position.y = 550 - height - kostka.wymiar;
            kostka.velocity.mult(0);
            kostka.rotationAngle = angle;
            kostka.mass = mass;
            first_time = false;
            getDown = false;
        }
        if (startedAnimation) {
            kostka.checkEdges(rownia);
            slide(kostka,gravity,angle);
            //friction(kostka,rownia,gravity,angle);
            kostka.update();
            if (getDown && kostka.rotationAngle > 0) {

                kostka.rotationAngle -= 0.5;
            } else if (getDown) {
                kostka.rotationAngle = 0;
                startedAnimation=false;
                showForce=false;
            }
        }
        kostka.display();
        kostka.cetrePoint();
        if (showForce)
        {
            kostka.gravityForcePrint();
            kostka.sliceForcePrint();
            kostka.pressForcePrint();
        }
    }
    $('#predkosc')[0].innerHTML= kostka.velocity.mag() +"&nbspm/s";
}

function start() {
    if (getDown)
    {
        first_time=true;
    }
    startedAnimation = true;
}

function pause() {
    startedAnimation = false;
}

function reset() {
    first_time = true;
    startedAnimation = false;
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
function heightRanger()
{
    accepted_h = true;
    first_time = true;
    $('#height')[0].value = $('#rangeHeight')[0].value/20;
    height = document.getElementById('height').value;
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
function angleRanger()
{
    accepted_a = true;
    first_time = true;
    $('#angle')[0].value = Math.floor($('#rangeAngle')[0].value/1.12);
    angle = document.getElementById('angle').value;
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
function confirm_f() {
    first_time = true;
    frictionParametr = document.getElementById("friction").value;
    frictionParametr = frictionParametr.replace(",", ".");
    let reg = /\d+(\.\d+)?/;
    if (reg.test(frictionParametr) && frictionParametr >= 0 && frictionParametr <= 10) {
        document.getElementById('info_friction').style.color = 'black';
        accepted_f = true;
    } else {
        document.getElementById('info_friction').style.color = 'red';
        frictionParametr = 0;
        accepted_f = false;
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
    if (this.position.x > 1600 || this.position.x < 0 || this.position.y > 600 || this.position.y < 0 || this.position.x > rownia.third.x) {
        this.velocity.mult(0);
    }
    if (this.position.x > rownia.third.x) {
        getDown = true;
    }
}
Brick.prototype.display = function () {
    push();
    fill (236, 99, 32);
    translate(this.position.x, this.position.y + this.wymiar);
    rotate(this.rotationAngle);
    square(0, -this.wymiar, this.wymiar);
    pop();
}
Brick.prototype.cetrePoint = function () {
    push();
    strokeWeight(10);
    translate(this.position.x, this.position.y + this.wymiar);
    rotate(this.rotationAngle);
    point(0+this.wymiar/2, -this.wymiar/2,);
    pop();
}
Brick.prototype.gravityForcePrint = function () {
    push();
    let start = createVector(+this.wymiar/2, -this.wymiar/2);
    let end = createVector(0,this.mass*gravity);
    strokeWeight(10);
    translate(this.position.x, this.position.y + this.wymiar);
    rotate(this.rotationAngle);
    end.rotate(-this.rotationAngle);
    end.mult(10);
    drawArrow(start,end,'black');
    pop();
}
Brick.prototype.sliceForcePrint = function () {
    push();
    let start = createVector(+this.wymiar/2, -this.wymiar/2);
    let end = createVector(this.mass*gravity*Math.sin(this.rotationAngle),0);
    strokeWeight(10);
    translate(this.position.x, this.position.y + this.wymiar);
    rotate(this.rotationAngle);
    end.mult(10);
    drawArrow(start,end,'red');
    pop();
}
Brick.prototype.pressForcePrint = function () {
    push();
    let start = createVector(+this.wymiar/2, -this.wymiar/2);
    let end = createVector(0,this.mass*gravity*Math.cos(this.rotationAngle));
    strokeWeight(10);
    translate(this.position.x, this.position.y + this.wymiar);
    rotate(this.rotationAngle);
    end.mult(10);
    drawArrow(start,end,'red');
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
    this.velocity.add(acceleration_c);
    this.velocity.div(5);
    if (this.velocity.x <= 0)
    {
        this.velocity.mult(0);
    }
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

function buttonCheck() {
    if ($('#check_friction')[0].checked == true)
    {
        $('#friction')[0].disabled = false;
        $('#frictionButton')[0].disabled = false;
    }
    if (accepted_a && accepted_h)
    {
        $('#startButton')[0].disabled = false;
    }else
    {
        $('#startButton')[0].disabled = true;
        $('#startButton')[0].disabled = true;
        $('#resetButton')[0].disabled = true;


    }
    if (startedAnimation) {
        $('#startButton')[0].disabled = true;
        $('#pauseButton')[0].disabled = false;
        $('#resetButton')[0].disabled = false;
        $(".input").prop("disabled",true);

    }else
    {
        $('#pauseButton')[0].disabled = true;
        $(".input").prop("disabled",false);

    }
    if (!$('#check_friction')[0].checked == true)
    {
        $('#friction')[0].disabled = true;
        $('#frictionButton')[0].disabled = true;
    }
}
function slide (kostka,gravity,angle)
{
    let force;
    force = createVector(0, kostka.mass * gravity);
    force.mult(Math.sin(angle));
    force.rotate(-((PI / 2) - angle));
    kostka.addForce(force);
}
function friction(kostka,rownia,gravity,angle)
{
    let force;
    force = createVector(0, kostka.mass * gravity);
    force.mult(Math.cos(angle));
    force.rotate(-((PI / 2) - angle));
    force.mult(rownia.friction);
    force.mult(-1);
    kostka.addForce(force);
}
function drawArrow(base, vec, myColor) {
    push();
    stroke(myColor);
    strokeWeight(3);
    fill(myColor);
    translate(base.x, base.y);
    line(0, 0, vec.x, vec.y);
    rotate(vec.heading());
    let arrowSize = 7;
    translate(vec.mag() - arrowSize, 0);
    triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
    pop();
}
$(function () {
    $('#heightButton').click(confirm_h);
    $('#angleButton').click(confirm_a);
    $('#massButton').click(confirm_m);
    $('#startButton').click(start);
    $('#pauseButton').click(pause);
    $('#resetButton').click(reset);
    $('#frictionButton').click(confirm_f);
    $("#rangeHeight").click(heightRanger);
    $("#rangeAngle").click(angleRanger);
});