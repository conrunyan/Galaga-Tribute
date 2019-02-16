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
        if (spec.map[spec.rowIdx][spec.colIdx - 1] !== undefined && spec.map[spec.rowIdx][spec.colIdx - 1].edges.topWall !== undefined) {
            spec.colIdx -= 1;
            spec.direction = 'up';
        }
    }
    function moveDown() {
        if (spec.map[spec.rowIdx][spec.colIdx + 1] !== undefined && spec.map[spec.rowIdx - 1][spec.colIdx].edges.bottomWall !== undefined) {
            spec.colIdx += 1;
            spec.direction = 'down';
        }
    }
    function moveLeft() {
        if (spec.map[spec.rowIdx - 1][spec.colIdx] !== undefined && spec.map[spec.rowIdx - 1][spec.colIdx].edges.topWall !== undefined) {
            spec.rowIdx -= 1;
            spec.direction = 'left';
        }
    }
    function moveRight() {
        if (spec.map[spec.rowIdx + 1][spec.colIdx] !== undefined && spec.map[spec.rowIdx + 1][spec.colIdx].edges.topWall !== undefined) {
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
        get image() { return image },
        get cellSize() { return spec.cellSize },
        moveUp: moveUp,
        moveDown: moveDown,
        moveLeft: moveLeft,
        moveRight: moveRight,
        givePlayerMap: givePlayerMap,
    };

    return api;
}