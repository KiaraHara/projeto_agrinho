let gameStarted = false;
let gameOver = false;
let victory = false;
let phase = 1;
let transitionScreen = false; 
let button, continueButton;
let corns = [];
let score = 0;
let character;
let truck;
let obstacles = [];
let sommilho;

function preload() {
  sommilho = loadSound('sommilho.mp3'); 
}

function setup() {
  createCanvas(800, 600);
  button = createButton('Iniciar Jogo');
  button.position(width / 2 - 90, height / 1.6);
  button.style('font-size', '24px');
  button.style('padding', '15px 30px');
  button.style('border-radius', '10px');
  button.style('background-color', 'yellow');
  button.mousePressed(startGame);

  character = new Character();
  
  for (let i = 0; i < 15; i++) {
    corns.push(new Corn());
  }
}

function draw() {
  if (gameOver) {
    background(255, 63, 51);
    textSize(60);
    textAlign(CENTER, CENTER);
    fill(255);
    text('GAME OVER', width / 2, height / 2);
    return;
  }

  if (victory) {
    background(78, 113, 255);
    textSize(30);
    textAlign(CENTER, CENTER);
    fill(0);
    text('PARABÉNS!\n Você conseguiu realizar o trajeto\n e levar os milhos com segurança,\n desta forma você ligou o campo e a cidade,\n como podemos ver eles estão mais ligados\n do que imaginamos\n e uma simples refeição leva\n diversas fases para estar em nossa mesa!!!', width / 2, height / 2);
    return;
  }

  if (transitionScreen) {
    showTransitionScreen();
    return;
  }

  if (gameStarted) {
    if (phase === 1) {
      playHarvestPhase();
    } else if (phase === 2) {
      playTruckPhase();
    }
  } else {
    background(78, 113, 255);
    textSize(30);
    textAlign(CENTER, CENTER);
    text('Você já parou para pensar \n de onde vêm os alimentos que você consome? \n Por trás deles, há um grande processo \n que envolve desde a colheita até chegar ao mercado.\n Você está pronto para conectar o campo e a cidade?', width / 2, height / 2.5 - 1);
    textSize(100);
    textAlign(CENTER, CENTER);
    text('👨‍🌾', width / 2 - 80, height / 1.1);
    text('👩‍🌾', width / 2 + 80, height / 1.1);
    
    fill(253, 250, 246);
    stroke(253, 250, 246);
    strokeWeight(1.5);
    rect(width / 1.8 - 300, height / 1.1 - 80, 120, 40, 20); // Retângulo arredondado

    // Texto dentro do balão
    noStroke();
    fill(0);
    textSize(19);
    textAlign(CENTER, CENTER);
    text('Vamos lá!!!', width / 3.9, height / 1.101 - 55);
  }
}

function playHarvestPhase() {
  background(0, 150, 0);

  fill(255);
  textSize(30);
  textAlign(CENTER, CENTER);
  text('COLHA OS MILHOS', width / 2, 50);

  for (let corn of corns) {
    corn.show();
  }

  character.move();
  character.show();
  character.collect(corns);

  if (character.x < 0 || character.x > width || character.y < 0 || character.y > height) {
    gameOver = true;
  }

  if (corns.length === 0) {
    transitionScreen = true;
    createContinueButton();
  }

  textSize(20);
  text(`PONTUAÇÃO: ${score}`, 90, 35);
}

function playTruckPhase() {
  background(150, 150, 150);
  
  for (let obs of obstacles) {
    obs.move();
    obs.show();
  }

  truck.move();
  truck.show();
  
  for (let obs of obstacles) {
    if (truck.collidesWith(obs)) {
      gameOver = true;
    }
  }

  if (truck.y <= 0) {
    victory = true;
  }
}

function showTransitionScreen() {
  background(78, 113, 255);
  textSize(30);
  textAlign(CENTER, CENTER);
  fill(255);
  text('Parabéns, você passou para a segunda fase!\nAgora você deve levar os milhos\n para a cidade, onde ocorrerá o processamento\n e então, a distribuição para o mercado.\nCUIDADO COM OS BURACOS NA ESTRADA!', width / 2, height / 2 - 40);
}

function createContinueButton() {
  continueButton = createButton('Continuar');
  continueButton.position(width / 2 - 60, height / 1.6);
  continueButton.style('font-size', '20px');
  continueButton.style('padding', '10px 20px');
  continueButton.style('border-radius', '5px');
  continueButton.style('background-color', 'green');
  continueButton.mousePressed(startTruckPhase);
}

function startTruckPhase() {
  transitionScreen = false;
  phase = 2;
  truck = new Truck(); 
  obstacles = [];
  
  for (let i = 0; i < 5; i++) {
    obstacles.push(new Obstacle());
  }
  
  if (continueButton) {
    continueButton.hide();
  }
}

function startGame() {
  gameStarted = true;
  button.hide();
}

class Character {
  constructor() {
    this.x = width / 2;
    this.y = height / 2;
    this.size = 70;
  }

  move() {
    if (keyIsDown(LEFT_ARROW)) this.x -= 5;
    if (keyIsDown(RIGHT_ARROW)) this.x += 5;
    if (keyIsDown(UP_ARROW)) this.y -= 5;
    if (keyIsDown(DOWN_ARROW)) this.y += 5;
  }

  show() {
    textSize(this.size);
    textAlign(CENTER, CENTER);
    text('👨‍🌾', this.x, this.y);
  }

  collect(corns) {
    for (let i = corns.length - 1; i >= 0; i--) {
      let d = dist(this.x, this.y, corns[i].x, corns[i].y);
      if (d < this.size / 2) {
        corns.splice(i, 1);
        score++;
        sommilho.play(); 
      }
    }
  }
}

class Corn {
  constructor() {
    let margin = 50;
    this.x = random(margin, width - margin);
    this.y = random(margin, height - margin);
    this.size = 30;
  }

  show() {
    textSize(this.size);
    textAlign(CENTER, CENTER);
    text('🌽', this.x, this.y);
  }
}

class Truck {
  constructor() {
    this.x = width / 2;
    this.y = height - 50;
    this.size = 70;
  }

  move() {
    if (keyIsDown(LEFT_ARROW)) this.x -= 5;
    if (keyIsDown(RIGHT_ARROW)) this.x += 5;
    if (keyIsDown(UP_ARROW)) this.y -= 5;
    if (keyIsDown(DOWN_ARROW)) this.y += 5;
  }

  show() {
    textSize(this.size);
    textAlign(CENTER, CENTER);
    text('🚚', this.x, this.y);
  }

  collidesWith(obstacle) {
    let d = dist(this.x, this.y, obstacle.x, obstacle.y);
    return d < this.size / 2;
  }
}

class Obstacle {
  constructor() {
    this.x = random(50, width - 50);
    this.y = random(50, height / 2);
    this.size = 50;
    this.speed = random(1, 3);
  }

  move() {
    this.y += this.speed;
    if (this.y > height) {
      this.y = random(50, height / 2);
      this.x = random(50, width - 50);
    }
  }

  show() {
    textSize(this.size);
    textAlign(CENTER, CENTER);
    text('🕳️', this.x, this.y);
  }
}
