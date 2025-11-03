// Find Smudge - Phaser 3 Mobile Edition
// Landscape-only mobile game

const VERSION = 'v2.0.0';

// ====== BOOT SCENE ======
// Loads all assets
class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // Load sprites
        this.load.image('smudge_idle', 'assets/sprites/smudge_idle.png');
        this.load.image('smudge_jumping', 'assets/sprites/smudge_jumping.png');
        this.load.image('smudge_searching', 'assets/sprites/smudge_searching.png');
        this.load.image('smudge_running', 'assets/sprites/smudge_running.png');
        this.load.image('laundry_basket', 'assets/sprites/laundry_basket.png');
        this.load.image('martini_glass', 'assets/sprites/martini_glass.png');
        this.load.image('neighborhood_map', 'assets/sprites/neighborhood_map.png');
        this.load.image('ice_cream_cone', 'assets/sprites/ice_cream_cone.png');
        this.load.image('mom_dad_bed', 'assets/sprites/mom_dad_bed.png');
    }

    create() {
        this.scene.start('MainMenuScene');
    }
}

// ====== MAIN MENU SCENE ======
class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenuScene' });
    }

    create() {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

        // Title
        const title = this.add.text(centerX, 80, 'FIND SMUDGE', {
            fontFamily: 'Baloo 2',
            fontSize: '42px',
            fontStyle: 'bold',
            color: '#ff9966',
            stroke: '#ffffff',
            strokeThickness: 4
        }).setOrigin(0.5);

        // Subtitle
        const subtitle = this.add.text(centerX, 125, 'A Tabby Cat Adventure', {
            fontFamily: 'Baloo 2',
            fontSize: '20px',
            color: '#b48c64'
        }).setOrigin(0.5);

        // Smudge sprite (bobbing animation)
        const smudge = this.add.image(centerX, centerY - 10, 'smudge_idle')
            .setScale(2);

        // Bob animation
        this.tweens.add({
            targets: smudge,
            y: centerY - 20,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Menu buttons
        const buttonY = centerY + 70;
        const buttonSpacing = 50;

        this.createButton(centerX, buttonY, 'New Game', () => {
            this.scene.start('OverworldScene');
        });

        this.createButton(centerX, buttonY + buttonSpacing, 'Continue', () => {
            this.scene.start('OverworldScene');
        });

        this.createButton(centerX, buttonY + buttonSpacing * 2, 'Quit', () => {
            console.log('Quit game');
        });

        // Version number
        this.add.text(centerX, this.cameras.main.height - 20, VERSION, {
            fontFamily: 'Baloo 2',
            fontSize: '12px',
            color: '#b4a08c'
        }).setOrigin(0.5);

        // Touch/keyboard instructions
        this.add.text(centerX, 30, 'Tap to play', {
            fontFamily: 'Baloo 2',
            fontSize: '14px',
            color: '#8c7860'
        }).setOrigin(0.5);
    }

    createButton(x, y, text, callback) {
        const button = this.add.container(x, y);

        // Button background
        const bg = this.add.rectangle(0, 0, 250, 40, 0xffcc99, 1);
        bg.setStrokeStyle(3, 0xff9966);

        // Button text
        const label = this.add.text(0, 0, text, {
            fontFamily: 'Baloo 2',
            fontSize: '18px',
            fontStyle: 'bold',
            color: '#5c4033'
        }).setOrigin(0.5);

        button.add([bg, label]);
        button.setSize(250, 40);

        // Make interactive
        bg.setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                button.setScale(0.95);
            })
            .on('pointerup', () => {
                button.setScale(1);
                callback();
            })
            .on('pointerover', () => {
                bg.setFillStyle(0xff9966);
            })
            .on('pointerout', () => {
                bg.setFillStyle(0xffcc99);
                button.setScale(1);
            });

        return button;
    }
}

// ====== OVERWORLD SCENE ======
class OverworldScene extends Phaser.Scene {
    constructor() {
        super({ key: 'OverworldScene' });
    }

    create() {
        const centerX = this.cameras.main.width / 2;

        // Title
        this.add.text(centerX, 40, 'Choose a Quest:', {
            fontFamily: 'Baloo 2',
            fontSize: '28px',
            fontStyle: 'bold',
            color: '#8c5a3c'
        }).setOrigin(0.5);

        // Smudge sprite
        this.add.image(80, 80, 'smudge_idle').setScale(1.5);

        // Quest buttons
        const quests = [
            { name: 'Laundry Leap', scene: 'LaundryLeapScene' },
            { name: 'Martini Mondays', scene: 'MartiniMondaysScene' },
            { name: 'Ice Cream Headache', scene: 'IceCreamScene' },
            { name: 'Air Tag', scene: 'AirTagScene' }
        ];

        const startY = 100;
        const spacing = 50;

        quests.forEach((quest, i) => {
            this.createQuestButton(centerX, startY + i * spacing, quest.name, quest.scene);
        });

        // Back button
        this.createBackButton();

        // Instructions
        this.add.text(centerX, this.cameras.main.height - 20, 'Tap a quest to start', {
            fontFamily: 'Baloo 2',
            fontSize: '14px',
            color: '#96785a'
        }).setOrigin(0.5);
    }

    createQuestButton(x, y, text, sceneKey) {
        const button = this.add.container(x, y);

        const bg = this.add.rectangle(0, 0, 400, 38, 0xffffff, 1);
        bg.setStrokeStyle(2, 0xffcc99);

        const label = this.add.text(0, 0, text, {
            fontFamily: 'Baloo 2',
            fontSize: '16px',
            color: '#5c4033'
        }).setOrigin(0.5);

        button.add([bg, label]);

        bg.setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                button.setScale(0.98);
            })
            .on('pointerup', () => {
                button.setScale(1);
                // For now just show alert, we'll implement quests next
                alert(`${text} - Coming soon!`);
            })
            .on('pointerover', () => {
                bg.setFillStyle(0xffcc99);
            })
            .on('pointerout', () => {
                bg.setFillStyle(0xffffff);
                button.setScale(1);
            });

        return button;
    }

    createBackButton() {
        const backBtn = this.add.text(30, 30, '← Back', {
            fontFamily: 'Baloo 2',
            fontSize: '16px',
            color: '#ff9966'
        }).setInteractive({ useHandCursor: true })
            .on('pointerup', () => {
                this.scene.start('MainMenuScene');
            });
    }
}

// Game configuration with mobile-first design
const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 800,
    height: 450,
    backgroundColor: '#fff8f0',
    scale: {
        mode: Phaser.Scale.ENVELOP,  // Fills screen while maintaining aspect ratio
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 450
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [BootScene, MainMenuScene, OverworldScene]
};

const game = new Phaser.Game(config);

console.log(`Find Smudge ${VERSION} - Phaser 3 Edition initialized`);
