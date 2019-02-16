// --------------------------------------------------------------
//
// Creates a Player object, with functions for managing state.
// One player object will exist at a time. This object can manuever
// around the game board and interact with the maze (exit, run into walls, etc.)
// spec = {
//  rowIdx: ,
//  colIdx: ,
//  imageSrc: ,
//  cellSize: ,
//  direction: ,
// }
//
// --------------------------------------------------------------
MazeGame.objects.player.Player = function (spec) {
    'use strict';

    // load image
    let image = new Image();
    image.isReady = false;
    image.onload = function() {
        this.isReady = true;
    };
    image.src = spec.imageSrc;

    function moveUp() {
        if (spec.map[spec.rowIdx][spec.colIdx - 1] !== undefined && spec.map[spec.rowIdx][spec.colIdx - 1].topWall !== undefined) {
            spec.colIdx -= 1;
            spec.direction = 'up';
        }
    }
    function moveDown() {
        if (spec.map[spec.rowIdx][spec.colIdx + 1] !== undefined && spec.map[spec.rowIdx - 1][spec.colIdx].bottonWall !== undefined) {
            pec.colIdx += 1;
            spec.direction = 'down';
        }
    }
    function moveLeft() {
        if (spec.map[spec.rowIdx - 1][spec.colIdx] !== undefined && spec.map[spec.rowIdx - 1][spec.colIdx].topWall !== undefined) {
            spec.rowIdx -= 1;
            spec.direction = 'left';
        }
    }
    function moveRight() {
        if (spec.map[spec.rowIdx + 1][spec.colIdx] !== undefined && spec.map[spec.rowIdx + 1][spec.colIdx].topWall !== undefined) {
            spec.rowIdx += 1;
            spec.direction = 'right';
        }
    }

    function givePlayerMap(map) {
        spec.map = map;
    }

    let api = {
        get rowIdx() { return spec.rowIdx },
        get colIdx() { return spec.colIdx },
        get xCoord() { return spec.rowIdx * spec.cellSize },
        get yCoord() { return spec.colIdx * spec.cellSize },
        get image() { return spec.image },
        moveUp: moveUp,
        moveDown: moveDown,
        moveLeft: moveLeft,
        moveRight: moveRight,
        givePlayerMap: givePlayerMap,
    };

    return api;
}