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
    let endXY = { x: spec.size.xCellCount - 1, y: spec.size.yCellCount - 1 }; // default locations
    spec.shortestPath = [];
    spec.breadCrumbs = [];
    spec.crumbCoords = [];
    spec.drawnMaze = false;

    // load background image
    spec.cellBackgroundImg = new Image();
    spec.cellBackgroundImg.isReady = false;
    spec.cellBackgroundImg.onload = function () {
        console.log('loaded space background...')
        this.isReady = true;
    };
    spec.cellBackgroundImg.src = spec.cellBackgroundImgSrc;

    // load bread image
    let breadCrumbImg = new Image();
    breadCrumbImg.isReady = false;
    breadCrumbImg.onload = function () {
        console.log('loaded breadcrum...')
        this.isReady = true;
    };
    breadCrumbImg.src = spec.breadCrumbImgSrc;

    // Set size to {}
    function setSize(mazeSize) {
        spec.size = mazeSize;
    }

    function setDrawnMaze(val) {
        spec.drawnMaze = val;
    }

    function toggleShowCrumbs() {
        console.log("toggling bread crumbs");
        spec.showBreadCrumbs = !spec.showBreadCrumbs;
    }

    // Function uses Randomized Prim's algorithm to generate a maze
    function generateMaze() {
        console.log('Generating maze...');
        // 1 - Generate a grid of walls
        _generateBaseBoard();
        _primsMagicMazeMachine();
        // set start and end places
        spec.mazeBoard[startXY.x][startXY.y].setType('start');
        spec.mazeBoard[endXY.x][endXY.y].setType('end');

    }

    function addBreadCrumb(player) {
        if (!spec.crumbCoords.includes(player.rowColIdx)) {
            spec.mazeBoard[player.colIdx][player.rowIdx].setBreadCrumb(breadCrumbImg);
            spec.breadCrumbs.push(spec.mazeBoard[player.colIdx][player.rowIdx]);
            spec.crumbCoords.push(player.rowColIdx);
        }
    }

    // returns a list of cells in order in the shortest path
    function setShortestPath(myPlayer) {
        let curCellCoords = { x: myPlayer.rowIdx, y: myPlayer.colIdx };
        // reset previous shortest path
        _resetShortestPathTiles();
        let startCell;
        if (curCellCoords === undefined) {
            startCell = spec.mazeBoard[startXY.x][startXY.y];
        }
        else {
            startCell = spec.mazeBoard[curCellCoords.x][curCellCoords.y]
        }
        let firstDirection = 'right';
        startCell.setVisited(true);
        let endCell = _breadthFirstSearch(startCell, firstDirection, 0);
        // follow cameFrom path to the start
        _findShortestPath(endCell);
        // mark shortest path cells
        spec.shortestPath.forEach(element => {
            element.setInShortPath(true);
        });
    }

    function _resetShortestPathTiles() {
        for (let i = 0; i < spec.mazeBoard.length; i++) {
            for (let j = 0; j < spec.mazeBoard.length; j++) {
                spec.mazeBoard[i][j].setInShortPath(false);
            }
        }
    }

    // loop over visited cells, and determine shortest path from start to finish
    function _findShortestPath(endCell) {
        let prevCell = endCell.cameFrom;
        let path = [endCell];
        while (prevCell !== undefined) {
            path.push(prevCell);
            prevCell = prevCell.cameFrom;
        }
        path.reverse();
        spec.shortestPath = path;
        console.log(path);
    }
    // returns a list of visited cells, and the minimum distance
    function _breadthFirstSearch(curCell, direction, distance) {
        // base cases 
        let pathQueue = [curCell];
        let visitedCells = [];
        let directions = ['up', 'down', 'left', 'right'];
        let finalCell;
        // loop until queue is empty
        while (pathQueue.length > 0) {
            let curCell = pathQueue.shift();
            let dist = curCell.distanceTraveled;
            curCell.setVisited(true);
            // get paths surrounding current cell
            if (curCell.type === 'end') {
                finalCell = curCell;
            }
            for (let i = 0; i < directions.length; i++) {
                let nextCell = curCell.getWall(directions[i]);
                if (nextCell !== undefined && !nextCell.visited) {
                    // update all info for backtracking of cell
                    nextCell.setDistanceTraveled(dist + 1);
                    nextCell.setCameFrom(curCell);
                    pathQueue.push(nextCell);
                }
            }
        }
        return finalCell;
    }

    function info() {
        console.log(`Size: ${spec.size.xCellCount}X${spec.size.yCellCount}`)
    }

    function _primsMagicMazeMachine() {
        // 2 - Randomly pick a cell, add it to the maze
        let frontier;
        let mazeCells = [];
        let startCoords = _getRandomCellCoords();
        let startCell = spec.mazeBoard[startCoords.x][startCoords.y];
        // let startCell = spec.mazeBoard[0][0];
        mazeCells.push(startCell.getRowColIdx());
        // Add its neighboring cells to the frontier
        frontier = startCell.getNeighborCells(spec.mazeBoard);
        let randIdx = _getRandomInt(0, frontier.length - 1);
        // 3.Randomly choose a cell in the frontier
        while (frontier.length > 0) {
            let randFrontierCell = frontier[randIdx];

            // (randomly) pick a "wall" that connects to a cell in the maze
            let surroundingCells = randFrontierCell.getNeighborCells(spec.mazeBoard);
            surroundingCells = surroundingCells.filter(cell => mazeCells.includes(cell.getRowColIdx()));
            let randWallIdx = _getRandomInt(0, surroundingCells.length - 1);
            let randomMazeCell = surroundingCells[randWallIdx];

            // Remove that wall
            _linkCells(randFrontierCell, randomMazeCell);

            // Add cell to the maze
            mazeCells.push(randFrontierCell.getRowColIdx());
            let cellsLeftOver = randFrontierCell.getNeighborCells(spec.mazeBoard).filter(cell => !mazeCells.includes(cell.getRowColIdx()));

            // remove cell from frontier and reset index for next search
            frontier = frontier.filter(cell => cell.getRowColIdx() !== randFrontierCell.getRowColIdx());
            // TODO: Do a set union on these. NO DUPLICATES!
            frontier = Array.from(new Set(frontier.concat(cellsLeftOver)));
            randIdx = _getRandomInt(0, frontier.length - 1);
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
                let curCell = mazeSpace.Cell({
                    yCoord: i * spec.cellSize,
                    xCoord: j * spec.cellSize,
                    rowIdx: i,
                    colIdx: j,
                    size: spec.cellSize,
                    edges: {
                        topWall: null,
                        bottomWall: null,
                        leftWall: null,
                        rightWall: null,
                    },
                    type: 'cell',
                    color: 'green',
                    visited: false,
                    inShortPath: false,
                    distanceTraveled: 0,
                    cellBackgroundImg: spec.cellBackgroundImg,
                    nodes: 0,
                });
                mazeRow.push(curCell);
            }
            spec.mazeBoard.push(mazeRow);
        }
    }

    // Function links cells to walls
    function _linkCells(cellFrontier, cellMaze) {
        let wallDir = _getWallDir(cellFrontier, cellMaze);
        if (wallDir === 'up') {
            // remove wall for the linked cell as well
            spec.mazeBoard[cellMaze.rowIdx][cellMaze.colIdx].setBottomWall(cellFrontier);
            spec.mazeBoard[cellFrontier.rowIdx][cellFrontier.colIdx].setTopWall(cellMaze);
        }
        else if (wallDir === 'down') {
            // remove wall for the linked cell as well
            spec.mazeBoard[cellMaze.rowIdx][cellMaze.colIdx].setTopWall(cellFrontier);
            spec.mazeBoard[cellFrontier.rowIdx][cellFrontier.colIdx].setBottomWall(cellMaze);
        }
        else if (wallDir === 'left') {
            // remove wall for the linked cell as well
            spec.mazeBoard[cellFrontier.rowIdx][cellFrontier.colIdx].setLeftWall(cellMaze);
            spec.mazeBoard[cellMaze.rowIdx][cellMaze.colIdx].setRightWall(cellFrontier);
        }
        else if (wallDir === 'right') {
            // remove wall for the linked cell as well
            spec.mazeBoard[cellFrontier.rowIdx][cellFrontier.colIdx].setRightWall(cellMaze);
            spec.mazeBoard[cellMaze.rowIdx][cellMaze.colIdx].setLeftWall(cellFrontier);
        }
    }

    function _getWallDir(cellFrontier, cellMaze) {
        if (cellFrontier.rowIdx - 1 == cellMaze.rowIdx && cellFrontier.colIdx == cellMaze.colIdx) {
            return 'up';
        }
        else if (cellFrontier.rowIdx + 1 == cellMaze.rowIdx && cellFrontier.colIdx == cellMaze.colIdx) {
            return 'down';
        }
        else if (cellFrontier.rowIdx == cellMaze.rowIdx && cellFrontier.colIdx - 1 == cellMaze.colIdx) {
            return 'left';
        }
        else if (cellFrontier.rowIdx == cellMaze.rowIdx && cellFrontier.colIdx + 1 == cellMaze.colIdx) {
            return 'right';
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
        get cellBackgroundImg() { return spec.cellBackgroundImg },
        get showBreadCrumbs() { return spec.showBreadCrumbs },
        get drawnMaze() { return spec.drawnMaze },
        generateMaze: generateMaze,
        setShortestPath: setShortestPath,
        setSize: setSize,
        setDrawnMaze: setDrawnMaze,
        toggleShowCrumbs: toggleShowCrumbs,
        addBreadCrumb: addBreadCrumb,
        info: info,
        print: print,
    };

    return api;
}