import { Pipe } from './pipe.js';
import { loadImage } from './utils.js';
import { Ground } from './ground.js';
import { Bird } from './bird.js';
import { checkCollision } from './collision.js';
import { Text } from './text.js';
import { Button } from './button.js';

// rundll32.exe keymgr.dll,KRShowKeyMgr

export class Game {
  SPEED = 3;
  k = 5;
  DISTANCE_BETWEEN_PIPES = this.k * Pipe.width;

  frameCount = 0;
  score = 0;
  scoreRecord = 0;
  isGameStarted = false;

  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    const height = window.visualViewport ? window.visualViewport.height : window.innerHeight;
    const width = window.visualViewport ? Math.min(window.visualViewport.width, height * 0.6) : Math.min(window.innerWidth, height * 0.6);
    this.canvas.height = 900;
    this.canvas.width = 900 * width / height;
    this.BG_IMG = new Image();
    this.pipes = [new Pipe(this.canvas)];
    this.ground = new Ground(this.canvas);
    this.bird = new Bird(this.canvas);

    this.button = new Button(this.canvas);

    this.scoreText = new Text(this.ctx, this.score, this.canvas.width / 2, 65);

    this.scoreRecord = parseInt(this.getCookie('score')) || 0;

    this.scoreRecordText = new Text(this.ctx, this.scoreRecord, 50, 15);

    this.buttonText = new Text(this.ctx, 'Restart', this.canvas.width - 120, 20);
  }

  async loadAssets() {
    await Promise.all([
      loadImage(this.BG_IMG, './assets/bg.png'),
      Pipe.preloadImages(),
      Ground.preloadImage(),
      Bird.preloadImage(),
      Button.preloadImage()
    ]);
  }
 
  start() {
    this.initializeControls();
    this.intervalId = setInterval(() => this.draw(), 10);

    this.scoreRecord = this.getCookie('score');
    this.scoreRecordText = new Text(this.ctx, this.scoreRecord, 50,65);

    this.canvas.addEventListener('click', (e) => {
        const rect = this.canvas.getBoundingClientRect(); // Получаем позицию канваса на странице
        const x = e.clientX - rect.left; // Координата X относительно канваса
        const y = e.clientY - rect.top;  // Координата Y относительно канваса

        const buttonWidth = 200;
        const buttonHeight = 50;
        const buttonX = this.canvas.width - buttonWidth - 20; // Отступ справа
        const buttonY = 10; 

        if (x >= buttonX && x <= buttonX + buttonWidth &&
            y >= buttonY && y <= buttonY + buttonHeight) {
            console.log('Клик на кнопку Restart');
            this.restartGame();
        }
    });
}


  stop() {
    clearInterval(this.intervalId);
  }

  addDifficult(){
    if(this.score % 10 == 0 && this.score != 0){
      if(!this.k < 3.5){
        this.k -= 0.10;
        this.SPEED += 0.09;
      }
      this.DISTANCE_BETWEEN_PIPES = this.k * Pipe.width;
    }
  }

  update(){
    this.updatePipes();
    this.ground.update(this.SPEED);
    this.bird.update();
  
    if (checkCollision(this.bird, this.pipes, this.ground)){
      this.stop();
    }
    //push new pipe
    if (this.frameCount * this.SPEED > this.DISTANCE_BETWEEN_PIPES) {
        this.pipes.push(new Pipe(this.canvas));
        this.frameCount = 0;
      }
      this.frameCount++;
  }

  draw() {
    this.ctx.drawImage(this.BG_IMG, 0, 0, this.canvas.width, this.canvas.height);

      if (!this.isGameStarted) {
        this.ground.update(this.SPEED);
        this.bird.draw();
      return;
      }
      
      this.update(); //обновление логики

      this.scoreText = new Text(this.ctx, this.score, this.canvas.width / 2, 65);
      this.scoreRecordText = new Text(this.ctx, this.scoreRecord, 50, 15);
      this.button.draw()
    //  this.buttonText = new Text(this.ctx, 'Restart', this.canvas.width - 120,20);

}

restartGame() {
  clearInterval(this.intervalId);
  this.intervalId = setInterval(() => this.draw(), 10);
  this.bird = new Bird(this.canvas);
  this.pipes = [new Pipe(this.canvas)];
  this.ground = new Ground(this.canvas);

  // сохранение рекорда в куки
  if (this.score > this.scoreRecord) {
    this.scoreRecord = this.score;
    this.setCookie('score', this.scoreRecord, { secure: true, 'max-age': 3600 });
  }

  this.score = 0;
  this.frameCount = 0;
  this.k = 3.5;
  this.DISTANCE_BETWEEN_PIPES = this.k * Pipe.width;
  this.SPEED = 3;
}

  updatePipes() {
    for (let i = 0; i < this.pipes.length; i++) {
      this.pipes[i].update(this.SPEED);
      if (this.pipes[i].isOffscreen()) {
        this.pipes.shift();
        i--;
        this.score++;
        this.addDifficult();
      }
    }
  }

  initializeControls() {
    if ('ontouchstart' in window) {
      document.addEventListener('touchstart', this.handleFlap);
    } else {
      document.addEventListener('mousedown', this.handleFlap);
    }
    document.addEventListener('keydown', this.handleFlap);
  }

  handleFlap = (event) => {
    if (event.type === 'keydown' && event.code !== 'Space') return;
    if (!this.isGameStarted) this.isGameStarted = true;
    this.bird.flap();
  }  

  // возвращает score из куки
  getCookie(name) {
    let matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : 0; // Возвращаем 0, если куки не найдены
  }

  // сохранение Score в куки
  setCookie(name, value, options = {}) {
    options = {
      path: '/',
      // при необходимости добавьте другие значения по умолчанию
      ...options
    };

    if (options.expires instanceof Date) {
      options.expires = options.expires.toUTCString();
    }

    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

    for (let optionKey in options) {
      updatedCookie += "; " + optionKey;
      let optionValue = options[optionKey];
      if (optionValue !== true) {
        updatedCookie += "=" + optionValue;
      }
    }

    document.cookie = updatedCookie;
  }

}