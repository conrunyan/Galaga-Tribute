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
    spec.topWall = null;
    spec.bottomWall = null;
    spec.leftWall = null;
    spec.rightWall = null;

    function setVisited (newVisted) {
        spec.visited = newVisted;
    }
    function setTopWall(wall) {
        spec.topWall = wall;
    }
    function setBottomWall(wall) {
        spec.bottomWall = wall;
    }
    function setLeftWall(wall) {
        spec.leftWall = wall;
    }
    function setRightWall(wall) {
        spec.rightWall = wall;
    }

    // returns the x/y indices of neighboring cells
    function getNeighborCellCoords() {
        return {
            up: {x: spec.xIdx, y: spec.yIdx + 1},
            down: {x: spec.xIdx, y: spec.yIdx - 1},
            right: {x: spec.xIdx + 1, y: spec.yIdx},
            left: {x: spec.xIdx - 1, y: spec.yIdx},
        };
    }

    function getWalls() {
        return [
            spec.topWall,
            spec.bottomWall,
            spec.leftWall,
            spec.rightWall,
        ];
    }

    let api = {
        get xCoord() { return spec.xCoord },
        get yCoord() { return spec.yCoord },
        get topWall() { return spec.topWall },
        get bottomWall() { return spec.bottomWall },
        get leftWall() { return spec.leftWall },
        get rightWall() { return spec.rightWall },
        get type() { return spec.type },
        get visited() { return spec.visited },
        get xIdx() { return spec.xIdx },
        get yIdx() { return spec.yIdx },
        setVisited: setVisited,
        setTopWall: setTopWall,
        setBottomWall: setBottomWall,
        setLeftWall: setLeftWall,
        setRightWall: setRightWall,
        getNeighborCellCoords: getNeighborCellCoords,
        getWalls: getWalls,
    };

    return api;
}