export default class Background {
    images: Phaser.GameObjects.Image[];
  
    constructor(scene: Phaser.Scene, key: string) {
      this.images = [
        scene.add.image(0, 0, key).setOrigin(0, 0),
        scene.add.image(0, 0, key).setOrigin(0, 0)
      ];
  
      // Set the x-position of the second image to the right edge of the first image
      this.images[1].x = this.images[0].width;
    }
  
    update(speed: number) {
      // Move the background images to the left
    for (let key in this.backgrounds) {
      let speed = key === 'glacial_mountains' ? 1.25 : 1; // Move glacial_mountains faster
      for (let i = 0; i < this.backgrounds[key].length; i++) {
        this.backgrounds[key][i].x -= speed;

        // Repeat the image when it touches the edge of the screen
        if (this.backgrounds[key][i].x + this.backgrounds[key][i].width <= 0) {
          this.backgrounds[key][i].x = this.backgrounds[key][(i + 1) % 2].x + this.backgrounds[key][(i + 1) % 2].width;
        }
      }
    }
    }
  }