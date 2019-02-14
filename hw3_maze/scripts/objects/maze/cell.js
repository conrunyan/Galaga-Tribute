// --------------------------------------------------------------
//
// Creates a maze Cell object, with functions for managing state.
// A single Cell can border up 4 other cells, connected by one wall each.
// spec = {
//  xCoord: cell's x coordinate,
//  yCoord: cell's y coordinate,
//  xIdx: ,
//  yIdx: ,
//  cellType: type of cell (start, end, normal),
//  visited: ,
// }
//
// --------------------------------------------------------------
MazeGame.objects.maze.Cell = function (spec) {
    'use strict';

    spec.visited = false;
    spec.partOfMaze = false;
    spec.edges = {
        topWall: spec.topWall,
        bottomWall: spec.bottomWall,
        leftWall: spec.leftWall,
        rightWall: spec.rightWall,
    };

    function setType(newType) {
        spec.type = newType;
    }

    function setVisited(newVisted) {
        spec.visited = newVisted;
    }
    function setTopWall(wall) {
        spec.edges.topWall = wall;
    }
    function setBottomWall(wall) {
        spec.edges.bottomWall = wall;
    }
    function setLeftWall(wall) {
        spec.edges.leftWall = wall;
    }
    function setRightWall(wall) {
        spec.edges.rightWall = wall;
    }

    // returns the x/y indices of neighboring cells
    function getNeighborCellCoords() {
        return {
            up: { x: spec.rowIdx - 1, y: spec.colIdx },
            down: { x: spec.rowIdx + 1, y: spec.colIdx },
            right: { x: spec.rowIdx, y: spec.colIdx + 1 },
            left: { x: spec.rowIdx, y: spec.colIdx - 1 },
        };
    }

    function getRowColIdx() {
        return `${spec.rowIdx},${spec.colIdx}`;
    }

    function getNeighborCells() {
        let cells = [
            spec.edges.topWall,
            spec.edges.bottomWall,
            spec.edges.leftWall,
            spec.edges.rightWall,
        ];

        return cells.filter(cell => cell !== null);
    }

    function removeWall(cell) {
        if (spec.edges.topWall !== null && cell.getRowColIdx() === spec.edges.topWall.getRowColIdx()) {
            // remove wall for the linked cell as well
            spec.edges.topWall.edges.bottomWall = null;
            spec.edges.topWall = null;
        }
        else if (spec.edges.bottomWall !== null && cell.getRowColIdx() === spec.edges.bottomWall.getRowColIdx()) {
            // remove wall for the linked cell as well
            spec.edges.bottomWall.edges.topWall = null;
            spec.edges.bottomWall = null;
        }
        else if (spec.edges.leftWall !== null && cell.getRowColIdx() === spec.edges.leftWall.getRowColIdx()) {
            // remove wall for the linked cell as well
            spec.edges.leftWall.edges.rightWall = null;
            spec.edges.leftWall = null;
        }
        else if (spec.edges.rightWall !== null && cell.getRowColIdx() === spec.edges.rightWall.getRowColIdx()) {
            // remove wall for the linked cell as well
            spec.edges.rightWall.edges.leftWall = null;
            spec.edges.rightWall = null;
        }
    }

    let api = {
        get xCoord() { return spec.xCoord },
        get yCoord() { return spec.yCoord },
        // get topWall() { return spec.topWall },
        // get bottomWall() { return spec.bottomWall },
        // get leftWall() { return spec.leftWall },
        // get rightWall() { return spec.rightWall },
        get type() { return spec.type },
        get visited() { return spec.visited },
        get rowIdx() { return spec.rowIdx },
        get colIdx() { return spec.colIdx },
        get color() { return spec.color },
        get size() { return spec.size },
        get edges() { return spec.edges },
        setVisited: setVisited,
        setTopWall: setTopWall,
        setBottomWall: setBottomWall,
        setLeftWall: setLeftWall,
        setRightWall: setRightWall,
        setType: setType,
        getNeighborCellCoords: getNeighborCellCoords,
        getNeighborCells: getNeighborCells,
        getRowColIdx: getRowColIdx,
        removeWall: removeWall,
    };

    return api;
}