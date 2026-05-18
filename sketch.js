await Canvas();
world.gravity.y = 9.8;

let ground = new Group();
ground.physics = STATIC;
ground.d = 24;
ground.img = '🟫';
ground.tile = '=';

let coins = new Group();
coins.physics = STATIC;
coins.d = 24;
coins.img = '🟡';
coins.tile = 'o';

let tiles = [
'..........========......
=================================='
];

let platforms = new Group();
platforms.addTiles(tiles, -54, -99, 28, 28);

let ladybug = new Sprite();
ladybug.diameter = 50;
ladybug.img = '🐞';

let groundA = new Sprite();
groundA.x = -120;
groundA.y = 200;
groundA.width = 500;
groundA.rotation = 0;
groundA.physics = STATIC;

q5.update = function move() {
	background('skyblue');

	if (kb.pressing('up')) ladybug.vel.y = -4;
	else if (kb.pressing('right')) ladybug.direction = 0;
	else if (kb.pressing('left')) ladybug.direction = 180;
	
};

