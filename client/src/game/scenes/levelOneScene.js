import Phaser from 'phaser';
import io from 'socket.io-client';

class LevelOneScene extends Phaser.Scene {
  constructor() {
    super({key:'levelOneScene'});
  }
  preload(){
    this.cameras.main.backgroundColor.setTo(300, 100, 65);
    this.load.image("block", 'assets/redbrick.png');  
    this.load.image("blob", 'assets/blob.png');  
    this.load.image("platform", 'assets/platform.png');
  }
  

  
  create() {
    this.socket = io('http://localhost:3000');
    
    //add platforms
    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(200, 800, 'platform').setScale(0.6);
    this.platforms.create(500, 400, 'platform').setScale(0.6);
    this.platforms.create(50, 250, 'platform').setScale(0.6);
    this.platforms.create(750, 220, 'platform').setScale(0.6);

       
    this.blob = this.physics.add.image(200,400, "blob");
    this.blob.setScale(0.25);
    this.blob.body.collideWorldBounds = true
    this.physics.enable("blob");

    this.physics.arcade.collider(this.blob, this.platforms);

    //direction keys   
    this.key_A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.key_D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.key_W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.key_S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    

    var text = this.add.text(100,100, 'level one scene');
    text.setInteractive({ useHandCursor: true});
    text.on('pointerdown', () => this.clickButton());
    }
    clickButton(){
      this.scene.switch('titleScene');
  }
  update() {
    if(this.key_A.isDown)
    this.blob.x -= 5;
    if(this.key_D.isDown)
    this.blob.x += 5;
    if(this.key_W.isDown)
    this.blob.y -= 5;
    if(this.key_S.isDown)
    this.blob.y += 5;
  }
}
export default LevelOneScene;