import Phaser from 'phaser';
import io from 'socket.io-client';
var player;
var platforms;
var cursors;

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'GameScene'
        });
    }

    
    preload() {
        this.load.image('sky', 'assets/sky2.jpg');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('diamond', 'assets/diamond.jpg');
        this.load.spritesheet('dude', 'assets/dude.png', { frameWidth:32, frameHeight:48 });
    }

    create() {
        this.socket = io('http://localhost:3000');
        this.add.image(400, 300, 'sky');
    
        platforms = this.physics.add.staticGroup();
          
        platforms.create(400, 568, 'ground').setScale(2).refreshBody();
      
        platforms.create(600, 400, 'ground');
        platforms.create(50, 300, 'ground');
        platforms.create(750, 220, 'ground');
      
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
      
        this.physics.add.collider(player, platforms);       
    }

    update() {
        if (cursors.left.isDown){
            player.setVelocityX(-160);
        
            player.anims.play('left', true);
        }
        else if (cursors.right.isDown){
            player.setVelocityX(160);
        
            player.anims.play('right', true);
        }
        else{
            player.setVelocityX(0);
        
            player.anims.play('turn');
        }
        
        if (cursors.up.isDown && player.body.touching.down){
            player.setVelocityY(-330);
        }
    }
}

