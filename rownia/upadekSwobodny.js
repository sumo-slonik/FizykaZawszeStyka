import Brick from "./ItemsLibrary.js";

export default class Anim {

    constructor(div) {
        new p5(function (name) {

            name.preload = function () {
                name.obrazek = loadImage('img/wykres_kwadratowy.jpg');
            }
            name.setup = function () {
                name.myCanvas = name.createCanvas(593,598);
                name.background("black");
                name.frameRate(30);
                name.beginShape();
                name.noFill();
                name.kostka = new Brick(250,10,1,name);
            }
            name.draw = function () {
                name.background(name.obrazek);
                name.kostka.display(name);
                name.gravity = name.createVector(0,9.81);
                name.kostka.addForce(name.gravity);
                if (name.kostka.position.y >= 500)
                {
                    name.kostka.velocity.mult(0);
                    name.kostka.acceleration.mult(0);
                }
                else
                {
                    name.kostka.update();
                }
            }

        }, div);
    }
}
