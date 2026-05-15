await Canvas();
world.gravity.y = 9.8;

let ladybug = new Sprite();
ladybug.diameter = 50;
ladybug.img = '🤪';

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

