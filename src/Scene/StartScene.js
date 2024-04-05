import Phaser from 'phaser'
export default class StartScene extends Phaser.Scene {
    constructor() {
        super('start-scene')
    }
    init(data) {
        this.startButton = undefined
    }
    preload() {
        this.load.image('background', 'image/bg_layer1.png')
        this.load.image('start-button', 'image/Start-button.png')
    }
    create() {
        this.add.image(200, 320, 'background')
        this.startButton = this.add.image(200, 400, 'start-button')
            .setInteractive().setScale(0.1)
        this.startButton.once('pointerup', () => {
            this.scene.start('corona-buster-scene')
        }, this)
    }
}