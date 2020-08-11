function setup() {
    myCanvas = createCanvas(593, 598);
    myCanvas.parent('skrypt_upadek');
    img = loadImage('img/wykres_kwadratowy.jpg');
    frameRate(30);
    beginShape();
    noFill();
}
function draw() {
    background(img);
}