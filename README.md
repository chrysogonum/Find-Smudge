# 🐱 Find Smudge - A Tabby Cat Adventure

Help Smudge the tabby Maine Coon complete quirky quests around the house!

![Made with Kaboom.js](https://img.shields.io/badge/made%20with-Kaboom.js-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🎮 [Play the Game!](https://chrysogonum.github.io/Find-Smudge/)

## 📖 Story

Join Smudge, an adorable miniature Maine Coon tabby cat, on hilarious adventures! Complete four unique quests featuring Smudge's special brand of "help".

### Quest 1: Laundry Leap 🧺
Jump into the perfect warm laundry basket fresh from the dryer!

**Mechanics:**
- ⏱️ **Timing Challenge** - Press SPACE when basket is close
- 🔥 **Temperature Management** - Laundry cools down over time
- 🎯 **Win Condition** - Perfect landing in warm laundry!

### Quest 2: Martini Mondays 🍸
Find Smudge's favorite martini glass cat toy!

**Mechanics:**
- 🔍 **Search 3 Locations** - Under fridge, under couch, or basement stairs
- 🎲 **Random Placement** - Different every time
- 🎯 **Win Condition** - Find it in 3 attempts or less!

### Quest 3: Ice Cream Headache 🍦
"Help" mom's headache by delivering an ice cream cone toy!

**Mechanics:**
- 🤫 **Stealth Gameplay** - Tiptoe past sleeping dad
- 📊 **Noise Meter** - Move slowly to stay quiet
- 🎯 **Win Condition** - Reach mom without waking dad!

### Quest 4: Air Tag 🏘️
Smudge escaped! Rally the neighborhood to find him!

**Mechanics:**
- 🗺️ **Neighborhood Search** - Ask 3 neighbors for clues
- 💡 **Clue Collection** - Piece together where Smudge might be
- 🎯 **Win Condition** - Find Smudge with the community's help!

## ✨ Features

- 🎨 **Procedural Pixel Art** - All sprites generated with Python
- 📱 **Mobile Controls** - Touch controls that actually work!
- 💾 **Auto-save** - Progress saved to browser storage
- 🎮 **Varied Gameplay** - Timing, stealth, search, and exploration
- 🐱 **Maine Coon Cuteness** - Fluffy tabby goodness

## 🕹️ Controls

**Keyboard:**
- **Arrow Keys**: Navigate menus, move Smudge
- **Enter**: Select/Confirm
- **Space**: Action (jump, search, etc.)
- **Escape**: Back to menu

**Mobile:**
- **D-pad**: Navigate and move
- **A Button**: Select/Confirm
- **B Button**: Back
- **Space Button**: Actions

## 🚀 Play Locally

```bash
# Clone the repository
git clone https://github.com/chrysogonum/Find-Smudge.git
cd Find-Smudge

# Start a local server
python -m http.server 8000

# Open your browser to http://localhost:8000
```

## 🛠️ Built With

- [Kaboom.js](https://kaboomjs.com/) - Game engine
- JavaScript - Game logic
- Python/PIL - Sprite generation
- Love - For Smudge, the miniature Maine Coon 🧡

## 🎨 Sprite Generation

All sprites are generated programmatically with Python:

```bash
python generate_sprites.py
```

Creates:
- Smudge in 4 poses (idle, jumping, searching, running)
- Quest objects (laundry basket, martini glass, ice cream cone)
- Environment sprites (bedroom, neighborhood map)

## 👤 Credits

Made with love for Smudge, the tabby troublemaker! 🐱

Sister game to [The Adventures of Kosh](https://chrysogonum.github.io/Kosh/)

## 📄 License

MIT License - Feel free to use this for learning or make your own cat adventure!

---

⭐ If you enjoyed the game, consider giving it a star!
