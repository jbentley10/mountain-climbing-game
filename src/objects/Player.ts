export default class Player {
	sprite: Phaser.Physics.Arcade.Sprite;
	cursors: Phaser.Types.Input.Keyboard.CursorKeys;

	constructor(scene: Phaser.Scene, x: number, y: number, cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
		this.sprite = scene.physics.add.sprite(x, y, 'player-run');
		this.sprite.setCollideWorldBounds(true);
		this.cursors = cursors;

		// Create the player animations
		// RUN
		scene.anims.create({
			key: 'run',
			frames: scene.anims.generateFrameNumbers('player-run', { start: 0, end: 7 }),
			frameRate: 10,
			repeat: -1
		});

		// JUMP
		scene.anims.create({
			key: 'jump',
			frames: scene.anims.generateFrameNumbers('player-jump', { start: 0, end: 2 }),
			frameRate: 10,
			repeat: 1
		});
	}

	update() {
		// Make the player run in place
		this.sprite.setVelocityX(0);

		// Only play the sprite run animation while y velocity is at 0
		if (this.sprite.body.velocity.y === 0 && this.sprite.body.touching.down) {
			this.sprite.anims.play('run', true);
		}

		// Check for jump input
		if (Phaser.Input.Keyboard.JustDown(this.cursors.space) && this.sprite.body.touching.down) {
			this.sprite.setVelocityY(-150); // Adjust the value as needed
			this.sprite.anims.stop();
			this.sprite.anims.play('jump', true);
		}
	}
}