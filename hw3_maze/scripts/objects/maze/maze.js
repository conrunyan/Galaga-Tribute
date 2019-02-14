// --------------------------------------------------------------
//
// Creates a Maze object, with functions for managing state.
// One Maze object will exist at a time. This can be thougth of as
// the game board.
// spec = {
//  size: {xCellCount , yCellCount: }, # defaults to 5x5
//  cellSize,
// }
//
// --------------------------------------------------------------
MazeGame.objects.maze.Maze = function (spec, mazeSpace) {
    'use strict';

    spec.mazeBoard = [];
    let startXY = { x: 0, y: 0 }; // default locations
    let endXY = { x: spec.xCellCount - 1, y: spec.yCellCount - 1 }; // default locations
    spec.shortestPath = [];
    spec.breadCrumbs = [];
    spec.walls = [];

    // Set size to {}
    function setSize(mazeSize) {
        spec.size = mazeSize;
    }

    // Function uses Randomized Prim's algorithm to generate a maze
    function generateMaze() {
        console.log('Generating maze...');
        // 1 - Generate a grid of walls
        _generateBaseBoard();
        _linkCells();
        _primsMagicMazeMachine();

    }

    function info() {
        console.log(`Size: ${spec.size.xCellCount}X${spec.size.yCellCount}`)
    }

    function print() {
        for (let i = 0; i < spec.size.xCellCount; i++) {
            let row = ''
            for (let j = 0; j < spec.size.yCellCount; j++) {
                if (i === 0 || i === spec.size.xCellCount - 1) {
                    row += ' - ';
                }
                else if (spec.mazeBoard[i][j].type === 'cell') {
                    row += ' X ';
                }
                else if (spec.mazeBoard[i][j].type === 'wall-verticle') {
                    if (spec.mazeBoard[i][j].isPassage) {
                        row += ' $ '
                    }
                    else {
                        row += ' | '
                    }
                    // // row += ' | ';
                }
                else if (spec.mazeBoard[i][j].type === 'wall-horizontal') {
                    if (spec.mazeBoard[i][j].isPassage) {
                        row += ' $ '
                    }
                    else {
                        row += ' - '
                    }
                }
                else {
                    row += ' - '
                }
            }
            console.log(row)
        }
    }

    function _primsMagicMazeMachine() {
        // 2 - Randomly pick a cell, add it to the maze
        let frontier;
        let mazeCells = [];
        let startCoords = _getRandomCellCoords();
        let startCell = spec.mazeBoard[0][0];
        mazeCells.push(startCell.getXYIdx());
        // Add its neighboring cells to the frontier
        frontier = startCell.getNeighborCells();
        let randIdx = _getRandomInt(0, frontier.length - 1);
        // 3.Randomly choose a cell in the frontier
        while (frontier.length > 0) {
            let randFrontierCell = frontier[randIdx];
            // (randomly) pick a "wall" that connects to a cell in the maze
            let surroundingCells = randFrontierCell.getNeighborCells();
            surroundingCells = surroundingCells.filter(cell => mazeCells.includes(cell.getXYIdx()));
            let randWallIdx = _getRandomInt(0, surroundingCells.length - 1);
            let randomWallCell = surroundingCells[randWallIdx];
            // Remove that wall
            spec.mazeBoard[randFrontierCell.xIdx][randFrontierCell.yIdx].removeWall(randomWallCell);
            // Add cell to the maze
            mazeCells.push(randFrontierCell.getXYIdx());
            let cellsLeftOver = randFrontierCell.getNeighborCells().filter(cell => !mazeCells.includes(cell.getXYIdx()));
            frontier = frontier.concat(cellsLeftOver);

            // remove cell from frontier and reset index for next search
            frontier.splice(randIdx, 1);
            randIdx = _getRandomInt(0, frontier.length - 1);
        }
        console.log(frontier);

    }

    // Generates an xCellCount X yCellCount board of cells, with each cell connected to other adjacent cells
    function _generateBaseBoard() {
        for (let i = 0; i < spec.size.xCellCount; i++) {
            // console.log('Now on row:', i);
            let mazeRow = [];
            for (let j = 0; j < spec.size.yCellCount; j++) {
                // 
                let type = _calcCellType(i, j);
                let curCell = mazeSpace.Cell({
                    xCoord: j * spec.cellSize,
                    yCoord: i * spec.cellSize,
                    xIdx: j,
                    yIdx: i,
                    size: spec.cellSize,
                    edges: {
                        topWall: null,
                        bottomWall: null,
                        leftWall: null,
                        rightWall: null,
                    },
                    color: 'green'
                });
                mazeRow.push(curCell);
            }
            spec.mazeBoard.push(mazeRow);
        }
    }

    // Function links cells to walls
    function _linkCells() {
        console.log('Linking cells...');
        for (let i = 0; i < spec.size.xCellCount; i++) {
            for (let j = 0; j < spec.size.yCellCount; j++) {
                // if type is cell, link it to adjacent walls
                let neighborCoords = spec.mazeBoard[i][j].getNeighborCellCoords();
                // link walls to cells
                // link wall above to NodeB
                let upperCell = _getMazeCell(neighborCoords.up.x, neighborCoords.up.y);
                let leftCell = _getMazeCell(neighborCoords.left.x, neighborCoords.left.y);
                let rightCell = _getMazeCell(neighborCoords.right.x, neighborCoords.right.y);
                let downCell = _getMazeCell(neighborCoords.down.x, neighborCoords.down.y);
                // set walls to cells
                spec.mazeBoard[i][j].setTopWall(upperCell);
                spec.mazeBoard[i][j].setLeftWall(leftCell);
                spec.mazeBoard[i][j].setRightWall(rightCell);
                spec.mazeBoard[i][j].setBottomWall(downCell);
            }
        }
    }

    function _calcCellType(cellI, cellJ) {
        if (cellI === 0 || cellJ === 0 || cellI === spec.size.xCellCount - 1 || cellJ === spec.size.yCellCount - 1) {
            return 'wall-border';
        }
        // walls are between normal cells
        if (cellI % 2 === 1 && cellJ % 2 === 0) {
            return 'wall-veritcal';
        }
        else if (cellI % 2 === 0 && cellJ % 2 === 1) {
            return 'wall-horizontal';
        }
        else {
            return 'cell';
        }
    }

    function _getRandomCellCoords(mazeCells) {
        let cellFound = false;
        let randX;
        let randY;
        randX = _getRandomInt(0, spec.size.xCellCount - 1);
        randY = _getRandomInt(0, spec.size.yCellCount - 1);
        return { x: randX, y: randY };
    }

    // Returns a random integer -> https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
    function _getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // returns null if the referenced cell is not in the bounds of the maze
    function _getMazeCell(x, y) {
        if (x < 0 || y < 0 || x > spec.size.xCellCount - 1 || y > spec.size.yCellCount - 1) {
            return null;
        }
        return spec.mazeBoard[x][y];
    }

    let api = {
        get mazeBoard() { return spec.mazeBoard },
        get shortestPath() { return spec.shortestPath },
        get breadCrumbs() { return spec.breadCrumbs },
        generateMaze: generateMaze,
        setSize: setSize,
        info: info,
        print: print,
    };

    return api;
}