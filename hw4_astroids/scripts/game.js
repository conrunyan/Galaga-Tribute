Asteroids.main = (function (myGraphics, input, player, renderer, screens, myGame, projectiles, asteroid) {
    'use strict';

    let boardDim = 750; // measurement in pixels
    let myKeyboard = input.Keyboard();
    let lastTimeStamp;
    // initialize screens
    screens.Controller.initScreens();
    screens.Controller.showScreen('main-menu');

    // Renderers
    // let myPlayerRenderer = renderer.Player
    let boardRenderer = renderer.Board;

    let myPlayer = player.Player({
        coords: { x: boardDim / 2, y: boardDim / 2 },
        imageSrc: './assets/arrwing.png',
        maxSpeed: 5, // pixels per second
        acceleration: 20,
        velocities: { x: 0, y: 0 },
        rotation: -Math.PI/2,
        boardSize: boardDim,
        size: 40,
        shot: projectiles,
        shotImgSource: './assets/green_laser.png',
        shotSpeed: 50,
        maxProjectiles: 40,
    });

    let testAsteroid = asteroid.Asteroid({
        coords: { x: 150, y: 150},
        imageSrc: './assets/asteroid.png',
        velocities: { x: 5, y: 5 },
        rotation: 0,
        asteroidType: 'large',
        mass:100,
    });

    let gameBoard;

    function processInput(elapsedTime) {
        myKeyboard.update(elapsedTime);
    }

    function update(elapsedTime) {
        // myPlayer.playerMoveLocation(elapsedTime);
        gameBoard.updatePieces(elapsedTime);
    }

    function render() {
        myGraphics.clear();
        // myPlayerRenderer.renderPlayer(myPlayer);
        boardRenderer.renderPieces(gameBoard);
    }

    function init() {
        lastTimeStamp = performance.now();
        gameBoard = myGame.Board({
            gamePieces: {
                player: myPlayer,
                asteroids: [testAsteroid],
                ufos: [],
            },
            constructors: {
                asteroids: asteroid,
                ufos: '',
            },
            imageSrc: 'assets/background_gif.gif'
        })
        console.log('SCREENS:', screens)
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
    init();

}(Asteroids.graphics, Asteroids.input, Asteroids.objects.player, Asteroids.render, Asteroids.screens, Asteroids.game, Asteroids.objects.projectile, Asteroids.objects.asteroid));
