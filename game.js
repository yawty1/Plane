class Main extends Phaser.Scene {
    jump() {
        this.tweens.add({
            targets: this.plane,
            angle: -20,
            duration: 100,
            repeat: 1
        });
        this.plane.body.velocity.y = -350;
    }

    //Функція для створення блоку труби
    addOnePipe(x, y) {
        var pipe = this.physics.add.sprite(x, y, 'pipe');
        pipe.setOrigin(0, 0);
        this.pipes.add(pipe);
        pipe.body.velocity.x = -300;

        pipe.collideWorldBounds = true;
        pipe.outOfBoundsKill = true;
    }
    //Функція створення труби (стовпчик блоків)
    addRowOfPipes() {
        var hole = Math.floor(Math.random() * 5) + 1;
        this.score += 1;
        this.labelScore.text = this.score;
        for (var i = 0; i < 8; i++) {
            if (!(i >= hole && i <= hole + 2))
                this.addOnePipe(800, i * 60 + 10);
        }
    }

    hitPipe() {
        if (this.plane.alive == false) return;

        this.timedEvent.remove(false);
        this.plane.alive = false;

        this.pipes.children.each(function (pipe) {
            pipe.body.velocity.x = 0;
        });
    }

    preload() {
        this.load.spritesheet('plane', 'assets/planesheet.png', { frameWidth: 98, frameHeight: 83 });
        this.load.image('pipe', 'assets/pipe.png');
        this.load.audio('jump', 'assets/jump.wav');
    }


    create() {
        this.add.text(630, 450, "Created by yawty1", { fontSize: 16, color: "black" });
        //Додаємо літак на сцену
        this.plane = this.physics.add.sprite(0, 0, 'plane')
        //Масштабуємо літак
        this.plane.setScale(0.5, 0.5);
        //Встановлюємо опорну точку літака
        this.plane.setOrigin(0, 0.5);

        this.anims.create({
            key: "planeAnimation",
            frames: this.anims.generateFrameNumbers('plane', { frames: [0, 1, 3, 2] }),
            frameRate: 10,
            repeat: -1
        });
        this.plane.play("planeAnimation");

        this.plane.body.gravity.y = 1000;

        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.score = 0;
        this.labelScore = this.add.text(20, 20, "0", { fontSize: 24, color: "black" });


        this.pipes = this.physics.add.group();

        this.timedEvent = this.time.addEvent({
            delay: 1500,
            callback: this.addRowOfPipes, //Цю функцію реалізуємо на наступному кроці
            callbackScope: this,
            loop: true


        });
        this.physics.add.overlap(this.plane, this.pipes, this.hitPipe, null, this);
    }


    // While preload() and create() run only once at the start of the game, update() runs constantly.
    update() {
        if (this.plane.angle < 20) {
            this.plane.angle += 1;
        }

        if (this.plane.y < 0 || this.plane.y > 490) {
            this.scene.restart();
        }

        if (this.spaceBar.isDown) {
            this.jump();
        }
    }
}



const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 490,
    scene: Main, // Цю сцену ми створимо на 4-му кроці
    backgroundColor: '#FFC0CB',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    }
};

const game = new Phaser.Game(config);



