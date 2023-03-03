import Phaser from './lib/phaser.js';
import Game from './scenes/Game.js';
import Restart from './scenes/Restart.js';
import Start from './scenes/Start.js';

export default new Phaser.Game({
    type: Phaser.AUTO,
    width: 1024,
    height: 712,
    scene: [Start, Game, Restart],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 0
            },
            debug: true
        }
    }
});