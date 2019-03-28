Galaga.main = (function (myGraphics, input, player, renderer, screens, myGame, projectiles, sounds, partSys, myRandom, myStorage) {
    'use strict';

    let boardDim = { x: window.innerWidth, y: window.innerHeight }; // measurement in pixels
    let myKeyboard = input.Keyboard();
    let lastTimeStamp;
    let totalElapsedTime = 0;
    let MAX_SCORES_KEPT = 10;
    let scores = []

    // initialize screens
    screens.Controller.initScreens();
    screens.Controller.showScreen('main-menu');
    screens.Controller.giveInitFunc(init);

    // background image
    let backgroundImg = new Image();
    backgroundImg.isReady = false;
    backgroundImg.src = 'assets/gameBackground.jpg';
    backgroundImg.onload = function () {
        console.log('loaded image...');
        this.isReady = true;
    };

    // Renderers & Particle System
    let boardRenderer = renderer.Board;
    let particleSystemRenderer = renderer.ParticleSystem;
    // let gameStatRenderer = renderer.Status;
    let particleSystemController = partSys.ParticleSystemController({ systems: [] });

    let myPlayer;
    let gameBoard;

    function processInput(elapsedTime) {
        myKeyboard.update(elapsedTime);
    }

    function update(elapsedTime) {
        // myPlayer.playerMoveLocation(elapsedTime);
        gameBoard.updatePieces(elapsedTime);
        gameBoard.updateClock(totalElapsedTime);
        particleSystemController.update(elapsedTime);
        totalElapsedTime += elapsedTime;

        // check for game loss condition
    }

    function render() {
        myGraphics.clear();
        // render board background
        // myGraphics.drawTexture(backgroundImg, { x: boardDim.x / 2, y: boardDim.y / 2 }, 0, { width: boardDim.x, height: boardDim.y });
        boardRenderer.renderPieces(gameBoard);
        // particleSystemRenderer.render(particleSystemController.systems);
    }

    function init() {
        lastTimeStamp = performance.now();
        myPlayer = player.Player({
            coords: { x: boardDim.x / 2, y: boardDim.y - 30 },
            imageSrc: './assets/playerShip.png',
            maxSpeed: 0.33, // pixels per second
            acceleration: 40,
            velocities: { x: 0, y: 0 },
            rotation: 0,
            boardSize: boardDim,
            size: 30,
            shot: projectiles,
            shotImgSource: './assets/playerShip.png',
            shotSpeed: 50,
            maxProjectiles: 40,
            sounds: sounds,
            particleController: particleSystemController,
            partSys: partSys,
            myRandom: myRandom,
        });
        gameBoard = myGame.Board({
            gamePieces: {
                player: myPlayer,
                galaga: [],
                aliens: [],
            },
            constructors: {
                galaga: '',
                ufos: '',
                shot: projectiles,
                particleSystem: partSys
            },
            boardDimmensions: boardDim,
            particleController: particleSystemController,
            Random: myRandom,
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
        // check game ending condition (player out of lives)
        if (myPlayer.lives <= 0) {
            // save highscores
            saveHighScore();
            screens.Controller.showScreen('high-scores-screen');
            return;
        }
        requestAnimationFrame(gameLoop);
    }

    function registerKeyEvents() {
        // Register Arrow keys
        myKeyboard.register(' ', myPlayer.playerShoot);
        myKeyboard.register('ArrowLeft', myPlayer.movePlayerLeft);
        myKeyboard.register('ArrowRight', myPlayer.movePlayerRight);
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
            let hsHTML = `<li id="high-scores-hsEntry">Score #${i + 1} - ${scores[i].score} - Level: ${scores[i].level}</li>`;
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

}(Galaga.graphics, Galaga.input, Galaga.objects.player, Galaga.render, Galaga.screens, Galaga.game, Galaga.objects.projectile, Galaga.sounds.Player, Galaga.particles, Galaga.utils.Random, Galaga.utils.Storage));
