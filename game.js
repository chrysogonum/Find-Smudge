// Find Smudge - A Tabby Cat Adventure
// Help Smudge complete quests around the house and neighborhood!

console.log('Starting Kaboom initialization...');

kaboom({
    width: 800,
    height: 600,
    scale: 1,
    background: [255, 250, 245], // Warm cream background
});

console.log('Kaboom initialized!');

// Mobile input system is defined in index.html
// (window.smudgeInput is already available)

// Load all sprites
loadSprite('smudge_idle', 'assets/sprites/smudge_idle.png');
loadSprite('smudge_jumping', 'assets/sprites/smudge_jumping.png');
loadSprite('smudge_searching', 'assets/sprites/smudge_searching.png');
loadSprite('smudge_running', 'assets/sprites/smudge_running.png');
loadSprite('laundry_basket', 'assets/sprites/laundry_basket.png');
loadSprite('martini_glass', 'assets/sprites/martini_glass.png');
loadSprite('neighborhood_map', 'assets/sprites/neighborhood_map.png');
loadSprite('ice_cream_cone', 'assets/sprites/ice_cream_cone.png');
loadSprite('mom_dad_bed', 'assets/sprites/mom_dad_bed.png');

// Global game state
const gameState = {
    player: {
        energy: 100,
        maxEnergy: 100,
        completedQuests: new Set(),
    }
};

// Save/load system
function saveGame() {
    const data = {
        energy: gameState.player.energy,
        completedQuests: Array.from(gameState.player.completedQuests),
    };
    localStorage.setItem('find_smudge_save', JSON.stringify(data));
}

function loadGame() {
    const saved = localStorage.getItem('find_smudge_save');
    if (saved) {
        const data = JSON.parse(saved);
        gameState.player.energy = data.energy;
        gameState.player.completedQuests = new Set(data.completedQuests);
    }
}

// ===========================
// MOBILE INPUT SYSTEM
// ===========================

// Mobile buttons simulate real keyboard events, so we can use
// regular onKeyPress for everything!

// Alias for consistency - but just uses regular onKeyPress now
function onAnyKeyPress(key, callback) {
    onKeyPress(key, callback);
}

// Enhanced isKeyDown that works with both keyboard and touch
function isAnyKeyDown(key) {
    return isKeyDown(key) || window.smudgeInput.isDown(key);
}

// ===========================
// UTILITY FUNCTIONS
// ===========================

function sparkleBurst(p, n = 16) {
    for (let i = 0; i < n; i++) {
        const ang = rand(0, 360);
        const spd = rand(120, 240);
        add([
            pos(p),
            circle(2),
            color(rand(230, 255), rand(170, 150), rand(100, 150)),
            opacity(1),
            move(ang, spd),
            lifespan(0.6, { fade: 0.35 }),
            z(9999),
        ]);
    }
}

function drawTextShadow(txt, x, y, opts = {}) {
    const size = opts.size || 24;
    const align = opts.align || 'left';
    const col = opts.color || rgb(255, 255, 255);

    // Shadow
    drawText({
        text: txt,
        pos: vec2(x + 2, y + 2),
        size: size,
        align: align,
        color: rgb(0, 0, 0, 0.3),
    });

    // Main text
    drawText({
        text: txt,
        pos: vec2(x, y),
        size: size,
        align: align,
        color: col,
    });
}

function uiPill(text, y, { selected = false, centered = true } = {}) {
    const padX = 14;
    const padY = 6;
    const textSize = 20;
    const w = text.length * 12 + padX * 2;
    const h = 34;
    const r = 12;
    const x = centered ? width() / 2 - w / 2 : padX;

    drawRect({
        width: w,
        height: h,
        pos: vec2(x, y),
        radius: r,
        color: selected ? rgb(255, 153, 102) : rgb(255, 255, 255),
        outline: { color: selected ? rgb(200, 100, 50) : rgb(255, 204, 153), width: 3 },
    });

    drawText({
        text,
        size: textSize,
        pos: vec2(x + padX, y + padY + 2),
        color: selected ? rgb(92, 64, 51) : rgb(92, 64, 51),
    });

    return { x, y, w, h };
}

function getBobOffset(speed = 3, amplitude = 3) {
    return Math.sin(time() * speed) * amplitude;
}

// ===========================
// MAIN MENU SCENE
// ===========================
scene('mainMenu', () => {
    console.log('Main menu scene started!');
    loadGame();

    let selectedIndex = 0;
    const menuOptions = ['New Game', 'Continue', 'Quit'];
    console.log('Menu options:', menuOptions);

    onDraw(() => {
        // Title
        drawTextShadow('FIND SMUDGE', width() / 2, 80, {
            size: 48,
            align: 'center',
            color: rgb(255, 153, 102),
        });

        drawTextShadow('A Tabby Cat Adventure', width() / 2, 140, {
            size: 20,
            align: 'center',
            color: rgb(180, 140, 100),
        });

        // Smudge (bobbing)
        const smudgeY = 220 + getBobOffset();
        drawSprite({
            sprite: 'smudge_idle',
            pos: vec2(width() / 2, smudgeY),
            scale: 3,
            anchor: 'center',
        });

        // Menu options
        for (let i = 0; i < menuOptions.length; i++) {
            uiPill(menuOptions[i], 350 + i * 50, { selected: i === selectedIndex });
        }

        // Controls hint
        drawTextShadow('↑/↓ Navigate · A = Select', width() / 2, height() - 40, {
            size: 16,
            align: 'center',
            color: rgb(150, 120, 90),
        });
    });

    onAnyKeyPress('up', () => {
        selectedIndex = (selectedIndex - 1 + menuOptions.length) % menuOptions.length;
    });

    onAnyKeyPress('down', () => {
        selectedIndex = (selectedIndex + 1) % menuOptions.length;
    });

    onAnyKeyPress('enter', () => {
        if (menuOptions[selectedIndex] === 'New Game') {
            gameState.player.energy = 100;
            gameState.player.completedQuests.clear();
            saveGame();
            go('overworld');
        } else if (menuOptions[selectedIndex] === 'Continue') {
            go('overworld');
        } else if (menuOptions[selectedIndex] === 'Quit') {
            // Close window (doesn't work in browser, but shows intent)
            window.close();
        }
    });
});

// ===========================
// OVERWORLD SCENE (Quest Hub)
// ===========================
scene('overworld', () => {
    let selectedIndex = 0;
    const quests = [
        { name: 'Laundry Leap', id: 'laundry_leap', scene: 'laundryLeap' },
        { name: 'Martini Mondays', id: 'martini_mondays', scene: 'martiniMondays' },
        { name: 'Ice Cream Headache', id: 'ice_cream_headache', scene: 'iceCreamHeadache' },
        { name: 'Air Tag', id: 'air_tag', scene: 'airTag' },
    ];

    onDraw(() => {
        // Background
        drawRect({
            pos: vec2(0, 0),
            width: width(),
            height: height(),
            color: rgb(255, 245, 230),
        });

        // Title
        drawTextShadow('QUEST HUB', width() / 2, 40, {
            size: 36,
            align: 'center',
            color: rgb(255, 153, 102),
        });

        // Smudge (upper-middle left area)
        const smudgeY = 160 + getBobOffset();
        drawSprite({
            sprite: 'smudge_idle',
            pos: vec2(200, smudgeY),
            scale: 1.6,
            anchor: 'center',
        });

        // Energy display
        drawText({
            text: `Energy: ${gameState.player.energy}/100`,
            pos: vec2(20, 20),
            size: 20,
            color: rgb(255, 153, 102),
        });

        // Quest list
        drawTextShadow('Choose a Quest:', width() / 2, 220, {
            size: 22,
            align: 'center',
            color: rgb(140, 90, 60),
        });

        for (let i = 0; i < quests.length; i++) {
            const quest = quests[i];
            const completed = gameState.player.completedQuests.has(quest.id);
            const text = `${quest.name} ${completed ? '✓' : ''}`;
            uiPill(text, 265 + i * 50, { selected: i === selectedIndex });
        }

        // Instructions
        drawTextShadow('↑/↓ Navigate · A = Select · B = Back', width() / 2, height() - 30, {
            size: 16,
            align: 'center',
            color: rgb(150, 120, 90),
        });
    });

    onAnyKeyPress('up', () => {
        selectedIndex = (selectedIndex - 1 + quests.length) % quests.length;
    });

    onAnyKeyPress('down', () => {
        selectedIndex = (selectedIndex + 1) % quests.length;
    });

    onAnyKeyPress('enter', () => {
        go(quests[selectedIndex].scene);
    });

    onAnyKeyPress('escape', () => {
        go('mainMenu');
    });
});

// ===========================
// LAUNDRY LEAP QUEST
// ===========================
scene('laundryLeap', () => {
    let phase = 'intro'; // 'intro', 'positioning', 'jumping', 'result'
    let basketX = 600;
    let basketSpeed = 150;
    let smudgeY = 450;
    let jumpProgress = 0;
    let jumpSpeed = 0;
    const gravity = 800;
    let result = '';
    let temperature = 0;
    const perfectTemp = 75;

    onUpdate(() => {
        if (phase === 'positioning') {
            // Basket moves side to side
            basketX += basketSpeed * dt();
            if (basketX > 700 || basketX < 100) {
                basketSpeed *= -1;
            }

            // Temperature decreases over time
            temperature = Math.max(0, temperature - dt() * 10);
        } else if (phase === 'jumping') {
            // Smudge jumps!
            jumpSpeed += gravity * dt();
            smudgeY += jumpSpeed * dt();
            jumpProgress += dt();

            // Check landing
            if (smudgeY >= 300) {
                const smudgeX = 200;
                const distance = Math.abs(smudgeX - basketX);

                if (distance < 80 && temperature > 50) {
                    result = 'SUCCESS! Perfect landing in warm laundry!';
                    gameState.player.completedQuests.add('laundry_leap');
                    saveGame();
                    sparkleBurst(vec2(basketX, 300), 30);
                } else if (distance < 80) {
                    result = 'Landed... but the laundry cooled down!';
                } else {
                    result = 'Missed the basket! Try again?';
                }

                phase = 'result';
            }
        }
    });

    onDraw(() => {
        // Background
        drawRect({
            pos: vec2(0, 0),
            width: width(),
            height: height(),
            color: rgb(230, 220, 210),
        });

        // Title
        drawTextShadow('LAUNDRY LEAP', width() / 2, 30, {
            size: 32,
            align: 'center',
            color: rgb(255, 153, 102),
        });

        if (phase === 'intro') {
            drawTextShadow('The dryer just finished!', width() / 2, 120, {
                size: 22,
                align: 'center',
            });
            drawTextShadow('Help Smudge jump into', width() / 2, 160, {
                size: 18,
                align: 'center',
            });
            drawTextShadow('the warm laundry basket!', width() / 2, 185, {
                size: 18,
                align: 'center',
            });

            // Smudge waiting (centered, above controls)
            drawSprite({
                sprite: 'smudge_idle',
                pos: vec2(width() / 2, 280),
                scale: 2,
                anchor: 'center',
            });

            drawTextShadow('Press SPACE (␣) when', width() / 2, 360, {
                size: 16,
                align: 'center',
                color: rgb(255, 153, 102),
            });
            drawTextShadow('basket is close!', width() / 2, 380, {
                size: 16,
                align: 'center',
                color: rgb(255, 153, 102),
            });

            drawTextShadow('Press A to start', width() / 2, 440, {
                size: 20,
                align: 'center',
                color: rgb(140, 90, 60),
            });
        } else if (phase === 'positioning' || phase === 'jumping') {
            // Laundry basket
            drawSprite({
                sprite: 'laundry_basket',
                pos: vec2(basketX, 300),
                scale: 1.5,
                anchor: 'center',
            });

            // Temperature indicator
            const tempColor = temperature > 70 ? rgb(255, 200, 100) : temperature > 40 ? rgb(255, 220, 150) : rgb(200, 200, 200);
            drawText({
                text: `Warmth: ${Math.floor(temperature)}°`,
                pos: vec2(basketX - 40, 220),
                size: 16,
                color: tempColor,
            });

            // Smudge
            const sprite = phase === 'jumping' ? 'smudge_jumping' : 'smudge_idle';
            drawSprite({
                sprite: sprite,
                pos: vec2(200, smudgeY),
                scale: 2,
                anchor: 'center',
            });

            // Instructions
            if (phase === 'positioning') {
                drawTextShadow('Press SPACE to JUMP!', width() / 2, 500, {
                    size: 24,
                    align: 'center',
                    color: rgb(255, 153, 102),
                });
            }
        } else if (phase === 'result') {
            drawSprite({
                sprite: 'laundry_basket',
                pos: vec2(basketX, 300),
                scale: 1.5,
                anchor: 'center',
            });

            drawSprite({
                sprite: result.includes('SUCCESS') ? 'smudge_idle' : 'smudge_searching',
                pos: vec2(basketX, 280),
                scale: 2,
                anchor: 'center',
            });

            const resultColor = result.includes('SUCCESS') ? rgb(100, 200, 100) : rgb(255, 150, 100);
            drawTextShadow(result, width() / 2, 450, {
                size: 24,
                align: 'center',
                color: resultColor,
            });

            drawTextShadow('Press A to continue', width() / 2, 520, {
                size: 20,
                align: 'center',
            });
        }
    });

    onAnyKeyPress('enter', () => {
        if (phase === 'intro') {
            phase = 'positioning';
            temperature = perfectTemp;
        } else if (phase === 'result') {
            if (result.includes('SUCCESS')) {
                go('questComplete', { questName: 'Laundry Leap' });
            } else {
                go('overworld');
            }
        }
    });

    onAnyKeyPress('space', () => {
        if (phase === 'positioning') {
            phase = 'jumping';
            jumpSpeed = -400; // Initial jump velocity
        }
    });

    onAnyKeyPress('escape', () => {
        go('overworld');
    });
});

// ===========================
// MARTINI MONDAYS QUEST
// ===========================
scene('martiniMondays', () => {
    let phase = 'intro'; // 'intro', 'searching', 'result'
    let selectedLocation = 0;
    const locations = [
        { name: 'Under the Fridge', chance: 0.4 },
        { name: 'Under the Couch', chance: 0.4 },
        { name: 'Basement Stairs', chance: 0.2 },
    ];
    let toyLocation = null;
    let result = '';
    let attempts = 0;
    const maxAttempts = 3;

    function startSearch() {
        // Randomly place the toy
        const roll = rand();
        let cumulative = 0;
        for (let i = 0; i < locations.length; i++) {
            cumulative += locations[i].chance;
            if (roll < cumulative) {
                toyLocation = i;
                break;
            }
        }
        phase = 'searching';
    }

    onDraw(() => {
        // Background
        drawRect({
            pos: vec2(0, 0),
            width: width(),
            height: height(),
            color: rgb(240, 230, 220),
        });

        // Title
        drawTextShadow('MARTINI MONDAYS', width() / 2, 30, {
            size: 32,
            align: 'center',
            color: rgb(255, 153, 102),
        });

        if (phase === 'intro') {
            drawTextShadow("Smudge lost his", width() / 2, 170, {
                size: 22,
                align: 'center',
            });
            drawTextShadow("martini glass toy!", width() / 2, 200, {
                size: 22,
                align: 'center',
            });
            drawTextShadow('Where could it be?', width() / 2, 240, {
                size: 18,
                align: 'center',
            });

            // Smudge searching
            drawSprite({
                sprite: 'smudge_searching',
                pos: vec2(width() / 2, 350),
                scale: 2.5,
                anchor: 'center',
            });

            drawTextShadow('Press A to start searching', width() / 2, 480, {
                size: 20,
                align: 'center',
                color: rgb(140, 90, 60),
            });
        } else if (phase === 'searching') {
            drawTextShadow(`Attempts: ${attempts}/${maxAttempts}`, 20, 80, {
                size: 20,
                color: rgb(255, 153, 102),
            });

            drawTextShadow('Where should Smudge look?', width() / 2, 150, {
                size: 24,
                align: 'center',
            });

            // Location options
            for (let i = 0; i < locations.length; i++) {
                uiPill(locations[i].name, 220 + i * 60, { selected: i === selectedLocation });
            }

            // Smudge
            drawSprite({
                sprite: 'smudge_searching',
                pos: vec2(width() / 2, 450),
                scale: 2.5,
                anchor: 'center',
            });

            drawTextShadow('↑/↓ Navigate · ENTER Search · ESC Back', width() / 2, height() - 30, {
                size: 16,
                align: 'center',
            });
        } else if (phase === 'result') {
            const resultColor = result.includes('FOUND') ? rgb(100, 200, 100) : rgb(255, 150, 100);

            if (result.includes('FOUND')) {
                // Show the toy!
                drawSprite({
                    sprite: 'martini_glass',
                    pos: vec2(width() / 2, 200),
                    scale: 3,
                    anchor: 'center',
                });

                drawSprite({
                    sprite: 'smudge_idle',
                    pos: vec2(width() / 2, 380),
                    scale: 3,
                    anchor: 'center',
                });
            } else {
                drawSprite({
                    sprite: 'smudge_searching',
                    pos: vec2(width() / 2, 280),
                    scale: 3,
                    anchor: 'center',
                });
            }

            drawTextShadow(result, width() / 2, 480, {
                size: 24,
                align: 'center',
                color: resultColor,
            });

            drawTextShadow('Press A to continue', width() / 2, 540, {
                size: 20,
                align: 'center',
            });
        }
    });

    onAnyKeyPress('enter', () => {
        if (phase === 'intro') {
            startSearch();
        } else if (phase === 'searching') {
            attempts++;

            if (selectedLocation === toyLocation) {
                result = 'FOUND IT! Martini time! 🍸';
                gameState.player.completedQuests.add('martini_mondays');
                saveGame();
                phase = 'result';
                sparkleBurst(vec2(width() / 2, 200), 30);
            } else {
                if (attempts >= maxAttempts) {
                    result = "Couldn't find it... Maybe next Monday?";
                    phase = 'result';
                } else {
                    result = `Not here! ${maxAttempts - attempts} attempts left`;
                    // Brief feedback then continue searching
                    wait(1, () => {
                        if (phase === 'searching') {
                            // Still searching
                        }
                    });
                }
            }
        } else if (phase === 'result') {
            if (result.includes('FOUND')) {
                go('questComplete', { questName: 'Martini Mondays' });
            } else {
                go('overworld');
            }
        }
    });

    onAnyKeyPress('up', () => {
        if (phase === 'searching') {
            selectedLocation = (selectedLocation - 1 + locations.length) % locations.length;
        }
    });

    onAnyKeyPress('down', () => {
        if (phase === 'searching') {
            selectedLocation = (selectedLocation + 1) % locations.length;
        }
    });

    onAnyKeyPress('escape', () => {
        go('overworld');
    });
});

// ===========================
// AIR TAG QUEST
// ===========================
scene('airTag', () => {
    let phase = 'intro'; // 'intro', 'searching', 'found', 'result'
    let neighborsAsked = 0;
    const totalNeighbors = 3;
    let smudgeLocation = choose([0, 1, 2]); // Random hiding spot
    let selectedNeighbor = 0;
    let result = '';

    const neighbors = [
        { name: 'Neighbor A', clue: 'saw something near the park' },
        { name: 'Neighbor B', clue: 'heard meowing by the bushes' },
        { name: 'Neighbor C', clue: 'spotted a tabby by the garage' },
    ];

    onDraw(() => {
        // Background
        drawRect({
            pos: vec2(0, 0),
            width: width(),
            height: height(),
            color: rgb(220, 240, 220),
        });

        // Title
        drawTextShadow('AIR TAG', width() / 2, 30, {
            size: 32,
            align: 'center',
            color: rgb(255, 153, 102),
        });

        if (phase === 'intro') {
            drawTextShadow('Oh no! Smudge escaped!', width() / 2, 180, {
                size: 28,
                align: 'center',
                color: rgb(200, 100, 100),
            });
            drawTextShadow('The neighborhood needs to help find him!', width() / 2, 230, {
                size: 20,
                align: 'center',
            });

            // Question mark (Smudge is missing!)
            drawText({
                text: '?',
                pos: vec2(width() / 2 - 30, 300),
                size: 120,
                color: rgb(255, 153, 102),
            });

            drawTextShadow('Press A to start searching', width() / 2, 480, {
                size: 20,
                align: 'center',
                color: rgb(140, 90, 60),
            });
        } else if (phase === 'searching') {
            drawTextShadow(`Asked: ${neighborsAsked}/${totalNeighbors}`, width() / 2, 70, {
                size: 18,
                align: 'center',
                color: rgb(255, 153, 102),
            });

            drawTextShadow('Ask the neighbors for clues:', width() / 2, 130, {
                size: 20,
                align: 'center',
            });

            // Neighbor options
            for (let i = 0; i < neighbors.length; i++) {
                const asked = neighborsAsked > i;
                const text = asked ? `${neighbors[i].name} ✓` : neighbors[i].name;
                uiPill(text, 180 + i * 60, { selected: i === selectedNeighbor });
            }

            // Show clues collected (center, well above mobile controls)
            if (neighborsAsked > 0) {
                drawTextShadow('Clues:', width() / 2, 370, {
                    size: 16,
                    align: 'center',
                    color: rgb(140, 90, 60),
                });

                for (let i = 0; i < neighborsAsked; i++) {
                    drawText({
                        text: `• ${neighbors[i].clue}`,
                        pos: vec2(width() / 2 - 140, 395 + i * 20),
                        size: 13,
                        color: rgb(100, 140, 100),
                    });
                }
            }

            if (neighborsAsked >= totalNeighbors) {
                drawTextShadow('All neighbors asked! Press SPACE to find Smudge!', width() / 2, height() - 40, {
                    size: 18,
                    align: 'center',
                    color: rgb(255, 153, 102),
                });
            } else {
                drawTextShadow('↑/↓ Navigate · ENTER Ask · ESC Back', width() / 2, height() - 30, {
                    size: 16,
                    align: 'center',
                });
            }
        } else if (phase === 'found') {
            drawTextShadow('Following the clues...', width() / 2, 150, {
                size: 24,
                align: 'center',
            });

            // Animation of finding Smudge
            drawSprite({
                sprite: 'smudge_idle',
                pos: vec2(width() / 2, 300 + getBobOffset(5, 10)),
                scale: 3,
                anchor: 'center',
            });

            drawTextShadow('There he is!', width() / 2, 450, {
                size: 28,
                align: 'center',
                color: rgb(100, 200, 100),
            });

            // Auto-advance after a moment
            wait(2, () => {
                result = 'FOUND! The neighborhood worked together! 🏡';
                gameState.player.completedQuests.add('air_tag');
                saveGame();
                phase = 'result';
            });
        } else if (phase === 'result') {
            drawSprite({
                sprite: 'smudge_idle',
                pos: vec2(width() / 2, 280),
                scale: 3,
                anchor: 'center',
            });

            drawTextShadow(result, width() / 2, 450, {
                size: 24,
                align: 'center',
                color: rgb(100, 200, 100),
            });

            drawTextShadow('Press A to continue', width() / 2, 520, {
                size: 20,
                align: 'center',
            });
        }
    });

    onAnyKeyPress('enter', () => {
        if (phase === 'intro') {
            phase = 'searching';
        } else if (phase === 'searching') {
            if (neighborsAsked <= selectedNeighbor) {
                neighborsAsked++;
            }
        } else if (phase === 'result') {
            go('questComplete', { questName: 'Air Tag' });
        }
    });

    onAnyKeyPress('space', () => {
        if (phase === 'searching' && neighborsAsked >= totalNeighbors) {
            phase = 'found';
            sparkleBurst(vec2(width() / 2, 300), 30);
        }
    });

    onAnyKeyPress('up', () => {
        if (phase === 'searching') {
            selectedNeighbor = (selectedNeighbor - 1 + neighbors.length) % neighbors.length;
        }
    });

    onAnyKeyPress('down', () => {
        if (phase === 'searching') {
            selectedNeighbor = (selectedNeighbor + 1) % neighbors.length;
        }
    });

    onAnyKeyPress('escape', () => {
        go('overworld');
    });
});

// ===========================
// ICE CREAM HEADACHE QUEST
// ===========================
scene('iceCreamHeadache', () => {
    console.log('Ice Cream Headache scene started!');
    let phase = 'intro'; // 'intro', 'tiptoeing', 'result'
    let smudgeX = 100;
    const momX = 600;
    const dadX = 400;
    let noiseLevel = 0;
    let result = '';
    let hasIceCream = false;

    onUpdate(() => {
        if (phase === 'tiptoeing') {
            // Noise level decreases over time (if quiet)
            noiseLevel = Math.max(0, noiseLevel - dt() * 20);

            // Check if reached mom
            if (smudgeX >= momX - 50) {
                // Success!
                result = 'SUCCESS! Ice cream "helps" with headaches! 🍦';
                gameState.player.completedQuests.add('ice_cream_headache');
                saveGame();
                phase = 'result';
                sparkleBurst(vec2(momX, 200), 30);
            }

            // Check if woke up dad
            if (noiseLevel > 80) {
                result = 'Oh no! You woke up dad! Abort mission!';
                phase = 'result';
            }
        }
    });

    onDraw(() => {
        // Background (bedroom)
        drawRect({
            pos: vec2(0, 0),
            width: width(),
            height: height(),
            color: rgb(200, 190, 210), // Dim bedroom lighting
        });

        // Title
        drawTextShadow('ICE CREAM HEADACHE', width() / 2, 30, {
            size: 28,
            align: 'center',
            color: rgb(255, 153, 102),
        });

        if (phase === 'intro') {
            drawTextShadow("Mom has a headache!", width() / 2, 100, {
                size: 22,
                align: 'center',
            });
            drawTextShadow("Smudge wants to help", width() / 2, 135, {
                size: 18,
                align: 'center',
            });
            drawTextShadow("with his ice cream toy!", width() / 2, 160, {
                size: 18,
                align: 'center',
            });
            drawTextShadow("Tiptoe past sleeping dad!", width() / 2, 195, {
                size: 16,
                align: 'center',
                color: rgb(255, 200, 100),
            });

            // Smudge with ice cream
            drawSprite({
                sprite: 'ice_cream_cone',
                pos: vec2(width() / 2 - 20, 280),
                scale: 2.5,
                anchor: 'center',
            });

            drawSprite({
                sprite: 'smudge_idle',
                pos: vec2(width() / 2 + 30, 305),
                scale: 1.8,
                anchor: 'center',
            });

            drawTextShadow('LEFT/RIGHT = Move', width() / 2, 380, {
                size: 16,
                align: 'center',
            });
            drawTextShadow('Slow & steady!', width() / 2, 400, {
                size: 16,
                align: 'center',
            });

            drawTextShadow('Press A to start', width() / 2, 450, {
                size: 20,
                align: 'center',
                color: rgb(140, 90, 60),
            });
        } else if (phase === 'tiptoeing' || phase === 'result') {
            // Noise level indicator
            const noiseColor = noiseLevel > 60 ? rgb(255, 100, 100) : noiseLevel > 30 ? rgb(255, 200, 100) : rgb(100, 255, 100);
            drawRect({
                pos: vec2(20, 80),
                width: 200,
                height: 20,
                color: rgb(100, 100, 100),
                radius: 10,
            });
            drawRect({
                pos: vec2(20, 80),
                width: (noiseLevel / 100) * 200,
                height: 20,
                color: noiseColor,
                radius: 10,
            });
            drawText({
                text: `Noise: ${Math.floor(noiseLevel)}%`,
                pos: vec2(25, 82),
                size: 14,
                color: rgb(255, 255, 255),
            });

            // Mom and Dad in bed
            drawSprite({
                sprite: 'mom_dad_bed',
                pos: vec2(momX - 100, 200),
                scale: 2,
                anchor: 'center',
            });

            // Smudge tiptoeing position (declare first, used below)
            const smudgeY = 380 + Math.sin(time() * 8) * 2; // Gentle tiptoeing bounce

            // Ice cream cone (if Smudge has it)
            if (hasIceCream || smudgeX >= momX - 50) {
                const coneY = smudgeX >= momX - 50 ? 140 : smudgeY - 40; // On mom's head if arrived
                drawSprite({
                    sprite: 'ice_cream_cone',
                    pos: vec2(smudgeX + 20, coneY),
                    scale: smudgeX >= momX - 50 ? 1.5 : 1,
                    anchor: 'center',
                });
            }

            // Smudge tiptoeing sprite
            drawSprite({
                sprite: phase === 'tiptoeing' ? 'smudge_idle' : (result.includes('SUCCESS') ? 'smudge_idle' : 'smudge_searching'),
                pos: vec2(smudgeX, smudgeY),
                scale: 2,
                anchor: 'center',
            });

            if (phase === 'tiptoeing') {
                drawTextShadow('Tiptoe slowly... LEFT/RIGHT to move', width() / 2, 500, {
                    size: 16,
                    align: 'center',
                    color: rgb(200, 200, 220),
                });

                drawTextShadow('ESC = Back', width() / 2, 540, {
                    size: 14,
                    align: 'center',
                });
            } else if (phase === 'result') {
                const resultColor = result.includes('SUCCESS') ? rgb(100, 200, 100) : rgb(255, 150, 100);
                drawTextShadow(result, width() / 2, 480, {
                    size: 24,
                    align: 'center',
                    color: resultColor,
                });

                drawTextShadow('Press A to continue', width() / 2, 540, {
                    size: 20,
                    align: 'center',
                });
            }
        }
    });

    onAnyKeyPress('enter', () => {
        if (phase === 'intro') {
            phase = 'tiptoeing';
            hasIceCream = true;
        } else if (phase === 'result') {
            if (result.includes('SUCCESS')) {
                go('questComplete', { questName: 'Ice Cream Headache' });
            } else {
                go('overworld');
            }
        }
    });

    onAnyKeyPress('left', () => {
        if (phase === 'tiptoeing') {
            smudgeX = Math.max(100, smudgeX - 3);
            noiseLevel += 2; // Moving makes noise
        }
    });

    onAnyKeyPress('right', () => {
        if (phase === 'tiptoeing') {
            smudgeX = Math.min(momX, smudgeX + 3);
            noiseLevel += 2; // Moving makes noise
        }
    });

    // Continuous movement (hold down keys)
    onUpdate(() => {
        if (phase === 'tiptoeing') {
            if (isAnyKeyDown('left')) {
                smudgeX = Math.max(100, smudgeX - 50 * dt());
                noiseLevel = Math.min(100, noiseLevel + 15 * dt());
            }
            if (isAnyKeyDown('right')) {
                smudgeX = Math.min(momX, smudgeX + 50 * dt());
                noiseLevel = Math.min(100, noiseLevel + 15 * dt());
            }
        }
    });

    onAnyKeyPress('escape', () => {
        go('overworld');
    });
});

// ===========================
// QUEST COMPLETE SCENE
// ===========================
scene('questComplete', ({ questName }) => {
    onDraw(() => {
        const boxWidth = 500;
        const boxHeight = 200;
        const x = (width() - boxWidth) / 2;
        const y = (height() - boxHeight) / 2;

        // Background
        drawRect({
            pos: vec2(0, 0),
            width: width(),
            height: height(),
            color: rgb(255, 248, 240),
        });

        // Box
        drawRect({
            pos: vec2(x, y),
            width: boxWidth,
            height: boxHeight,
            color: rgb(255, 255, 255),
            radius: 20,
            outline: { color: rgb(255, 204, 153), width: 4 },
        });

        // Quest complete!
        drawTextShadow('QUEST COMPLETE!', width() / 2, y + 50, {
            size: 32,
            align: 'center',
            color: rgb(100, 200, 100),
        });

        drawTextShadow(questName, width() / 2, y + 100, {
            size: 24,
            align: 'center',
            color: rgb(255, 153, 102),
        });

        // Smudge celebrating
        drawSprite({
            sprite: 'smudge_idle',
            pos: vec2(width() / 2, y + 180),
            scale: 2,
            anchor: 'center',
        });

        drawTextShadow('Press A to continue', width() / 2, y + boxHeight + 60, {
            size: 20,
            align: 'center',
        });

        // Sparkles
        if (rand() < 0.3) {
            sparkleBurst(vec2(width() / 2 + rand(-100, 100), y + rand(0, 100)), 2);
        }
    });

    onAnyKeyPress('enter', () => {
        go('overworld');
    });

    onAnyKeyPress('escape', () => {
        go('overworld');
    });
});

// Start the game!
console.log('About to start main menu...');
go('mainMenu');
console.log('Main menu started!');
