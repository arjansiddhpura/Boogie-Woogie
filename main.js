function setup() {
    createCanvas(windowWidth, windowHeight - 15);
    randomSeed(int(random(10000000)));
    victory = new Canvas(width / 2, height / 2);
    victory.setup();
    frameRate(60);
}

function draw() {
    victory.grow();
    victory.draw(false);
}