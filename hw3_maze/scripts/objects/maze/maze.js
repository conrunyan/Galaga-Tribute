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

    // Set size to {}
    function setSize(mazeSize) {
        spec.size = mazeSize;
    }

    // Function uses Randomized Prim's algorithm to generate a maze
    function generateMaze() {
        console.log('Generating maze...');
        _generateBaseBoard();
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

    // Generates an xCellCount X yCellCount board of cells, with each cell connected to other adjacent cells
    function _generateBaseBoard() {
        for (let i = 0; i < spec.size.xCellCount; i++) {
            console.log('Now on row:', i);
            let mazeRow = [];
            for (let j = 0; j < spec.size.yCellCount; j++) {
                // 
                let curCell = mazeSpace.Cell({
                    xCoord: i * spec.boardWidth,
                    yCoord: j * spec.boardHeight,
                    xIdx: i,
                    yIdx: j,
                    cellType: _calcCellType(i, j),
                });
                mazeRow.push(curCell);
            }
            spec.mazeBoard.push(mazeRow);
        }
    }

    // Function 
    function _linkCells(cellA, CellB) {
        // check if either cell is on the edge
        let cellANeighbors = cellA.getNeighborCellCoords();
        let cellBNeighbors = cellB.getNeighborCellCoords();

        // TODO: Finish function to link cells together with a wall. Wall needs to be put in the
        // list of walls.
    }

    function _calcCellType(cellI, cellJ) {
        if (cellI === 0 || cellJ === 0 || cellI === spec.size.xCellCount - 1 || cellJ === spec.size.yCellCount) {
            return 'border-wall'
        }
        // walls are between normal cells
        if ((cellI % 2 === 1 && cellJ % 2 === 0) || (cellI % 2 === 2 && cellJ % 2 === 1)) {
            return 'wall'
        }
        else {
            return 'cell'
        }
    }

    let api = {
        get mazeBoard() { return spec.mazeBoard },
        get shortestPath() { return spec.shortestPath },
        get breadCrumbs() { return spec.breadCrumbs },
        generateMaze: generateMaze,
        setSize: setSize,
        info: info,
    };

    return api;
}