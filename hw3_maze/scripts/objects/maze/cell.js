// --------------------------------------------------------------
//
// Creates a maze Cell object, with functions for managing state.
// A single Cell can border up 4 other cells, connected by one wall each.
// spec = {
//  xCoord: cell's x coordinate,
//  yCoord: cell's y coordinate,
//  walls: {
//            topWall: ,
//            bottomWall: ,
//            leftWall: ,
//            rightWall: ,
//          },
//  cellType: type of cell (start, end, normal),
//  visited: ,
// }
//
// --------------------------------------------------------------
MazeGame.objects.maze.Cell = function (spec) {
    'use strict';

    spec.visited = false;
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

    let api = {
        get xCoord() { return spec.xCoord },
        get yCoord() { return spec.yCoord },
        get topWall() { return spec.topWall },
        get bottomWall() { return spec.bottomWall },
        get leftWall() { return spec.leftWall },
        get rightWall() { return spec.rightWall },
        get cellType() { return spec.cellType },
        get visited() { return spec.visited },
        setVisited: setVisited,
        setTopWall: setTopWall,
        setBottomWall: setBottomWall,
        setLeftWall: setLeftWall,
        setRightWall: setRightWall,
    };

    return api;
}