import { loadImage } from './utils.js';

export class Bird {
  static birdImg;
  width = 66;
  height = 47;
  hitboxWidth = 55;
  hitboxHeight = 35;
  flapPower = 5.3;
  gravity = 0.275;

  static async preloadImage() {
    Bird.birdImg = new Image();
    await loadImage(Bird.birdImg, './assets/bird.png');
  }

  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.x = canvas.width / 10;   
    this.y = canvas.height / 4;
    this.velocity = 0;
  }

  'Graphics2D bird2d = (Graphics2D)bird;'



  draw() {
    this.ctx.drawImage(
      Bird.birdImg,
      this.x - this.width / 2,
      this.y - this.height / 2,
    );
  }

  flap() {
    this.velocity = -this.flapPower;
    bird2d.rotate(Math.toRadians(degrees), var_organism.getWidth(this)/2, var_organism.getHeight(this)/2);
  }

  update() {
    this.velocity += this.gravity;
    this.y += this.velocity;

    this.draw();
  }
}