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
  this.load.image('sky', '../assets/sky2.jpg');
  this.load.image('ground', '../assets/platform.png');
  this.load.image('star', '../assets/star.png');
  this.load.image('bomb', '../assets/bomb.png');
  this.load.spritesheet('dude', '../assets/dude.png', { frameWidth:32, frameHeight:48 });
}

function create() {
  // this.socket = io();
  this.add.image(400, 300, 'sky');
    
  platforms = this.physics.add.staticGroup();
    
  platforms.create(400, 568, 'ground').setScale(2).refreshBody();

  platforms.create(600, 400, 'ground');
  platforms.create(50, 300, 'ground');
  platforms.create(750, 220, 'ground');

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
