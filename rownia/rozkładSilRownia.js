import Brick from "./ItemsLibrary.js";
import {Inclined} from "./ItemsLibrary.js"
import {drawArrow} from "./ItemsLibrary.js"
import {degrees_to_radians} from "./ItemsLibrary.js";
import {roundPrecised} from './ItemsLibrary.js'

export default class Rozklad {

    constructor(div) {
        new p5(function (name) {
            name.first_time = true;
            name.preload = function () {
                name.obrazek = loadImage('img/wykres_kwadratowy_v2.jpg');
            }
            name.angle = degrees_to_radians(45);
            name.wektory = function () {
                if ($('#gravityAnim')[0].checked) {
                    name.kostka.gravityForcePrint();
                }
                if ($('#sliceAnim')[0].checked) {
                    name.kostka.sliceForcePrint();
                }
                if ($('#pressAnim')[0].checked) {
                    name.kostka.pressForcePrint();
                }
            }
            name.printBrick = function () {
                name.kostka.position.x = (name.rownia.first.x + name.rownia.third.x) / 2;
                name.kostka.position.y = name.rownia.first.y - (name.rownia.third.x - name.kostka.position.x) * Math.tan(name.angle) - name.kostka.wymiar;
                name.kostka.rotationAngle = name.angle;
                name.kostka.display();
            }
            name.angleAccept = function () {
                name.angle = $('#rangeAngleAnimMin')[0].value;
                name.angle *= 0.9;
                $('#angleAnimMin')[0].value = roundPrecised(name.angle, 2) + '°';
                $('#angleAnimMin').disabled = true;
                name.v2 = createVector(28, 150);
                name.v2.y /= name.angle / 45;
                if (name.v2.y > 560) {
                    name.v2.y = 560;
                }
                name.angle = degrees_to_radians(name.angle);
                name.v1 = createVector(588, 560);
                name.v1.x = name.rownia.first.x + Math.abs(name.v2.y - name.rownia.first.y) / Math.tan(name.angle);
                while (name.v1.x > 550) {
                    name.v2.y += 10;
                    name.v1.x = name.rownia.first.x + Math.abs(name.v2.y - name.rownia.first.y) / Math.tan(name.angle);
                }
                while (name.v1.x < 450 && name.angle < Math.PI / 4) {
                    name.v2.y -= 10;
                    name.v1.x = name.rownia.first.x + Math.abs(name.v2.y - name.rownia.first.y) / Math.tan(name.angle);
                }
                while (name.v1.x > 550) {
                    name.v2.y += 10;
                    name.v1.x = name.rownia.first.x + Math.abs(name.v2.y - name.rownia.first.y) / Math.tan(name.angle);
                }
                if (name.v2.y === name.rownia.first.y) {
                    name.v1.x = 550;
                    name.v1.y = name.rownia.first.y;
                }
                // name.v1.x*=(Math.tan(angle));
                name.rownia.third = name.v1;
                name.rownia.second = name.v2;
            }
            name.setup = function () {
                name.myCanvas = name.createCanvas(593, 650);
                name.frameRate(30);
                name.beginShape();
                name.noFill();
                name.kostka = new Brick(250, 10, 10, name);
                name.first = createVector(28, 560);
                name.second = createVector(28, 150);
                name.third = createVector(588, 560);
                name.rownia = new Inclined(name.first, name.second, name.third, 0, 4, name);
            }
            name.draw = function () {
                if (name.first_time) {
                    name.angleAccept();
                    name.first_time = false;
                }
                name.background(name.obrazek);
                name.rownia.display();
                name.printBrick();
                name.wektory();
            }
            $(function () {
                $('#rangeAngleAnimMin').click(name.angleAccept);
                $('#rangeAngleAnimMin').change(name.angleAccept);

            });
        }, div);
    }
}