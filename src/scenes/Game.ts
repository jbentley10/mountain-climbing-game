import Phaser from 'phaser';
import Player from '../objects/Player';
import Background from '../objects/Background';

export default class Demo extends Phaser.Scene {
  player: Player;
  backgrounds: { [key: string]: Background };
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  preload() {
    this.load.image('clouds_bg', 'assets/backgrounds/clouds_bg.png');
    this.load.image('clouds_mg_1', 'assets/backgrounds/clouds_mg_1.png');
    this.load.image('clouds_mg_2', 'assets/backgrounds/clouds_mg_2.png');
    this.load.image('clouds_mg_3', 'assets/backgrounds/clouds_mg_3.png');
    this.load.image('glacial_mountains', 'assets/backgrounds/glacial_mountains.png');
    this.load.spritesheet('player-run', 'assets/player/player-run.png', {
      frameWidth: 48,
      frameHeight: 48
    });
    this.load.spritesheet('player-jump', 'assets/player/player-jump.png', {
      frameWidth: 48,
      frameHeight: 48
    });
  }

  create() {
    // Add the background images
    // Create two instances of each background image
    this.backgrounds = {
      clouds_bg: new Background(this, 'clouds_bg'),
      glacial_mountains: new Background(this, 'glacial_mountains'),
      clouds_mg_1: new Background(this, 'clouds_mg_1'),
      clouds_mg_2: new Background(this, 'clouds_mg_2'),
      clouds_mg_3: new Background(this, 'clouds_mg_3')
    };

    // Initialize the cursors object
    this.cursors = this.input.keyboard.createCursorKeys();

    // Add the player
    this.player = new Player(this, 100, 200, this.cursors);
  }
  
  update() {
    // Update the player
    this.player.update();

    // Update the backgrounds
    for (let key in this.backgrounds) {
      let speed = key === 'glacial_mountains' ? 2 : 1; // Move glacial_mountains faster
      this.backgrounds[key].update(speed);
    }
  }
}
