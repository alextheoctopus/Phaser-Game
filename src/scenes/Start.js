export default class Start extends Phaser.Scene {

    constructor() {
        super('start');
    }

    preload() {
        this.load.image('backgroundEmpty', 'assets/background/backgroundEmpty.png');
    }

    create() {
        this.add.image(512, 356, 'backgroundEmpty');
        this.add.rectangle(512, 356, 750, 350, 0xffffff, 0.9);
        this.add.text(250, 265, 'BunnySports - Carrot hit', { fontFamily: 'Roboto', fontSize: 50, color: '#0DF731' });
        this.add.text(495, 330, 'An A.Beznosova & E.Mamontova game', { fontFamily: 'Roboto', fontSize: 15, color: '#555' });

        this.add.text(378, 400, 'Click to start', { fontFamily: 'Roboto', fontSize: 45, color: '#FF5733' });

        this.input.once('pointerdown', this.start, this);


    }

    start() {
        this.scene.start('game');
    }
}