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

    // Main text only (shadow removed for clarity)
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
    let smudgeX = 200; // Smudge can now move left and right!
    let smudgeY = 450;
    let jumpProgress = 0;
    let jumpSpeed = 0;
    const gravity = 800;
    let result = '';
    let temperature = 0;
    let finalTemp = 0; // Store temp at landing for bonus calculation
    const perfectTemp = 100; // Start hotter so players have more time!

    onUpdate(() => {
        if (phase === 'positioning') {
            // Basket moves side to side
            basketX += basketSpeed * dt();
            if (basketX > 700 || basketX < 100) {
                basketSpeed *= -1;
            }

            // Smudge can move left and right!
            if (isAnyKeyDown('left')) {
                smudgeX = Math.max(50, smudgeX - 200 * dt());
            }
            if (isAnyKeyDown('right')) {
                smudgeX = Math.min(750, smudgeX + 200 * dt());
            }

            // Temperature decreases over time - more aggressive now! (8° per second)
            temperature = Math.max(0, temperature - dt() * 8);
        } else if (phase === 'jumping') {
            // Smudge jumps!
            jumpSpeed += gravity * dt();
            smudgeY += jumpSpeed * dt();
            jumpProgress += dt();

            // Check landing
            if (smudgeY >= 300) {
                const distance = Math.abs(smudgeX - basketX);
                finalTemp = Math.floor(temperature);

                if (distance < 80 && temperature > 50) {
                    // Temperature bonus based on speed!
                    let bonus = '';
                    if (temperature >= 90) {
                        bonus = 'ULTRA TOASTY! 🔥';
                    } else if (temperature >= 75) {
                        bonus = 'SUPER WARM! ⭐';
                    } else if (temperature >= 60) {
                        bonus = 'Nice & Cozy! ✨';
                    } else {
                        bonus = 'Still Warm!';
                    }
                    result = `SUCCESS! ${bonus}`;
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
            drawTextShadow('The dryer just finished!', width() / 2, 110, {
                size: 22,
                align: 'center',
            });
            drawTextShadow('Help Smudge jump into', width() / 2, 145, {
                size: 18,
                align: 'center',
            });
            drawTextShadow('the warm laundry basket!', width() / 2, 170, {
                size: 18,
                align: 'center',
            });
            drawTextShadow('⚡ Jump FAST for bonus!', width() / 2, 200, {
                size: 16,
                align: 'center',
                color: rgb(255, 180, 100),
            });
            drawTextShadow("Nobody likes cold laundry!", width() / 2, 220, {
                size: 14,
                align: 'center',
                color: rgb(200, 150, 120),
            });

            // Smudge waiting (centered, above controls)
            drawSprite({
                sprite: 'smudge_idle',
                pos: vec2(width() / 2, 280),
                scale: 2,
                anchor: 'center',
            });

            drawTextShadow('Use ← → to move', width() / 2, 350, {
                size: 16,
                align: 'center',
                color: rgb(255, 153, 102),
            });
            drawTextShadow('Press SPACE (␣) to', width() / 2, 370, {
                size: 16,
                align: 'center',
                color: rgb(255, 153, 102),
            });
            drawTextShadow('jump into basket!', width() / 2, 390, {
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

            // Temperature indicator with bar
            const tempColor = temperature > 70 ? rgb(255, 150, 50) : temperature > 50 ? rgb(255, 220, 100) : rgb(150, 150, 150);

            // Temperature bar
            drawRect({
                pos: vec2(20, 80),
                width: 200,
                height: 20,
                color: rgb(100, 100, 100),
                radius: 10,
            });
            drawRect({
                pos: vec2(20, 80),
                width: (temperature / 100) * 200,
                height: 20,
                color: tempColor,
                radius: 10,
            });
            drawText({
                text: `Warmth: ${Math.floor(temperature)}°`,
                pos: vec2(25, 82),
                size: 14,
                color: rgb(255, 255, 255),
            });

            // Smudge
            const sprite = phase === 'jumping' ? 'smudge_jumping' : 'smudge_idle';
            drawSprite({
                sprite: sprite,
                pos: vec2(smudgeX, smudgeY),
                scale: 2,
                anchor: 'center',
            });

            // Instructions
            if (phase === 'positioning') {
                drawTextShadow('← → to move · SPACE to JUMP!', width() / 2, 500, {
                    size: 20,
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

            // Split longer messages to avoid cutoff
            if (result.includes('SUCCESS')) {
                // Extract bonus from result (after "SUCCESS! ")
                const bonusText = result.replace('SUCCESS! ', '');

                drawTextShadow('SUCCESS!', width() / 2, 320, {
                    size: 24,
                    align: 'center',
                    color: resultColor,
                });
                drawTextShadow(bonusText, width() / 2, 350, {
                    size: 22,
                    align: 'center',
                    color: rgb(255, 180, 100),
                });
                drawTextShadow(`${finalTemp}° warmth!`, width() / 2, 380, {
                    size: 18,
                    align: 'center',
                    color: resultColor,
                });
            } else if (result.includes('cooled down')) {
                drawTextShadow('Landed... but the', width() / 2, 360, {
                    size: 20,
                    align: 'center',
                    color: resultColor,
                });
                drawTextShadow('laundry cooled down!', width() / 2, 390, {
                    size: 20,
                    align: 'center',
                    color: resultColor,
                });
            } else {
                drawTextShadow(result, width() / 2, 370, {
                    size: 20,
                    align: 'center',
                    color: resultColor,
                });
            }

            drawTextShadow('Press A to continue', width() / 2, 450, {
                size: 18,
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
        { name: 'Under the Couch', chance: 0.4 },
        { name: 'Basement Stairs', chance: 0.2 },
        { name: 'Under the Fridge', chance: 0.4 },
    ];
    let toyLocation = null;
    let result = '';
    let attempts = 0;
    const maxAttempts = 3;

    function startSearch() {
        // Always under the fridge (index 2)
        toyLocation = 2;
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
            drawTextShadow("Help Smudge find his lost", width() / 2, 170, {
                size: 22,
                align: 'center',
            });
            drawTextShadow("martini before hangover", width() / 2, 200, {
                size: 22,
                align: 'center',
            });
            drawTextShadow('sets in!', width() / 2, 230, {
                size: 22,
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

            // Show feedback message if we just searched and didn't find it
            if (result && result !== '') {
                drawTextShadow(result, width() / 2, 380, {
                    size: 20,
                    align: 'center',
                    color: rgb(255, 180, 100),
                });
                drawTextShadow(`${maxAttempts - attempts} attempts left`, width() / 2, 405, {
                    size: 16,
                    align: 'center',
                    color: rgb(200, 150, 100),
                });
            }

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

            // Split success message to avoid cutoff and sprite overlap
            if (result.includes('FOUND')) {
                drawTextShadow('FOUND IT!', width() / 2, 460, {
                    size: 24,
                    align: 'center',
                    color: resultColor,
                });
                drawTextShadow('Martini time! 🍸', width() / 2, 485, {
                    size: 20,
                    align: 'center',
                    color: resultColor,
                });
            } else {
                drawTextShadow(result, width() / 2, 360, {
                    size: 18,
                    align: 'center',
                    color: resultColor,
                });
            }

            drawTextShadow('Press A to continue', width() / 2, 430, {
                size: 16,
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
                    // Fun cat-themed "not here" messages
                    const notFoundMessages = [
                        "Just dust bunnies here!",
                        "Nope, only cobwebs!",
                        "Nothing but cat hair!",
                        "Empty! Keep looking!",
                        "Not this spot!",
                        "Try somewhere else!"
                    ];
                    result = choose(notFoundMessages);
                    // Brief feedback then clear result to continue searching
                    wait(1.5, () => {
                        if (phase === 'searching') {
                            result = ''; // Clear after showing feedback
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
    let selectedNeighbor = 0;
    let result = '';

    const neighbors = [
        { name: 'Aunt Claudia and Uncle D', clue: 'I heard meowing from above!', x: 150, y: 180 },
        { name: 'Jason and Amy', clue: 'Saw something furry up high', x: 400, y: 160 },
        { name: 'The Peters', clue: 'Check the big oak tree!', x: 650, y: 180 },
    ];

    let currentClue = ''; // Show clue when asking a neighbor
    let clueTimer = 0;

    // Helper function to draw a cute house
    function drawHouse(x, y, color, label, asked) {
        // House body
        drawRect({
            pos: vec2(x - 30, y),
            width: 60,
            height: 50,
            color: color,
            radius: 4,
        });

        // Roof
        drawPolygon({
            pts: [vec2(x, y - 25), vec2(x - 40, y), vec2(x + 40, y)],
            color: rgb(180, 100, 80),
        });

        // Door
        drawRect({
            pos: vec2(x - 10, y + 30),
            width: 20,
            height: 20,
            color: rgb(100, 60, 40),
            radius: 2,
        });

        // Window
        drawRect({
            pos: vec2(x + 10, y + 10),
            width: 12,
            height: 12,
            color: rgb(200, 220, 255),
            radius: 2,
        });

        // Label below house
        drawText({
            text: label,
            pos: vec2(x, y + 65),
            size: 13,
            color: rgb(60, 60, 80),
            align: 'center',
            anchor: 'center',
        });

        // Checkmark if asked
        if (asked) {
            drawText({
                text: '✓',
                pos: vec2(x + 30, y - 10),
                size: 20,
                color: rgb(100, 200, 100),
            });
        }
    }

    // Helper function to draw a tree
    function drawTree(x, y) {
        // Tree trunk
        drawRect({
            pos: vec2(x - 10, y),
            width: 20,
            height: 60,
            color: rgb(120, 80, 50),
            radius: 2,
        });

        // Tree foliage (3 green circles)
        drawCircle({
            pos: vec2(x - 20, y - 20),
            radius: 25,
            color: rgb(80, 150, 80),
        });
        drawCircle({
            pos: vec2(x + 20, y - 20),
            radius: 25,
            color: rgb(80, 150, 80),
        });
        drawCircle({
            pos: vec2(x, y - 35),
            radius: 30,
            color: rgb(60, 140, 60),
        });

        // Blinking Smudge if all neighbors asked
        if (neighborsAsked >= totalNeighbors) {
            const shouldShow = Math.floor(time() * 3) % 2 === 0; // Blink 1.5 times per second
            if (shouldShow) {
                drawSprite({
                    sprite: 'smudge_idle',
                    pos: vec2(x, y - 25),
                    scale: 1.5,
                    anchor: 'center',
                });
            }
        }
    }

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
            drawTextShadow('Oh no!', width() / 2, 100, {
                size: 28,
                align: 'center',
                color: rgb(200, 100, 100),
            });
            drawTextShadow('Smudge escaped!', width() / 2, 135, {
                size: 24,
                align: 'center',
                color: rgb(200, 100, 100),
            });

            // Draw a simple neighborhood scene showing Smudge is missing
            // Empty house
            drawRect({
                pos: vec2(250, 240),
                width: 70,
                height: 60,
                color: rgb(255, 220, 200),
                radius: 4,
            });
            // Roof
            drawPolygon({
                pts: [vec2(285, 210), vec2(245, 240), vec2(325, 240)],
                color: rgb(180, 100, 80),
            });
            // Door (open)
            drawRect({
                pos: vec2(275, 270),
                width: 20,
                height: 30,
                color: rgb(50, 50, 50),
                radius: 2,
            });

            // Arrow showing Smudge left
            drawText({
                text: '→',
                pos: vec2(340, 255),
                size: 40,
                color: rgb(255, 153, 102),
            });

            // Smudge running away (small)
            drawSprite({
                sprite: 'smudge_running',
                pos: vec2(480, 270),
                scale: 2,
                anchor: 'center',
            });

            drawTextShadow('The neighborhood needs', width() / 2, 330, {
                size: 18,
                align: 'center',
            });
            drawTextShadow('to help find him!', width() / 2, 355, {
                size: 18,
                align: 'center',
            });

            drawTextShadow('Press A to start searching', width() / 2, 440, {
                size: 18,
                align: 'center',
                color: rgb(140, 90, 60),
            });
        } else if (phase === 'searching') {
            drawTextShadow(`Asked: ${neighborsAsked}/${totalNeighbors}`, width() / 2, 70, {
                size: 18,
                align: 'center',
                color: rgb(255, 153, 102),
            });

            // Draw neighborhood map
            drawTextShadow('Neighborhood Map:', width() / 2, 105, {
                size: 16,
                align: 'center',
                color: rgb(140, 90, 60),
            });

            // Draw grass background for map area
            drawRect({
                pos: vec2(50, 125),
                width: 700,
                height: 140,
                color: rgb(180, 220, 160),
                radius: 8,
            });

            // Draw houses
            const houseColors = [
                rgb(255, 220, 200),
                rgb(220, 230, 255),
                rgb(255, 255, 220),
            ];

            for (let i = 0; i < neighbors.length; i++) {
                const neighbor = neighbors[i];
                drawHouse(
                    neighbor.x,
                    neighbor.y,
                    houseColors[i],
                    neighbor.name,
                    neighborsAsked > i
                );
            }

            // Draw tree in the middle-right area
            drawTree(550, 190);

            // Show current clue if asking a neighbor
            if (currentClue !== '') {
                drawRect({
                    pos: vec2(150, 280),
                    width: 500,
                    height: 55,
                    color: rgb(255, 250, 220),
                    outline: { color: rgb(255, 153, 102), width: 3 },
                    radius: 8,
                });
                drawText({
                    text: `"${currentClue}"`,
                    pos: vec2(width() / 2, 295),
                    size: 18,
                    align: 'center',
                    anchor: 'center',
                    color: rgb(60, 50, 40),
                });
                drawText({
                    text: `- ${neighbors[neighborsAsked - 1]?.name || ''}`,
                    pos: vec2(width() / 2, 320),
                    size: 15,
                    align: 'center',
                    anchor: 'center',
                    color: rgb(100, 80, 60),
                });
            } else {
                // Instruction when no clue showing
                drawText({
                    text: 'Ask neighbors for clues:',
                    pos: vec2(width() / 2, 300),
                    size: 20,
                    align: 'center',
                    anchor: 'center',
                    color: rgb(60, 50, 40),
                });
            }

            // Neighbor selection buttons
            for (let i = 0; i < neighbors.length; i++) {
                const asked = neighborsAsked > i;
                const text = asked ? `${neighbors[i].name} ✓` : neighbors[i].name;
                uiPill(text, 350 + i * 35, { selected: i === selectedNeighbor });
            }

            // Show instruction at bottom
            if (neighborsAsked >= totalNeighbors) {
                drawTextShadow('Found him! Press SPACE to rescue!', width() / 2, 465, {
                    size: 18,
                    align: 'center',
                    color: rgb(255, 153, 102),
                });
            } else {
                drawTextShadow('↑/↓ Choose · A Ask', width() / 2, 465, {
                    size: 14,
                    align: 'center',
                    color: rgb(140, 90, 60),
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

            // Split success message to avoid cutoff
            drawTextShadow('FOUND!', width() / 2, 390, {
                size: 24,
                align: 'center',
                color: rgb(100, 200, 100),
            });
            drawTextShadow('The neighborhood', width() / 2, 420, {
                size: 20,
                align: 'center',
                color: rgb(100, 200, 100),
            });
            drawTextShadow('worked together! 🏡', width() / 2, 445, {
                size: 20,
                align: 'center',
                color: rgb(100, 200, 100),
            });

            drawTextShadow('Press A to continue', width() / 2, 480, {
                size: 18,
                align: 'center',
            });
        }
    });

    onAnyKeyPress('enter', () => {
        if (phase === 'intro') {
            phase = 'searching';
        } else if (phase === 'searching') {
            if (neighborsAsked <= selectedNeighbor) {
                // Show the clue from this neighbor
                currentClue = neighbors[neighborsAsked].clue;
                neighborsAsked++;

                // Clear the clue after 2.5 seconds
                wait(2.5, () => {
                    currentClue = '';
                });
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
    let smudgeX = 100;  // Start on left side
    let smudgeY = 240;  // Start at bed level - lined up with dad! Must move down first!
    const bedCenterX = 400; // Bed in middle of screen
    const momX = 510;   // Mom on RIGHT side of bed (adjusted to be more over her head)
    const dadX = 340;   // Dad on LEFT side of bed
    const momHeadY = 180; // Mom's head position (target)
    let noiseLevel = 0;
    let result = '';
    let hasIceCream = false;

    onUpdate(() => {
        if (phase === 'tiptoeing') {
            // Noise level decreases over time (if quiet)
            noiseLevel = Math.max(0, noiseLevel - dt() * 20);

            // Check if collided with dad - dad is at bed level (Y~200) on the left side (X~340)
            // Collision happens if Smudge is near dad's position AND above the safe zone (Y < 320)
            const distanceToDadX = Math.abs(smudgeX - dadX);
            const distanceToDadY = Math.abs(smudgeY - 200);
            if (distanceToDadX < 70 && distanceToDadY < 90 && smudgeY < 320) {
                result = 'Oh no! You bumped into dad and woke him up!';
                phase = 'result';
                return;
            }

            // Check if reached mom's HEAD (specifically on her head, not to the right)
            // Mom's head is at X=530, Y=140
            const distanceToMomHead = Math.sqrt(Math.pow(smudgeX - momX, 2) + Math.pow(smudgeY - momHeadY, 2));
            // Tighter condition: must be close to her head specifically
            if (distanceToMomHead < 45) {
                // Success!
                result = 'SUCCESS! Ice cream "helps" with headaches! 🍦';
                gameState.player.completedQuests.add('ice_cream_headache');
                saveGame();
                phase = 'result';
                sparkleBurst(vec2(momX, momHeadY), 30);
            }

            // Check if woke up dad with noise
            if (noiseLevel > 80) {
                result = 'Oh no! Too noisy! You woke up dad!';
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
            drawTextShadow("Move DOWN first to avoid dad!", width() / 2, 195, {
                size: 16,
                align: 'center',
                color: rgb(255, 200, 100),
            });
            drawTextShadow("Sneak under bed, climb to mom!", width() / 2, 215, {
                size: 16,
                align: 'center',
                color: rgb(255, 200, 100),
            });

            // Smudge with ice cream (moved down slightly)
            drawSprite({
                sprite: 'ice_cream_cone',
                pos: vec2(width() / 2 - 20, 295),
                scale: 2.5,
                anchor: 'center',
            });

            drawSprite({
                sprite: 'smudge_idle',
                pos: vec2(width() / 2 + 30, 320),
                scale: 1.8,
                anchor: 'center',
            });

            drawTextShadow('ARROWS = Move', width() / 2, 390, {
                size: 16,
                align: 'center',
            });
            drawTextShadow('Slow & steady!', width() / 2, 410, {
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

            // Mom and Dad in bed (Dad on left, Mom on right)
            drawSprite({
                sprite: 'mom_dad_bed',
                pos: vec2(bedCenterX, 240),
                scale: 2,
                anchor: 'center',
            });

            // Visual indicator for target zone (mom's head) - subtle pulsing circle
            if (phase === 'tiptoeing') {
                const pulseSize = 40 + Math.sin(time() * 3) * 5;
                drawCircle({
                    pos: vec2(momX, momHeadY),
                    radius: pulseSize,
                    color: rgb(100, 255, 100),
                    opacity: 0.15,
                });
                drawCircle({
                    pos: vec2(momX, momHeadY),
                    radius: pulseSize,
                    outline: { color: rgb(150, 255, 150), width: 2 },
                    opacity: 0.3,
                });

                // Blinking lightning bolts to indicate headache
                const shouldBlink = Math.floor(time() * 3) % 2 === 0; // Blink 3 times per second
                if (shouldBlink) {
                    const boltColor = rgb(255, 220, 100);
                    // Left lightning bolt
                    const leftX = momX - 40;
                    const leftY = momHeadY - 20;
                    drawLine({
                        p1: vec2(leftX, leftY),
                        p2: vec2(leftX - 5, leftY + 10),
                        width: 3,
                        color: boltColor,
                    });
                    drawLine({
                        p1: vec2(leftX - 5, leftY + 10),
                        p2: vec2(leftX, leftY + 20),
                        width: 3,
                        color: boltColor,
                    });
                    drawLine({
                        p1: vec2(leftX, leftY + 20),
                        p2: vec2(leftX - 3, leftY + 30),
                        width: 3,
                        color: boltColor,
                    });

                    // Right lightning bolt
                    const rightX = momX + 40;
                    const rightY = momHeadY - 20;
                    drawLine({
                        p1: vec2(rightX, rightY),
                        p2: vec2(rightX + 5, rightY + 10),
                        width: 3,
                        color: boltColor,
                    });
                    drawLine({
                        p1: vec2(rightX + 5, rightY + 10),
                        p2: vec2(rightX, rightY + 20),
                        width: 3,
                        color: boltColor,
                    });
                    drawLine({
                        p1: vec2(rightX, rightY + 20),
                        p2: vec2(rightX + 3, rightY + 30),
                        width: 3,
                        color: boltColor,
                    });
                }
            }

            // Smudge visual position with gentle bounce
            const smudgeDisplayY = smudgeY + Math.sin(time() * 8) * 2; // Gentle tiptoeing bounce

            // Ice cream cone (if Smudge has it)
            const atMomsHead = (smudgeX >= momX - 50 && smudgeY <= momHeadY + 30);
            if (hasIceCream || atMomsHead) {
                const coneY = atMomsHead ? momHeadY - 40 : smudgeDisplayY - 40; // On mom's head if arrived
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
                pos: vec2(smudgeX, smudgeDisplayY),
                scale: 2,
                anchor: 'center',
            });

            if (phase === 'tiptoeing') {
                // Instructions - concise and high up
                drawTextShadow('Go DOWN, under bed', width() / 2, 380, {
                    size: 15,
                    align: 'center',
                    color: rgb(255, 200, 100),
                });
                drawTextShadow('then UP to mom!', width() / 2, 400, {
                    size: 15,
                    align: 'center',
                    color: rgb(255, 200, 100),
                });

                // Distance indicator (helps player know how close they are)
                const distanceToMomHead = Math.sqrt(Math.pow(smudgeX - momX, 2) + Math.pow(smudgeY - momHeadY, 2));
                if (distanceToMomHead < 100) {
                    const proximityText = distanceToMomHead < 45 ? '⭐ Right here!' : 'Getting close...';
                    drawTextShadow(proximityText, width() / 2, 430, {
                        size: 14,
                        align: 'center',
                        color: rgb(150, 255, 150),
                    });
                }
            } else if (phase === 'result') {
                const resultColor = result.includes('SUCCESS') ? rgb(100, 200, 100) : rgb(255, 150, 100);

                if (result.includes('SUCCESS')) {
                    drawTextShadow('SUCCESS!', width() / 2, 240, {
                        size: 24,
                        align: 'center',
                        color: resultColor,
                    });
                    drawTextShadow('Ice cream "helps"', width() / 2, 270, {
                        size: 18,
                        align: 'center',
                        color: resultColor,
                    });
                    drawTextShadow('with headaches! 🍦', width() / 2, 295, {
                        size: 18,
                        align: 'center',
                        color: resultColor,
                    });
                } else {
                    // Failure messages (shorter, fit on fewer lines)
                    drawTextShadow(result, width() / 2, 250, {
                        size: 18,
                        align: 'center',
                        color: resultColor,
                    });
                }

                drawTextShadow('Press A to continue', width() / 2, 340, {
                    size: 16,
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

    onAnyKeyPress('up', () => {
        if (phase === 'tiptoeing') {
            smudgeY = Math.max(120, smudgeY - 3); // Can climb up to mom's head level
            noiseLevel += 2; // Moving makes noise
        }
    });

    onAnyKeyPress('down', () => {
        if (phase === 'tiptoeing') {
            smudgeY = Math.min(400, smudgeY + 3); // Stay above bottom UI
            noiseLevel += 2; // Moving makes noise
        }
    });

    // Continuous movement (hold down keys) - faster movement!
    onUpdate(() => {
        if (phase === 'tiptoeing') {
            if (isAnyKeyDown('left')) {
                smudgeX = Math.max(100, smudgeX - 100 * dt());
                noiseLevel = Math.min(100, noiseLevel + 15 * dt());
            }
            if (isAnyKeyDown('right')) {
                smudgeX = Math.min(momX, smudgeX + 100 * dt());
                noiseLevel = Math.min(100, noiseLevel + 15 * dt());
            }
            if (isAnyKeyDown('up')) {
                smudgeY = Math.max(120, smudgeY - 100 * dt());
                noiseLevel = Math.min(100, noiseLevel + 15 * dt());
            }
            if (isAnyKeyDown('down')) {
                smudgeY = Math.min(400, smudgeY + 100 * dt());
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
