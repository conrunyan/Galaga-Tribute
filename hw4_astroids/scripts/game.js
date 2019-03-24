Asteroids.main = (function (myGraphics, input, player, renderer, screens, myGame, projectiles, asteroid, ufos, sounds, partSys, myRandom) {
    'use strict';

    let boardDim = { x: window.innerWidth, y: window.innerHeight }; // measurement in pixels
    let myKeyboard = input.Keyboard();
    let lastTimeStamp;
    let totalElapsedTime = 0;
    // initialize screens
    screens.Controller.initScreens();
    screens.Controller.showScreen('main-menu');
    screens.Controller.giveInitFunc(init);

    // background image
    let backgroundImg = new Image();
    backgroundImg.isReady = false;
    backgroundImg.src = 'assets/game_background.jpg';
    backgroundImg.onload = function () {
        console.log('loaded image...');
        this.isReady = true;
    };

    // Renderers & Particle System
    let boardRenderer = renderer.Board;
    let particleSystemRenderer = renderer.ParticleSystem;
    let gameStatRenderer = renderer.Status;
    let particleSystemController = partSys.ParticleSystemController({systems: []});

    let myPlayer = player.Player({
        coords: { x: boardDim.x / 2, y: boardDim.y / 2 },
        imageSrc: './assets/1B.png',
        maxSpeed: 5, // pixels per second
        acceleration: 40,
        velocities: { x: 0, y: 0 },
        rotation: -Math.PI / 2,
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
    });

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
        myGraphics.drawTexture(backgroundImg, { x: boardDim.x / 2, y: boardDim.y / 2 }, 0, { width: boardDim.x, height: boardDim.y});
        boardRenderer.renderPieces(gameBoard);
        particleSystemRenderer.render(particleSystemController.systems);
        gameStatRenderer.renderStats(myPlayer, gameBoard);
    }

    function init() {
        lastTimeStamp = performance.now();
        gameBoard = myGame.Board({
            gamePieces: {
                player: myPlayer,
                asteroids: [],
                ufos: [],
            },
            constructors: {
                asteroids: asteroid,
                ufos: ufos,
                shot: projectiles,
                particleSystem: partSys
            },
            imageSrc: 'assets/background_gif.gif',
            boardDimmensions: boardDim,
            asteroidSize: 80,
            asteroidInitMinVel: 15,
            asteroidInitMaxVel: 35,
            maxNumAsteroids: 5,
            particleController: particleSystemController,
            Random: myRandom,
        });

        console.log('Configuring board...');
        gameBoard.generateAsteroids(10);
        console.log('game-board', gameBoard);
        console.log('SCREENS:', screens);
        registerKeyEvents();
        console.log(myPlayer);

        requestAnimationFrame(gameLoop);

        // if (myPlayer.didCollide) {
        //     window.alert('Collision');
        // }
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
            return;
        }
        requestAnimationFrame(gameLoop);
    }

    function registerKeyEvents() {
        // Register Arrow keys
        myKeyboard.register('ArrowUp', myPlayer.playerThrust);
        // myKeyboard.register('ArrowUp', myPlayer.moveUp);
        myKeyboard.register(' ', myPlayer.playerShoot);
        myKeyboard.register('ArrowLeft', myPlayer.turnPlayerLeft);
        myKeyboard.register('ArrowRight', myPlayer.turnPlayerRight);
        // Register scoring events 
    }

    // Start of game
    // init();

}(Asteroids.graphics, Asteroids.input, Asteroids.objects.player, Asteroids.render, Asteroids.screens, Asteroids.game, Asteroids.objects.projectile, Asteroids.objects.asteroid, Asteroids.objects.ufo, Asteroids.sounds.Player, Asteroids.particles, Asteroids.utils.Random));
