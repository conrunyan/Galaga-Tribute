Asteroids.main = (function (myGraphics, input, player, renderer) {
    'use strict';

    let boardDim = 750; // measurement in pixels
    let lastTimeStamp = performance.now();
    let myKeyboard = input.Keyboard();

    // Renderers
    let myPlayerRenderer = renderer.Player

    let myPlayer = player.Player({
        coords: { x: boardDim / 2, y: boardDim / 2 },
        imageSrc: './assets/1B.png',
        maxSpeed: 5, // pixels per second
        acceleration: 5,
        velocities: { x: 0, y: 0 },
        rotation: -Math.PI/2,
        boardSize: boardDim,
        size: 40,
    });

    function processInput(elapsedTime) {
        myKeyboard.update(elapsedTime);
    }

    function update(elapsedTime) {
        myPlayer.playerMoveLocation(elapsedTime);
    }

    function render() {
        myGraphics.clear();
        myPlayerRenderer.renderPlayer(myPlayer);
    }

    function init() {
        registerKeyEvents();
        console.log(myPlayer);
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
        myKeyboard.register('ArrowLeft', myPlayer.turnPlayerLeft);
        myKeyboard.register('ArrowRight', myPlayer.turnPlayerRight);
        // Register scoring events 
    }

    // Start of game
    init();
    requestAnimationFrame(gameLoop);

}(Asteroids.graphics, Asteroids.input, Asteroids.objects.player, Asteroids.render));
