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
        // 1 - Generate a grid of walls
        // 2 - Pick a cell, mark it as part of the maze. Add the walls of the cell to the wall list.
        // 3 - While there are walls in the list:
        //     a - Pick a random wall from the list. If only one of the two cells that the wall divides is visited, then:
        //         i - Make the wall a passage and mark the unvisited cell as part of the maze.
        //         ii - Add the neighboring walls of the cell to the wall list.
        //     b - Remove the wall from the list.
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
                else if (spec.mazeBoard[i][j].cellType === 'cell') {
                    row += ' X ';
                }
                else if (spec.mazeBoard[i][j].wallType === 'wall-verticle') {
                    row += ' | ';
                }
                else {
                    row += ' - ';
                }
            }
            console.log(row)
        }
    }

    // Generates an xCellCount X yCellCount board of cells, with each cell connected to other adjacent cells
    function _generateBaseBoard() {
        for (let i = 0; i < spec.size.xCellCount; i++) {
            console.log('Now on row:', i);
            let mazeRow = [];
            for (let j = 0; j < spec.size.yCellCount; j++) {
                // 
                let cellType = _calcCellType(i, j);
                let curCell;
                if (cellType === 'cell') {
                    curCell = mazeSpace.Cell({
                        xCoord: i * spec.boardWidth,
                        yCoord: j * spec.boardHeight,
                        xIdx: i,
                        yIdx: j,
                        cellType: cellType,
                    });
                } else {
                    curCell = mazeSpace.Wall({
                        wallType: cellType,
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
                if (spec.mazeBoard[i][j].cellType === 'cell') {
                    let neighborCoords = spec.mazeBoard[i][j].getNeighborCellCoords();
                    // link cells together
                    // link wall above to NodeB
                    if (spec.mazeBoard[neighborCoords.up.x][neighborCoords.up.y] !== undefined) {
                        spec.mazeBoard[neighborCoords.up.x][neighborCoords.up.y].setNodeB(spec.mazeBoard[i][j]);
                    } else {
                        console.log(`out of bounds reference UP: [${neighborCoords.up.x}][${neighborCoords.up.y}]`);
                    }
                    // link wall left to NodeB
                    if (spec.mazeBoard[neighborCoords.left.x][neighborCoords.left.y] !== undefined) {
                        spec.mazeBoard[neighborCoords.left.x][neighborCoords.left.y].setNodeB(spec.mazeBoard[i][j]);
                    } else {
                        console.log(`out of bounds reference LEFT: [${neighborCoords.left.x}][${neighborCoords.left.y}]`);
                    }
                    // link wall right to NodeA
                    if (spec.mazeBoard[neighborCoords.right.x][neighborCoords.right.y] !== undefined) {
                        spec.mazeBoard[neighborCoords.right.x][neighborCoords.right.y].setNodeA(spec.mazeBoard[i][j]);
                    } else {
                        console.log(`out of bounds reference RIGHT: [${neighborCoords.right.x}][${neighborCoords.right.y}]`);
                    }
                    // link wall down to NodeA
                    if (spec.mazeBoard[neighborCoords.down.x][neighborCoords.down.y] !== undefined) {
                        spec.mazeBoard[neighborCoords.down.x][neighborCoords.down.y].setNodeA(spec.mazeBoard[i][j]);
                    } else {
                        console.log(`out of bounds reference DOWN: [${neighborCoords.down.x}][${neighborCoords.down.y}]`);
                    }
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
            return 'wall-verticle';
        }
        else if (cellI % 2 === 0 && cellJ % 2 === 1) {
            return 'wall-horizontal';
        }
        else {
            return 'cell';
        }
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