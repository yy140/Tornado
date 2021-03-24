import Phaser from "phaser";
import TitleScene from "./scenes/titleScene"
import GameScene from "./scenes/gamescene";
import LevelOneScene from "./scenes/levelOneScene";


function launch(containerId) {
    return new Phaser.Game({
        type: Phaser.AUTO,
        parent: containerId,
        scene: [
            TitleScene, GameScene, LevelOneScene
        ],
        physics: {
            default: 'arcade',
            arcade: {
              gravity: { y: 300 }
            }
        },
        scale: {
            mode: Phaser.Scale.FIT,
            width: '100%',
            height: '100%'
        }
    });
}


export default launch;
export { launch }