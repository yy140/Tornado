import Phaser from 'phaser';
import io from 'socket.io-client';

class TitleScene extends Phaser.Scene {
  constructor() {
    super({key:'titleScene'});
  }
  preload(){
    this.cameras.main.backgroundColor.setTo(100, 189, 65);
    this.load.image('background', '/assets/backgrounds/grass.png');  
    this.load.image("block", 'assets/redbrick.png');  
    
      
    
  }
  create() {
    this.socket = io('http://localhost:3000');
    var bg = this.add.sprite(0,0, 'background');
    bg.setOrigin(0,0);

    this.block = this.add.image(600,600, "block");
   
    
    var text = this.add.text(300,400, 'Click to start playing!')
    text.setInteractive({ useHandCursor: true});
    text.on('pointerdown', () => this.clickButton());
    }
    clickButton(){
      this.scene.switch('levelOneScene');
  }
}
export default TitleScene;