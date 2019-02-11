MazeGame.main = (function (objects, renderer, graphics, input) {
    'use strict';

    let lastTimeStamp = performance.now();

    let myKeyboard = input.Keyboard();
    let myOtherKeyboard = input.Keyboard();

    function processInput(elapsedTime) {
        myOtherKeyboard.update(elapsedTime);
    }

    function update() {
        // TODO: Update player state
        // TODO: Update maze state
        // TODO: Update shortest path state
        // TODO: Update bread-crumb state
    }

    function render() {
        graphics.clear();

    }

    function gameLoop(time) {
        let elapsedTime = time - lastTimeStamp;
        lastTimeStamp = time;

        processInput(elapsedTime);
        update();
        render();

        requestAnimationFrame(gameLoop);
    }

    myKeyboard.register('s', myLogo.moveDown);
    myKeyboard.register('w', myLogo.moveUp);
    myKeyboard.register('a', myLogo.moveLeft);
    myKeyboard.register('d', myLogo.moveRight);

    myOtherKeyboard.register('k', myLogo.moveDown);
    myOtherKeyboard.register('i', myLogo.moveUp);
    myOtherKeyboard.register('j', myLogo.moveLeft);
    myOtherKeyboard.register('l', myLogo.moveRight);

    requestAnimationFrame(gameLoop);

}(MazeGame.objects, MazeGame.render, MazeGame.graphics, MazeGame.input));
