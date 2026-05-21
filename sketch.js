await Canvas(0, 0, 400, 500);
world.gravity.y = 9.8;

const coinImagePath = 'assets/coin.png';
let coinImage = null;

if (typeof loadImage === 'function') {
	try {
		let loaded = loadImage(coinImagePath);
		if (loaded && typeof loaded.then === 'function') {
			loaded.then((img) => {
				coinImage = img;
			}).catch(() => {
				coinImage = null;
			});
		} else {
			coinImage = loaded || null;
		}
	} catch (error) {
		coinImage = null;
	}
}

let ground = new Group();
ground.physics = STATIC;
ground.d = 24;
ground.img = '🟫';
ground.tile = '=';
ground.bounciness = 0;

let tiles = [
	'..........................................................................',
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

const coinPickupRadius = 20;
const coinStepX = 180;


q5.update = function move() {
	background('skyblue');

	if (coin.visible) {
		if (coinImage && typeof image === 'function') {
			imageMode(CENTER);
			image(coinImage, coin.x, coin.y, coin.size, coin.size);
		} else {
			stroke('#8a6b00');
			strokeWeight(2);
			fill('#ffd54a');
			circle(coin.x, coin.y, coin.size);
		}
	}

	if (ladybug.colliding(level1)) {
		if (kb.presses('up')) {
			ladybug.vel.y = -7;
		}
	}
	if (kb.pressing('right')) {
		ladybug.direction = 0;
		ladybug.vel.x = 5;
	}
	else if (kb.pressing('left')) {
		ladybug.direction = 180;
		ladybug.vel.x = -5;
	}

	if (coin.visible) {
		let distanceToCoin = dist(ladybug.x, ladybug.y, coin.x, coin.y);
		if (distanceToCoin <= coinPickupRadius) {
			coin.x += coinStepX;
			coin.y = random(120, 220);
			
		}
	}
};

