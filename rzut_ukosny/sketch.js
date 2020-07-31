/*W obliczeniach  przyjęta została poprawka na położenie piłki. Piksel (0,0) znajduje się w lewym górnym ekranie
i współrzędne rosną w kierunku prawo-dół (zamiast prawo-góra jak w kartezjańskim układzie), więc często współrzędna
y piłki obliczona będzie jako 493 - e.y zamiast samego e.y*/ 


// wartość o jaką przesunie się czas w animacji uwzględniając
//ilość klatek na sek oraz średni czas obliczania jednej klatki
//wyznaczony eksperymentalnie
let dt = 0.01*8343/5000;
let t = 0; //całkowity czas
let e = new element(493,76,5); //obiekt który odpowiada piłce
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
  myCanvas = createCanvas(1113, 524);
  myCanvas.parent('main');
  img = loadImage('img/wykres.png');
  frameRate(100);
  beginShape();
  noFill();
  e.addForce(0, 9.81);
}
function draw(){
  let opor = 0.5*Math.pow(1.07,$("#preasure_range_air")[0].value-50);
  e.m = 4*Math.pow(1.07, $("#mass_range_air")[0].value-50);
  if(startedAnimation){
    $('#h')[0].disabled = true; // gdy działa animacja, niektóre przyciski stają się nieaktywne
    $('#angle_button')[0].disabled = true;
    $('#reset_button')[0].disabled = false;
    $('#vel_button')[0].disabled = true;
    $('#check_air')[0].disabled = true;
    if(!pause){
      $('#start_button')[0].disabled = true;
      $('#pause_button')[0].disabled = false;
    }
    else{
      $('#start_button')[0].disabled = false;
      $('#pause_button')[0].disabled = true;
    }
  }
  else{ // gdy animacja jeszcze się nie rozpoczęła, przyciski są jeszcze aktywne
    $('#h')[0].disabled = false;
    $('#angle_button')[0].disabled = false;
    $('#vel_button')[0].disabled = false;
    $('#check_air')[0].disabled = false;
    $('#start_button')[0].disabled = false;
    $('#pause_button')[0].disabled = true;
    $('#reset_button')[0].disabled = true;
  }
  if(!$("#check_air")[0].checked || $("#check_air")[0].disabled){
    $(".ranger").attr("disabled",true);
  }
  else{
    $(".ranger").attr("disabled",false);
    $("#preasure_amount")[0].innerHTML = Math.round(opor*2026 * 100) / 100+" hpa";
    $("#mass_amount")[0].innerHTML = Math.round(e.m*2.5 * 100) / 100+" kg";
    console.log(opor);
    console.log(e.m);
  }
  fill(255);
  stroke('orange');
  background(img);
  if(startedAnimation && !pause){ // gdy animacja została uruchomiona i nie jest wciśnięta pauza
    t += dt;
    fill(255);
    if(e.x <= 1080) { // gdy jeszcze piłka nie wyleciała poza układ współrzędnych
      strokeWeight(1);
      fill(91,95,102);
      ellipse(e.x,e.y,15,15); // rysuje piłkę we wskazanym miejscu o średnicy 15 pikseli
      strokeWeight(3);
      fill(255);
      noFill();
      stroke('red');
      curveVertex(e.x,e.y+7); // rysuje czerwony ślad za piłką
      endShape();
      if(frameUpdate % 7 == 0){ // wyliczenia parametrów animacji i ich wypisanie na ekran (domyślnie co 7 klatek)
        $('#predkosc')[0].innerHTML = Math.round((velocity(e.Vx, e.Vy))* 100) / 100+"&nbspm/s";
        $('#wysokosc')[0].innerHTML = Math.round(((492-e.y) < 0.2 ? 0 : 492-e.y) * 100) / 100+"&nbspm";
        $('#czas')[0].innerHTML = Math.round(t * 100) / 100+"&nbsps";
        $('#odleglosc')[0].innerHTML = Math.round((e.x - 73) * 100) / 100+"&nbspm";
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
    if($('#check_air')[0].checked == true){ // jeżeli zaznaczony został opór ośrodka
      e.y += e.Vy*dt + 0.5*opor/e.m*e.Vy*dt*dt -0.5*9.81*dt*dt; // wzór na y(t)
      e.x += e.Vx*dt -0.5*opor/e.m*e.Vx*dt*dt; // wzór na x(t)
      e.Vx += (e.Ax - opor/e.m*e.Vx)*dt; // wzór na Vx(t)
      if(Math.abs(e.Vy) < 0.2 && e.y >= sizeY - 8){
        e.Vy = 0;
        e.y = sizeY -7;
      }
      else e.Vy += (e.Ay - opor/e.m*e.Vy)*dt; // wzór na Vy(t)
      if(e.y >= sizeY-7 && e.Vy >= 0 && e.Vy != 0){ // jeżeli piłka dotknie ziemi, to odbije się od niej zachowując 60% prędkośći
        e.Vy = -Math.abs(e.Vy*0.6);
      }
      if(e.y >= sizeY-7) e.y = sizeY-7;
    }
    else{ // analogiczne wzory, jeżeli nie ma oporu ośrodka
      e.y += e.Vy*dt -0.5*9.81*dt*dt;
      e.x += e.Vx*dt;
      e.Vx += e.Ax*dt;
      if(Math.abs(e.Vy) < 0.2 && e.y >= sizeY - 8){
        e.Vy = 0;
        e.y = sizeY -7;
      }
      else e.Vy += e.Ay*dt;
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
      draw_x = beginVx + 75;
      draw_y = beginVy + e.y + 7;
    }
    else{
      //flaga setData jest nieaktywna, czyli użytkownik wybiera jeszcze myszką Vx i Vy
      draw_x = mouseX;
      draw_y = mouseY;
      console.log(mouseX - 75);
      console.log(mouseY - e.y - 7.5);
      $('#angle')[0].value = Math.round(angle(beginVx, beginVy)*180/Math.PI * 100) / 100; //obliczanie kąta z dokładnością do 2 miejsc po przecinku
      $('#velocity')[0].value = Math.round(velocity(beginVx, beginVy) * 100) / 100; // analogicznie prędkość początkowa
      $('#height')[0].value = Math.round((493-e.y) * 100) / 100; // oraz wysokość
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
    text((parseInt(Math.round(-draw_y + e.y + 7),10)).toString()+'m/s', draw_x,(e.y+draw_y)/2);
    text((parseInt(Math.round(draw_x - 75))).toString()+'m/s', draw_x/2,draw_y);
    beginVy = -Math.round(-draw_y + e.y + 7);
    beginVx = Math.round(draw_x - 75);
    fill(91,95,102);
    strokeWeight(1);
    ellipse(e.x,e.y,15,15);
    strokeWeight(3);
    fill(255);
  }
  //gdy zostanie wciśnięta pauza, należy rysować piłkę w tym samym miejscu i ślad za piłką też
  else{
    fill(91,95,102);
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
    console.log(beginVx);
    console.log(beginVy);
    setData = true;
  }
  else if(!startedAnimation && setData && mouseX >= 73 && mouseX <= sizeX + 73 && mouseY >= 0 && mouseY <= sizeY){
    //jeżeli ponownie myszka zostanie kliknięta, to znaczy, że użytkownik chce wybrać parametry jeszcze raz
    setData = false;
  }
}

//głowny obiekt przechowujący dane piłki
function element(y,x,m){
  this.Ax = 0; // przyspieszenie w kierunku X
  this.Ay = 0 // przyspieszenie w kierunku Y
  this.Vx = 0; // prędkość w kierunku X
  this.Vy = 0; // prędkość w kierunku Y
  this.m = m; // masa
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
    $('#height')[0].value = 493 - e.y;
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
  $('#predkosc')[0].innerHTML = "0.00&nbspm/s";
  $('#wysokosc')[0].innerHTML = "0.00&nbspm";
  $('#czas')[0].innerHTML = "0.00&nbsps";
  $('#odleglosc')[0].innerHTML = "0,00&nbspm";
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
  angle = $('#angle')[0].value;
  //mechanizm sprawdzania, czy dane są poprawne:
  angle = angle.replace(",",".");
  let reg = /-*\d+(\.\d+)?/;
  if(reg.test(angle) && angle > -90 && angle < 90){ // sprawdza czy kąt jest liczbą z przedziału -90 do 90
    $('#info_velocity').css("color","rgba(232, 232, 233,0.9)");
  }
  else{
    $('#info_angle')[0].style.color = 'red'; // podświetla uwagę na czerwono i nie pozwala przejść dalej
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
  v = $('#velocity')[0].value;
  v = v.replace(",",".");
  let reg = /\d+(\.\d+)?/;
  if(reg.test(v) && v > 0 && v < 1113){
    $('#info_velocity').css("color","rgba(232, 232, 233,0.9)");
  }
  else{
    $('#info_velocity')[0].style.color = 'red';
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
  height = $('#height')[0].value;
  height = height.replace(",",".");
  let reg = /\d+(\.\d+)?/;
  if(reg.test(height) && height >= 0 && height <= 500){
    $('#info_velocity').css("color","rgba(232, 232, 233,0.9)");
  }
  else{
    $('#info_height')[0].style.color = 'red';
    return;
  }
  e.y = 493 - height; //aktualizuje pozycję piłki
}

//podpięcie zdarzenia "kliknięcie myszą" do poszczególnych przycisków
$(function(){
  $('#start_button').click(start);
  $('#pause_button').click(pause_f);
  $('#reset_button').click(stop);
  $('#h').click(confirm_height);
  $('#angle_button').click(confirm_angle);
  $('#vel_button').click(confirm_velocity);
});
