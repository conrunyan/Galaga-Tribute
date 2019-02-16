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
// }
//
// --------------------------------------------------------------
MazeGame.objects.player.Player = function (spec) {
    'use strict';

    function moveUp() {
        spec.colIdx -= 1;
    }
    function moveDown() {
        pec.colIdx += 1;
    }
    function moveLeft() {
        spec.rowIdx -= 1;
    }
    function moveLeft() {
        spec.rowIdx += 1;
    }

    let api = {
        get rowIdx() { return spec.rowIdx },
        get colIdx() { return spec.colIdx },
        get xCoord() { return spec.rowIdx * spec.cellSize }, 
        get yCoord() { return spec.colIdx * spec.cellSize },
        get imageSrc() { return spec.imageSrc },
        moveUp: moveUp,
        moveDown: moveDown,
        moveLeft: moveLeft,
        moveLeft: moveLeft,
    };

    return api;
}