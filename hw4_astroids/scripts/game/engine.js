Asteroids.main.Game = (function (myGraphics, input, player, renderer, screens, myGame, projectiles, asteroid, ufos, sounds, partSys, myRandom) {
    'use strict';

    let boardDim = { x: window.innerWidth, y: window.innerHeight }; // measurement in pixels
    let myKeyboard = input.Keyboard();
    let lastTimeStamp;
    let totalElapsedTime = 0;
    // initialize screens

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
    let particleSystemController = partSys.ParticleSystemController({ systems: [] });

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
        myGraphics.drawTexture(backgroundImg, { x: boardDim.x / 2, y: boardDim.y / 2 }, 0, { width: boardDim.x, height: boardDim.y });
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
            maxNumAsteroids: 10,
            particleController: particleSystemController,
            Random: myRandom,
        });

        console.log('Configuring board...');
        gameBoard.generateAsteroids(10);
        console.log('game-board', gameBoard);
        console.log('SCREENS:', screens);
        registerKeyEvents();
        console.log(myPlayer);

        console.log('adding particle system');
        // let newPS = partSys.ParticleSystem({
        //     center: { x: 300, y: 300 },
        //     size: { mean: 15, stdev: 5 },
        //     speed: { mean: 65, stdev: 35 },
        //     lifetime: { mean: 4, stdev: 1 },
        //     totalLife: 2,
        //     imageSrc: './assets/green_laser.png',
        // }, myRandom)
        // particleSystemController.addNewSystem(newPS);
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
