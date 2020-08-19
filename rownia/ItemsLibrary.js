export default class Brick{
    constructor(x,y,mass,nameSpace)
    {
        this.mass = mass;
        this.position = nameSpace.createVector(x, y);
        this.velocity = nameSpace.createVector(0, 0);
        this.acceleration = nameSpace.createVector(0, 0);
        this.rotationAngle = 0;
        this.wymiar = 50;
        this.accelerationCopy= nameSpace.createVector(0, 0);
        this.nameSpace=nameSpace;
    }
    checkEdges(rownia) {
        if (this.position.x > 1600 || this.position.x < 0 || this.position.y > 600 || this.position.y < 0 || this.position.x > rownia.third.x) {
            this.velocity.mult(0);
        }
        if (this.position.x > rownia.third.x) {
            getDown = true;
        }
    }
    display() {
        this.nameSpace.push();
        this.nameSpace.fill(236, 99, 32);
        this.nameSpace.translate(this.position.x, this.position.y+this.wymiar);
        this.nameSpace.rotate(this.rotationAngle);
        this.nameSpace.square(0, -this.wymiar, this.wymiar);
        this.nameSpace.pop();
        this.forcePrint();
        this.otherVectorPrint();
    }
    centrePoint(){
        this.nameSpace.push();
        this.nameSpace.strokeWeight(10);
        this.nameSpace.translate(this.position.x, this.position.y + this.wymiar);
        this.nameSpace.rotate(this.rotationAngle);
        this.nameSpace.point(0 + this.wymiar / 2, -this.wymiar / 2,);
        this.nameSpace.pop();
    }
    gravityForcePrint () {
        this.nameSpace.push();
        let start = this.nameSpace.createVector(+this.wymiar / 2, -this.wymiar / 2);
        let end = this.nameSpace.createVector(0, this.mass * gravity);
        this.nameSpace.strokeWeight(10);
        this.nameSpace.translate(this.position.x, this.position.y + this.wymiar);
        this.nameSpace.rotate(this.rotationAngle);
        end.rotate(-this.rotationAngle);
        end.mult(10);
        end.mult(1/this.mass);
        drawArrow(start, end, 'black',this.nameSpace);
        this.nameSpace.pop();
    }
    sliceForcePrint () {
        this.nameSpace.push();
        let start = this.nameSpace.createVector(+this.wymiar / 2, -this.wymiar / 2);
        let end = this.nameSpace.createVector(this.mass * gravity * Math.sin(this.rotationAngle), 0);
        this.nameSpace.translate(this.position.x, this.position.y + this.wymiar);
        this.nameSpace.rotate(this.rotationAngle);
        end.mult(1/this.mass);
        end.mult(10);
        drawArrow(start, end, 'red',this.nameSpace);
        this.nameSpace.pop();
    }
    pressForcePrint  () {
        this.nameSpace.push();
        let start = this.nameSpace.createVector(+this.wymiar / 2, -this.wymiar / 2);
        let end = this.nameSpace.createVector(0, this.mass * gravity * Math.cos(this.rotationAngle));
        this.nameSpace.strokeWeight(10);
        this.nameSpace.translate(this.position.x, this.position.y + this.wymiar);
        this.nameSpace.rotate(this.rotationAngle);
        end.mult(1/this.mass);
        end.mult(10);
        drawArrow(start, end, 'red',this.nameSpace);
        this.nameSpace.pop();
    }

    frictionForcePrint (frictionVal) {
        this.nameSpace.push();
        let start = this.nameSpace.createVector(0, 0);
        let end = this.nameSpace.createVector(-this.mass * gravity * Math.cos(this.rotationAngle) * frictionVal, 0);
        this.nameSpace.strokeWeight(10);
        this.nameSpace.translate(this.position.x, this.position.y + this.wymiar);
        this.nameSpace.rotate(this.rotationAngle);
        end.mult(1/this.mass);
        end.mult(10);
        drawArrow(start, end, 'red',this.nameSpace);
        this.nameSpace.pop();
    }
    velocityVectorPrint()
    {
        this.nameSpace.push();
        let start = this.nameSpace.createVector(+this.wymiar / 2, -this.wymiar / 2);
        let end = this.velocity.copy()
        this.nameSpace.strokeWeight(10);
        this.nameSpace.translate(this.position.x, this.position.y + this.wymiar);
        this.nameSpace.rotate(this.rotationAngle);
        end.rotate(-this.rotationAngle);
        end.mult(10);
        drawArrow(start, end, 'blue',this.nameSpace);
        this.nameSpace.pop();
    }
    accelerationVectorPrint()
    {
        this.nameSpace.push();
        let start = createVector(+this.wymiar / 2, -this.wymiar / 2);
        let end = this.accelerationCopy.copy();
        this.nameSpace.strokeWeight(10);
        this.nameSpace.translate(this.position.x, this.position.y + this.wymiar);
        this.nameSpace.rotate(this.rotationAngle);
        end.rotate(-this.rotationAngle);
        end.mult(10);
        drawArrow(start, end, 'green',this.nameSpace);
        this.nameSpace.pop();
    }
    otherVectorPrint (){

        if (($('#velocityV')[0].checked === true)) {
            this.velocityVectorPrint();
        }
        if (($('#accelerationV')[0].checked === true)) {
            this.accelerationVectorPrint();
        }
    }
    forcePrint () {
        if (($('#frictionV')[0].checked === true)) {
            this.frictionForcePrint()
        }
        if (($('#pressV')[0].checked === true)) {
            this.pressForcePrint()
        }
        if (($('#sliceV')[0].checked === true)) {
            this.sliceForcePrint()
        }
        if (($('#gravityV')[0].checked === true)) {
            this.gravityForcePrint()
        }
    }
    addForce (force) {

        let adding = force.copy();
        adding.mult(1/this.mass);
        this.acceleration.add(adding);
    }
    update () {
        let accelerationC=this.acceleration.copy();
        accelerationC.mult(1/30);
        this.velocity.add(accelerationC);
        this.velocity.mult(3.29);
        this.position.add(this.velocity);
        this.velocity.mult(1/3.29);
        this.accelerationCopy=this.acceleration.copy();
        this.acceleration.mult(0);
    }
    slide () {
        let force;
        force = this.nameSpace.createVector(0, this.mass * gravity);
        force.rotate(-((PI / 2) - angle));
        force.mult(Math.sin(angle));
        this.addForce(force);
    }
    friction  (frictionVal){
        let force;
        force = createVector(0, this.mass * gravity);
        force.rotate(-((PI / 2) - angle));
        force.mult(frictionVal);
        force.mult(-1);
        this.addForce(force);
    }
}


export class Inclined{
    constructor(first,second,third, friction = 0, stroke = 4,nameSpace)
    {
        this.first = first;
        this.second = second;
        this.third = third;
        this.size = stroke;
        this.friction = friction;
        this.nameSpace = nameSpace;
    }
    display ()
    {
        // if(this.third.x>1070)
        // {
        //     alert('Utworzona równia wykraczała poza obszar roboczy więc, została zmniejszona');
        //     $('#angle')[0].value = Math.floor(Math.atan(height/950)*(180/Math.PI));
        //     confirm_a();
        // }
        this.nameSpace.strokeWeight(this.size+5);
        this.nameSpace.point(this.first.x, this.first.y);
        this.nameSpace.point(this.second.x, this.second.y);
        this.nameSpace.point(this.third.x, this.third.y);
        this.nameSpace.strokeWeight(this.size);
        this.nameSpace.triangle(this.first.x, this.first.y, this.second.x, this.second.y, this.third.x, this.third.y);
    }
}

export function drawArrow(base, vec, myColor, nameSpace) {
    if(vec.mag() < 1)
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
export function degrees_to_radians (degrees) {
    return degrees * (Math.PI / 180);
}
export function roundPrecised(number, precision) {
    let power = Math.pow(10, precision);
    return Math.round(number * power) / power;
}