var config = {
    type: Phaser.AUTO,
    // parent: 'phaser-example',
    width: 1000,
    height: 600,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 400 },
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
      width: 100,
      height: 600
    }
  };
 
var game = new Phaser.Game(config);

var player;
var cursors;
var sky;
var mountains;
var city;
var platformGroup;
var pause_label;
var pause_text;
var isPaused = false;

function preload() {

  this.load.spritesheet('dude', '../assets/dude.png', { frameWidth:32, frameHeight:48 });
  this.load.image('sky', '../assets/sky2.jpg');
  this.load.image('mountains', '../assets/mountain-skyline.png');
  this.load.image('city', '../assets/city-skyline.png');
  this.load.image('platform-50', '../assets/platform-050w.png');
  this.load.image('platform-100', '../assets/platform-100w.png');
  this.load.image('platform-200', '../assets/platform-200w.png');
  this.load.image('platform-300', '../assets/platform-300w.png');
  this.load.image('platform-400', '../assets/platform-400w.png');
  this.load.image('platform-500', '../assets/platform-500w.png');
  this.cursors = this.input.keyboard.createCursorKeys();
}

function create() {
  

  this.physics.world.setBounds(0, 0, 5000, 600);
  this.cameras.main.setBounds(0, 0, 5000, 600);

  sky = this.add.tileSprite(0,0, 5000, 1200, 'sky');
  mountains = this.add.tileSprite(0,0, 10000, 1200, 'mountains');
  city = this.add.tileSprite(0,0, 15000, 1200, 'city');
  sky.setScrollFactor(0);
  mountains.setScrollFactor(0.2);
  city.setScrollFactor(0.5);

  pause_text = this.add.text(900, 20, 'Pause', { fontSize: '16px', fill: '#000'}).setScrollFactor(0);
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

  

  platforms = this.physics.add.staticGroup();
  var ground = platforms.create(250, 550, 'platform-500');
  platforms.create(200, 500, 'platform-100');
  platforms.create(400, 425, 'platform-100');
  platforms.create(600, 350, 'platform-100');
  platforms.create(50, 100, 'platform-50');
  platforms.create(250, 175, 'platform-50');
  platforms.create(450, 260, 'platform-50');
  platforms.create(900, 275, 'platform-200');
  platforms.create(1150, 475, 'platform-50');
  platforms.create(1350, 500, 'platform-50');

  player = this.physics.add.sprite(25, 300, 'dude');
  player.setOrigin(0.5,0.5)
  
  player.setBounce(0.01);
  player.setCollideWorldBounds(true);
  cursors = this.input.keyboard.createCursorKeys();


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

  this.cameras.main.startFollow(player, true);
  this.physics.add.collider(player, platforms);
}

function update(){


  if (cursors.left.isDown && isPaused==false){
    player.setVelocityX(-160);

    player.anims.play('left', true);
  }
  else if (cursors.right.isDown && isPaused==false){
    player.setVelocityX(160);

    player.anims.play('right', true);
  }
  else if (isPaused==false){
    player.setVelocityX(0);

    player.anims.play('turn');
  }
  const didPressJump = Phaser.Input.Keyboard.JustDown(cursors.up);
  
  if (didPressJump){
    if (cursors.up.isDown && (player.body.onFloor() || player.body.touching.down)){
      this.canDoubleJump = true;
      player.body.setVelocityY(-300);
    }
    else if(this.canDoubleJump){
      this.canDoubleJump = false;
      player.body.setVelocityY(-300);
    }
}

};