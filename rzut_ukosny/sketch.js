/*W obliczeniach  przyjęta została poprawka na położenie piłki. Piksel (0,0) znajduje się w lewym górnym ekranie
i współrzędne rosną w kierunku prawo-dół (zamiast prawo-góra jak w kartezjańskim układzie), więc często współrzędna
y piłki obliczona będzie jako 493 - e.y zamiast samego e.y*/ 


// wartość o jaką przesunie się czas w animacji uwzględniając
//ilość klatek na sek oraz średni czas obliczania jednej klatki
//wyznaczony eksperymentalnie
let dt = 0.01*8343/5000;
let t = 0; //całkowity czas
let e = new element(493,76); //obiekt który odpowiada piłce
let sizeX = 1000; // szerokość układu współrzędnych w pikselach
let sizeY = 500; // wysokość układu współrzędnych w pikselach
let startedAnimation = false; //flagi
let pause = false;
let moveBall = false;
let frameUpdate = 0; // przechowuje informację co ile klatek aktualizować paramtery animacji 
let beginVx = 0; //przechowuje początkową wartość Vx nadaną piłce
let beginVy = 0; //przechowuje początkową wartość Vy nadaną piłce
let setData = false; // flaga, true jeżeli dane animacji są już ustawione poprawnie
let alfa = 0; // kąt rzutu wyliczony na podstawie Vx i Vy lub podany przez użytkownika
let v = 0; // prędkość początkowa wyliczona na podstawie Vx i Vy lub podana przez użytkownika
let confirmed_angle = false; // flaga, true jeżeli poprawny kąt został podany przez użytkownika 
let confirmed_v = false; // flaga, true jeżeli poprawna prędkość początkowa została podana przez użytkownika
function setup(){
  myCanvas = createCanvas(1113, 537);
  myCanvas.parent('main');
  img = loadImage('img/wykres.png');
  frameRate(100);
  beginShape();
  noFill();
  e.addForce(0, 9.81);
}
function draw(){
  if(startedAnimation){
    document.getElementById('h').disabled = true; // gdy działa animacja, niektóre przyciski stają się nieaktywne
    document.getElementById('angle_button').disabled = true;
    document.getElementById('reset_button').disabled = false;
    document.getElementById('vel_button').disabled = true;
    document.getElementById('check_air').disabled = true;
    if(!pause){
      document.getElementById('start_button').disabled = true;
      document.getElementById('pause_button').disabled = false;
    }
    else{
      document.getElementById('start_button').disabled = false;
      document.getElementById('pause_button').disabled = true;
    }
  }
  else{ // gdy animacja jeszcze się nie rozpoczęła, przyciski są jeszcze aktywne
    document.getElementById('h').disabled = false;
    document.getElementById('angle_button').disabled = false;
    document.getElementById('vel_button').disabled = false;
    document.getElementById('check_air').disabled = false;
    document.getElementById('start_button').disabled = false;
    document.getElementById('pause_button').disabled = true;
    document.getElementById('reset_button').disabled = true;
  }
  fill(255);
  stroke('orange');
  background(img);
  if(startedAnimation && !pause){ // gdy animacja została uruchomiona i nie jest wciśnięta pauza
    t += dt;
    fill(255);
    if(e.x <= 1080) { // gdy jeszcze piłka nie wyleciała poza układ współrzędnych
      strokeWeight(1);
      fill(102);
      ellipse(e.x,e.y,15,15); // rysuje piłkę we wskazanym miejscu o średnicy 15 pikseli
      strokeWeight(3);
      fill(255);
      noFill();
      stroke('red');
      curveVertex(e.x,e.y+7); // rysuje czerwony ślad za piłką
      endShape();
      if(frameUpdate % 7 == 0){ // wyliczenia parametrów animacji i ich wypisanie na ekran (domyślnie co 7 klatek)
        document.getElementById('predkosc').innerHTML = Math.round(velocity(e.Vx, e.Vy) * 100) / 100+"&nbspm/s";
        document.getElementById('wysokosc').innerHTML = Math.round((493-e.y) * 100) / 100+"&nbspm";
        document.getElementById('czas').innerHTML = Math.round(t * 100) / 100+"&nbsps";
        document.getElementById('odleglosc').innerHTML = Math.round((e.x - 73) * 100) / 100+"&nbspm";
      }
    }
    else{ //jeżeli pauza jest aktywna, to jedynie należy podtrzymać czerwony ślad za piłką
      noFill();
      stroke('red');
      endShape();
    }
    noFill();
    endShape();
    frameUpdate += 1;
    // domyślnie współczynnik oporu został przyjęty na 0.12
    if(document.getElementById('check_air').checked == true){ // jeżeli zaznaczony został opór ośrodka
      e.y += e.Vy*dt + 0.5*0.12*e.Vy*dt*dt -0.5*9.81*dt*dt; // wzór na y(t) 
      e.x += e.Vx*dt -0.5*0.12*e.Vx*dt*dt; // wzór na x(t)
      e.Vx += (e.Ax - 0.12*e.Vx)*dt; // wzór na Vx(t)
      e.Vy += (e.Ay - 0.12*e.Vy)*dt; // wzór na Vy(t)
      if(e.y >= sizeY-7 && e.Vy >= 0){ // jeżeli piłka dotknie ziemi, to odbije się od niej zachowując 60% prędkośći
        e.Vy = -Math.abs(e.Vy*0.6);
      }
    }
    else{ // analogiczne wzory, jeżeli nie ma oporu ośrodka
      e.y += e.Vy*dt -0.5*9.81*dt*dt;
      e.x += e.Vx*dt;
      e.Vx += e.Ax*dt;
      e.Vy += e.Ay*dt;
      if(e.y >= sizeY-7){
        e.Vy = -Math.abs(e.Vy*0.6);
      }
      if(e.y >= sizeY-7) e.y = sizeY-7;
    }
  }
  //Gdy uruchomiony został tryb wybierania myszką Vx i Vy, a animacja nie została jeszcze uruchomiona
  //właściwy układ zaczyna się od 73 piksela w prawo od początku obiektu canvas (dlatego często występuje beginVx + 73)
  else if(mouseX >= 73 && mouseX <= sizeX +73 && mouseY >= 0 && mouseY <= sizeY && !pause || setData && !pause ){
    strokeWeight(3);
    let draw_x; // współrzędna x pukntu względem którego będzie rysowana linia i kropki
    let draw_y; // analogicznie dla współrzędnej y
    if(setData){
      //jeżeli użytkownik kliknął myszką w którymś miejscu układu współrzędnych, a nie były jeszcze ustalone
      //wartośći Vx i Vy to beginVx i beginVy zostaną zaaktualizowane.
      //Innymi słowy, flaga setData aktywna
      draw_x = beginVx + 73;
      draw_y = beginVy + e.y;
    }
    else{
      //flaga setData jest nieaktywna, czyli użytkownik wybiera jeszcze myszką Vx i Vy
      draw_x = mouseX;
      draw_y = mouseY;
      document.getElementById('angle').value = Math.round(angle(mouseX - 73, mouseY - e.y)*180/Math.PI * 100) / 100; //obliczanie kąta z dokładnością do 2 miejsc po przecinku
      document.getElementById('velocity').value = Math.round(velocity(mouseX-73, mouseY-e.y) * 100) / 100; // analogicznie prędkość początkowa
      document.getElementById('height').value = Math.round((493-e.y) * 100) / 100; // oraz wysokość
    }
    line(73,e.y,draw_x,draw_y);
    it_y = draw_y;
    // rysowanie kropek od miejsca kliknięcia myszką do granic układu współrzędnych. Wykona się, gdy użytkownik klinie na układ
    if(draw_y <= e.y){ // jeżeli Vy jest dodatnia
      while(it_y < e.y){
        point(draw_x,it_y);
        it_y += 5; // rysowanie kropek odbywa się co 5 pikseli
      }
    }
    else{ //jeżeli Vy jest ujemna
      while(it_y > e.y){
        point(draw_x, it_y);
        it_y -= 5;
      }
    }
    it_x = draw_x;
    while(it_x > 73){
      strokeWeight(3);
      point(it_x, draw_y); // rysowanie kropek wzdłuż osi OX
      it_x -= 5;
    }
    textSize(17);
    fill(0);
    //wypisuje obok kropek aktualne wartości Vx i Vy
    text((parseInt(-draw_y + e.y,10)).toString()+'m/s', draw_x,(e.y+draw_y)/2);
    text((parseInt(draw_x - 73)).toString()+'m/s', draw_x/2,draw_y);
    fill(102);
    strokeWeight(1);
    ellipse(e.x,e.y,15,15);
    strokeWeight(3);
    fill(255);
  }
  //gdy zostanie wciśnięta pauza, należy rysować piłkę w tym samym miejscu i ślad za piłką też
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
    //jeżeli myszka zostanie kliknięta na układ współrzędnych i flaga setData jest nieaktywna,
    //to ustalamy parametry animacji na podstawie położenia myszki i setData = true
    beginVx = mouseX - 73;
    beginVy = mouseY - e.y;
    setData = true;
  }
  else if(!startedAnimation && setData && mouseX >= 73 && mouseX <= sizeX + 73 && mouseY >= 0 && mouseY <= sizeY){
    //jeżeli ponownie myszka zostanie kliknięta, to znaczy, że użytkownik chce wybrać parametry jeszcze raz
    setData = false;
  }
}

//głowny obiekt przechowujący dane piłki
function element(y,x){
  this.Ax = 0; // przyspieszenie w kierunku X
  this.Ay = 0 // przyspieszenie w kierunku Y
  this.Vx = 0; // prędkość w kierunku X
  this.Vy = 0; // prędkość w kierunku Y
  this.m = 0; // masa (aktualnie nie używana)
  this.y = y; // położenie y
  this.x = x; // położenie x
}

//dodaje przyspieszenie obiektowi
element.prototype.addForce = function(x,y){
  this.Ax += x;
  this.Ay += y;
}
//dodaje prędkość obiektowi
element.prototype.addVelocity = function(x,y){
  this.Vx += x;
  this.Vy += y;
}

//trzy funkcje umożliwiające zmianę początkowej wysokości piłki klikając na nią i przytrzymując przycisk myszki
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
  if(!startedAnimation && moveBall && mouseY >= 0 && mouseY <= 493){
    e.y = mouseY;
    document.getElementById('height').value = 493 - e.y;
  }
}

//funkcja obsługująca start animacji.
//Ustawia odpowiednie flagi i odpowiednie wartości
function start(){
  if(!startedAnimation){
    e.Vx = 0;
    e.Vy = 0;
    e.addVelocity(beginVx,beginVy);
  }
  startedAnimation = true;
  pause = false;
}
//analogicznie dla pauzy
function pause_f(){
  pause = true;
}

//funkcja ta zatrzymuje animację i przywraca piłkę do początkowego stanu
function stop(){
  startedAnimation = false;
  pause = false;
  e.y = 493;
  e.x = 76;
  document.getElementById('predkosc').innerHTML = "0.00&nbspm/s";
  document.getElementById('wysokosc').innerHTML = "0.00&nbspm";
  document.getElementById('czas').innerHTML = "0.00&nbsps";
  document.getElementById('odleglosc').innerHTML = "0,00&nbspm";
  t=0;
  beginVx = 0;
  beginVy = 0;
  setData = false;
  beginShape();
}

//liczy kąt pomiędzy x i y
function angle(x, y){
  return -Math.atan(y/x);
}

//liczy prędkość mając dane Vx i Vy
function velocity(Vx, Vy){
  return Math.sqrt(Vx*Vx + Vy*Vy);
}

//funkcja wywoływana przy wciśnięciu przycisku "OK" przy wyborze kąta
function confirm_angle(){
  angle = document.getElementById('angle').value;
  //mechanizm sprawdzania, czy dane są poprawne:
  angle = angle.replace(",",".");
  let reg = /-*\d+(\.\d+)?/;
  if(reg.test(angle) && angle > -90 && angle < 90){ // sprawdza czy kąt jest liczbą z przedziału -90 do 90
    document.getElementById('info_angle').style.color = 'black';
  }
  else{
    document.getElementById('info_angle').style.color = 'red'; // podświetla uwagę na czerwono i nie pozwala przejść dalej
    return;
  }
  confirmed_angle = true;
  if(confirmed_v){ // oblicza tylko wtedy jeżeli ma daną też prędkość początkową
    setData = true;
    //obliczone początkowe Vx i Vy na podstawie danej prędkości początkowej V i kąta alfa
    beginVx = v/(Math.sqrt(Math.tan(-angle*Math.PI/180)*Math.tan(-angle*Math.PI/180) + 1));
    beginVy = Math.tan(-angle*Math.PI/180)*v/(Math.sqrt(Math.tan(-angle*Math.PI/180)*Math.tan(-angle*Math.PI/180) + 1));
  }
}

//analogicznie jak poprzednio, tylko dla prędkości początkowej
function confirm_velocity(){
  v = document.getElementById('velocity').value;
  v = v.replace(",",".");
  let reg = /\d+(\.\d+)?/;
  if(reg.test(v) && v > 0 && v < 1113){
    document.getElementById('info_velocity').style.color = 'black';
  }
  else{
    document.getElementById('info_velocity').style.color = 'red';
    return;
  }
  confirmed_v = true;
  if(confirmed_angle){ //oblicza wtedy jak ma daną poprawną prędkość początkową
    setData = true;
    beginVx = v/(Math.sqrt(Math.tan(-angle*Math.PI/180)*Math.tan(-angle*Math.PI/180) + 1));
    beginVy = Math.tan(-angle*Math.PI/180)*v/(Math.sqrt(Math.tan(-angle*Math.PI/180)*Math.tan(-angle*Math.PI/180) + 1));
  }
}

//analogicznie jak poprzednio, tylko dla wysokości
function confirm_height(){
  height = document.getElementById('height').value;
  height = height.replace(",",".");
  let reg = /\d+(\.\d+)?/;
  if(reg.test(height) && height >= 0 && height <= 500){
    document.getElementById('info_height').style.color = 'black';
  }
  else{
    document.getElementById('info_height').style.color = 'red';
    return;
  }
  e.y = 493 - height; //aktualizuje pozycję piłki
}