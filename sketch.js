await Canvas();
world.gravity.y = 9.8;


let ground = new Group();
ground.physics = STATIC;
ground.d = 24;
ground.img = 'assets/tiles.png';
ground.tile = '=';
ground.bounciness = 0;


let coins = new Group();
coins.physics = STATIC;
coins.d = 24;
coins.img = 'assets/gold.png';
coins.tile = 'o';


let tiles = [
   '...............o.............o........oo...........o...o..................',
   '=========================================================================='
];


let level1 = new Group();
level1.addTiles(tiles, -900, height/2-50, 40, 40);
let count = 0;


//ground.addTiles(tiles, -900, height/2-50, 40, 40);
//coins.addTiles(tiles, -900, height/2-50, 40, 40);


let ladybug = new Sprite();
ladybug.diameter = 75;
ladybug.rotationLock = true;
ladybug.friction = 0;
ladybug.bounciness = 0;

ladybug.addAnis('assets/ladybug.png', '177x109',{
    run: { row: 0, frames: 1},
    happy: { row: 1, frames: 2, frameRate: 0.5 },
    sad: { row: 2, frames: 1, frameRate: 0.5 }
})
ladybug.changeAni('run');

q5.update = function move() {
   background('skyblue');


   if (ladybug.colliding(level1)) {
       if (kb.presses('up')) {
           ladybug.vel= [1,-7];
           ladybug.changeAni('run');
       }
   }
   if (kb.presses('right')) {
       ladybug.direction = 0;
       ladybug.vel.x = 5;
       ladybug.changeAni('run');
   }
   else if (kb.presses('left')) {
       ladybug.direction = 180;
       ladybug.vel.x = -5;
       ladybug.changeAni('run');
   }


   ladybug.overlap(coins, (player, coins) => {
       coins.delete();
       count += 1;
       ladybug.changeAni('happy');
   });
};

