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
var trust_text;
var isPaused = false;
var acid;
var gameOver = false;
var bird;
var moving_platform_1;
var moving_platform_2;
var theta = 0;

function preload() {

this.load.spritesheet('dude', '../assets/dude.png', { frameWidth:32, frameHeight:48 });
this.load.spritesheet('bird', '../assets/game_2/bird_sheet.png', { frameWidth:32, frameHeight:48 });
this.load.spritesheet('bird_left', '../assets/game_2/bird_sheet_left.png', { frameWidth:32, frameHeight:48 });
this.load.image('bg', '../assets/game_2/bg.png');
this.load.image('buildings', '../assets/game_2/buildings.png');
this.load.image('far_buildings', '../assets/game_2/far-buildings.png');
this.load.image('foreground', '../assets/game_2/skill-foreground.png');
this.load.image('platform-10', '../assets/game_2/platform-10w.png');
this.load.image('platform-25', '../assets/game_2/platform-25w.png');
this.load.image('platform-50', '../assets/game_2/platform-50w.png');
this.load.image('platform-100', '../assets/game_2/platform-100w.png');
this.load.image('platform-200', '../assets/game_2/platform-200w.png');
this.load.image('platform-300', '../assets/game_2/platform-300w.png');
this.load.image('platform-400', '../assets/game_2/platform-400w.png');
this.load.image('platform-500', '../assets/game_2/platform-500w.png');
this.load.image('acid_1', '../assets/game_2/acid_1.png');

this.cursors = this.input.keyboard.createCursorKeys();
}

function create() {


  this.physics.world.setBounds(0, 0, 5000, 600);
  this.cameras.main.setBounds(0, 0, 5000, 600);

  bg = this.add.tileSprite(0,0, 0, 0, 'bg').setScale(8);
  far_buildings = this.add.tileSprite(0,300, 5000, 1000, 'far_buildings').setScale(5);
  buildings = this.add.tileSprite(0,300, 5000, 1000, 'buildings').setScale(4);
  foreground = this.add.tileSprite(0,500, 5000, 100, 'foreground').setScale(3);
  
  acid = this.add.tileSprite(0,560,10000,200, 'acid_1');
  
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
      bird.anims.stop();
      player.anims.stop();
      pause_text.setText('Resume');
    }
    else{
      this.physics.resume();
      pause_text.setText('Pause')
    }
    isPaused = !isPaused;
    
  });

  trust_text = this.add.text(1400, 300, 'Just jump...trust me', { fontSize: '16px', fill: '#000'});

  trust_text = this.add.text(1800, 300, 'Mind the gap', { fontSize: '16px', fill: '#000'});

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
  platforms.create(1800, 500, 'platform-500').setVisible(false);
  platforms.create(2400, 500, 'platform-500');
  platforms.create(3900, 500, 'platform-25');
  platforms.create(4100, 400, 'platform-25');
  platforms.create(4050, 300, 'platform-25');
  platforms.create(4150, 200, 'platform-50');

  moving_platform_1 = this.physics.add.sprite(2900,300, 'platform-50').setImmovable(true);
  moving_platform_1.body.setAllowGravity(false);
  moving_platform_1.body.friction.y=100;
  moving_platform_2 = this.physics.add.sprite(3300,300, 'platform-50').setImmovable(true);
  moving_platform_2.body.setAllowGravity(false);
 
  

  player = this.physics.add.sprite(25, 300, 'dude');
  player.setOrigin(0.5,0.5)

  //player.setBounce(0.01);
  player.setCollideWorldBounds(true);
  cursors = this.input.keyboard.createCursorKeys();

  bird = this.physics.add.sprite(500, 500, 'bird');
  bird.body.setAllowGravity(false);
  bird.setSize(24, 20).setOffset(8, 12);

  this.anims.create({ key: 'fly_right', 
    frames: this.anims.generateFrameNumbers('bird', {start:0, end:8}), 
    frameRate: 10, 
    repeat: -1 
  });
  this.anims.create({ key: 'fly_left', 
    frames: this.anims.generateFrameNumbers('bird_left', {start:0, end:8}), 
    frameRate: 10, 
    repeat: -1 
  });
  
  

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

  gameOverText = this.add.text(400, 300, "         Game Over\n Click here to try again!", { fontSize: '32px', fill: '#000'}).setScrollFactor(0);
  gameOverText.setOrigin(0.5).setInteractive();
  gameOverText.visible = false
  gameOverText.on('pointerdown', () => { 
    gameOver = false;
    this.registry.destroy(); // destroy registry
    this.events.off(); // disable all active events
    this.scene.restart(); // restart current scen
  });

  this.cameras.main.startFollow(player, true);
  this.physics.add.collider(player, platforms);
  this.physics.add.collider(player, moving_platform_1);
  this.physics.add.collider(player, moving_platform_2);
  this.physics.add.collider(player, acid, player_die, null, this);
  this.physics.add.collider(player, bird, player_die, null, this);
  


  }

  function update(){
    theta+=0.01;
    update_moving_platform()
    
    update_bird()

    
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

function player_die() {
  

  this.physics.pause();

  player.setTint(0xff0000);

  player.anims.play('turn');
  bird.anims.stop();
  gameOver = true;

  gameOverText.visible = true;
}

function update_bird(){
  if(isPaused == false){
    if(bird.body.position.x < player.body.position.x){
      bird.anims.play('fly_right', true);
    }
    else{
      bird.anims.play('fly_left', true);
    }
    bird.body.position.x = bird.body.position.x + 0.006*(player.body.position.x - bird.body.position.x);
    bird.body.position.y =  bird.body.position.y + 0.006*(player.body.y - bird.body.position.y);
  }

}
function update_moving_platform(){
  moving_platform_1.body.position.x += Math.cos(theta);
  moving_platform_1.body.position.y += Math.sin(theta*2);
  moving_platform_2.body.position.x += Math.cos(theta);
  moving_platform_2.body.position.y += Math.sin(-theta*2);
}