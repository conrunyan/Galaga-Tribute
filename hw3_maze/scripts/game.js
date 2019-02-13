MazeGame.main = (function (maze, graphics, input) {
    'use strict';

    let lastTimeStamp = performance.now();
    let myKeyboard = input.Keyboard();
    let CELL_SIZE = 25; // TODO: Make this evenly divided by cell count and board width
    let cellCount = 10;

    let gameMaze = maze.Maze({
        size: { xCellCount: (cellCount * 2) + 1, yCellCount: (cellCount * 2) + 1},
            CELL_SIZE,
        },
        maze
    );

    gameMaze.generateMaze();
    gameMaze.print();
    console.log(gameMaze.mazeBoard);
    console.log('GRAPHICS:', graphics);
    // render();

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
                // get color
                let color = 'black'
                if (gameMaze.mazeBoard[i][j].type === 'cell') {
                    color = 'green'
                }
                graphics.drawGamePiece({
                    color: color,
                    xCoord: gameMaze.mazeBoard[i][j].xCoord,
                    yCoord: gameMaze.mazeBoard[i][j].yCoord,
                    height: CELL_SIZE,
                    width: CELL_SIZE,
                });
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
    //requestAnimationFrame(gameLoop);

}(MazeGame.objects.maze, MazeGame.graphics, MazeGame.input));
