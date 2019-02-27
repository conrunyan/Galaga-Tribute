// --------------------------------------------------------------
//
// Creates a Player object, with functions for managing state.
// One player object will exist at a time. This object can manuever
// around the game board and interact with the maze (exit, run into walls, etc.)
// spec = {
//  coords: {x: int, y: int} ,
//  imageSrc: ,
//  maxSpeed: ,
//  velocities: {x: float, y: float},
// }
//
// CREDITS: Character art from https://opengameart.org/content/jumping-galaxy-asset-cc-by-30
// --------------------------------------------------------------
MazeGame.objects.player.Player = function (spec) {
    'use strict';

    // load image
    let image = new Image();
    image.isReady = false;
    image.src = spec.imageSrc;
    image.onload = function () {
        console.log('loaded image...')
        this.isReady = true;
    };

    function moveUp() {
        console.log('trying to move up...');
        if (spec.map[spec.colIdx][spec.rowIdx].edges.topWall !== undefined) {
            console.log('moved up!');
            spec.colIdx -= 1;
            spec.direction = 'up';
            // get new shortest path
            spec.maze.setShortestPath(spec);
        }
        console.log(spec);
    }
    function moveDown() {
        console.log('trying to move down...');
        if (spec.map[spec.colIdx][spec.rowIdx].edges.bottomWall !== undefined) {
            console.log('moved down!');
            spec.colIdx += 1;
            spec.direction = 'down';
            // get new shortest path
            spec.maze.setShortestPath(spec);
        }
        console.log(spec);
    }
    function moveLeft() {
        console.log('trying to move left...');
        if (spec.map[spec.colIdx][spec.rowIdx].edges.leftWall !== undefined) {
            console.log('moved left!');
            spec.rowIdx -= 1;
            spec.direction = 'left';
            // get new shortest path
            spec.maze.setShortestPath(spec);
        }
        console.log(spec);
    }
    function moveRight() {
        console.log('trying to move right...');
        if (spec.map[spec.colIdx][spec.rowIdx].edges.rightWall !== undefined) {
            console.log('moved right!');
            spec.rowIdx += 1;
            spec.direction = 'right';
            // get new shortest path
            spec.maze.setShortestPath(spec);
        }
        console.log(spec);
    }

    let api = {
        get rowIdx() { return spec.rowIdx },
        get colIdx() { return spec.colIdx },
        get xCoord() { return spec.rowIdx * spec.cellSize },
        get yCoord() { return spec.colIdx * spec.cellSize },
        get image() { return image },
        get cellSize() { return spec.cellSize },
        get rowColIdx() { return `${spec.rowIdx},${spec.colIdx}` },
        moveUp: moveUp,
        moveDown: moveDown,
        moveLeft: moveLeft,
        moveRight: moveRight,
    };

    return api;
}