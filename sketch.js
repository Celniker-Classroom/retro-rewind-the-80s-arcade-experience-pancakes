await Canvas();
world.gravity.y = 17;
textFont('Comic Sans MS');

const BASE_HALF_W = 700;
const BASE_HALF_H = 600;
const UI_Y_SHIFT = -120;
const INSPIRATION_PAGE_SCALE = 1.06;

let discoBallImg = await loadImage('assets/discoBall.png');

// Calculated the positions of the Disco and the text 
let winDiscoX = BASE_HALF_W - 700;
let winDiscoY = BASE_HALF_H - 600 + UI_Y_SHIFT;
let winDiscoWidth = 260;
let winDiscoHeight = 260;
let winResetTextX = BASE_HALF_W - 700;
let winResetTextY = BASE_HALF_H - 750 + UI_Y_SHIFT;

//physics for the ground (img 1)
let ground1 = new Group();
ground1.physics = STATIC;
ground1.d = 24;
ground1.img = 'assets/tiles (1).png';
ground1.tile = '=';
ground1.bounciness = 0;

//physics for the ground (img 2)
let ground2 = new Group();
ground2.physics = STATIC;
ground2.d = 24;
ground2.img = 'assets/tiles (2).png';
ground2.tile = 'x';
ground2.bounciness = 0;

//physics for the ground (img 3)
let ground3 = new Group();
ground3.physics = STATIC;
ground3.d = 24;
ground3.img = 'assets/tiles (3).png';
ground3.tile = '*';
ground3.bounciness = 0;

//coins physics and properties
let coins = new Group();
coins.physics = STATIC;
coins.d = 24;
coins.img = 'assets/gold.png';
coins.tile = 'o';


let tiles = [
    '............................o......................o...................................................................................o.o..........',
    '...........................*xx**...............xx**xx*............................o...................................oo.............xx*x*xxx..............',
    '................................................................................x**xxx.......................***xxx**xxxxxx**xx..........',
   '.......................o................o.......................o.....x*xx*xx..........................oo..........................................o..',
    '...................*xxx**............xx***x...............xxxxxxx*x................................***x*xx***.....................................x**xx**..',
    '.................................................................................................................................',
    '........................................................................................................................................................',
    '...............o.........................................o.....o........................o....................oo.................................................o',
   '==x=**==x=xx===**===x**=====*==*==xx======xxx*=.....=====xx**==*==x=**===x====xx==x=x=**===x=**==.xxx==.===**.==***=========.....xxxx...xx..xxxxxxxxx==**=x*==x*=====*x=====xx**====*=x==**=x======***====xx===',
   '................................................................................................................',
    '................................................................................................................',
'................................................................................................................',
'................................................................................................................',
   'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
];

//game entries
let level1 = new Group();
level1.addTiles(tiles, -900, height/2-400, 40, 40);
let count = 0;
const maxJumps = 1;
let jumpsUsed = 0;
let gameEnded = false;
let showInstructions = false;
let showIntro = true;
let showTextPage = false;
const infoPageYOffset = -100;

//buttons for the intro and instructions pages
let instructionsButton = { x: BASE_HALF_W - 900, y: BASE_HALF_H - 500 + UI_Y_SHIFT, w: 440, h: 80 };
let textPageButton = { x: BASE_HALF_W - 900, y: BASE_HALF_H - 400 + UI_Y_SHIFT, w: 440, h: 80 };
let introBackButton = { x: BASE_HALF_W - 900, y: BASE_HALF_H - 20 + infoPageYOffset + UI_Y_SHIFT, w: 440, h: 80 };
background('skyblue');

//ladybug sprite 
let ladybug = new Sprite();
ladybug.diameter = 75;
ladybug.rotationLock = true;
ladybug.friction = 0;
ladybug.bounciness = 0;

ladybug.addAnis('assets/ladybug.png', '178x109',{
    run: { row: 0, frames: 1},
    happy: { row: 1, frames: 1 },
    won: {row: 1, frames: 2},
    sad: { row: 2, frames: 1 }
})
ladybug.changeAni('run');

function resetGame() {
    // Reload to restore coins/tiles and restart from the beginning.
    location.reload();
}

function setGameSpritesVisible(visible) {
    for (let s of allSprites) {
        s.visible = visible;
    }

    // Keep barrier hidden when returning to gameplay.
    if (typeof barrier !== 'undefined' && barrier) {
        barrier.visible = false;
    }
}

function openIntro() {
    showIntro = true;
    showInstructions = false;
    showTextPage = false;
    setGameSpritesVisible(false);
}

function openInstructions() {
    showIntro = false;
    showInstructions = true;
    showTextPage = false;
    setGameSpritesVisible(false);
}

function openTextPage() {
    showIntro = false;
    showInstructions = false;
    showTextPage = true;
    setGameSpritesVisible(false);
}

function openGame() {
    showIntro = false;
    showInstructions = false;
    showTextPage = false;
    setGameSpritesVisible(true);
}

// Open on intro screen when the page first loads.
openIntro();

function drawCloud(x, y, s = 1) {
    noStroke();
    fill(255, 255, 255, 230);
    ellipse(x - 30 * s, y, 55 * s, 40 * s);
    ellipse(x + 15 * s, y - 10 * s, 70 * s, 50 * s);
    ellipse(x + 55 * s, y, 55 * s, 40 * s);
}

function drawGameplaySky() {
    background('#75c8ff');


    camera.off();
    drawCloud(width * -0.4, -120, 1.4);
    drawCloud(width * -.15, -180, 1.1);
    drawCloud(width * .1, -160, 1.5);
    drawCloud(width * .4, -220, 1.0);
    camera.on();
}

function getUIScale() {
    return min(width / (BASE_HALF_W * 2), height / (BASE_HALF_H * 2), 1);
}

function isMouseInsideButton(button, scaleFactor = getUIScale()) {
    const scaledMouseX = mouse.x / scaleFactor;
    const scaledMouseY = mouse.y / scaleFactor;

    return (
        scaledMouseX >= button.x &&
        scaledMouseX <= button.x + button.w &&
        scaledMouseY >= button.y &&
        scaledMouseY <= button.y + button.h
    );
}

q5.update = function move() {
    if (showIntro) {
        if (kb.presses('1')) openInstructions();
        if (kb.presses('2')) openTextPage();
        if (kb.presses('enter')) openGame();

        if (typeof mouse !== 'undefined' && mouse.presses && mouse.presses()) {
            if (isMouseInsideButton(instructionsButton)) {
                openInstructions();
            }

            if (isMouseInsideButton(textPageButton)) {
                openTextPage();
            }
        }

        return;
    }

    if (showInstructions) {
        if (kb.presses('q')) openIntro();
        if (kb.presses('enter')) openGame();
        if (typeof mouse !== 'undefined' && mouse.presses && mouse.presses() && isMouseInsideButton(introBackButton)) {
            openIntro();
        }

        ladybug.vel.x = 0;
        ladybug.vel.y = 0;
        return;
    }

    if (showTextPage) {
        if (kb.presses('q')) openIntro();
        if (kb.presses('enter')) openGame();
        if (typeof mouse !== 'undefined' && mouse.presses && mouse.presses() && isMouseInsideButton(introBackButton, getUIScale() * INSPIRATION_PAGE_SCALE)) {
            openIntro();
        }
        return;
    }

    if (kb.presses('q')) {
        openIntro();
        return;
    }

    drawGameplaySky();

    if (gameEnded && count >= 20) {
        if (kb.presses('enter')) {
            resetGame();
        }
        return;
    }

    if (typeof barrier !== 'undefined' && barrier && ladybug.colliding(barrier)) {
        resetGame();
        return;
    }

    if (ladybug.colliding(ground1) || ladybug.colliding(ground2) || ladybug.colliding(ground3)) {
        jumpsUsed = 0;
    }

    if (kb.presses('up') && jumpsUsed < maxJumps) {
        ladybug.vel.y = -8;
        jumpsUsed += 1;
        ladybug.changeAni('run');
    }
    if (ladybug.colliding(ground1) || ladybug.colliding(ground2) || ladybug.colliding(ground3)) {
        if (kb.pressing('right')) {
       ladybug.direction = 0;
       ladybug.scale.x = 1;
       ladybug.vel.x = 7;
       ladybug.changeAni('run');
            if (kb.presses('up') && jumpsUsed < maxJumps) {
            ladybug.vel.y = -7;
            jumpsUsed += 1;
            ladybug.changeAni('run');
            }
        }
        else if (kb.pressing('left')) {
       ladybug.direction = 180;
        ladybug.scale.x = -1;
       ladybug.vel.x = -5;
       ladybug.changeAni('run');
            if (kb.presses('up') && jumpsUsed < maxJumps) {
                ladybug.vel.y = -7;
                jumpsUsed += 1;
                ladybug.changeAni('run');
            }
        }
   }

 ladybug.overlap(coins, (player, coins) => {
       coins.delete();
       count += 1;
       ladybug.changeAni('happy');
   });

   if (count >= 20) {
       gameEnded = true;
       ladybug.changeAni('happy');
       ladybug.vel.x = 0;
       ladybug.vel.y = 0;
   }

   camera.x = ladybug.x;
};

q5.draw = function() {
    camera.off();
    const uiScale = getUIScale();

    if (showIntro) {
        background('#dc0d4b');
        push();
        scale(uiScale);
        fill('white');
        stroke('black');
        strokeWeight(4);
        textAlign(CENTER, CENTER);

        textSize(98);
        text('Ladybug Disco', 0, -250 + UI_Y_SHIFT);

        fill('#ffffff');
        rect(instructionsButton.x, instructionsButton.y, instructionsButton.w, instructionsButton.h, 16);
        fill('#ffffff');
        rect(textPageButton.x, textPageButton.y, textPageButton.w, textPageButton.h, 16);

        fill('black');
        noStroke();
        textSize(46);
        text('Instructions (1)', instructionsButton.x + instructionsButton.w / 2, instructionsButton.y + instructionsButton.h / 2);
        text('Inspiration (2)', textPageButton.x + textPageButton.w / 2, textPageButton.y + textPageButton.h / 2);

        fill('white');
        textSize(36);
        text('Press ENTER to start game', 0, -70 + UI_Y_SHIFT);

        pop();
        camera.on();
        return;
    }

    if (showInstructions) {
        background('#3a8edb');
        push();
        scale(uiScale);
        fill('white');
        stroke('black');
        strokeWeight(3);
        textAlign(CENTER, CENTER);

        textSize(72);
            text('HOW TO PLAY', BASE_HALF_W - 700, BASE_HALF_H - 630 + infoPageYOffset + UI_Y_SHIFT);

                textSize(34);
            text('Move: LEFT and RIGHT arrows', BASE_HALF_W - 700, BASE_HALF_H - 500 + infoPageYOffset + UI_Y_SHIFT);
            text('Jump: UP arrow', BASE_HALF_W - 700, BASE_HALF_H - 450 + infoPageYOffset + UI_Y_SHIFT);
            text('Collect all 20 coins to win and go to the disco', BASE_HALF_W - 700, BASE_HALF_H - 400 + infoPageYOffset + UI_Y_SHIFT);
            text('Press Q to view instructions at any time', BASE_HALF_W - 700, BASE_HALF_H - 350 + infoPageYOffset + UI_Y_SHIFT);
            text('Press Q to go back to gameplay', BASE_HALF_W - 700, BASE_HALF_H - 300 + infoPageYOffset + UI_Y_SHIFT);
            text('Refresh the page to restart', BASE_HALF_W - 700, BASE_HALF_H - 250 + infoPageYOffset + UI_Y_SHIFT);

                textSize(30);
            text('Click below to return to the intro page', BASE_HALF_W - 700, BASE_HALF_H - 90 + infoPageYOffset + UI_Y_SHIFT);

        fill('#ffffff');
        rect(introBackButton.x, introBackButton.y, introBackButton.w, introBackButton.h, 16);
        fill('black');
        noStroke();
        textSize(34);
        text('Back to Intro Page', introBackButton.x + introBackButton.w / 2, introBackButton.y + introBackButton.h / 2);

        pop();
        camera.on();
        return;
    }

    if (showTextPage) {
        background('#0f5b9e');
        push();
        scale(uiScale * INSPIRATION_PAGE_SCALE);
        fill('white');
        stroke('black');
        strokeWeight(3);
        textAlign(CENTER, CENTER);


         textSize(64);
            text('Our Inspiration for Ladybug Disco', BASE_HALF_W - 700, BASE_HALF_H - 650 + infoPageYOffset + UI_Y_SHIFT);

                textSize(21);
            text('Our game, Ladybug Disco, was inspired by both Adventure Island and Pacman. The ladybug, like Master Higgins', BASE_HALF_W - 700, BASE_HALF_H - 550 + infoPageYOffset + UI_Y_SHIFT);
            text('from Adventure Island, must traverse through obstacles by using keyboard keys to jump and move forward.', BASE_HALF_W - 700, BASE_HALF_H - 510 + infoPageYOffset + UI_Y_SHIFT);
            text(' Additionally, we were motivated by the coin collection mechanism of Pacman. The ladybug must first collect', BASE_HALF_W - 700, BASE_HALF_H - 470 + infoPageYOffset + UI_Y_SHIFT);
            text('all the coins before moving on towards the disco, similarly in Pacman, it must collect all the coins before', BASE_HALF_W - 700, BASE_HALF_H - 430 + infoPageYOffset + UI_Y_SHIFT);
            text('moving towards the next level. Both games inspired the mechanisms ingrained in the code of Ladybug Disco, ', BASE_HALF_W - 700, BASE_HALF_H - 390 + infoPageYOffset + UI_Y_SHIFT);
            text('however, we added unique sprites and a special theme to cultivate the final product.', BASE_HALF_W - 700, BASE_HALF_H - 350 + infoPageYOffset + UI_Y_SHIFT);

                textSize(30);
            text('Click below to return to the intro page', BASE_HALF_W - 700, BASE_HALF_H - 100 + infoPageYOffset + UI_Y_SHIFT);

        fill('#ffffff');
        rect(introBackButton.x, introBackButton.y, introBackButton.w, introBackButton.h, 16);
        fill('black');
        noStroke();
        textSize(34);
        text('Back to Intro Page', introBackButton.x + introBackButton.w / 2, introBackButton.y + introBackButton.h / 2);

        pop();
        camera.on();
        return;
    }
    
    if (gameEnded && count >= 20) {
        let colors = ['red', 'pastel yellow', 'green', 'blue', 'pink'];
    let i = floor(frameCount / 20) % colors.length;
    background(colors[i]);
    push();
    scale(uiScale);
    ladybug.changeAni('won');

        let discoFrame = floor(frameCount / 12) % 2;
        let frameW = discoBallImg.width / 2;
        let frameH = discoBallImg.height;
        let srcX = discoFrame * frameW;

        image(discoBallImg, winDiscoX, winDiscoY, winDiscoWidth, winDiscoHeight, srcX, 0, frameW, frameH);
    

    stroke('black');
    strokeWeight(4);
    textSize(80);
    textAlign(CENTER, CENTER);
    text("YOU WIN! 🎉", BASE_HALF_W - 650, BASE_HALF_H - 400 + UI_Y_SHIFT, 800, 600);

    fill('white');
    textSize(32);
    text("Press ENTER to reset", winResetTextX, winResetTextY);
    pop();
}

    fill('gold');
    stroke('black');
    strokeWeight(4);
    textSize(50);
    textAlign(LEFT, TOP);
    text("Coins: " + count + "/20", 200, -300);
    
    camera.on();
}