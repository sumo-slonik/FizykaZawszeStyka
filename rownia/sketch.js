let height = 0;
let angle = Math.PI / 2;
let kostka;
let rownia;
let accepted_h = false;
let accepted_a = false;
let accepted_m = false;
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
let time = 0;
let counter = 0;

function roundPrecised(number, precision) {
    var power = Math.pow(10, precision);
    return Math.round(number * power) / power;
}

function degrees_to_radians(degrees) {
    var pi = Math.PI;
    return degrees * (pi / 180);
}

function setup() {
    myCanvas = createCanvas(1100, 600);
    myCanvas.parent('main');
    img = loadImage('img/wykres.png');
    frameRate(30);
    frame = 100;
    beginShape();
    noFill();
    kostka = new Brick(104, 500, 1);
    rownia = new Inclined(55, 550, 55, 550, 55, 550, frictionParametr);
}

function draw() {

    buttonCheck();
    background(img);
    rownia.friction = frictionParametr;
    rownia.display();
    if (accepted_a && accepted_h && accepted_m) {
        if (first_time)
        {
            rownia.friction = frictionParametr;
            time=0;
            counter=0;
            defaultPose(kostka);
        }

        if (startedAnimation) {
            if (counter%3 == 0)
            {
                time+=0.1;
                $('#debug')[0].innerHTML= roundPrecised(time,2)+"s";
            }
            kostka.checkEdges(rownia);
            if (getDown)
            {
                kostka.accelerationCopy.mult(0);
                kostka.position.y=rownia.third.y-kostka.wymiar;
                kostka.position.x=rownia.third.x;
                if(kostka.rotationAngle > 0)
                {
                    kostka.rotationAngle -= 0.5;
                }
                else
                {
                    kostka.rotationAngle = 0;
                    startedAnimation = false;
                    showForce = false;
                }
            }else
            {
                kostka.slide();
                kostka.friction(rownia.friction);
                kostka.update();
            }
            counter+=1;
        }
        kostka.display();
        kostka.centrePoint();
    }
    // $('#debug')[0].innerHTML = rownia.third.x;
}
function defaultPose(kostka)
{
    time = 0;
    kostka.position.x = 55;
    kostka.position.y = 550 - height - kostka.wymiar;
    kostka.velocity.mult(0);
    kostka.acceleration.mult(0);
    kostka.rotationAngle = angle;
    kostka.mass = mass;
    first_time = false;
    getDown = false;
}
function start() {
    if (getDown) {
        first_time = true;
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
        $("#rangeHeight")[0].value = height*20;
        accepted_h = true;
    } else {
        document.getElementById('info_heigth').style.color = 'red';
        accepted_h = false;
        height = 0;
        return;
    }
    height *= 97;
}

function timePass(time) {
    time += 1 / 100;
    $('#debug')[0].innerHTML = time;
}

function heightRanger() {
    accepted_h = true;
    first_time = true;
    $('#height')[0].value = $('#rangeHeight')[0].value / 20;
    height = document.getElementById('height').value;
    height *= 97;
    document.getElementById('info_heigth').style.color = 'black';
}

function confirm_a() {
    first_time = true;
    angle = document.getElementById("angle").value;
    angle = angle.replace(",", ".");
    let reg = /\d+(\.\d+)?/;
    if (reg.test(angle) && angle > 0 && angle <= 90) {
        document.getElementById('info_angle').style.color = 'black';
        $("#rangeAngle")[0].value = angle*1.13;
        accepted_a = true;
    } else {
        document.getElementById('info_angle').style.color = 'red';
        let angle = Math.PI / 2;
        accepted_a = false;
        return;
    }
    angle = degrees_to_radians(angle);
}

function angleRanger() {
    accepted_a = true;
    first_time = true;
    $('#angle')[0].value = Math.floor($('#rangeAngle')[0].value / 1.12);
    angle = document.getElementById('angle').value;
    angle = degrees_to_radians(angle);
    document.getElementById('info_angle').style.color = 'black';
}

function confirm_m() {
    first_time = true;
    mass = document.getElementById("mass").value;
    mass = mass.replace(",", ".");
    let reg = /\d+(\.\d+)?/;
    if (reg.test(mass) && mass > 0 && mass <= 1000) {
        document.getElementById('info_mass').style.color = 'black';
        accepted_m = true;
    } else {
        document.getElementById('info_mass').style.color = 'red';
        let mass = 1;
        accepted_m = false;
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
    this.accelerationCopy= createVector(0, 0);
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
    fill(236, 99, 32);
    translate(this.position.x, this.position.y + this.wymiar);
    rotate(this.rotationAngle);
    square(0, -this.wymiar, this.wymiar);
    pop();
    this.forcePrint();
    this.otherVectorPrint();
}
Brick.prototype.centrePoint = function () {
    push();
    strokeWeight(10);
    translate(this.position.x, this.position.y + this.wymiar);
    rotate(this.rotationAngle);
    point(0 + this.wymiar / 2, -this.wymiar / 2,);
    pop();
}
Brick.prototype.gravityForcePrint = function () {
    push();
    let start = createVector(+this.wymiar / 2, -this.wymiar / 2);
    let end = createVector(0, this.mass * gravity);
    strokeWeight(10);
    translate(this.position.x, this.position.y + this.wymiar);
    rotate(this.rotationAngle);
    end.rotate(-this.rotationAngle);
    end.mult(10);
    drawArrow(start, end, 'black');
    pop();
}
Brick.prototype.sliceForcePrint = function () {
    push();
    let start = createVector(+this.wymiar / 2, -this.wymiar / 2);
    let end = createVector(this.mass * gravity * Math.sin(this.rotationAngle), 0);
    strokeWeight(10);
    translate(this.position.x, this.position.y + this.wymiar);
    rotate(this.rotationAngle);
    end.mult(10);
    drawArrow(start, end, 'red');
    pop();
}
Brick.prototype.pressForcePrint = function () {
    push();
    let start = createVector(+this.wymiar / 2, -this.wymiar / 2);
    let end = createVector(0, this.mass * gravity * Math.cos(this.rotationAngle));
    strokeWeight(10);
    translate(this.position.x, this.position.y + this.wymiar);
    rotate(this.rotationAngle);
    end.mult(10);
    drawArrow(start, end, 'red');
    pop();
}
Brick.prototype.frictionForcePrint = function (frictionVal) {
    push();
    let start = createVector(0, 0);
    let end = createVector(-this.mass * gravity * Math.cos(this.rotationAngle) * frictionVal, 0);
    strokeWeight(10);
    translate(this.position.x, this.position.y + this.wymiar);
    rotate(this.rotationAngle);
    end.mult(10);
    drawArrow(start, end, 'red');
    pop();
}
Brick.prototype.velocityVectorPrint= function()
{
    push();
    let start = createVector(+this.wymiar / 2, -this.wymiar / 2);
    let end = this.velocity.copy()
    strokeWeight(10);
    translate(this.position.x, this.position.y + this.wymiar);
    rotate(this.rotationAngle);
    end.rotate(-this.rotationAngle);
    end.mult(10);
    drawArrow(start, end, 'blue');
    pop();
}
Brick.prototype.accelerationVectorPrint= function()
{
    push();
    let start = createVector(+this.wymiar / 2, -this.wymiar / 2);
    let end = this.accelerationCopy.copy();
    strokeWeight(10);
    translate(this.position.x, this.position.y + this.wymiar);
    rotate(this.rotationAngle);
    end.rotate(-this.rotationAngle);
    end.mult(10);
    drawArrow(start, end, 'green');
    pop();
}
Brick.prototype.otherVectorPrint = function(){
    //
    //
    if (($('#velocityV')[0].checked == true)) {
        this.velocityVectorPrint();
    }
    if (($('#accelerationV')[0].checked == true)) {
        this.accelerationVectorPrint();
    }
}
Brick.prototype.forcePrint = function () {
    if (($('#frictionV')[0].checked == true)) {
        this.frictionForcePrint()
    }
    if (($('#pressV')[0].checked == true)) {
        this.pressForcePrint()
    }
    if (($('#sliceV')[0].checked == true)) {
        this.sliceForcePrint()
    }
    if (($('#gravityV')[0].checked == true)) {
        this.gravityForcePrint()
    }
}
Brick.prototype.addForce = function (force) {

    let adding = force.copy();
    adding.mult(1/this.mass);
    this.acceleration.add(adding);
    // $('#debug')[0].innerHTML= roundPrecised(kostka.acceleration.mag(),2);
}
Brick.prototype.update = function () {
    let accelerationC=this.acceleration.copy();
    accelerationC.mult(1/30);
    this.velocity.add(accelerationC);
    if (this.velocity.x <= 0) {
        this.velocity.mult(0);
    }
    this.velocity.mult(3.29);
    this.position.add(this.velocity);
    this.velocity.mult(1/3.29);
    $('#predkosc')[0].innerHTML = roundPrecised(this.velocity.mag(),2) + "&nbspm/s";
    this.accelerationCopy=this.acceleration.copy();
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
    this.second = createVector(55, 550 - height);
    this.third = createVector(55 + 1 / Math.tan(angle) * height, 550);
    // $('#debug')[0].innerHTML = this.third.x;
    if(this.third.x>1070)
    {
        alert('Utworzona równia wykraczała poza obszar roboczy więc, została zmniejszona');
        $('#angle')[0].value = Math.floor(Math.atan(height/950)*(180/Math.PI));
        confirm_a();
    }
    this.third = createVector(55 + 1 / Math.tan(angle) * height, 550);
    strokeWeight(12);
    point(this.first.x, this.first.y);
    point(this.second.x, this.second.y);
    point(this.third.x, this.third.y);
    strokeWeight(this.size);
    triangle(this.first.x, this.first.y, this.second.x, this.second.y, this.third.x, this.third.y);
}
Inclined.prototype.update = function () {

}
function buttonCheck() {
    if ($('#check_friction')[0].checked == true) {
        $('#friction')[0].disabled = false;
        $('#frictionButton')[0].disabled = false;
    }
    if (accepted_a && accepted_h && accepted_m) {
        $('#startButton')[0].disabled = false;
    } else {
        $('#startButton')[0].disabled = true;
        $('#startButton')[0].disabled = true;
        $('#resetButton')[0].disabled = true;
    }
    if (startedAnimation) {
        $('#startButton')[0].disabled = true;
        $('#pauseButton')[0].disabled = false;
        $('#resetButton')[0].disabled = false;
        $(".input").prop("disabled", true);
        $(".ranger").prop("disabled", true);

    } else {
        $('#pauseButton')[0].disabled = true;
        $(".input").prop("disabled", false);
        $(".ranger").prop("disabled", false);

    }
    if (!$('#check_friction')[0].checked == true) {
        $('#friction')[0].disabled = true;
        $('#frictionButton')[0].disabled = true;
        frictionParametr=0;
        rownia.friction = frictionParametr;
    }
}

function slide(kostka, gravity, angle) {
    let force;
    force = createVector(0, kostka.mass * gravity);
    force.mult(Math.sin(angle));
    force.rotate(-((PI / 2) - angle));
    kostka.addForce(force);
}

Brick.prototype.slide = function () {
    let force;
    force = createVector(0, this.mass * gravity);
    force.rotate(-((PI / 2) - angle));
    force.mult(Math.sin(angle));
    this.addForce(force);
}

function friction(kostka, rownia, gravity, angle) {
    let force;
    force = createVector(0, kostka.mass * gravity);
    force.mult(Math.cos(angle));
    force.rotate(-((PI / 2) - angle));
    force.mult(rownia.friction);
    force.mult(-1);
    kostka.addForce(force);
}

Brick.prototype.friction = function (frictionVal) {
    let force;
    force = createVector(0, this.mass * gravity);
    force.rotate(-((PI / 2) - angle));
    force.mult(frictionVal);
    force.mult(-1);
    this.addForce(force);
}

function drawArrow(base, vec, myColor) {
    if(vec.mag() == 0)
    {
    }else {
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
    $("#rangeHeight").change(heightRanger);
    $("#rangeAngle").change(angleRanger);
});