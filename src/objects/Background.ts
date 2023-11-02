export default class Background {
    images: Phaser.GameObjects.Image[];
    speed: number;
  
    constructor(scene: Phaser.Scene, key: string, speed: number) {
      this.images = [
        scene.add.image(0, 0, key).setOrigin(0, 0),
        scene.add.image(0, 0, key).setOrigin(0, 0)
      ];
  
      // Set the x-position of the second image to the right edge of the first image
      this.images[1].x = this.images[0].width;

      // Set the speed at which the background moves
      this.speed = speed;
    }
  
    update() {
      // Move the background images to the left
      for (let i = 0; i < this.images.length; i++) {
        this.images[i].x -= this.speed;
  
        // Repeat the image when it goes off the screen
        if (this.images[i].x + this.images[i].width <= 0) {
          this.images[i].x = this.images[(i + 1) % 2].x + this.images[(i + 1) % 2].width;
        }
      }
    }
  }