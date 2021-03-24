import Phaser from 'phaser';

class LevelOneScene extends Phaser.Scene {
  constructor() {
    super({key:'levelOneScene'});
  }
  preload(){
    this.cameras.main.backgroundColor.setTo(100, 189, 65);
    this.load.image("block", 'assets/redbrick.png');  
    
      
  }
  create() {

    this.block = this.add.image(600,600, "block");
    this.block.setScale(0.25);
    
    var text = this.add.text(100,100, 'level one scene')
    text.setInteractive({ useHandCursor: true});
    text.on('pointerdown', () => this.clickButton());
    }
    clickButton(){
      this.scene.switch('titleScene');
  }
}
export default LevelOneScene;