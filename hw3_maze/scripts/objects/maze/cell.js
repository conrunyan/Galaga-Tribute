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

    function setVisited (visited) {
        spec.visited = visited;
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
        get topWall() { return spec.walls.topWall },
        get bottomWall() { return spec.walls.bottomWall },
        get leftWall() { return spec.walls.leftWall },
        get rightWall() { return spec.walls.rightWall },
        get cellType() { return spec.cellType },
        get visited() { return visited },
        setVisited: setVisited,
    };

    return api;
}