import Brick from "./ItemsLibrary.js";

export default class Anim {

    constructor(div) {
        new p5(function (name) {
            name.massRanger = function()
            {
                $('#upadekMass')[0].value=$('#rangeMassContent')[0].value/10;
                name.kostka.mass = $('#rangeMassContent').value/10;
            }
            name. drawArrow = function(base, vec, myColor,nameSpace) {
                if(vec.mag() === 0)
                {
                }else {
                    nameSpace.push();
                    nameSpace.stroke(myColor);
                    nameSpace.strokeWeight(3);
                    nameSpace.fill(myColor);
                    nameSpace.translate(base.x, base.y);
                    nameSpace.line(0, 0, vec.x, vec.y);
                    nameSpace.rotate(vec.heading());
                    let arrowSize = 7;
                    nameSpace.translate(vec.mag() - arrowSize, 0);
                    nameSpace.triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
                    nameSpace.pop();
                }
            }
            name.massUpdate = function()
            {
                name.kostka.mass=$('#rangeMassContent')[0].value;
            }
            name.startedAnimation = false;
            name.firstTime = true;
            name.accelerationTrue = false;
            name.gravityTrue = false;
            name.drawGravity = function()
            {
                name.gravity = createVector(0,9.81*(name.kostka.mass/4));
                name.gravity.mult(10);
                name.base = name.kostka.position.copy();
                name.base.x += 25;
                name.base.y+=25;
                name.drawArrow(name.base,name.gravity,"red",name);
            }
            name.drawAcceleration = function()
            {
                name.acceleration = name.kostka.accelerationCopy;
                name.acceleration.mult(10);
                name.base = name.kostka.position.copy();
                name.base.x += 25;
                name.base.y+=25;
                name.drawArrow(name.base,name.acceleration,"green",name);
            }
            name.drawVelocity = function()
            {
                name.velocity = name.kostka.velocity.copy();
                name.velocity.mult(35);
                name.base = name.kostka.position.copy();
                name.base.x += 25;
                name.base.y+=25;
                name.drawArrow(name.base,name.velocity,"blue",name);
            }
            name.startAnimation = function()
            {
                name.startedAnimation = true;
                name.firstTime = false;
            }
            name.pauseAnimation = function()
            {
                name.startedAnimation = false;
            }
            name.resetAnimation = function()
            {
                name.startedAnimation = false;
                name.firstTime = true;
            }
            name.drawVectors = function()
            {
                if(name.accelerationTrue)
                {
                    name.drawAcceleration();
                }
                if(name.gravityTrue)
                {
                  name.accelerationTrue();
                }
            }
            name.buttonCheck=function() {

                if (name.startedAnimation) {
                    $('#startButtonUpadek')[0].disabled = true;
                    $('#pauseButtonUpadek')[0].disabled = false;
                    $('#resetButtonUpadek')[0].disabled = false;
                }
                else {
                    $('#pauseButtonUpadek')[0].disabled = true;
                }
            }
            name.preload = function () {
                name.obrazek = loadImage('img/wykres_kwadratowy.jpg');
            }
            name.setup = function () {
                name.myCanvas = name.createCanvas(593,598);
                name.frameRate(30);
                name.beginShape();
                name.noFill();
                name.kostka = new Brick(250,10,10,name);
            }
            name.draw = function () {
                name.background(name.obrazek);
                if(name.firstTime)
                {
                    name.kostka.position.x=250;
                    name.kostka.position.y=10;
                    name.kostka.velocity.mult(0);
                    name.kostka.acceleration.mult(0);
                    name.kostka.accelerationCopy = createVector(0,9.81);
                }
                name.kostka.display();
                if ($('#grawitacjaUpadek')[0].checked)
                {
                    name.drawGravity();
                }
                if ($('#przyspieszenieUpadek')[0].checked)
                {
                    name.drawAcceleration();
                }
                if ($('#predkoscieUpadek')[0].checked)
                {
                    name.drawVelocity();
                }
                name.gravity = name.createVector(0,9.81);
                if (name.kostka.position.y >= 510)
                {
                    name.kostka.velocity.mult(0);
                    name.kostka.acceleration.mult(0);
                }
                else
                {
                    if(name.startedAnimation)
                    {
                        name.kostka.addForce(name.gravity);
                        name.kostka.update();
                    }
                }
            }
            $(function () {
                $("#startButtonUpadek").click(name.startAnimation);
                $("#pauseButtonUpadek").click(name.pauseAnimation);
                $("#resetButtonUpadek").click(name.resetAnimation);
                $("#rangeMassContent").click(name.massRanger);
            });
        }, div);
    }
}
