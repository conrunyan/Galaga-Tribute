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
//  objects (constructors from game)
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

    function updatePieces(elapsedTime) {
        // update player
        spec.gamePieces.player.playerMoveLocation(elapsedTime);
        spec.gamePieces.player.updateShots(elapsedTime);
        // update asteroids
        spec.gamePieces.asteroids.forEach(asteroid => {
            asteroid.asteroidMoveLocation(elapsedTime);
        });

        // detect colision
        // check player with asteroids
        // if distance between two centers is less than the sum of two radi
        spec.gamePieces.asteroids.forEach(asteroid => {
            console.log('asteroid', asteroid);
            let playerAstDist = _getDistanceBetweenPoints(asteroid.center, spec.gamePieces.player.center);
            let sumOfRadi = spec.gamePieces.player.radius + asteroid.radius;
            if (playerAstDist < sumOfRadi) {
                spec.gamePieces.player.setDidCollide(true);
                asteroid.setDidCollide(true);
            }
        });
        // check projectiles with asteroids
        let astToSplit = [];
        spec.gamePieces.player.projectiles.forEach(shot => {
            console.log('shot', shot);
            spec.gamePieces.asteroids.forEach(asteroid => {
                console.log('shot->asteroid', asteroid);
                let shotAstDist = _getDistanceBetweenPoints(shot.center, asteroid.center);
                let sumOfRadi = shot.radius + asteroid.radius;
                if (shotAstDist < sumOfRadi) {
                    shot.setDidCollide(true);
                    asteroid.setDidCollide(true);
                    astToSplit.push(asteroid);
                }
            });
        });
        // check player with ufos
        // check projectiles with ufos

        // split asteroids in two that have colided, then remove the original
        let newAsteroids = [];
        astToSplit.forEach(asteroid => {
            if (asteroid.didCollide) {
                let sptAsts = splitAsteroid(asteroid);
                newAsteroids.concat(sptAsts);
            }
        });

        spec.gamePieces.asteroids.filter(asteroid => !asteroid.didCollide);
        spec.gamePieces.asteroids.concat(newAsteroids);
    }

    // split asteroid in half, returning a list of two asteroids
    // of half the size moving in random, opposite directions
    function splitAsteroid(astToSplit) {
        let ast1 = spec.constructors.asteroids.Asteroid({
            coords: { x: astToSplit.coords.x, y: astToSplit.coords.y },
            imageSrc: '../../assets/asteroid.png',
            velocities: { x: -astToSplit.velocities.x * 1.5, y: astToSplit.velocities.y * 1.5 },
            rotation: 0,
            size: astToSplit.size / 2,
            mass: astToSplit.mass / 2,
        });

        let ast2 = spec.constructors.asteroids.Asteroid({
            coords: { x: astToSplit.coords.x, y: astToSplit.coords.y },
            imageSrc: '../../assets/asteroid.png',
            velocities: { x: astToSplit.velocities.x * 1.5, y: -astToSplit.velocities.y * 1.5 },
            rotation: 0,
            size: astToSplit.size / 2,
            mass: astToSplit.mass / 2,
        });

        return [ast1, ast2];
    }

    function _getDistanceBetweenPoints(p1, p2) {
        let x_2 = Math.pow(p2.x - p1.x, 2)
        let y_2 = Math.pow(p2.y - p1.y, 2)
        return Math.sqrt(x_2 + y_2)
    }

    let api = {
        get image() { return backgroundImg },
        get player() { return spec.gamePieces.player },
        get asteroids() { return spec.gamePieces.asteroids },
        get ufos() { return spec.gamePieces.ufos },
        addAsteroid: addAsteroid,
        addUFO: addUFO,
        updatePieces: updatePieces,
    }

    return api;
});