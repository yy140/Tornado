import Phaser from "phaser";
import GameScene from "./scenes/gamescene";
import LevelOneScene from "./scenes/levelOneScene";


function launch(containerId) {
    return new Phaser.Game({
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent: containerId,
        scene: [
            GameScene, LevelOneScene
        ],
        physics: {
            default: 'arcade',
            arcade: {
              gravity: { y: 300 }
            }
        }
    });
}


export default launch;
export { launch }