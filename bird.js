import { loadImage } from './utils.js';

export class Bird {
  static birdImg;
  width = 66;
  height = 47;
  hitboxWidth = 55;
  hitboxHeight = 35;

  flapPower = 6.5; // Сила взмаха
  gravity = 0.35;   // Гравитация
  maxVelocity = 15; // Максимальная скорость падения

  // Новые параметры для постоянного подъема
  liftDuration = 5; // Количество кадров для постоянного подъема
  liftCounter = 0;

  static async preloadImage() {
    Bird.birdImg = new Image();
    await loadImage(Bird.birdImg, './assets/bird.png');
  }

  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.x = canvas.width / 4;
    this.y = canvas.height / 2;
    this.velocity = 0;
    this.lastTime = Date.now();
  }

  draw() {
    this.ctx.drawImage(
      Bird.birdImg,
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height
    );
  }

  flap() {
    this.velocity = -this.flapPower;
    this.liftCounter = this.liftDuration; // Активируем режим постоянного подъема
  }

  update() {
    const currentTime = Date.now();
    const deltaTime = (currentTime - this.lastTime) / 10;
    this.lastTime = currentTime;

    // Логика постоянного подъема
    if (this.liftCounter > 0) {
      this.velocity = -this.flapPower; // Фиксированная скорость подъема
      this.liftCounter--;
    } else {
      this.velocity += this.gravity * deltaTime; // Обычная гравитация
    }

    this.velocity = Math.min(this.velocity, this.maxVelocity);
    
    this.y += this.velocity * deltaTime;

    // Ограничения перемещения
    if (this.y < -this.height/2) {
      this.y = -this.height/2;
      this.velocity = 0;
    }
    
    if (this.y + this.height/2 > this.canvas.height - 112) {
      this.y = this.canvas.height - 112 - this.height/2;
      this.velocity = 0;
    }

    this.draw();
  }
}