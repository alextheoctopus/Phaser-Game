export default class Restart extends Phaser.Scene {

    constructor() {
        super('restart');
    }

    preload() {
        this.load.image('backgroundForest', 'assets/background/backgroundColorForest.png');
    }

    create() {
        this.add.image(512, 356, 'backgroundForest');
        this.add.rectangle(512, 356, 750, 350, 0xffffff, 0.9);
        this.add.text(250, 265, 'Your score: ' + this.registry.get('score'), { fontFamily: 'Roboto', fontSize: 80, color: '#555' });
        this.add.text(360, 400, 'Click to restart', { fontFamily: 'Roboto', fontSize: 45, color: '#555' });

        this.input.once('pointerdown', this.start, this);
    }

    start() {
        this.scene.start('game');
    }
}