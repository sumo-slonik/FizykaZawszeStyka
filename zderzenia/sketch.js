/*
* Przedział prędkości, z którego możemy korzystać to 0-100, a wielkości kulek to 0-50. Wielkości te są odpowiednio
* haszowane i zamieniane na odpowiednie procenty w celu lepszej wizualizacji problemu w aplikacji
* */

let velocity1 = 0; //wartość pobrana z pola input
let velocity2 = 0;
let velocity3 = 0;
let weight1 = 0;
let weight2 = 0;
let c_w; // szerokość canvasu
let c_h; // wysokość canvasu
let tab;
let z = 0; // położenie 1-szej kulki
let w = 0; // położenie 2-giej kulki
let r = 0; // położenie dla złączonych kulek
let vFirstBall = 1; //zahaszowana prędkość 1-szej kulki, potrzebna do animacji
let vSecondBall = 1;
let vThirdBall = 0; //prędkość złaćzonych kulek
let sizeFirstBall = 0.15; //zahaszowana wielkość 1-szej kulki
let sizeSecondBall = 0.15;
let resilient = true; //wartość początkowa oraz domyślne ustawienie
let opposite = false;
let startedVIsZero = true;
let start = false; //czy animacja jest w ruchu
let reflection = false;
let result = 0;
let moveSecond = false; //czy 2-ga kulka się porusza
let moveTogether = false;
let firstTime = true; //czy program wykonuje się po raz pierwszy ?


window.addEventListener("resize", afterSize);


function change(){
    //funkcja monitorująca radioButtony
    var myRadio = $("input[name = zderzenie]");
    if(myRadio.filter(":checked").val() == "Zderzenie_sprezyste" || !resilient){
        resilient = true;
        $('#vector').prop('disabled', false);
    } else if(myRadio.filter(":checked").val() == "Zderzenie_niesprezyste"){
        resilient = false;
        firstTime = true;
        $('#vector').prop('disabled', true);
    }
    restartAnimation();
    windowResized();
    actualVNS();
}

$(document).ready(function(){
    //funkcja sprawdzająca wartość checkboxa
    var checkbox1 = $('#vector');
    var checkbox2 = $('#v_zero');
    checkbox1.click(function(){
        opposite = checkbox1.prop('checked');
        restartAnimation();
        if(opposite){
            $('#v_zero').prop('disabled', true);
            checkbox2.prop('checked', false);
            $('#zderzenie_niesprezyste').prop('disabled', true);
            $('#velocity2').prop('disabled', false);
            if(velocity3 == 0 ){
                $('#start').prop("disabled", true);
            }
            resilient = true;
            $('#zderzenie_sprezyste').prop('checked', true);
        } else {
            $('#v_zero').prop('disabled', false);
            $('#v_zero').prop('checked', true);
            startedVIsZero = true;
            velocity2 == 0;
            $('#velocity2').prop('disabled', true);
            $('#velocity2').val(0)
            $('#vButton2').prop('disabled', true);
            $('#zderzenie_niesprezyste').prop('disabled', false);
        }
    });


    checkbox2.click(function(){
        startedVIsZero = checkbox2.prop('checked');
        restartAnimation();
        if(startedVIsZero){
            $('#velocity2').prop('disabled', true);
            velocity2 == 0;
        } else if(!startedVIsZero){
            $('#velocity2').prop('disabled', false);
        }
    });
});

//funkcja pobierająca wartości z pól input
function getValue(idField) {
    var value = $("#" + idField).val();
    value = parseInt(value, 10);
    if (isNaN(value)){
        alert("to nie liczba !!!");
        $("#" + idField).val("");
        $('#start').prop("disabled", true);
    }
    else if(value == ""){
        alert("Puste pole !!!");
        $('#start').prop("disabled", true);
    }
    else if (resilient && !opposite){ //!!!
        console.log("czySprezyste i !czyPrzeciwne");
        if(idField == 'velocity1'){
            velocity1 = value;
            if(velocity2 != 0 && velocity1 < velocity2){
                alert("Prędkość 2-giej kulki musi być mniejsza od prędkości 1-szej kulki");
                velocity1 = 0;
                $('#velocity1').val("");
            }
            if(weight1 == weight2 && weight1 != 0 && startedVIsZero){

            } else if(weight1 == weight2 && weight1 != 0 && !startedVIsZero){

            }
        }
        else if(idField == 'velocity2'){
            velocity2 = value;
            if(velocity1 != 0 && velocity1 < velocity2){
                alert("Prędkość 2-giej kulki musi być mniejsza od prędkości 1-szej kulki");
                velocity2 = 0;
                $('#velocity2').val("");
            }
        }
        else if(idField == 'weight1'){
            weight1 = value;
            if(weight1 == weight2 && weight2 != 0){

            }
        }
        else if(idField == 'weight2'){
            weight2 = value;
            if(weight1 == weight2 && velocity2 != 0 && velocity1 > velocity2){
                console.log(velocity1, velocity2)
                $('#velocity1').val(velocity1);
                $('#velocity2').val(velocity2);
            } else if(weight1 == weight2 && velocity1 < velocity2){
                velocity1 = $('#velocity2').val();
                velocity2 = $('#velocity1').val();
                $('#velocity1').val(velocity1);
                $('#velocity2').val(velocity2);
            }
        }
    } else if(!resilient && !opposite){
        //zderzenie niesprezyste i nieprzeciwne
        if(idField == 'velocity1'){
            velocity1 = value;
        }
        else if(idField == 'velocity2'){
            velocity2 = value;
        }
        else if(idField == 'weight1'){
            weight1 = value;
        }
        else if(idField == 'weight2'){
            weight2 = value;
        }
    } else if(opposite && resilient){
        // sprężyste i przeciwne
        console.log("dobrze weszlismy");
        if(idField == 'velocity1'){
            if(value != 0){
                velocity1 = value;
            } else {
                alert("Podaj liczbę dodatnią !!!");
            }

        } else if(idField == 'weight1'){
            if(value != 0){
                weight1 = value;
            } else {
                alert("Podaj liczbę dodatnią !!!");
            }
        } else if(idField == 'velocity2'){
            if(value != 0){
                velocity2 = value;
            } else {
                alert("Podaj liczbę dodatnią !!!");
            }
        } else if(idField == 'weight2'){
            if(value != 0){
                weight2 = value;
            } else {
                alert("Podaj liczbę dodatnią !!!");
            }
        }
        if(velocity1 != 0 && weight1 != 0 && velocity2 != 0 && weight2 != 0){
            if(weight1 == weight2){
                t = velocity1;
                velocity1 = min(velocity1, velocity2);
                velocity2 = max(t, velocity2);
                $('#velocity1').val(velocity1);
                $('#velocity2').val(velocity2);
            } else {
                velocity3 = (weight1 * velocity1 - weight2 * velocity2) / (weight1 + weight2);
                $('#velocity3').prop('disabled', false);
                velocity3 = velocity3.toFixed(2);
                $('#velocity3').val(velocity3);
                vThirdBall = hashVelocity(abs(velocity3));
                $('#start').prop('disabled', false);
            }
        }
    }
    actualVNS();
    resizeCanvas(c_w, c_h);
    background(230);
    z = 0;
    w = 0;
    loop();
    if(weight1 != 0 && weight2 != 0 && velocity1 != 0 && velocity2 != 0){
        start = true;
        $('#start').prop('disabled', false);
    }
}

// funkcja aktualizująca wartości prędkości i wielkości kulek
function actualVNS(){
    vFirstBall = hashVelocity(velocity1);
    if(resilient){
        vSecondBall = hashVelocity(velocity2);
    }
    sizeFirstBall = hashSize(weight1);
    sizeSecondBall = hashSize(weight2);
    vSecondBall = hashVelocity(velocity2);
    if(!resilient){
        vThirdBall = hashVelocity(velocity2);
        console.log(vThirdBall + "predkosci");
    }

    if(!startedVIsZero){
        if(velocity1 < 2 * velocity2){
            vSecondBall /= 2;
        } else if(velocity2 > 2 * velocity1){
            vFirstBall /= 2;
        }
    }
    console.log("predkosc1: actual " + vFirstBall);
    console.log("predkosc2: actual " + vSecondBall);
}

function findResult(){
    vFirstBall = hashVelocity(velocity1);
    if(resilient){
        vSecondBall = hashVelocity(velocity2);
    }
    sizeFirstBall = hashSize(weight1);
    sizeSecondBall = hashSize(weight2);
    $('#vButton2')[0].disabled = false;
    $('#velocity2')[0].disabled = false;
    vSecondBall = hashVelocity(velocity2);
}

function afterLoad(){
    c_h = $('#canvas').height();
    c_w = $('#canvas').width();
    if(firstTime){
        if($('#vButton2').is(":disabled")){
            $('#vButton2').prop('disabled', false);
            $('#velocity2').prop('disabled', false);
        } else {
            $('#vButton2').prop('disabled', true);
            $('#velocity2').prop('disabled', true);
        }
        $('#v_zero').prop('checked', true);
        firstTime = false;
    }
    if(resilient && startedVIsZero){
        $('#velocity2').val(0);
    }

    if(velocity3 == 0){
        $('#velocity3').prop('disabled', true);
        $('#play').prop('disabled', true);
    }
    if(velocity1 !=0 || velocity2 != 0 || weight1 != 0 || weight2 != 0){
        $('#play').prop('disabled', false);
    }

    //ustawienia divów - css

    var screenHeight = innerHeight;
    $('#firstDiv').css("marginTop", Math.round(1.5 * screenHeight));
    $('#secondDiv').css("marginTop", 3 *  screenHeight);
    $('#secondDiv').css("height", screenHeight);

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
    let c = color('rgb(0, 128, 255)');
    let c2 = color('rgb(223, 32, 32)');
    fill(c);
    if(!start && resilient && startedVIsZero && !opposite){
        //zatrzymana i sprezyste v == 0
        stroke('#000');
        ellipse(width / 4 + z, height / 2, sizeFirstBall * c_w, sizeFirstBall * c_w);
        ellipse(width * 5 / 8 + w, height / 2, sizeSecondBall * c_w, sizeSecondBall * c_w);
    } else if(!start && resilient && opposite) {
        stroke('#000');
        ellipse(width * 2 / 10 + z, height / 2, sizeFirstBall * c_w, sizeFirstBall * c_w);
        ellipse(width * 8 / 10 + w, height / 2, sizeSecondBall * c_w, sizeSecondBall * c_w);
    } else if(!start && resilient && !startedVIsZero){
        //zatrzymana i sprezyste prędkść początkowa != 0
        stroke('#000');
        ellipse(width * 2 / 10 + z, height / 2, sizeFirstBall * c_w, sizeFirstBall * c_w);
        ellipse(width * 8 / 10 + w, height / 2, sizeSecondBall * c_w, sizeSecondBall * c_w);
    } else if (!start && !resilient){
        //zatrzymana i niesprezyste
        noStroke();
        fill(c2);
        ellipse(width / 4 + z + r, height / 2, sizeFirstBall * c_w, sizeFirstBall * c_w);
        ellipse(width * 5 / 8 + r, height / 2, sizeSecondBall * c_w, sizeSecondBall * c_w);
    } else if(resilient && start && !opposite && startedVIsZero) {
        //sprezyste i działa i nieprzeciwne
        //prędkość początkowa == 0
        stroke('#000');
        ellipse(width / 4 + z, height / 2, sizeFirstBall * c_w, sizeFirstBall * c_w);
        ellipse(width * 5 / 8 + w, height / 2, sizeSecondBall * c_w, sizeSecondBall * c_w);

        t1 = Math.round(c_w * 1 / 4 - sizeFirstBall * c_w / 2);
        t2 = Math.round(c_w * 3 / 8 - sizeSecondBall * c_w / 2);

        //warunek końca animacji
        if (Math.round(z / vFirstBall) == -Math.round(t1 / vFirstBall) ||
            Math.round(z / vFirstBall) + 1 == -Math.round(t1 / vFirstBall) ||
            Math.round(z / vFirstBall) == -Math.round(t1 / vFirstBall) + 1) {
            z = 0;
            w = 0;
            moveSecond = false;
            if(weight1 == weight2){
                velocity1 = velocity2;
                velocity2 = 0;
            }
            noLoop();
        }
        if(Math.round(w / vSecondBall) == Math.round(t2 / vSecondBall)){
            z = 0;
            w = 0;
            moveSecond = false;
            if(weight1 == weight2){
                velocity1 = velocity2;
                velocity2 = 0;
            }
            noLoop();
        }

        if(abs(width * 1 / 4 + z + sizeFirstBall * c_w / 2 - (width * 5 / 8 - sizeSecondBall * c_w / 2)) <= 4 &&
            !moveSecond){
            moveSecond = true;
            velocity2 = findMoment(velocity1, weight1, weight2).toFixed(2);
            $('#velocity2').val(velocity2);
            if(weight1 == weight2){
                velocity2 = velocity1;
                velocity1 = 0;
                $('#velocity1').val(velocity1);
                $('#velocity2').val(velocity2);
            } else if(weight1 < weight2 && 2 * weight1 >= weight2){
                vSecondBall = vFirstBall;
                vFirstBall = hashVelocity(0);
            } else if(weight1 > weight2 && weight1 >= 2 * weight2){
                velocity2 = 2 *velocity1;
                $('#velocity1').val(velocity1);
                $('#velocity2').val(velocity2);
                vSecondBall = 2 * vFirstBall;
            }
        }
        if(moveSecond && weight1 >= 2 * weight2 && weight1 != weight2){
            w += vSecondBall;
            z += vFirstBall;
        } else if(moveSecond && 2 * weight1 <= weight2 && weight1 != weight2) {
            z -= vFirstBall;
        } else if(moveSecond && weight1 == weight2){
            w += vSecondBall;
        } else if(moveSecond && weight1 < weight2){
            w += vSecondBall;
            z += vFirstBall;
        }

        if(!moveSecond){
            z += vFirstBall;
        }

    } else if(resilient && start && !opposite && !startedVIsZero && weight1 == weight2){
        //prędkość początkowa jest RÓŻNA OD ZERA !!!
        //warunek konieczny to m1 == m2
        stroke('#000');
        ellipse(width / 10 + z, height / 2, sizeFirstBall * c_w, sizeFirstBall * c_w);
        ellipse(width * 5 / 10 + w, height / 2, sizeSecondBall * c_w, sizeSecondBall * c_w);

        t1 = Math.round(c_w * 1 / 4 - sizeFirstBall * c_w / 2);
        t2 = Math.round(c_w * 1 / 2 - sizeSecondBall * c_w / 2);

        if(abs(width * 1 / 10 + z + sizeFirstBall * c_w / 2 - (width * 5 / 10 - sizeSecondBall * c_w / 2 + w)) <= 4 &&
            !moveSecond){
            moveSecond = true;
            var pom = velocity1;
            velocity1 = velocity2;
            velocity2 = pom;
            $('#velocity1').val(velocity1);
            $('#velocity2').val(velocity2);
            vFirstBall = hashVelocity(velocity1);
            vSecondBall = hashVelocity(velocity2);
        }

        if (Math.round(z / vFirstBall) == -Math.round(t1 / vFirstBall) ||
            Math.round(z / vFirstBall) + 1 == -Math.round(t1 / vFirstBall) ||
            Math.round(z / vFirstBall) == -Math.round(t1 / vFirstBall) + 1) {
            z = 0;
            w = 0;
            moveSecond = false;
            [velocity1, velocity2] = [velocity2, velocity1];
            vFirstBall = hashVelocity(velocity1);
            vSecondBall = hashVelocity(velocity2);
            noLoop();
        }

        if(Math.round(w / vSecondBall) == Math.round(t2 / vSecondBall)){
            z = 0;
            w = 0;
            moveSecond = false;
            [velocity1, velocity2] = [velocity2, velocity1];
            vFirstBall = hashVelocity(velocity1);
            vSecondBall = hashVelocity(velocity2);
            noLoop();
        }

        z += vFirstBall;
        w += vSecondBall;

    } else if(resilient && start && opposite && !startedVIsZero){

        ellipse(width * 2 / 10 + z, height / 2, Math.round(sizeFirstBall * c_w), Math.round(sizeFirstBall * c_w));
        ellipse(width * 8 / 10 + w, height / 2, sizeSecondBall * c_w, sizeSecondBall * c_w);

        t1 = Math.round(c_w * 2 / 10 - sizeFirstBall * c_w / 2);
        t2 = Math.round(c_w * 2 / 10 - sizeSecondBall * c_w / 2);

        if(weight1 == weight2 && velocity1 == velocity2 ){
            if(Math.round(2 * t1 / vFirstBall) - Math.round(z / vFirstBall) <= 4 && reflection == false){
                reflection = true;
                [velocity1, velocity2] = [velocity2, velocity1];
                $('#velocity1').val(velocity1);
                $('#velocity2').val(velocity2);
            }
        } else {
            if(abs(width * 2 / 10 + z + sizeFirstBall * c_w / 2 - (width * 8 / 10 - sizeSecondBall * c_w / 2 + w)) <= 4 &&
                !reflection){
                reflection = true;
                [velocity1, velocity2] = [velocity2, velocity1];
                $('#velocity1').val(velocity1);
                $('#velocity2').val(velocity2);
            }
        }

        if (Math.round(z / vFirstBall + t1 / vFirstBall) <= 3 && reflection){
            z = 0;
            w = 0;
            reflection = false;
            noLoop();
        }

        if(abs(Math.round(w / vSecondBall) - Math.round(t2 / vSecondBall)) <= 3){
            z = 0;
            w = 0;
            reflection = false;
            noLoop();
        }

        if(reflection && velocity3 > 0){
            w += vThirdBall;
            z += vThirdBall;
        } else if(reflection && velocity3 < 0){
            w -= vThirdBall;
            z -= vThirdBall;
        } else if(reflection && weight1 == weight2 && velocity1 == velocity2){
            z -= vFirstBall;
            w += vSecondBall;
        } else if(reflection && weight1 == weight2 && velocity1 != velocity2){
            z -= vSecondBall;
            w += vFirstBall;
        } else {
            w -= vSecondBall;
            z += vFirstBall;
        }

    } else if(start && resilient && !opposite && !startedVIsZero){

        ellipse(width * 2 / 10 + z, height / 2, Math.round(sizeFirstBall * c_w), Math.round(sizeFirstBall * c_w));
        ellipse(width * 8 / 10 + w, height / 2, sizeSecondBall * c_w, sizeSecondBall * c_w);

        t1 = Math.round(c_w * 2 / 10 - sizeFirstBall * c_w / 2);
        t2 = Math.round(c_w * 2 / 10 - sizeSecondBall * c_w / 2);

        //warunek końca animacji
        if (Math.round(z / vFirstBall) == -Math.round(t1 / vFirstBall) ||
            Math.round(z / vFirstBall) + 1 == -Math.round(t1 / vFirstBall) ||
            Math.round(z / vFirstBall) == -Math.round(t1 / vFirstBall) + 1) {
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

        if(abs(width * 1 / 4 + z + sizeFirstBall * c_w / 2 - (width * 5 / 8 - sizeSecondBall * c_w / 2)) <= 4 &&
            !reflection){
            reflection = true;
        }

        if(!reflection) {
            z += vFirstBall;
            w -= vSecondBall;
        }

    } else if(!resilient && start) {
        //niesprezyste
        fill(c2);
        noStroke();
        ellipse(width / 4 + z + r, height / 2, sizeFirstBall * c_w, sizeFirstBall * c_w);
        ellipse(width * 5 / 8 + r, height / 2, sizeSecondBall * c_w, sizeSecondBall * c_w);

        t1 = Math.round(c_w * 3 / 4 - sizeFirstBall * c_w / 2);
        t2 = Math.round(c_w * 3 / 8 - sizeSecondBall * c_w / 2);

        //warunek końca animacji
        if (Math.round(z / vFirstBall) == Math.round(t1 / vFirstBall)) {
            z = 0;
            r = 0;
            moveTogether = false;
            noLoop();
        }
        if(Math.round(r / vThirdBall) == Math.round(t2 / vThirdBall)){
            z = 0;
            r = 0;
            moveTogether = false;
            noLoop();
        }

        if(Math.round(width * 1 / 4 + z) == Math.round(width * 5 / 8 - sizeSecondBall * c_w / 2) ||
            Math.round(width * 1 / 4 + z) + 1 == Math.round(width * 5 / 8 - sizeFirstBall * c_w / 2) ||
            Math.round(width * 1 / 4 + z) == Math.round(width * 5 / 8 - sizeSecondBall * c_w / 2) + 1 &&
            !moveTogether){
            moveTogether = true;
            velocity2 = findMoment(velocity1, weight1, weight1 + weight2);
            vThirdBall = hashVelocity(velocity2);
            $('#velocity2').val(velocity2);
        }

        if(!moveTogether){
            z += vFirstBall;
        } else {
            r += vThirdBall;
        }
    }
}

function windowResized(){
    afterLoad();
    resizeCanvas(c_w, c_h);
    background(230);
    actualVNS();
    z = 0;
    w = 0;
    r = 0;
    start = false;
    loop();
}

function findMoment(x1, x2, x3){
    //funkcja do znajdowania brakującej wartości
    // x1 * x2 / x3
    // x1 * x2 = x3 * Y
    return x1 * x2 / x3;
}


function hashVelocity(v){
    //funkcja haszująca prędkości kulek
    //przedział wartości po zahaszowaniu: 0.8 - 8.0
    v = Math.round(v);
    const velocityValuesArray = new Array(101);
    velocityValuesArray[0] = 0.8;
    var t = 0.8;
    for(var i = 1; i < 100; i++){
        velocityValuesArray[i] = parseFloat(t.toFixed(2));
        t += (8.0 - 0.8) / 100;
    }
    velocityValuesArray[100] = 8.0;

    if(v >= 100){
        return velocityValuesArray[100];
    }
    return velocityValuesArray[v];
}

function hashSize(w){
    //funkcja haszująca wielkości kulek
    //przedział wartości po zahaszowaniu: 0.04 - 0.33
    const weightValuesArray = new Array(51);
    weightValuesArray[0] = 0.04;
    var t = 0.04;
    for(var i = 1; i < 50; i++){
        weightValuesArray[i] = parseFloat(t.toFixed(2));
        t += (0.33 - 0.04) / 50;
    }
    weightValuesArray[50] = 0.33;

    if(w >= 50){
        return weightValuesArray[100];
    }
    return weightValuesArray[w];
}

//funkcje onclick do buttonów na stopce

function playAnimation(){
    start = true;
}

function pauseAnimation(){
    start = false;
    $('#wButton2')[0].disabled = false;
    $('#weight2')[0].disabled = false;
}

function restartAnimation(){
    start = false;
    reflection = false;
    moveTogether = false;

    windowResized();
    if(!moveSecond){
        velocity2 = 0;
    }

    $('#velocity1').val(velocity1);
    $('#velocity2').val(velocity2);
}

function deleteValue(){
    $('#velocity1').val("");
    $('#velocity2').val("");
    $('#weight1').val("");
    $('#weight2').val("");
    $('#velocity3').val("");
    velocity1 = 0;
    velocity2 = 0;
    weight1 = 0;
    weight2 = 0;
    velocity3 = 0;
}