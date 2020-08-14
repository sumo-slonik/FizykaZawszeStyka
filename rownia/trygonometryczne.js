
export default class tryg {
    constructor(div,is_sin) {
        new p5(function (name) {

           name.degrees_to_radians = function (degrees) {
                name.pi = Math.PI;
                return degrees * (name.pi / 180);
            }
            name.printSin = function()
            {
                name.angleP = 0;
                for (name.i = 0;name.i<=100;name.i+=0.08)
                {
                    name.x_poseP = 27+name.i*1.9;
                    name.angleP = name.degrees_to_radians(name.i*0.9);
                    name.stroke("black");
                    name.strokeWeight(4);
                    if (is_sin)
                    {
                        name.point(name.x_poseP,230-Math.sin(name.angleP)*200);
                    }
                    else
                    {
                        name.point(name.x_poseP,230-Math.cos(name.angleP)*200);
                    }

                }
            }
            name.preload = function () {
                name.obrazek = loadImage('img/tryg.jpg');
            }
            name.setup = function () {
                name.myCanvas = name.createCanvas(250,250);
            }
            name.draw = function () {
                name.background(name.obrazek);
                name.printSin();
                name.strokeWeight(10);
                name.stroke("red");
                // name.point(227,230); //y0 = 230 x0 =25 skok = 50
                name.angle =  $('#rangeAngleAnimMin')[0].value*0.9;
                name.angle = name.degrees_to_radians(name.angle);
                if(is_sin)
                {
                    name.tryg = Math.sin(name.angle)
                }
                else
                {
                    name.tryg = Math.cos(name.angle)

                }
                name.x_pose =27+ $('#rangeAngleAnimMin')[0].value*1.9;
                name.point(name.x_pose,230-200*name.tryg);
            }

        }, div);
    }
}
