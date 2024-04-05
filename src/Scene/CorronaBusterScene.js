import Phaser from "phaser";
import FallingObject from "../ui/FallingObject";

import Laser from "../ui/Laser";
export default class CorronaBusterScene extends Phaser.Scene{
    constructor(){
        super('corona-buster-scene')
    }
    init(){
        this.cloud = undefined;
        this.nav_left = false;
        this.nav_right = false;
        this.shoot = false;
        this.player = undefined;
        this.speed = 100
        this.cursor = undefined;
        this.enemies = undefined;
        this.enemySpeed = 50;
        this.laser = undefined;
        this.lastFired = 10
        this.scoreLabel = undefined;
        this.score = 0;
        this.lifeLabel = undefined;
        this.life = 3;
    }
    preload(){
        this.load.image('background', 'image/bg_layer1.png')
        this.load.image('clouds', 'image/cloud.png')
        this.load.image('left-btn', 'image/left-btn.png')
        this.load.image('right-btn', 'image/right-btn.png')
        this.load.image('shoot', 'image/shoot-btn.png')
        this.load.image('enemy', 'image/enemy.png')
        // this.load.image('Laser', 'image/laser-bolts.png')
        this.load.spritesheet('player', 'image/ship.png',{
            frameWidth: 66,
            frameHeight:66
        })
        this.load.spritesheet('laser','image/laser-bolts.png',{
            frameWidth: 16,
            frameHeight: 16,
        })
        
    }
    create(){
        const gameWidth = this.scale.width*0.5
        const gameHeight = this.scale.height*0.5
        this.add.image(gameWidth, gameHeight, 'background')
        this.cloud = this.physics.add.group({
            key: 'clouds',
            repeat: 10 ,

        })
        Phaser.Actions.RandomRectangle(
            this.cloud.getChildren(),
            this.physics.world.bounds
        )
        this.createButton()
        this.player = this.createPlayer() 
        this.cursor=this.input.keyboard.createCursorKeys()
        this.enemies = this.physics.add.group({
            classType: FallingObject,
            maxSize: 10,
            runChildUpdate: true
        })
        this.time.addEvent({
            delay: Phaser.Math.Between(1000, 5000),
            callback: this.spawnEnemy,
            callbackScope: this,
            loop: true
        })
        this.lasers = this.physics.add.group({
            classType: Laser,
            maxSize: 10,
            runChildUpdate: true
        })
        this.physics.add.overlap(
            this.enemies,
            this.lasers,
            this.hitEnemy,
            null,
            this
        )
        this.scoreLabel = this.add.text(10, 10, 'score', {
            fontSize: 16,
            fill: 'black',
            backgroundColor: 'white',

        }).setDepth(1)
        this.lifeLabel = this.add.text(10, 40, 'life', {
            fontSize: 16,
            fill: 'black',
            backgroundColor: 'white',

        }).setDepth(1)
        this.physics.add.overlap(
            this.player,
            this.enemies,
            this.decreaseLife,
            null,
            this
        )
    }
    update(time){
        this.cloud.children.iterate((child) => {
            child.setVelocityY(100)
            if(child.y > this.scale.height){
            // @ts-ignore
            child.x = Phaser.Math.Between(10, 400)
            // @ts-ignore
            child.y = 0
            }
        })
        this.movePlayer(this.player, time)
        this.moveYLine(this.player, time)
        this.scoreLabel.setText('Score:'+this.score)
        this.lifeLabel.setText('life:'+this.life)
    }
    createButton(){
        this.input.addPointer(3)

        let shoot = this.add.image(320,550, 'shoot').setInteractive().setDepth(0.5).setAlpha(0.8)

        let nav_left = this.add.image(50,550, 'left-btn').setInteractive().setDepth(0.5).setAlpha(0.8)

        let nav_right = this.add.image(nav_left.x + nav_left.displayWidth+20, 550,'right-btn').setInteractive().setDepth(0.5).setAlpha(0.8)
        nav_left.on('pointerdown', () => {
            this.nav_left = true
        }, this)
        nav_left.on('pointerout', () => {
            this.nav_left = false
        }, this)
        nav_right.on('pointerdown', () => {
            this.nav_right = true
        }, this)
        nav_right.on('pointerout', () => {
            this.nav_right = false
        }, this)
        shoot.on('pointerdown', () => {
            this.shoot = true
        }, this)
        shoot.on('pointerout', () => {
            this.shoot = false
        }, this)
    }
    movePlayer(player, time) {
        if (this.nav_left ){ this.player.setVelocityX(this.speed * -1)
            this.player.anims.play('left', true)
            this.player.setFlipX(false)
        } else if (this.nav_right){
            this.player.setVelocityX(this.speed)
            this.player.anims.play('right', true)
            this.player.setFlipX(true)
        //keyboard
        }else if (this.cursor.left.isDown){
            this.player.setVelocityX(this.speed * -1)
            this.player.anims.play('left',true)
            this.player.setFlipX(false)
        }else if(this.cursor.right.isDown){
            this.player.setVelocityX(this.speed)
            this.player.anims.play('right',true)
            this.player.setFlipX(true)
        }else {
            this.player.setVelocityX(0)
            this.player.setVelocityY(0)
            this.player.anims.play('turn')
        }
        if ((this.shoot) && time > this.lastFired) {
            const laser = this.lasers.get(0, 0, 'laser')
            if (laser) {
                laser.fire(this.player.x, this.player.y)
                this.lastFired = time + 500
            }
        }
        
    
    }
    moveYLine(player,time){
        if(this.cursor.down.isDown){
            this.player.setVelocityY(this.speed)
        }else if(this.cursor.up.isDown){
            this.player.setVelocityY(this.speed * -1)
        }else {
            this.player.setVelocityY(0)
        }
    }//biar ga ngebug
    createPlayer() {
        const player = this.physics.add.sprite(200, 450, 'player')
        player.setCollideWorldBounds(true)
        this.anims.create({
            key: 'turn',
            frames: [{
            key: 'player',frame: 0
            }],
        })
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player', {
                start: 1, end: 2
            }),
        })
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player', {
                start: 1,end: 2
            })
        })
        return player
    }
    spawnEnemy() {
        const config = {
            speed: 30,
            rotation: 0.1
        }
        // @ts-ignore
        const enemy = this.enemies.get(0,0,'enemy',config)
        const positionX = Phaser.Math.Between(50, 350)
        if (enemy) {
            enemy.spawn(positionX)
        }
    }
    hitEnemy(laser, enemy) {
        laser.die()
        enemy.die()
        this.score += 10;
    }
    decreaseLife(player, enemy){
        enemy.die()
        this.life--
        if (this.life == 2){
            player.setTint(0xff0000)
        }else if (this.life == 1){
            player.setTint(0xff0000).setAlpha(0.2)
        }else if (this.life == 0) {
            this.scene.start('over-scene',{score:this.score})
        }
    }
}