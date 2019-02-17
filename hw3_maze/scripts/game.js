MazeGame.main = (function (maze, myGraphics, input, player, renderer) {
    'use strict';

    let boardDim = 750; // measurement in pixels
    let lastTimeStamp = performance.now();
    let myKeyboard = input.Keyboard();
    let cellCount = 5;
    let cellSize = boardDim / cellCount; // TODO: Make this evenly divided by cell count and board width
    let drawnGameBoard = false;
    let gameWon = false;

    let gameMaze = maze.Maze({
        size: { xCellCount: cellCount, yCellCount: cellCount },
        cellSize: cellSize,
        cellBackgroundImgSrc: './assets/stars_aa.png',
        breadCrumbImgSrc: './assets/toast.png',
        homePlanetImgSrc: './assets/mars-icon.png',
        markerImageSrc: './assets/path_marker.png',
        showBreadCrumbs: false,
        showHint: false,
        showFullPath: false,
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
        console.log('BOARD:', gameMaze.mazeBoard);
        myPlayer.givePlayerMap(gameMaze.mazeBoard, gameMaze);
        console.log('Player:', myPlayer);
        // myGraphics.drawGameBoard(gameMaze, drawnGameBoard)
        // draw the game board. Only need to do this once

    }

    function processInput(elapsedTime) {
        myKeyboard.update(elapsedTime);
    }

    function update() {
        // TODO: Update player state
        // if player is on the end, game is over and display win screen
        gameMaze.addBreadCrumb(myPlayer);
        // TODO: Update bread-crumb state

        // check win condition
        if (myPlayer.rowColIdx === gameMaze.endCell.getRowColIdx()) {
            gameWon = true;
        }
    }

    function render() {
        // render board, if it hasn't been yet
        myGraphics.drawGameBoard(gameMaze, drawnGameBoard);
        myGraphics.clear2()
        // render bread crumbs, if toggled on
        if (gameMaze.showBreadCrumbs) {
            for (let i = 0; i < gameMaze.breadCrumbs.length; i++) {
                renderer.Crumb.renderCrumb(gameMaze.breadCrumbs[i]);
            }
        }
        // render full path, if toggled on
        if (gameMaze.showPath) {
            for (let i = 0; i < gameMaze.shortestPath.length; i++) {
                renderer.Marker.renderMarker(gameMaze.shortestPath[i]);
            }
        }
        // render hint, if toggled on
        if (gameMaze.showHint) {
            for (let i = 0; i < gameMaze.shortestPath.length; i++) {
                renderer.Marker.renderMarker(gameMaze.hint);
            }
        }

        renderer.Planet.renderPlanet(gameMaze.mazeBoard[cellCount - 1][cellCount - 1]);
        renderer.Player.renderPlayer(myPlayer);
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function gameLoop(time) {
        let elapsedTime = time - lastTimeStamp;
        lastTimeStamp = time;

        processInput(elapsedTime);
        update();
        render();
        if (gameWon) {
            console.log('GAME WON!');
            return;
        }
        requestAnimationFrame(gameLoop);
    }
    // Register AWSD keyboard, and other feature keys
    myKeyboard.register('s', myPlayer.moveDown);
    myKeyboard.register('w', myPlayer.moveUp);
    myKeyboard.register('a', myPlayer.moveLeft);
    myKeyboard.register('d', myPlayer.moveRight);
    myKeyboard.register('b', gameMaze.toggleShowCrumbs);
    myKeyboard.register('h', gameMaze.toggleShowHint);
    myKeyboard.register('p', gameMaze.toggleShowPath);

    // Start of game
    init();
    requestAnimationFrame(gameLoop);

}(MazeGame.objects.maze, MazeGame.graphics, MazeGame.input, MazeGame.objects.player, MazeGame.render));
