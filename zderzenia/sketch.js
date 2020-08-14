let velocity1 = 0;
let velocity2 = 0;
let weight1 = 0;
let weight2 = 0;
let c_w;
let c_h;
let tab;
let z = 0;
let w = 0;
let vFirstBall = 1; //potrzebne do animacji
let vSecondBall = 1; //potrzebne do animacji
let vThirdBall = 0;
let sizeFirstBall = 0.15; //potrzebne do animacji
let sizeSecondBall = 0.15; //potrzebne do animacji
let czySprezyste = true; //wartość początkowa oraz domyślne ustawienie
let start = false;
let result = 0;
let moveSecond = false;
let firstTime = true;


window.addEventListener("resize", afterSize);

//funkcja monitorująca radioButtony
function change(){
    var myRadio = $("input[name = zderzenie]");
    if(myRadio.filter(":checked").val() == "Zderzenie_sprezyste" || !czySprezyste){
        czySprezyste = true;
    } else if(myRadio.filter(":checked").val() == "Zderzenie_niesprezyste"){
        czySprezyste = false;
    }
    windowResized();
}

//funkcja pobierająca wartości z pól input
function getValue(idField) {
    var value = $("#" + idField).val();
    if (isNaN(value)){
        alert("to nie liczba !!!");
        $("#" + idField).val("");
    }
    else if(value == ""){
        alert("Puste pole !!!");
    }
    else {
        if(idField == 'velocity1'){
            velocity1 = value;
            if(velocity1 != 0 && weight2 != 0 && weight1 != 0){
                result = findMoment(velocity2, weight2, velocity1);
                console.log("ug");
                //result = a_momentum(weight1, weight2, velocity1, velocity2);
                weight1 = result.toFixed(2);
                $('#weight1').val(result);
            } else if(velocity1 == 0) {
                velocity1 = findMoment(velocity2, weight2, weight1);
            }
        }
        else if(idField == 'velocity2'){
            if(velocity2 == 0){
                alert("Podaj wagę 2-giej kulki");
                $('#wButton2').prop("disabled", false);
                $('#weight2').prop("disabled", false);
                velocity2 = value;
            } else if(velocity2 != 0 && weight2 != 0){
                velocity2 = value;
               // result = findMoment(velocity1, weight1, velocity2);
                //result = a_momentum(weight1, weight2, velocity1, velocity2);
                result = findMoment(velocity1, weight1, velocity2).toFixed(2);
                weight2 = result;
                $('#weight2').val(result);
            }

        }
        else if(idField == 'weight1'){
            weight1 = value;
            if (weight1 != 0 && velocity1 != 0 && weight2 != 0) {
                result = findMoment(velocity2, weight2, weight1);
                velocity1 = result.toFixed(2);
                $('#velocity1').val(result);
            } else if(velocity1 != 0 && velocity2 != 0 && weight2 != 0){
                weight1 = findMoment(velocity2, weight2, velocity1).toFixed(2);
            }
        }
        else if(idField == 'weight2'){
            weight2 = value;
            if(weight2 != 0 && velocity2 != 0){
                velocity2 = findMoment(velocity1, weight1, weight2).toFixed(2);
                $('#velocity2').val(velocity2);
            } else if (weight2 != 0 && velocity2 == 0){
                console.log("jestem");
                velocity2 = findMoment(velocity1, weight1, weight2).toFixed(2);
                result = a_momentum(weight1, weight2, velocity1, velocity2);
                console.log(weight1, weight2, velocity1, velocity2);
            } else {
                result = a_momentum(weight1, weight2, velocity1, velocity2).toFixed(2);
            }

            vSecondBall = hashVelocity(velocity2);
        }
    }
/*
    console.log(velocity1, velocity2, weight1, weight2);
    console.log(weight1 + " - waga1");
    console.log(velocity1 + " " + velocity2);

 */
    console.log(weight1, weight2, velocity1, velocity2 + "przed");
    //var wynik = a_momentum(weight1, weight2, velocity1, velocity2);
    actualVNS();
}

function actualVNS(){
    vFirstBall = hashVelocity(velocity1);
    if(czySprezyste){
        vSecondBall = hashVelocity(velocity2);
    }
    sizeFirstBall = hashSize(weight1);
    sizeSecondBall = hashSize(weight2);
    //  windowResized();
    //to jest do poprawienia
    vSecondBall = hashVelocity(velocity2);
}

function firstLoop(){
    if(firstTime == true){
        console.log("dzialam");
        var wynik = findMoment(velocity1, velocity2, weight2);
        result = wynik;
        console.log("wynik " + wynik);
        $('#velocity2').val(result);
        firstTime = false;
    }
}

function findResult(){
   /* if(result != undefined){
        result = result.toFixed(2);
        $('#velocity2').val(result);
    }
    */

    vFirstBall = hashVelocity(velocity1);
    if(czySprezyste){
        vSecondBall = hashVelocity(velocity2);
    }
    sizeFirstBall = hashSize(weight1);
    sizeSecondBall = hashSize(weight2);
    $('#vButton2')[0].disabled = false;
    $('#velocity2')[0].disabled = false;
  //  windowResized();
    //to jest do poprawienia
    vSecondBall = hashVelocity(velocity2);

}

function afterLoad(){
    c_h = $('#canvas').height();
    c_w = $('#canvas').width();
    if($('#vBUtton2').is(":disabled")){
        $('#vButton2').prop('disabled', false);
        $('#velocity2').prop('disabled', false);
    } else {
        $('#vButton2').prop('disabled', true);
        $('#velocity2').prop('disabled', true);
    }

}

function afterSize(){
    windowResized();
    afterLoad();
}

function setup(){
    myCanvas = createCanvas(c_w, c_h);
    myCanvas.parent('canvas');
    background(230);
}

function draw(){
    background(230);
    c_w = Math.floor(c_w);
    c_h = Math.floor(c_h);

    if(!start && czySprezyste){
        //zatrzymana i sprezyste
        ellipse(width / 4 + z, height / 2, sizeFirstBall * c_h, sizeFirstBall * c_h);
        ellipse(width * 5 / 8 + w, height / 2, sizeSecondBall * c_h, sizeSecondBall * c_h);
    } else if(!start && !czySprezyste){
        //zatrzymana i niesprezyste
        //trzeba wrocic
        ellipse(width / 4 + z, height / 2, sizeFirstBall * c_h, sizeFirstBall * c_h);
        ellipse(width * 5 / 8 + w, height / 2, sizeSecondBall * c_h, sizeSecondBall * c_h);
    } else if(czySprezyste && start) {
        ellipse(width / 4 + z, height / 2, sizeFirstBall * c_h, sizeFirstBall * c_h);
        ellipse(width * 5 / 8 + w, height / 2, sizeSecondBall * c_h, sizeSecondBall * c_h);

        t1 = Math.round(c_w * 3 / 4 - sizeFirstBall * c_h / 2);
        t2 = Math.round(c_w * 3 / 8 - sizeSecondBall * c_h / 2);

        //warunek końca animacji
        if (Math.round(z / vFirstBall) == Math.round(t1 / vFirstBall)) {
            z = 0;
            w = 0;
            moveSecond = false;
            noLoop();
        }
        if(Math.round(w / vSecondBall) == Math.round(t2 / vSecondBall)){
            z = 0;
            w = 0;
            moveSecond = false;
            noLoop();
        }

        if(Math.round(width * 1 / 4 + z + sizeFirstBall * c_h / 2) == Math.round(width * 5 / 8 - sizeSecondBall * c_h / 2)){
            moveSecond = true;
        }

        if(moveSecond){
            w += vSecondBall;
        } else {
            z += vFirstBall;
        }
    /*} else if(!czySprezyste && start){

        //niesprezyste
        //trzeba wrocic
        console.log("niesprezyste");
        ellipse(width / 4, height / 2, 0.15 * c_h, 0.15 * c_h);
        ellipse(width * 5 / 8 + vSecondBall, height / 2, 0.15 * c_h, 0.15 * c_h);
        t = Math.round(c_w * 3 / 4 - 0.15 * c_h / 2);
        if (vSecondBall == t) {
            vSecondBall = 0;
            noLoop();
        }
        vSecondBall++;

         */
    }
}

function windowResized(){
    afterLoad();
    resizeCanvas(c_w, c_h);
    background(230);
    z = 0;
    w = 0;
    start = false;
    loop();
}

function findMoment(x1, x2, x3){
    //funkcja do znajdowania brakującej wartości
    // x1 * x2 / x3
    // x1 * x2 = x3 * Y
    return x1 * x2 / x3;
}

function a_momentum(w1, w2, v1, v2){
    tab = new Array(w1, w2, v1, v2);
    x = 0;

    for(let i = 0; i < 4; i++){
        if(tab[i] == 0){
            x++;
        }
    }
    if(x == 1){
        if(w1 == 0){
            //tu uzupełnić poprawne wartości, które będą podawane po obliczeniu
            //weight1 = v2 * w2 / v1;
            return v2 * w2 / v1;
        } else if (w2 == 0){
            //weight2 = v1 * w1 / v2
            return v1 * w1 / v2;
        } else if(v1 == 0){
            //velocity1 = v2 * w2 / w1;
            return v2 * w2 / w1;
        } else if(v2 == 0){
            //velocity2 = v1 * w1 / w2;
            //console.log(velocity2 + "v");
            return v1 * w1 / w2;
        }
    }
}

//funckja haszująca prędkości kulek
function hashVelocity(v){
    const velocityValuesArray = new Array(0.4, 0.8, 1.2, 1.6, 2.0, 2.4, 2.8, 3.2, 3.6, 4.0);
    var x = 0;
    if(v <= 10){
        x = 0;
    } else if (v >= 100){
        x = 9;
    } else {
        x = Math.floor(v / 10);
    }
    return velocityValuesArray[x];
}

function hashSize(w){
    const weightValuesArray = new Array(0.04, 0.08, 0.12, 0.16, 0.2, 0.24, 0.28, 0.32, 0.36, 0.4);
    var y = 0;
    if(w <= 5){
        y = 0;
    } else if (w >= 50){
        y = 9;
    } else {
        y = Math.floor(w / 5);
    }
    return weightValuesArray[y];
}
//funkcje do buttonów na stopce
function playAnimation(){
    start = true;
  /*
    console.log(hashVelocity(velocity1) + "value from array");
    console.log(hashVelocity(velocity2) + "value from array 2 ");
    console.log(hashSize(weight1) + "value from array 3 ");
   */
}

function pauseAnimation(){
    start = false;
    $('#wButton2')[0].disabled = false;
    $('#weight2')[0].disabled = false;
}
function restartAnimation(){
    start = false;
    windowResized();
}
