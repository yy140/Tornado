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
    width: 1000,
    height: 600
  }
};

var game = new Phaser.Game(config);

var player;
var cursors;
var bg;
var buildings;
var far_buildings
var foreground;
var platformGroup;
var pause_label;
var pause_text;
var isPaused = false;
var acid;
var gameOver = false;

function preload() {

this.load.spritesheet('dude', '../assets/dude.png', { frameWidth:32, frameHeight:48 });
this.load.image('bg', '../assets/game_2/bg.png');
this.load.image('buildings', '../assets/game_2/buildings.png');
this.load.image('far_buildings', '../assets/game_2/far-buildings.png');
this.load.image('foreground', '../assets/game_2/skill-foreground.png');
this.load.image('platform-50', '../assets/platform-050w.png');
this.load.image('platform-100', '../assets/platform-100w.png');
this.load.image('platform-200', '../assets/platform-200w.png');
this.load.image('platform-300', '../assets/platform-300w.png');
this.load.image('platform-400', '../assets/platform-400w.png');
this.load.image('platform-500', '../assets/platform-500w.png');
this.load.image('acid_1', '../assets/game_2/acid_1.png');

this.cursors = this.input.keyboard.createCursorKeys();
}

function create() {


  this.physics.world.setBounds(0, 0, 5000, 600);
  this.cameras.main.setBounds(0, 0, 5000, 600);

  bg = this.add.tileSprite(0,0, 0, 0, 'bg').setScale(8);
  far_buildings = this.add.tileSprite(0,300, 1000, 1000, 'far_buildings').setScale(5);
  buildings = this.add.tileSprite(0,300, 1000, 1000, 'buildings').setScale(4);
  foreground = this.add.tileSprite(0,500, 1000, 100, 'foreground').setScale(3);
  
  acid = this.add.tileSprite(0,560,5000,200, 'acid_1');
  
  this.physics.add.existing(acid, true);
  acid.body.setOffset(0,100)

  bg.setScrollFactor(0);
  far_buildings.setScrollFactor(0.2);
  buildings.setScrollFactor(0.5);
  foreground.setScrollFactor(0.6)

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
  platforms.create(0, 500, 'platform-100');
  platforms.create(200, 500, 'platform-100');
  platforms.create(400, 425, 'platform-100');
  platforms.create(600, 350, 'platform-100');
  platforms.create(50, 100, 'platform-50');
  platforms.create(250, 175, 'platform-50');
  platforms.create(450, 260, 'platform-50');
  platforms.create(900, 275, 'platform-200');
  platforms.create(1150, 475, 'platform-50');
  platforms.create(1350, 500, 'platform-50');

  player = this.physics.add.sprite(100, 300, 'dude');
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

  gameOverText = this.add.text(400, 300, 'Game Over', { fontSize: '64px', fill: '#000'});
  gameOverText.setOrigin(0.5)
  gameOverText.visible = false

  this.cameras.main.startFollow(player, true);
  this.physics.add.collider(player, platforms);
  this.physics.add.collider(player, acid, touch_acid, null, this);
  


  }

  function update(){
    //console.log(player.body.position)
    
    if (gameOver){
      return;
    }

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

function touch_acid() {
  
  //console.log('touching acid')
  this.physics.pause();

  player.setTint(0xff0000);

  player.anims.play('turn');

  gameOver = true;

  gameOverText.visible = true;
}