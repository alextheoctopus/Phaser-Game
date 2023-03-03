import Phaser from "../lib/phaser.js";

export default class Game extends Phaser.Scene {
    /** @type {Phaser.Physics.Arcade.Sprite} */
    player;//declaration of the player property

    bunnysWalk;

    bunnysJump;

    bunnyFall;

    bunnyParabole;

    carrot;

    platforms;

    target;

    moveTo;

    carSound;

    bunnySound;

    carrotFlag = false;

    bunnies;

    posX;

    velocityX;

    velocityY;

    total;

    rate;

    bonus;

    text;

    isGameFinished;

    constructor() {
        super('game');//Every Scene has to define a unique key
    }

    preload() {// is called to allow us to specify images, audio, or other assets to load before starting the Scene.
        this.load.image('background', 'assets/background/backgroundCastles.png');
        this.load.image('platform', 'assets/platform/ground_wood.png');
        this.load.image('beardman', 'assets/beardman/adventurer_jump.png');
        this.load.image('target', 'assets/target/target.png');
        this.load.image('carrot', 'assets/carrot/carrot.png');
        this.load.plugin('rexmovetoplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexmovetoplugin.min.js', true);
        this.load.image('platform2', 'assets/platform/ground_grass.png');
        this.load.image('background1', 'assets/background/foliagePack_038.png');
        this.load.image('background2', 'assets/background/foliagePack_039.png');
        this.load.image('background3', 'assets/background/foliagePack_042.png');
        this.load.image('background4', 'assets/background/foliagePack_043.png');
        this.load.image('background5', 'assets/background/foliagePack_052.png');
        this.load.image('background6', 'assets/background/foliagePack_053.png');
        this.load.image('bunnyfall', 'assets/bunnys/bunny2_jump.png');
        this.load.image('bunnyready', 'assets/bunnys/bunny2_ready.png');
        this.load.spritesheet('bunnyswalk', 'assets/bunnys/walk.png', {
            frameWidth: 123,
            frameHeight: 202
        });
        this.load.spritesheet('bunnysjump', './assets/bunnys/spritesheet.png', {
            frameWidth: 140,
            frameHeight: 191
        });
        /////////
        //audio//
        /////////
        this.load.audio('soundCarrot', 'assets/audio/footstep00.ogg');
        this.load.audio('bunnySound', 'assets/audio/Steel jingles/jingles_STEEL10.ogg');
    }

    create() {
        this.add.image(512, 356, 'background');
        this.add.image(130, 650, 'platform').setScale(0.6);
        this.add.image(610, 590, 'platform2').setScale(0.6, 0.3);
        this.add.image(35, 740, 'background1').setScale(0.5);
        this.add.image(100, 720, 'background2').setScale(0.3);
        this.add.image(165, 690, 'background3').setScale(0.3);
        this.add.image(230, 680, 'background4').setScale(0.3);
        this.add.image(295, 690, 'background5');
        this.add.image(360, 690, 'background6');
        this.add.image(230 + 200, 680, 'background4').setScale(0.3);
        this.add.image(35 + 450, 740, 'background1').setScale(0.5);
        this.add.image(100 + 450, 720, 'background2').setScale(0.3);
        this.add.image(165 + 450, 690, 'background3').setScale(0.3);
        this.add.image(230 + 450, 680, 'background4').setScale(0.3);
        this.add.image(295 + 450, 690, 'background5').setScale(0.7);
        this.add.image(360 + 450, 690, 'background6').setScale(0.7);
        this.add.image(35 + 900, 740, 'background1').setScale(0.5);
        this.add.image(100 + 900, 720, 'background2').setScale(0.3);
        this.add.image(165 + 900, 690, 'background3').setScale(0.3);
        this.add.image(890, 460, 'target').setScale(0.7 * 0.8, 1);

        this.total = this.add.rectangle(540 - 400, 655 - 500, 160, 50, 0x80f261, 1);//total
        this.text = this.add.text(475 - 400, 646 - 500, 'total: 0', 'Roboto', 15);
        this.physics.add.existing(this.total);

        this.player = this.physics.add.sprite(150, 576, 'beardman').setScale(0.9);
        this.target = this.add.rectangle(890, 460, 2, 300, 0xfafcfa, 0);
        this.physics.add.existing(this.target);
        //audio
        this.carSound = this.sound.add('soundCarrot');
        this.bunnySound = this.sound.add('bunnySound');

        this.isGameFinished = false;
        this.rate = 0;
        this.bonus = 0;

        this.target.body.immovable = true;

        this.bunnies = this.add.group({
            key: 'bunnyready',
            repeat: 4,
            setXY:
            {
                x: 700,
                y: 552,
                stepX: -18
            },
            setScale: { x: 0.7 * 0.38, y: 0.7 * 0.38 }
        });

        this.loopp();

    }// is called once all the assets for the Scene have been loaded.


    loopp() {
        this.bunnyLeavesTheGroup();
        this.bunnyWalkAnim(540, 550, 4/* , false */);
        setTimeout(
            () => {
                this.spriteDestroy(this.bunnysWalk);
                this.bunnyJumpAnim();
            },
            2000
        );
        setTimeout(
            () => {
                this.bunnyFallAnim();
            },
            2520
        );
        setTimeout(
            () => {
                this.bunnyAtStart();
            },
            5200
        );
    }

    movingCarrot() {
        this.carrot =
            this.physics.add.sprite(210, 570,
                'carrot').setScale(0.7 * 0.7);

        this.carrot.moveTo = this.plugins.get('rexmovetoplugin').add(this.carrot).on('complete', function () {
            console.log('Reach target');
        });

        const g = 400;
        this.input.on('pointerdown', function (pointer) {
            this.carrotFlag = true;
            this.carSound.play();
            let v0 = 600;
            let alpha = Math.atan((570 - pointer.y) / (pointer.x - 210));
            let velocityX = 0;
            let velocityY0 = 0;

            if (pointer.y < 570 || pointer.x > 210) {
                velocityX = v0 * Math.cos(alpha);
                velocityY0 = - v0 * Math.sin(alpha);

            } else if (pointer.x <= 210) {
                velocityX = v0 * Math.cos(Math.PI / 2);
                velocityY0 = - v0 * Math.sin(Math.PI / 2);
            } else if (pointer.y >= 570 || pointer.x >= 210) {
                velocityX = v0 * Math.cos(0);
                velocityY0 = 0;
            }

            this.carrot.setVelocity(
                velocityX,
                velocityY0
            );
            this.velocityX = velocityX;
            this.velocityY = velocityY0;

            this.carrot.setGravityY(g);

        }, this);

    }

    bunnyLeavesTheGroup() {
        let children = this.bunnies.getChildren();
        this.bunnies.remove(children[children.length - 1], true, true);
        if (!children[0]) this.isGameFinished = true;
        console.log(this.isGameFinished);
    }

    bunnyWalkAnim(x, y, numOfRepetitions) {
        this.anims.create({
            key: "walk",
            frameRate: 5,
            frames: this.anims.generateFrameNumbers("bunnyswalk", { start: 1, end: 0 }),
        });
        this.bunnysWalk = this.add.sprite(x, y, 'bunnyswalk').setScale(0.7 * 0.38);
        //if(isReversed) this.bunnysWalk.sprite.scale.x = -1;
        this.bunnysWalk.play({ key: 'walk', repeat: numOfRepetitions })

        this.tweens.add({
            targets: this.bunnysWalk,
            x: 700,
            duration: 2000,
            ease: 'Linear'
        });

    }

    bunnyJumpAnim() {

        this.anims.create({
            key: "jump",
            frameRate: 5,
            frames: this.anims.generateFrameNumbers("bunnysjump", { start: 0, end: 1 }),
        });
        this.bunnysJump = this.add.sprite(700, 540, "bunnysjump").setScale(0.7 * 0.38);
        this.bunnysJump.play({ key: 'jump', repeat: 0 })


        this.tweens.add({
            targets: this.bunnysJump,
            y: 480,
            x: 710,
            duration: 500,
            ease: 'Linear'
        });
    }

    bunnyFallAnim() {
        this.bunnyFall = this.physics.add.sprite(710, 480, 'bunnyfall').setScale(0.7 * 0.38);
        this.spriteDestroy(this.bunnysJump);
        this.bunnyFall.setVelocity(
            63, -75
        );
        this.bunnyFall.setGravityY(180);
    }

    totalCalculations(rate) {
        let bonus = 0;
        (rate >= 398 && rate <= 400) ?
            bonus += 105 :
            ((367 <= rate && rate < 398) || (400 < rate && rate <= 430)) ?
                bonus += 90 :
                ((347 <= rate && rate < 367) || (430 < rate && rate <= 451)) ?
                    bonus += 75 :
                    ((317 <= rate && rate < 347) || (451 < rate && rate <= 482)) ?
                        bonus += 60 :
                        ((297 <= rate && rate < 317) || (482 < rate && rate <= 503)) ?
                            bonus += 45 :
                            ((265 <= rate && rate < 297) || (503 < rate && rate <= 534)) ?
                                bonus += 30 :
                                ((245 <= rate && rate < 265) || (534 <= rate && rate <= 555)) ?
                                    bonus += 15 : bonus += 0;
        this.bonus += bonus;
    }

    bunnyAtStart() {
        this.spriteDestroy(this.bunnyFall);
        this.bunnyParabole = this.physics.add.sprite(450, 712, 'bunnyfall').setScale(0.7 * 0.45);
        this.bunnyParabole.setVelocity(
            -50, -600
        );
        this.bunnyParabole.setGravityY(400);

        this.movingCarrot();

        let carCollider=this.physics.add.collider(this.bunnyParabole, this.carrot, () => {
            this.carSound.play();
            this.bunnyParabole.setVelocity(
                700, -100/* 0.8*this.velocityX, 0.3*this.velocityY */
            );
            this.physics.add.collider(this.bunnyParabole, this.target, () => {
                if (this.bunnyParabole.body.touching.right) {
                    console.log(this.bunnyParabole.body.y);

                    this.bunnySound.play();
                    this.bunnyParabole.setVelocity(
                        0, 0
                    );
                    this.bunnyParabole.setGravityY(0);
                    this.bunnyParabole.body.immovable = true;

                    this.totalCalculations(this.bunnyParabole.body.y);
                    this.text.setText('total: ' + this.bonus);
                };
            });
        }, () => {
            this.physics.world .removeCollider(carCollider);
        });
        setTimeout(
            () => {
                this.destroyCarrot();
                this.isGameFinished ? this.finishGame() : this.loopp();
            },
            3270
        );

    }

    destroyCarrot() {
        this.carrot.setGravityY(500);
    }
    spriteDestroy(sprite) {
        sprite.destroy();
    }

    finishGame() {
        this.registry.set('score', this.bonus)
        this.scene.pause();
        this.scene.run('restart');
    }
}