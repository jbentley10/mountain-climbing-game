import Phaser from 'phaser';
import Player from '../objects/Player';
import Background from '../objects/Background';
import Obstacle from '../objects/Obstacle';

export default class Game extends Phaser.Scene {
  player: Player;
  backgrounds: { [key: string]: Background };
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  ground: Phaser.Physics.Arcade.StaticGroup;
  pauseButton: Phaser.GameObjects.Sprite;
  isPaused: boolean;
  originalBackgroundSpeeds: { [key: string]: number };
  debugText: Phaser.GameObjects.Text;
  obstacles: Phaser.Physics.Arcade.Group;
  gameOverText: Phaser.GameObjects.Text;

  preload() {
    // Load backgrounds
    this.load.image('clouds_mg_3', 'assets/backgrounds/clouds_mg_3.png');
    this.load.image('clouds_mg_2', 'assets/backgrounds/clouds_mg_2.png');
    this.load.image('clouds_mg_1', 'assets/backgrounds/clouds_mg_1.png');
    this.load.image('clouds_bg', 'assets/backgrounds/clouds_bg.png');
    this.load.image('glacial_mountains', 'assets/backgrounds/glacial_mountains.png');
    // Load the obstacle
    this.load.image('obstacle', 'assets/obstacle.png');
    // Load the ground
    this.load.image('ground', 'assets/ground.png');
    // Load the player
    this.load.spritesheet('player-run', 'assets/player/player-run.png', {
      frameWidth: 48,
      frameHeight: 48
    });
    this.load.spritesheet('player-jump', 'assets/player/player-jump.png', {
      frameWidth: 48,
      frameHeight: 48
    });
    // Load the pause button
    this.load.image('pause-button', 'assets/pause-button.png');
  }

  create() {
    // Add the background images
    // Create two instances of each background image
    this.backgrounds = {
      clouds_bg: new Background(this, 'clouds_bg', 1),
      glacial_mountains: new Background(this, 'glacial_mountains', 2),
      clouds_mg_3: new Background(this, 'clouds_mg_3', 2),
      clouds_mg_2: new Background(this, 'clouds_mg_2', 3),
      clouds_mg_1: new Background(this, 'clouds_mg_1', 4)
    };

    // Store the original speeds of the backgrounds
    this.originalBackgroundSpeeds = {};
    for (let key in this.backgrounds) {
      this.originalBackgroundSpeeds[key] = this.backgrounds[key].speed;
    }

    // Initialize the cursors object
    this.cursors = this.input.keyboard.createCursorKeys();

    // Create the ground sprites
    this.ground = this.physics.add.staticGroup();
    this.ground.create(400, 586, 'ground').setScale(2).refreshBody();
    this.ground.create(400 + this.ground.children.entries[0].width, 586, 'ground').setScale(2).refreshBody();

    // Add the player
    this.player = new Player(this, 100, 550, this.cursors);

    // Add a collider between the player and the ground
    this.physics.add.collider(this.player.sprite, this.ground);

    // Create the obstacles group
    this.obstacles = this.physics.add.group();

    // Create the "Game Over" text
    this.gameOverText = this.add.text(400, 300, 'Game Over', { fontSize: '32px', color: '#ff0000' }).setOrigin(0.5);
    this.gameOverText.visible = false;

    // Initialize the paused state
    this.isPaused = false;

    // Create the pause button
    this.pauseButton = this.add.sprite(this.cameras.main.width - 40, 40, 'pause-button');
    this.pauseButton.setInteractive();

    // Add a click event to the pause button
    this.pauseButton.on('pointerdown', () => {
      this.isPaused = !this.isPaused;
    
      if (this.isPaused) {
        // Pause the game
        this.physics.pause();
        this.player.sprite.setVelocity(0);
        // Stop player animations
        this.player.sprite.anims.stop();
        // Update the backgrounds
        for (let key in this.backgrounds) {
          this.backgrounds[key].speed = 0;
        }
      } else {
        // Resume the game
        this.physics.resume();
        // Resume other game objects...
        // Resume the backgrounds
        for (let key in this.backgrounds) {
          this.backgrounds[key].speed = this.originalBackgroundSpeeds[key];
        }
      }
    });

    // Create the debug text
    this.debugText = this.add.text(10, 10, '', { color: '#00ff00' });

    // Spawn a new obstacle every 2 seconds
    this.time.addEvent({
      delay: 2000,
      callback: this.spawnObstacle,
      callbackScope: this,
      loop: true
    });
  }

  spawnObstacle() {
    // Create a new obstacle at the right edge of the screen
    const obstacle = new Obstacle(this, 800, 550, 1);
    this.obstacles.add(obstacle.sprite);

    // End the game when the player collides with an obstacle
    this.physics.add.collider(this.player.sprite, obstacle.sprite, this.endGame, null, this);
    // Add a collider for the obstacle and the ground
    this.physics.add.collider(obstacle.sprite, this.ground);
    // Make the obstacle move to the left once it touches the ground
    
  }

  update() {
    // Update the player
    this.player.update();

    // Update the backgrounds
    for (let key in this.backgrounds) {
      this.backgrounds[key].update();
    }

    // Move the ground sprites to the left
    this.ground.children.iterate((child) => {
      child.x -= 3; // Ground speed

      // Repeat the sprite when it goes off the screen
      if (child.x < -child.width) {
        child.x += child.width * 2;
      }
    });

    // Update the obstacles
    Phaser.Actions.Call(this.obstacles.getChildren(), function(obstacle: any) {
      obstacle.update();
    }, this);

    // Update the debug text
    this.debugText.setText([
      `Player Velocity X: ${this.player.sprite.body.velocity.x}`,
      `Player Velocity Y: ${this.player.sprite.body.velocity.y}`,
      // Add more debug information here...
    ]);
  }

  endGame() {
    // Stop the game
    this.physics.pause();
    this.player.sprite.anims.stop();
    // Stop other game objects...

    // Show the "Game Over" text
    this.gameOverText.visible = true;
  }
}
