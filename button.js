import { loadImage } from './utils.js';

export class Button {
  static btnImg;
  width = 66;
  height = 47;

  static async preloadImage() {
    Button.btnImg = new Image();
    await loadImage(Button.btnImg, './assets/restart.png');
  }

  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.x = canvas.width - 50;   
    this.y = 35;
    this.velocity = 0;
  }

  draw() {
    this.ctx.drawImage(
      Button.btnImg,
      this.x - this.width / 2,
      this.y - this.height / 2,
    );
  }

  update() {
    this.draw();
  }
}