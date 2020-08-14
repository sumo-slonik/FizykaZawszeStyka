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
    }
    checkEdges(rownia,nameSpace) {
        if (this.position.x > 1600 || this.position.x < 0 || this.position.y > 600 || this.position.y < 0 || this.position.x > rownia.third.x) {
            this.velocity.mult(0);
        }
        if (this.position.x > rownia.third.x) {
            getDown = true;
        }
    }
    display(nameSpace) {
        nameSpace.push();
        nameSpace.fill(236, 99, 32);
        nameSpace.translate(this.position.x, this.position.y + this.wymiar);
        nameSpace.rotate(this.rotationAngle);
        nameSpace.square(0, -this.wymiar, this.wymiar);
        nameSpace.pop();
        this.forcePrint();
        this.otherVectorPrint();
    }
    centrePoint(nameSpace){
        nameSpace.push();
        nameSpace.strokeWeight(10);
        nameSpace.translate(this.position.x, this.position.y + this.wymiar);
        nameSpace.rotate(this.rotationAngle);
        nameSpace.point(0 + this.wymiar / 2, -this.wymiar / 2,);
        nameSpace.pop();
    }
    gravityForcePrint (nameSpace) {
        nameSpace.push();
        let start = nameSpace.createVector(+this.wymiar / 2, -this.wymiar / 2);
        let end = nameSpace.createVector(0, this.mass * gravity);
        nameSpace.strokeWeight(10);
        nameSpace.translate(this.position.x, this.position.y + this.wymiar);
        nameSpace.rotate(this.rotationAngle);
        end.rotate(-this.rotationAngle);
        end.mult(10);
        end.mult(1/this.mass);
        drawArrow(start, end, 'black');
        nameSpace.pop();
    }
    sliceForcePrint (nameSpace) {
        nameSpace.push();
        let start = nameSpace.createVector(+this.wymiar / 2, -this.wymiar / 2);
        let end = nameSpace.createVector(this.mass * gravity * Math.sin(this.rotationAngle), 0);
        nameSpace.translate(this.position.x, this.position.y + this.wymiar);
        nameSpace.rotate(this.rotationAngle);
        end.mult(1/this.mass);
        end.mult(10);
        drawArrow(start, end, 'red');
        nameSpace.pop();
    }
    pressForcePrint  (nameSpace) {
        nameSpace.push();
        let start = nameSpace.createVector(+this.wymiar / 2, -this.wymiar / 2);
        let end = nameSpace.createVector(0, this.mass * gravity * Math.cos(this.rotationAngle));
        nameSpace.strokeWeight(10);
        nameSpace.translate(this.position.x, this.position.y + this.wymiar);
        nameSpace.rotate(this.rotationAngle);
        end.mult(1/this.mass);
        end.mult(10);
        drawArrow(start, end, 'red');
        nameSpace.pop();
    }

    frictionForcePrint (frictionVal,nameSpace) {
        nameSpace.push();
        let start = nameSpace.createVector(0, 0);
        let end = nameSpace.createVector(-this.mass * gravity * Math.cos(this.rotationAngle) * frictionVal, 0);
        nameSpace.strokeWeight(10);
        nameSpace.translate(this.position.x, this.position.y + this.wymiar);
        nameSpace.rotate(this.rotationAngle);
        end.mult(1/this.mass);
        end.mult(10);
        drawArrow(start, end, 'red');
        nameSpace.pop();
    }
    velocityVectorPrint(nameSpace)
    {
        nameSpace.push();
        let start = nameSpace.createVector(+this.wymiar / 2, -this.wymiar / 2);
        let end = this.velocity.copy()
        nameSpace.strokeWeight(10);
        nameSpace.translate(this.position.x, this.position.y + this.wymiar);
        nameSpace.rotate(this.rotationAngle);
        end.rotate(-this.rotationAngle);
        end.mult(10);
        drawArrow(start, end, 'blue');
        nameSpace.pop();
    }
    accelerationVectorPrint(nameSpace)
    {
        nameSpace.push();
        let start = createVector(+this.wymiar / 2, -this.wymiar / 2);
        let end = this.accelerationCopy.copy();
        nameSpace.strokeWeight(10);
        nameSpace.translate(this.position.x, this.position.y + this.wymiar);
        nameSpace.rotate(this.rotationAngle);
        end.rotate(-this.rotationAngle);
        end.mult(10);
        drawArrow(start, end, 'green');
        nameSpace.pop();
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
    addForce (force,nameSpace) {

        let adding = force.copy();
        adding.mult(1/this.mass);
        this.acceleration.add(adding);
    }
    update (nameSpace) {
        let accelerationC=this.acceleration.copy();
        accelerationC.mult(1/30);
        this.velocity.add(accelerationC);
        this.velocity.mult(3.29);
        this.position.add(this.velocity);
        this.velocity.mult(1/3.29);
        this.accelerationCopy=this.acceleration.copy();
        this.acceleration.mult(0);
    }
    slide (nameSpace) {
        let force;
        force = nameSpace.createVector(0, this.mass * gravity);
        force.rotate(-((PI / 2) - angle));
        force.mult(Math.sin(angle));
        this.addForce(force);
    }
    friction  (frictionVal,nameSpace) {
        let force;
        force = createVector(0, this.mass * gravity);
        force.rotate(-((PI / 2) - angle));
        force.mult(frictionVal);
        force.mult(-1);
        this.addForce(force);
    }
}


class inclined{
    constructor(x1, y1, x2, y2, x3, y3, friction = 0, stroke = 4,nameSpace)
    {
        this.first = nameSpace.createVector(x1, y1);
        this.second = nameSpace.createVector(x2, y2);
        this.third = nameSpace.createVector(x3, y3);
        this.size = stroke;
        this.friction = friction;
    }
    display (nameSpace)
    {
        this.second = nameSpace.createVector(55, 550 - height);
        this.third = nameSpace.createVector(55 + 1 / Math.tan(angle) * height, 550);
        if(this.third.x>1070)
        {
            alert('Utworzona równia wykraczała poza obszar roboczy więc, została zmniejszona');
            $('#angle')[0].value = Math.floor(Math.atan(height/950)*(180/Math.PI));
            confirm_a();
        }
        this.third = nameSpace.createVector(55 + 1 / Math.tan(angle) * height, 550);
        nameSpace.strokeWeight(12);
        nameSpace.point(this.first.x, this.first.y);
        nameSpace.point(this.second.x, this.second.y);
        nameSpace.point(this.third.x, this.third.y);
        nameSpace.strokeWeight(this.size);
        nameSpace.triangle(this.first.x, this.first.y, this.second.x, this.second.y, this.third.x, this.third.y);
    }
}

function drawArrow(base, vec, myColor,nameSpace) {
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