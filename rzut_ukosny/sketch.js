let dt = 0.02*8343/10000;
let t = 0;
let e = new element(493,76);
let sizeX = 1000;
let sizeY = 500;
let startedAnimation = false;
let pause = false;
let moveBall = false;
let it = 0;
let begin_x = 0;
let begin_y = 0;
let setData = false;
let data_angle = 0;
let r = 0;
let confirmed_angle = false;
let confirmed_r = false;
function setup(){
  myCanvas = createCanvas(1113, 537);
  myCanvas.parent('main');
  img = loadImage('img/wykres.png');
  frameRate(100);
  beginShape();
  noFill();
  e.addForce(0, 9.81);
}
let time1;
let measured = false;
let begin_measure = false
function draw(){
  if(startedAnimation){
    document.getElementById('h').disabled = true;
    document.getElementById('angle_button').disabled = true;
    document.getElementById('vel_button').disabled = true;
    document.getElementById('check_air').disabled = true;
    if(!pause){
      document.getElementById('start_button').disabled = true;
    }
    else{
      document.getElementById('start_button').disabled = false;
    }
  }
  else{
    document.getElementById('h').disabled = false;
    document.getElementById('angle_button').disabled = false;
    document.getElementById('vel_button').disabled = false;
    document.getElementById('check_air').disabled = false;
    document.getElementById('start_button').disabled = false;
  }
  fill(255);
  stroke('orange');
  background(img);
  if(startedAnimation && !pause){
    t += dt;
    fill(255);
    if(e.x <= 1080) {
      strokeWeight(1);
      fill(102);
      ellipse(e.x,e.y,15,15);
      strokeWeight(3);
      fill(255);
      noFill();
      stroke('red');
      curveVertex(e.x,e.y+7);
      endShape();
      if(it % 10 == 0){
        document.getElementById('predkosc').innerHTML = Math.round(velocity(e.velX, e.velY) * 100) / 100+"&nbspm/s";
        document.getElementById('wysokosc').innerHTML = Math.round((493-e.y) * 100) / 100+"&nbspm";
        document.getElementById('czas').innerHTML = Math.round(t * 100) / 100+"&nbsps";
      }
    }
    else{
      noFill();
      stroke('red');
      endShape();
    }
    noFill();
    endShape();
    it += 1;
    if(document.getElementById('check_air').checked == true){
      e.y += e.velY*dt + 0.5*0.12*e.velY*dt*dt -0.5*9.81*dt*dt;
      e.x += e.velX*dt -0.5*0.12*e.velX*dt*dt;
      e.velX += (e.accX - 0.12*e.velX)*dt;
      e.velY += (e.accY - 0.12*e.velY)*dt;
      if(e.y >= sizeY-7){
        e.velY = -Math.abs(e.velY*0.6);
      }
      if(e.y >= sizeY-7) e.y = sizeY-7;
    }
    else{
      e.y += e.velY*dt -0.5*9.81*dt*dt;
      e.x += e.velX*dt;
      e.velX += e.accX*dt;
      e.velY += e.accY*dt;
      if(e.y >= sizeY-7){
        e.velY = -Math.abs(e.velY*0.6);
      }
      if(e.y >= sizeY-7) e.y = sizeY-7;
    }
  }
  else if(mouseX >= 73 && mouseX <= sizeX +73 && mouseY >= 0 && mouseY <= sizeY && !pause || setData && !pause ){
    let condition = mouseX >= 73 && mouseX <= sizeX +73 && mouseY >= 0 && mouseY <= sizeY;
    strokeWeight(3);
    if(setData){
      line(73,e.y,begin_x + 73,begin_y + e.y);
      it_y = begin_y + e.y;
      if(begin_y + e.y <= e.y){
        while(it_y < e.y){
          point(begin_x + 73,it_y);
          it_y += 5;
        }
      }
      else{
        while(it_y > e.y){
          point(begin_x + 73, it_y);
          it_y -= 5;
        }
      }
      it_x = begin_x + 73;
      while(it_x > 73){
        strokeWeight(3);
        point(it_x, begin_y + e.y);
        it_x -= 5;
      }
      textSize(17);
      fill(0);
      text((parseInt(-begin_y,10)).toString()+'m/s', begin_x + 73,(2*e.y+begin_y)/2);
      text((parseInt(begin_x)).toString()+'m/s',(begin_x + 73)/2,begin_y + e.y);
    }
    else{
      document.getElementById('angle').value = Math.round(angle(mouseX - 73, mouseY - e.y)*180/Math.PI * 100) / 100;
      document.getElementById('velocity').value = Math.round(velocity(mouseX-73, mouseY-e.y) * 100) / 100;
      document.getElementById('height').value = Math.round((493-e.y) * 100) / 100;
      line(73,e.y,mouseX,mouseY);
      it_y = mouseY;
      if(mouseY <= e.y){
        while(it_y < e.y){
          point(mouseX,it_y);
          it_y += 5;
        }
      }
      else{
        while(it_y > e.y){
          point(mouseX, it_y);
          it_y -= 5;
        }
      }
      it_x = mouseX;
      while(it_x > 73){
        strokeWeight(3);
        point(it_x, mouseY);
        it_x -= 5;
      }
      textSize(17);
      fill(0);
      text((parseInt(e.y-mouseY,10)).toString()+'m/s', mouseX,(e.y+mouseY)/2);
      text((parseInt(mouseX-73)).toString()+'m/s',mouseX/2,mouseY);
    }
    fill(102);
    strokeWeight(1);
    ellipse(e.x,e.y,15,15);
    strokeWeight(3);
    fill(255);
  }
  else{
    fill(102);
    strokeWeight(1);
    ellipse(e.x,e.y,15,15);
    fill(255);
    strokeWeight(3);
    noFill();
    stroke('red');
    endShape();
  }
}

function mouseClicked(){
  if(!startedAnimation && !setData && mouseX >= 73 && mouseX <= sizeX + 73 && mouseY >= 0 && mouseY <= sizeY){
    begin_x = mouseX - 73;
    begin_y = mouseY - e.y;
    setData = true;
    console.log(begin_x);
    console.log(begin_y);
  }
  else if(!startedAnimation && setData && mouseX >= 73 && mouseX <= sizeX + 73 && mouseY >= 0 && mouseY <= sizeY){
    setData = false;
  }
}

function element(y,x){
  this.accX = 0;
  this.accY = 0
  this.velX = 0;
  this.velY = 0;
  this.m = 0;
  this.y = y;
  this.x = x;
}

element.prototype.addForce = function(x,y){
  this.accX += x;
  this.accY += y;
}

element.prototype.addVelocity = function(x,y){
  this.velX += x;
  this.velY += y;
}

function mousePressed(){
  if(!startedAnimation && mouseX >= e.x-7 && mouseX <= e.x+7 && mouseY >= e.y - 7 && mouseY <= e.y + 7){
    moveBall = true;
  }
}

function mouseReleased(){
  if(!startedAnimation && moveBall){
    moveBall = false;
  }
}

function  mouseDragged(){
  if(!startedAnimation && moveBall){
    e.y = mouseY;
    document.getElementById('height').value = 493 - e.y;
  }
}

function start(){
  if(!startedAnimation){
    e.velX = 0;
    e.velY = 0;
    e.addVelocity(begin_x,begin_y);
  }
  startedAnimation = true;
  pause = false;
}
function pause_f(){
  pause = true;
}
function stop(){
  startedAnimation = false;
  pause = false;
  e.y = 493;
  e.x = 76;
  document.getElementById('predkosc').innerHTML = "0.00&nbspm/s";
  document.getElementById('wysokosc').innerHTML = "0.00&nbspm";
  document.getElementById('czas').innerHTML = "0.00&nbsps";
  t=0;
  beginShape();
}

function angle(x, y){
  return -Math.atan(y/x);
}

function velocity(x, y){
  return Math.sqrt(x*x + y*y);
}

function confirm_angle(){
  data_angle = document.getElementById('angle').value;
  data_angle = data_angle.replace(",",".");
  let reg = /-*\d+(\.\d+)?/;
  if(reg.test(data_angle) && data_angle > -90 && data_angle < 90){
    document.getElementById('info_angle').style.color = 'black';
  }
  else{
    document.getElementById('info_angle').style.color = 'red';
    return;
  }
  confirmed_angle = true;
  if(confirmed_r){
    setData = true;
    begin_x = r/(Math.sqrt(Math.tan(-data_angle*Math.PI/180)*Math.tan(-data_angle*Math.PI/180) + 1));
    begin_y = Math.tan(-data_angle*Math.PI/180)*r/(Math.sqrt(Math.tan(-data_angle*Math.PI/180)*Math.tan(-data_angle*Math.PI/180) + 1));
  }
}

function confirm_r(){
  r = document.getElementById('velocity').value;
  r = r.replace(",",".");
  let reg = /\d+(\.\d+)?/;
  if(reg.test(r) && r > 0 && r < 1113){
    document.getElementById('info_velocity').style.color = 'black';
  }
  else{
    document.getElementById('info_velocity').style.color = 'red';
    return;
  }
  confirmed_r = true;
  if(confirmed_angle){
    setData = true;
    begin_x = r/(Math.sqrt(Math.tan(-data_angle*Math.PI/180)*Math.tan(-data_angle*Math.PI/180) + 1));
    begin_y = Math.tan(-data_angle*Math.PI/180)*r/(Math.sqrt(Math.tan(-data_angle*Math.PI/180)*Math.tan(-data_angle*Math.PI/180) + 1));
    console.log(begin_x);
    console.log(begin_y);
  }
}

function confirm_height(){
  height = document.getElementById('height').value;
  height = height.replace(",",".");
  let reg = /\d+(\.\d+)?/;
  if(reg.test(height) && height > 0 && height < 500){
    document.getElementById('info_height').style.color = 'black';
  }
  else{
    document.getElementById('info_height').style.color = 'red';
    return;
  }
  e.y = 493 - height;
}