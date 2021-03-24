import Phaser from 'phaser';

class LevelOneScene extends Phaser.Scene {
  constructor() {
    super({key:'levelOneScene'});
  }
  preload(){
    this.load.image('background', 'images/background.jpg');
    this.load.image("block", '../../assets/redbrick.png'); 
  }
  create() {
    var bg= this.add.sprite(0,0, 'background');
    bg.setOrigin(0,0);
    var text = this.add.text(100,100, 'level one scene')
    text.setInteractive({ useHandCursor: true});
    text.on('pointerdown', () => this.clickButton());
    }
    clickButton(){
      this.scene.switch('titleScene');
  }
}
export default LevelOneScene;