MazeGame.main = (function (maze, myGraphics, input) {
    'use strict';

    let boardDim = 500; // measurement in pixels
    let lastTimeStamp = performance.now();
    let myKeyboard = input.Keyboard();
    let cellCount = 20;
    let cellSize = boardDim / cellCount; // TODO: Make this evenly divided by cell count and board width

    let gameMaze = maze.Maze({
            size: { xCellCount: cellCount, yCellCount: cellCount},
            cellSize: cellSize,
        },
        maze
    );


    // initialize event handlers, set board size, generate maze, etc.
    function init() {
        gameMaze.generateMaze();
    }

    function processInput(elapsedTime) {
        myKeyboard.update(elapsedTime);
    }

    function update() {
        // TODO: Update player state
        // TODO: Update maze state
        // TODO: Update shortest path state
        // TODO: Update bread-crumb state
    }

    function render() {
        // graphics.clear();
        // render game board:
        for (let i = 0; i < cellCount; i++) {
            for (let j = 0; j < cellCount; j++) {
                myGraphics.drawGamePiece(gameMaze.mazeBoard[i][j]);
            }
        }
    }

    function gameLoop(time) {
        let elapsedTime = time - lastTimeStamp;
        lastTimeStamp = time;

        processInput(elapsedTime);
        update();
        render();

        requestAnimationFrame(gameLoop);
    }
    // Example of keyboard registering
    // myKeyboard.register('s', myLogo.moveDown);
    // myKeyboard.register('w', myLogo.moveUp);
    // myKeyboard.register('a', myLogo.moveLeft);
    // myKeyboard.register('d', myLogo.moveRight);

    // Start of game
    init();
    requestAnimationFrame(gameLoop);

}(MazeGame.objects.maze, MazeGame.graphics, MazeGame.input));
