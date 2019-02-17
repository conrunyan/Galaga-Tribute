MazeGame.main = (function (maze, myGraphics, input, player, renderer) {
    'use strict';

    let boardDim = 500; // measurement in pixels
    let lastTimeStamp = performance.now();
    let myKeyboard = input.Keyboard();
    let cellCount = 5;
    let cellSize = boardDim / cellCount; // TODO: Make this evenly divided by cell count and board width

    let gameMaze = maze.Maze({
            size: { xCellCount: cellCount, yCellCount: cellCount},
            cellSize: cellSize,
            imageSrc: './assets/space_dn.png',
        },
        maze
    );

    let myPlayer = player.Player({
        rowIdx: 0,
        colIdx: 0,
        imageSrc: './assets/pre__002.png',
        cellSize: cellSize,
        direction: 'down',
        map: '',
    });


    // initialize event handlers, set board size, generate maze, etc.
    function init() {
        gameMaze.generateMaze();
        gameMaze.setShortestPath({x:0, y:0});
        console.log('BOARD:', gameMaze.mazeBoard);
        myPlayer.givePlayerMap(gameMaze.mazeBoard);
        console.log('Player:', myPlayer);
        // draw the game board. Only need to do this once
    }

    function processInput(elapsedTime) {
        myKeyboard.update(elapsedTime);
    }

    function update() {
        // TODO: Update player state
            // if player is on the end, game is over and display win screen
        gameMaze.addBreadCrumb(myPlayer);
        // TODO: Update shortest path state
        gameMaze.setShortestPath(myPlayer);
        // TODO: Update bread-crumb state
    }

    function render() {
        myGraphics.clear2()
        // render game board:
        for (let i = 0; i < cellCount; i++) {
            for (let j = 0; j < cellCount; j++) {
                myGraphics.drawGamePiece(gameMaze.mazeBoard[i][j]); //, gameMaze.image);
            }
        }
        renderer.Player.renderPlayer(myPlayer);
    }

    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    function gameLoop(time) {
        let elapsedTime = time - lastTimeStamp;
        lastTimeStamp = time;

        processInput(elapsedTime);
        // update();
        render();
        requestAnimationFrame(gameLoop);
    }
    // Example of keyboard registering
    myKeyboard.register('s', myPlayer.moveDown);
    myKeyboard.register('w', myPlayer.moveUp);
    myKeyboard.register('a', myPlayer.moveLeft);
    myKeyboard.register('d', myPlayer.moveRight);

    // Start of game
    init();
    requestAnimationFrame(gameLoop);

}(MazeGame.objects.maze, MazeGame.graphics, MazeGame.input, MazeGame.objects.player, MazeGame.render));
