await Canvas(0, 0, 400, 500);
world.gravity.y = 9.8;

let ground = new Group();
ground.physics = STATIC;
ground.d = 24;
ground.img = '🟫';
ground.tile = '=';
ground.bounciness = 0;

let coins = new Group();
coins.physics = STATIC;
coins.d = 24;
coins.img = '🟡';
coins.tile = 'o';

let tiles = [
	'...............o.............o........oo...........o...o..................',
	'=========================================================================='
];

let level1 = new Group();
level1.addTiles(tiles, -900, height/2-50, 28, 28);

let ladybug = new Sprite();
ladybug.diameter = 50;
ladybug.img = '🐞';
ladybug.rotationLock = true;
ladybug.friction = 0.1;
ladybug.bounciness = 0;


q5.update = function move() {
	background('skyblue');

	if (ladybug.colliding(level1)) {
		if (kb.presses('up')) {
			ladybug.vel= [1,-7];
		}
	}
	if (kb.presses('right')) {
		ladybug.direction = 0;
		ladybug.vel.x = 5;
	}
	else if (kb.presses('left')) {
		ladybug.direction = 180;
		ladybug.vel.x = -5;
	}

	let touchedCoins = ladybug.overlaps(coins);


	if (touchedCoins) {
		touchedCoins.remove();
	}
};

