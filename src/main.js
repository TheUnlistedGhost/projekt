import Phaser from 'phaser'

import CorronaBusterScene from './Scene/CorronaBusterScene.js'
import GameOverScene from './Scene/GameOverScene.js'
import StartScene from './Scene/StartScene.js'

const config = {
	type: Phaser.AUTO,
	parent: 'app',
	width: 400,
	height: 620,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 },
		},
	},
	scene: [StartScene, CorronaBusterScene, GameOverScene],
	scale: {
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH
	}
}

export default new Phaser.Game(config)
