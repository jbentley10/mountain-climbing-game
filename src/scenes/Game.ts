import Phaser from 'phaser';

let cursors;
let player;

export default class Demo extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  preload() {
    this.load.image('background', 'assets/backgrounds/glacial_mountains.png');
    this.load.spritesheet('player', 'assets/player/player-run.png', {
      frameWidth: 32,
      frameHeight: 48
    });
  }

  create() {
    // Add the background image
    this.add.image(0, 0, 'background').setOrigin(0, 0);

    // Add the player sprite
    player = this.physics.add.sprite(100, 450, 'player');
    player.setCollideWorldBounds(true);

    // Create the player animation
    this.anims.create({
      key: 'run',
      frames: this.anims.generateFrameNumbers('player', { start: 0, end: 7 }),
      frameRate: 10,
      repeat: -1
    });

    // Set up the player controls
    cursors = this.input.keyboard.createCursorKeys();
  }
  
  update() {
    // Move the player left and right
    cursors.left.on('down', () => {
      player.setVelocityX(-160);
      player.anims.play('run', true);
      player.flipX = true;
    });
    cursors.right.on('down', () => {
      player.setVelocityX(160);
      player.anims.play('run', true);
      player.flipX = false;
    });
    cursors.left.on('up', () => {
      player.setVelocityX(0);
      player.anims.stop('run');
      player.setTexture('player', 0);
    });
    cursors.right.on('up', () => {
      player.setVelocityX(0);
      player.anims.stop('run');
      player.setTexture('player', 0);
    });
  }
}
