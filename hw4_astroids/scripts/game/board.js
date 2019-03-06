// --------------------------------------------------------------
//
// Creates a Player object, with functions for managing state.
// One player object will exist at a time. This object can manuever
// around the game board and interact with the maze (exit, run into walls, etc.)
// spec = {
//  gamePieces: {
//      player: {playerObj},
//      asteroids: [{asteroidObj}, ...],
//      ufos: [{ufoObj}, ....]
//  }
//  imageSrc: image
// }
// --------------------------------------------------------------
Asteroids.game.Board = (function (spec) {
    'use strict';

    // load image
    let backgroundImg = new Image();
    backgroundImg.isReady = false;
    backgroundImg.src = spec.imageSrc;
    backgroundImg.onload = function () {
        console.log('loaded image...');
        this.isReady = true;
    };

    function addAsteroid(newAstrd) {
        spec.gamePieces.asteroids.push(newAstrd);
    }

    function addUFO(newUFO) {
        spec.gamePieces.ufos.push(newUFO);
    }

    function updatePieces() {
        // update player
        spec.gamePieces.player.update();
    }

    let api = {
        get image() { return backgroundImg },
        get player() { return spec.gamePieces.player },
        get asteroids() { return spec.gamePieces.asteroids },
        get ufos() { return spec.gamePieces.ufos },
        addAsteroid: addAsteroid,
        addUFO: addUFO,
    }

    return api;
});