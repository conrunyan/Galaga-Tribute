Galaga.main = (function (myGraphics, input, player, renderer, screens, myGame, projectiles, sounds, partSys, myRandom, myStorage, ufo) {
    'use strict';

    let boardDim = { x: 1000, y: 750 }; // measurement in pixels
    let myKeyboard = input.Keyboard();
    let lastTimeStamp;
    let totalElapsedTime = 0;
    let waited = 0;
    let MAX_SCORES_KEPT = 10;
    let scores = []
    let surface = [
        { x: 0.00, y: 0.00, safe: false },
        { x: 0.25, y: 0.25, safe: false },
        { x: 0.40, y: 0.10, safe: true },
        { x: 0.70, y: 0.10, safe: true },
        { x: 0.80, y: 0.45, safe: false },
        { x: 1.00, y: 0.00, safe: false },
    ];

    // initialize screens
    screens.Controller.initScreens();
    screens.Controller.showScreen('main-menu');
    screens.Controller.giveInitFunc(init);

    // background image
    let backgroundImg = new Image();
    backgroundImg.isReady = false;
    backgroundImg.src = 'assets/background-1.jpg';
    backgroundImg.onload = function () {
        console.log('loaded image...');
        this.isReady = true;
    };

    // Renderers & Particle System
    let boardRenderer = renderer.Board;
    let particleSystemRenderer = renderer.ParticleSystem;
    let gameStatRenderer = renderer.Status;
    let gameMsgRenderer = renderer.Message;
    let particleSystemController = partSys.ParticleSystemController({ systems: [] });

    let myPlayer;
    let gameBoard;

    function processInput(elapsedTime) {
        myKeyboard.update(elapsedTime);
    }

    function update(elapsedTime) {
        gameBoard.updatePieces(elapsedTime);
        gameBoard.updateClock(totalElapsedTime);
        particleSystemController.update(elapsedTime);
        totalElapsedTime += elapsedTime;

        // check for game loss condition
    }

    function render() {
        myGraphics.clear();
        // render board background
        myGraphics.drawTexture(backgroundImg, { x: boardDim.x / 2, y: boardDim.y / 2 }, 0, { width: boardDim.x, height: boardDim.y });
        myGraphics.drawMoon(surface);
        boardRenderer.renderPieces(gameBoard);
        gameStatRenderer.renderStats(myPlayer);
        gameMsgRenderer.renderMessage(myPlayer, boardDim)

        particleSystemRenderer.render(particleSystemController.systems);
    }

    function init() {
        lastTimeStamp = performance.now();
        myPlayer = player.Player({
            // coords: { x: boardDim.x * .25, y: boardDim.y * .1 },
            coords: { x: boardDim.x * .6, y: boardDim.y * .7 },
            imageSrc: './assets/lander-2.png',
            maxSpeed: 5, // pixels per second
            acceleration: 7.5,
            velocities: { x: 0, y: 10 },
            rotation: 0,
            boardSize: boardDim,
            size: 30,
            shot: projectiles,
            shotImgSource: './assets/green_laser.png',
            shotSpeed: 50,
            maxProjectiles: 40,
            sounds: sounds,
            particleController: particleSystemController,
            partSys: partSys,
            myRandom: myRandom,
            isThrusting: false,
            fuel: 20000,
            playerStop: false,
            gameEnd: false,
            won: true,
        });
        gameBoard = myGame.Board({
            gamePieces: {
                player: myPlayer,
                galaga: [],
                ufos: [],
            },
            constructors: {
                galaga: '',
                ufos: ufo,
                shot: projectiles,
                particleSystem: partSys
            },
            boardDimmensions: boardDim,
            particleController: particleSystemController,
            Random: myRandom,
            boardClock: 0,
        });

        console.log('SCREENS:', screens);
        registerKeyEvents();
        console.log(myPlayer);
        requestAnimationFrame(gameLoop);
    }

    function gameLoop(time) {
        let elapsedTime = Math.ceil(time - lastTimeStamp);
        lastTimeStamp = time;

        processInput(elapsedTime);
        update(elapsedTime);
        render();
        if (myPlayer.gameEnd && myPlayer.won) {
            // wait for a few seconds for animation
            if (waited >= 3000) {
                insertScore(myPlayer.displayFuel);
                return;
            }
            else {
                waited += elapsedTime;
            }
        }
        // check game ending condition (player out of lives)
        requestAnimationFrame(gameLoop);
    }

    function registerKeyEvents() {
        // Register Arrow keys
        myKeyboard.register('ArrowUp', myPlayer.playerThrust);
        // myKeyboard.register('ArrowUp', myPlayer.moveUp);
        // myKeyboard.register(' ', myPlayer.playerShoot);
        myKeyboard.register('ArrowLeft', myPlayer.turnPlayerLeft);
        myKeyboard.register('ArrowRight', myPlayer.turnPlayerRight);
    }

    function saveHighScore() {
        insertScore(myPlayer.score);
        displayScores();
    }

    function insertScore(latestScore) {
        let idxToPlace = scores.length;
        // check where score goes in the score list
        for (let i = 0; i < scores.length; i++) {
            if (latestScore >= scores[i].score) {
                idxToPlace = i;
                break;
            }
        }
        // insert new score where it belongs, with a max of MAX_SCORES_KEPT
        scores.splice(idxToPlace, 0, { score: latestScore, level: myPlayer.level });
        scores = scores.slice(0, MAX_SCORES_KEPT);
        console.log(scores);
        myStorage.saveStorage(scores);
    }

    function displayScores() {
        let myHighscoreDiv = document.getElementById('high-scores-list');
        myHighscoreDiv.innerHTML = '';
        for (let i = 0; i < scores.length; i++) {
            let hsHTML = `<li class="menu-text" id="high-scores-hsEntry">Score #${i + 1} - ${scores[i].score} - Level: ${scores[i].level}</li>`;
            myHighscoreDiv.innerHTML += hsHTML;
        }
    }

    loadScores();

    function loadScores() {
        // load previous scores
        let previousScores = localStorage.getItem('Galaga.highScores');
        if (previousScores !== null) {
            scores = JSON.parse(previousScores);
        }
        displayScores();
    }

}(Galaga.graphics, Galaga.input, Galaga.objects.player, Galaga.render, Galaga.screens, Galaga.game, Galaga.objects.projectile, Galaga.sounds.Player, Galaga.particles, Galaga.utils.Random, Galaga.utils.Storage, Galaga.objects.ufo));
