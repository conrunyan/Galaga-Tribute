Asteroids.main = (function (maze, myGraphics, input, player, renderer) {
    'use strict';

    let boardDim = 750; // measurement in pixels
    let lastTimeStamp = performance.now();
    let myKeyboard = input.Keyboard();

    function processInput(elapsedTime) {
        myKeyboard.update(elapsedTime);
    }

    function update(elapsedTime) {
    }

    function render() {
    }

    function init() {
        registerKeyEvents();
    }

    function gameLoop(time) {
        let elapsedTime = Math.ceil(time - lastTimeStamp);
        lastTimeStamp = time;

        processInput(elapsedTime);
        update(elapsedTime);
        render();
        if (gameWon) {
            console.log('GAME WON!');
            insertScore(totalPoints);
            displayScore(totalPoints);
            myGraphics.winMessage(boardDim, boardDim);
            return;
        }
        if (totalPoints <= 0) {
            console.log('GAME LOST...');
            myGraphics.gameOverMessage(boardDim, boardDim);
            return;
        }
        renderID = requestAnimationFrame(gameLoop);
    }

    function registerKeyEvents() {
        // Register Arrow keys
        myKeyboard.register('ArrowDown', myPlayer.moveDown);
        myKeyboard.register('ArrowUp', myPlayer.moveUp);
        myKeyboard.register('ArrowLeft', myPlayer.moveLeft);
        myKeyboard.register('ArrowRight', myPlayer.moveRight);
        // Register scoring events 
    }

    // Start of game
    init();
    requestAnimationFrame(gameLoop);

}(Asteroids.objects.maze, Asteroids.graphics, Asteroids.input, Asteroids.objects.player, Asteroids.render));
