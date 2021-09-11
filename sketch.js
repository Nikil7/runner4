var PLAY = 1;
var END = 0;
var WIN = 2;
var gameState = PLAY;

var racetrack;
var score = 0;
var runnerImg;
var runner;
var invTrack;
var barrierImg,barrier;
var coinImg,coin;
var gameOverImg,gameOver,restartImg,restart;
var lifeImg3,lifeImg2,lifeImg1,heart = 3, life;
var bgSound,jumpSound,coinSound,dieSound;

function preload(){
  racetrackImg = loadImage("./assets/racetrack.PNG");
  runnerImg = loadAnimation("./assets/runner1.png","./assets/runner2.png","./assets/runner3.png")
  barrierImg = loadImage("./assets/barrier1.png");
  coinImg = loadImage("./assets/goldCoin.png");
  gameOverImg = loadImage("./assets/gameOver.png");
  restartImg = loadImage("./assets/restart.png");
  lifeImg3 = loadAnimation("assets/3 hearts.png")
  lifeImg2 = loadAnimation("assets/2 heartsbg.png")
  lifeImg1 = loadAnimation("assets/1 heartbg.png")
  bgSound = loadSound("./assets/bgsound.mp3");
  jumpSound = loadSound("./assets/jump.wav");
  coinSound = loadSound("./assets/coin.mp3");
  dieSound = loadSound("./assets/die.mp3");
}

function setup() {
  createCanvas(800,400);

  runner = createSprite(200,250,50,50);
  runner.addAnimation("runner",runnerImg);
  runner.scale  = 0.4;
  runner.setCollider("circle",0,0,150);
  runner.debug = true;

  invTrack = createSprite(200,350,250,10);
  invTrack.visible = false;

  barriersGroup = new Group();
  coinsGroup = new Group();

  gameOver = createSprite(400,100,10,10);
  gameOver.addImage("gameOver",gameOverImg);
  gameOver.scale = 0.5;
  gameOver.visible = false;

  restart = createImg("./assets/restart.png");
  restart.position(400,200,10,10);
  restart.size(50,50);
  restart.mouseClicked(reset);
  restart.hide();

  life = createSprite(700,50,50,50);
  life.addAnimation("3hearts",lifeImg3)
  life.addAnimation("2hearts",lifeImg2)
  life.addAnimation("1heart",lifeImg1)
  life.scale = 0.3; 

}

function draw() {

  background(racetrackImg);
  textSize(35);
  fill("blue");
  text("Score: "+score,10,50)
  
  if (gameState===PLAY){

    

    if(keyDown("space")&& runner.y>250) {
      runner.velocityY = -17;
      jumpSound.play();
    }
       
    runner.velocityY = runner.velocityY + 0.8
    runner.collide(invTrack); 

    if(runner.isTouching(coinsGroup)){
      coinsGroup.destroyEach();
      coinSound.play();
      score = score+1;
    }

    if(runner.isTouching(barriersGroup)){
      heart = heart - 1;
      barriersGroup.destroyEach(0);


      if(heart === 2){
        life.changeAnimation("2hearts",lifeImg2);
      }

      if(heart === 1){
        life.changeAnimation("1heart",lifeImg1);
      }

      if(heart === 0){
        gameState = END;
        runner.visible = false;
        dieSound.play();
      }
  }
    }
    
  if(gameState === END){
    runner.velocityX = 0;
    barriersGroup.destroyEach();
    coinsGroup.destroyEach();
    gameOver.visible = true;
    restart.show();
  }



  


  spawnBarriers();
  spawnCoins();
  drawSprites();
}

function spawnBarriers(){
  if(frameCount % 150 === 0){
    barrier = createSprite(800,340);
    barrier.velocityX = -(8 + 5*score/10);
    barrier.addImage("barrier",barrierImg);
    barrier.scale = 0.2;
    barrier.lifetime = 300;

    barriersGroup.add(barrier);
  }
}

function spawnCoins(){
  if(frameCount % 100 === 0){
    coin = createSprite(800,340);
    coin.velocityX = -7;
    coin.y = Math.round(random(50,350))
    coin.addImage("coin",coinImg);
    coin.lifetime = 400;
    coin.scale = 0.1;

    coinsGroup.add(coin);
  }
}

function reset(){
  gameState = PLAY;
  barriersGroup.destroyEach();
  gameOver.visible = false;
  restart.hide();
  score = 0;
  runner.visible = true;
  runner.x = 200;
  life.changeAnimation("3hearts",lifeImg3); 
  heart = 3;
}