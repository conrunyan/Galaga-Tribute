MazeGame.main = (function (maze, myGraphics, input, player, renderer) {
    'use strict';

    let boardDim = 750; // measurement in pixels
    let lastTimeStamp = performance.now();
    let myKeyboard = input.Keyboard();
    let myKeyboard1 = input.Keyboard();
    let myKeyboard2 = input.Keyboard();
    let myKeyboard3 = input.Keyboard();
    let cellCount = 15;
    let cellSize = boardDim / cellCount; // TODO: Make this evenly divided by cell count and board width
    let drawnGameBoard = false;
    let gameWon = false;
    let stopGame = false;
    let renderID = 0;
    let timeSinceLastClockTick = 0;
    let clock = 0;
    let totalPoints;
    let POINTSLOSTFORPATH;
    let POINTSLOSTFORHINT;
    let POINTSLOSTFORCRUMBS;
    let POINTSLOSTPERSECOND;
    let MAX_SCORES_KEPT = 5;
    let requestID;
    let scores = [];

    // add event listeners for size setup
    let newGame5x5 = document.getElementById('id-startbutton5x5');
    let newGame10x10 = document.getElementById('id-startbutton10x10');
    let newGame15x15 = document.getElementById('id-startbutton15x15');
    let newGame20x20 = document.getElementById('id-startbutton20x20');
    newGame5x5.addEventListener('click', function () { newGame(5) });
    newGame10x10.addEventListener('click', function () { newGame(10) });
    newGame15x15.addEventListener('click', function () { newGame(15) });
    newGame20x20.addEventListener('click', function () { newGame(20) });

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
        registerKeyEvents();
        gameMaze.generateMaze();
        console.log('BOARD:', gameMaze.mazeBoard);
        myPlayer.givePlayerMap(gameMaze.mazeBoard, gameMaze);
        console.log('Player:', myPlayer);
        gameMaze.setShortestPath(myPlayer);
        // set scoring method
        setScoring();

    }

    function newGame(count) {
        // // stop the game
        gameWon = false;
        cellCount = count;
        resetBoard(count);
        init();
        myGraphics.resetCore();
        renderID = requestAnimationFrame(gameLoop);
    }

    function resetBoard(cellCount) {
        // wipe canvases
        myGraphics.clear();
        myGraphics.clear2();
        // reset game objects & board settings
        drawnGameBoard = false;
        cellSize = boardDim / cellCount;

        gameMaze = maze.Maze({
            size: { xCellCount: cellCount, yCellCount: cellCount },
            cellSize: cellSize,
            cellBackgroundImgSrc: './assets/stars_aa.png',
            breadCrumbImgSrc: './assets/toast.png',
            homePlanetImgSrc: './assets/mars-icon.png',
            markerImageSrc: './assets/path_marker.png',
            showBreadCrumbs: false,
            showHint: false,
            showFullPath: false,
            mazeBoard: [],
        },
            maze
        );
        myPlayer = player.Player({
            rowIdx: 0,
            colIdx: 0,
            imageSrc: './assets/pre__002.png',
            cellSize: cellSize,
            direction: 'down',
            map: '',
        });
    }

    function setScoring() {
        // set point increments. more points for a larger board, but also greater loss
        // for hints
        totalPoints = 1000 * cellCount;
        POINTSLOSTFORPATH = 250 * cellCount;
        POINTSLOSTFORHINT = 100 * cellCount;
        POINTSLOSTFORCRUMBS = 30 * cellCount;
        POINTSLOSTPERSECOND = 10 * cellCount;
    }

    
    function insertScore(latestScore) {
        let idxToPlace = scores.length;
        // check where score goes in the score list
        for (let i = 0; i < scores.length; i++) {
            if (latestScore >= scores[i].score) {
                idxToPlace = i;
                break;
            }
        }
        // turn off animation for each of the scores
        scores.forEach((item) => {
            item.animate = false;
        });
        // insert new score where it belongs, with a max of MAX_SCORES_KEPT
        scores.splice(idxToPlace, 0, {score: latestScore, animate: true, size: cellCount});
        scores = scores.slice(0,MAX_SCORES_KEPT);
        console.log(scores);
    }

    function displayScore(latestScore) {
        let myHighscoreDiv = document.getElementById('id-hscontainer');
        myHighscoreDiv.innerHTML = '';
        for (let i = 0; i < scores.length; i++) {
            let hsHTML = `<p id="id-hsEntry">Score #${i+1} - ${scores[i].score} - Size: ${scores[i].size}x${scores[i].size}</p>`;
            if (scores[i].animate) {
                hsHTML = `<p id="id-hsEntryAnimated">Score #${i+1} - ${scores[i].score} - Size: ${scores[i].size}x${scores[i].size}</p>`;
            }
            myHighscoreDiv.innerHTML += hsHTML;
        }
    }

    function processInput(elapsedTime) {
        myKeyboard.update(elapsedTime);
        myKeyboard1.update(elapsedTime);
        myKeyboard2.update(elapsedTime);
    }

    function update(elapsedTime) {
        updateTime(elapsedTime);
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
        myGraphics.clear2();
        myGraphics.drawGameBoard(gameMaze);
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
        renderTime();
        renderer.Planet.renderPlanet(gameMaze.mazeBoard[cellCount - 1][cellCount - 1]);
        renderer.Player.renderPlayer(myPlayer);
    }

    function updateTime(elapsedTime) {
        timeSinceLastClockTick += elapsedTime;
        if (timeSinceLastClockTick >= 1000) {
            clock += 1;
            totalPoints -= POINTSLOSTPERSECOND;
            timeSinceLastClockTick = 0;
        }
    }
    
    function renderTime() {
        let statDiv = document.getElementById('game-stats');
        statDiv.innerHTML = `<p id="id-gamestat">Current Score: ${totalPoints}</p>
                            <p id="id-gamestat">Time Elapsed: ${clock}</p>`
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
            return;
        }
        if (totalPoints <= 0) {
            console.log('GAME LOST...');
            return;
        }
        renderID = requestAnimationFrame(gameLoop);
    }

    function registerKeyEvents() {
        // Register AWSD keyboard, and other feature keys
        myKeyboard.register('s', myPlayer.moveDown);
        myKeyboard.register('w', myPlayer.moveUp);
        myKeyboard.register('a', myPlayer.moveLeft);
        myKeyboard.register('d', myPlayer.moveRight);
        // Register arrow keys
        myKeyboard1.register('k', myPlayer.moveDown);
        myKeyboard1.register('i', myPlayer.moveUp);
        myKeyboard1.register('j', myPlayer.moveLeft);
        myKeyboard1.register('l', myPlayer.moveRight);
        // Register IJKL keys
        myKeyboard2.register('ArrowDown', myPlayer.moveDown);
        myKeyboard2.register('ArrowUp', myPlayer.moveUp);
        myKeyboard2.register('ArrowLeft', myPlayer.moveLeft);
        myKeyboard2.register('ArrowRight', myPlayer.moveRight);
        // Register scoring events 
        myKeyboard.register('b', crumbAction);
        myKeyboard.register('h', hintAction);
        myKeyboard.register('p', pathAction);
    }

    function dockPointsForPath() {
        totalPoints -= POINTSLOSTFORPATH;
    }

    function dockPointsForHint() {
        totalPoints -= POINTSLOSTFORHINT;
    }

    function dockPointsForCrumbs() {
        totalPoints -= POINTSLOSTFORCRUMBS;
    }

    function pathAction() {
        gameMaze.toggleShowPath();
        // only deduct points for path if the user is displaying it
        if (gameMaze.showPath) {
            dockPointsForPath();
        }
    }

    function hintAction() {
        gameMaze.toggleShowHint()
        // only deduct points for hint if the user is displaying it
        if (gameMaze.showHint) {
            dockPointsForHint();
        }
    }

    function crumbAction() {
        gameMaze.toggleShowCrumbs()
        // only deduct points for crumbs if the user is displaying it
        if (gameMaze.showBreadCrumbs) {
            dockPointsForCrumbs();
        }
    }


    // Start of game
    init();
    renderID = requestAnimationFrame(gameLoop);

}(MazeGame.objects.maze, MazeGame.graphics, MazeGame.input, MazeGame.objects.player, MazeGame.render));
