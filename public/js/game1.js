var config = {
    type: Phaser.AUTO,
    // parent: 'phaser-example',
    width: 800,
    height: 600,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 300 },
        debug: false
      }
    },
    scene: {
      preload: preload,
      create: create,
      update: update
    },
    scale: {
      parent: 'myGame',
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 800,
      height: 600
    }
};



var player;
var platforms;
var stars;
var cursors;
var score = 0;
var scoreText;
var bombs;
var gameOver = false;
var isPaused= false;

var game = new Phaser.Game(config);
   
function preload() {
  this.load.image('bg', '../assets/game_1/BG.png');
  this.load.image('platform', '../assets/game_1/14.png');
  this.load.image('platform2', '../assets/game_1/15.png');
  this.load.image('platform3', '../assets/game_1/16.png');
  this.load.image('stoneBlock', '../assets/game_1/StoneBlock.png');
  this.load.image('star', '../assets/game_1/star.png');
  this.load.image('bomb', '../assets/game_1/bomb.png');
  this.load.image('ground', '../assets/game_1/1.png');
  this.load.image('ground2', '../assets/game_1/2.png');
  this.load.image('ground3', '../assets/game_1/3.png');
  this.load.image('crate', '../assets/game_1/Crate.png');
  this.load.image('stone', '../assets/game_1/Stone.png');
  this.load.image('skeleton', '../assets/game_1/Skeleton.png');
  this.load.image('tree', '../assets/game_1/Tree.png');
  this.load.image('bush1', '../assets/game_1/Bush (1).png');
  this.load.image('bush2', '../assets/game_1/Bush (2).png');
  this.load.image('cactus1', '../assets/game_1/Cactus (1).png');
  this.load.image('cactus2', '../assets/game_1/Cactus (2).png');
  this.load.image('cactus3', '../assets/game_1/Cactus (3).png');
  this.load.image('grass1', '../assets/game_1/Grass (1).png');
  this.load.image('grass2', '../assets/game_1/Grass (2).png');
  this.load.spritesheet('dude', '../assets/game_1/dude.png', { frameWidth:32, frameHeight:48 });
}

function create() {
  // this.socket = io();
  this.add.image(400, 300, 'bg');
    
  platforms = this.physics.add.staticGroup();
    
  platforms.create(60, 588, 'ground');
  platforms.create(185,588, 'ground2');
  platforms.create(310, 588, 'ground2');
  platforms.create(435, 588, 'ground2');
  platforms.create(560, 588, 'ground2');
  platforms.create(685, 588, 'ground2');
  platforms.create(810, 588, 'ground3');

  platforms.create(350, 380, 'platform').setScale(0.5).setSize(60, 25).setOffset(35, 25);
  platforms.create(412, 380, 'platform2').setScale(0.5).setSize(60, 45).setOffset(35, 25);
  platforms.create(475, 380, 'platform2').setScale(0.5).setSize(60, 45).setOffset(35, 25);
  platforms.create(535, 380, 'platform3').setScale(0.5).setSize(60, 25).setOffset(35, 25);

  platforms.create(28 ,231.5, 'ground2').setScale(0.5).setSize(64, 63).setOffset(30,33);
  platforms.create(92 ,231.5, 'ground2').setScale(0.5).setSize(64, 63).setOffset(30,33);
  platforms.create(156 ,231.5, 'ground3').setScale(0.5).setSize(64, 63).setOffset(30,33);

  platforms.create(750, 200, 'platform2');
  platforms.create(625, 200, 'platform').setSize(120, 50).setOffset(0, 2);

  platforms.create(244, 488, 'crate').setScale(0.7).setSize(68, 69).setOffset(18, 18);
  platforms.create(510, 326, 'crate').setScale(0.6).setSize(60, 63).setOffset(19, 19);
  platforms.create(700, 493, 'crate').setScale(0.6).setSize(60, 63).setOffset(19, 19);

  decoration = this.physics.add.staticGroup();

  decoration.create(28, 486, 'stone');
  decoration.create(660, 510, 'stone').setScale(0.5);
  decoration.create(80, 510,'skeleton').setScale(0.6);
  decoration.create(400, 280, 'tree').setScale(0.6);
  decoration.create(370, 340, 'grass1').setScale(0.7);
  decoration.create(60, 143, 'cactus1');
  decoration.create(95, 174, 'bush2').setScale(0.7);
  decoration.create(680, 110, 'bush1');
  decoration.create(490, 487, 'bush2')
  decoration.create(450, 476, 'cactus3');
  decoration.create(450, 333, 'grass2');
  decoration.create(700, 142, 'skeleton').setScale(0.6);
  decoration.create(30, 182, 'cactus2').setScale(0.8);

  pause_text = this.add.text(700, 20, 'Pause', { fontSize: '16px', fill: '#000'}).setScrollFactor(0);
  pause_text.setInteractive();

  pause_text.on('pointerdown', () => { 
    if (isPaused == false){
      this.physics.pause();
      player.anims.stop();

      pause_text.setText('Resume')
    }
    else{
      this.physics.resume();
      pause_text.setText('Pause')
    }
    isPaused = !isPaused;
    
  });

  player = this.physics.add.sprite(100, 450, 'dude');

  player.setBounce(0.2);

  player.setCollideWorldBounds(true);
   

  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'turn',
    frames: [ { key: 'dude', frame: 4 } ],
    frameRate: 20
  });

  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1
  });

  cursors = this.input.keyboard.createCursorKeys();

  stars = this.physics.add.group({
    key: 'star',
    repeat: 11,
    setXY: { x: 12, y: 0, stepX: 70 }
  });

  stars.children.iterate(function (child) {

    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.6));

  });

  bombs = this.physics.add.group();

  scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000'});
  gameOverText = this.add.text(400, 300, "         Game Over\n Click here to try again!", { fontSize: '32px', fill: '#000'}).setScrollFactor(0);
  gameOverText.setOrigin(0.5).setInteractive();
  gameOverText.visible = false
  gameOverText.on('pointerdown', () => { 
    gameOver = false;
    this.registry.destroy(); // destroy registry
    this.events.off(); // disable all active events
    this.scene.restart(); // restart current scen
    score = 0;
  });

  this.physics.add.collider(player, platforms);
  this.physics.add.collider(stars, platforms);
  this.physics.add.collider(bombs, platforms);

  this.physics.add.overlap(player, stars, collectStar, null, this);
  this.physics.add.collider(player, bombs, hitBomb, null, this);
  
  
}
   
function update() {
  

  if (gameOver){
    return;
  }

  if (cursors.left.isDown  && isPaused==false){
    player.setVelocityX(-160);

    player.anims.play('left', true);
  }
  else if (cursors.right.isDown  && isPaused==false){
    player.setVelocityX(160);

    player.anims.play('right', true);
  }
  else if ( isPaused==false){
    player.setVelocityX(0);

    player.anims.play('turn');
  }

  if (cursors.up.isDown && player.body.touching.down){
    player.setVelocityY(-330);
  }

  
}

function collectStar (player, star){
  star.disableBody(true, true);

  score+=10;
  scoreText.setText('Score: ' + score)

  if (stars.countActive(true) == 0){
    stars.children.iterate(function(child){
      child.enableBody(true, child.x, 0, true, true);
    });

    var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

    var bomb = bombs.create(x, 16, 'bomb');
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    bomb.allowGravity = false;
  }
}

function hitBomb (player, bomb) {
  this.physics.pause();

  player.setTint(0xff0000);

  player.anims.play('turn');

  gameOver = true;

  gameOverText.visible = true;
}
