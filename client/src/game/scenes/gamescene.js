import Phaser from 'phaser';
import io from 'socket.io-client';


export default class GameScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'GameScene'
        });
    }

    preload() {
        
    }

    create() {
        this.socket = io('http://localhost:3000');
                
    }

    update() {

    }
}

