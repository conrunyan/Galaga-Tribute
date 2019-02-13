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
        _generateBaseBoard();
        _linkCells();
        _primsMagicMazeMachine();
        // 1 - Generate a grid of walls
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
        // 2 - Pick a cell, mark it as part of the maze. Add the walls of the cell to the wall list.
        let wallList;
        let mazePieces = [];
        let startCoords = _getRandomCellCoords();
        mazePieces.push(spec.mazeBoard[startCoords.x][startCoords.y]);
        wallList = spec.mazeBoard[startCoords.x][startCoords.y].getWalls();
        spec.mazeBoard[startCoords.x][startCoords.y].setVisited(true);
        // 3 - While there are walls in the list:
        while (wallList.length > 0) {
            // a - Pick a random wall from the list. If only one of the two cells that the wall divides is visited, then:
            let randIdx = _getRandomInt(0, wallList.length - 1);
            if (wallList[randIdx].nodeA !== undefined && wallList[randIdx].nodeB !== undefined) {
                // let wallList[randIdx] = wallList[randIdx];
                if (wallList[randIdx].nodeA.visited && !wallList[randIdx].nodeB.visited) { // && !wallList[randIdx].nodeB.getWalls === undefined) {
                    wallList[randIdx].nodeB.setVisited(true);
                    wallList[randIdx].setIsPassage(true);
                    // mazePieces.push(wallList[randIdx].nodeB);
                    wallList.concat(wallList[randIdx].nodeB.getWalls());
                }
                else if (!wallList[randIdx].nodeA.visited && wallList[randIdx].nodeB.visited) { // && !wallList[randIdx].nodeA.getWalls === undefined) {
                    wallList[randIdx].nodeA.setVisited(true);
                    wallList[randIdx].setIsPassage(true);
                    // mazePieces.push(wallList[randIdx].nodeA);
                    wallList.concat(wallList[randIdx].nodeA.getWalls());
                }
            }

            console.log(wallList);
            // Make the wall a passage and mark the unvisited cell as part of the maze.
            wallList.splice(randIdx, 1);
            // Add the neighboring walls of the cell to the wall list.
            // Remove the wall from the list.

        }
    }

    // Generates an xCellCount X yCellCount board of cells, with each cell connected to other adjacent cells
    function _generateBaseBoard() {
        for (let i = 0; i < spec.size.xCellCount; i++) {
            // console.log('Now on row:', i);
            let mazeRow = [];
            for (let j = 0; j < spec.size.yCellCount; j++) {
                // 
                let type = _calcCellType(i, j);
                let curCell;
                if (type === 'cell') {
                    curCell = mazeSpace.Cell({
                        xCoord: i * spec.cellSize,
                        yCoord: j * spec.cellSize,
                        xIdx: i,
                        yIdx: j,
                        type: type,
                        color: 'green'
                    });
                } else {
                    curCell = mazeSpace.Wall({
                        type: type,
                        color: 'blue',
                        xCoord: i * spec.cellSize,
                        yCoord: j * spec.cellSize,
                    });
                    spec.walls.push(curCell);
                }

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
                if (spec.mazeBoard[i][j].type === 'cell') {
                    let neighborCoords = spec.mazeBoard[i][j].getNeighborCellCoords();
                    // link walls to cells
                    // link wall above to NodeB
                    let upperWall = spec.mazeBoard[neighborCoords.up.x][neighborCoords.up.y];
                    let leftWall = spec.mazeBoard[neighborCoords.left.x][neighborCoords.left.y];
                    let rightWall = spec.mazeBoard[neighborCoords.right.x][neighborCoords.right.y]
                    let downWall = spec.mazeBoard[neighborCoords.down.x][neighborCoords.down.y]

                    if (upperWall !== undefined) {
                        spec.mazeBoard[neighborCoords.up.x][neighborCoords.up.y].setNodeB(spec.mazeBoard[i][j]);
                    } else {
                        console.log(`out of bounds reference UP: [${neighborCoords.up.x}][${neighborCoords.up.y}]`);
                    }
                    // link wall left to NodeB
                    if (leftWall !== undefined) {
                        spec.mazeBoard[neighborCoords.left.x][neighborCoords.left.y].setNodeB(spec.mazeBoard[i][j]);
                    } else {
                        console.log(`out of bounds reference LEFT: [${neighborCoords.left.x}][${neighborCoords.left.y}]`);
                    }
                    // link wall right to NodeA
                    if (rightWall !== undefined) {
                        spec.mazeBoard[neighborCoords.right.x][neighborCoords.right.y].setNodeA(spec.mazeBoard[i][j]);
                    } else {
                        console.log(`out of bounds reference RIGHT: [${neighborCoords.right.x}][${neighborCoords.right.y}]`);
                    }
                    // link wall down to NodeA
                    if (downWall !== undefined) {
                        spec.mazeBoard[neighborCoords.down.x][neighborCoords.down.y].setNodeA(spec.mazeBoard[i][j]);
                    } else {
                        console.log(`out of bounds reference DOWN: [${neighborCoords.down.x}][${neighborCoords.down.y}]`);
                    }
                    // set walls to cells
                    spec.mazeBoard[i][j].setTopWall(upperWall);
                    spec.mazeBoard[i][j].setBottomWall(downWall);
                    spec.mazeBoard[i][j].setLeftWall(leftWall);
                    spec.mazeBoard[i][j].setRightWall(rightWall);
                }
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

    function _getRandomCellCoords() {
        let cellFound = false;
        let randX;
        let randY;
        while (!cellFound) {
            randX = _getRandomInt(1, spec.size.xCellCount - 1);
            randY = _getRandomInt(1, spec.size.yCellCount - 1);
            if (spec.mazeBoard[randX][randY].type === 'cell') {
                cellFound = true;
            }
        }
        return { x: randX, y: randY };
    }

    // Returns a random integer -> https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
    function _getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
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