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
            // console.log('asteroid', asteroid);
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
            // console.log('shot', shot);
            spec.gamePieces.asteroids.forEach(asteroid => {
                console.log('shot->asteroid', asteroid.center.x, asteroid.center.y);
                let shotAstDist = _getDistanceBetweenPoints(shot.center, asteroid.center);
                let sumOfRadi = shot.radius + asteroid.radius;
                // console.log('SAD:', shotAstDist, 'SOR:', sumOfRadi);
                if (shotAstDist < sumOfRadi && !shot.didCollide) {
                    // window.alert('HIT!');
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
                newAsteroids = newAsteroids.concat(sptAsts);
            }
        });

        spec.gamePieces.asteroids = spec.gamePieces.asteroids.filter(asteroid => !asteroid.didCollide);
        spec.gamePieces.asteroids = spec.gamePieces.asteroids.concat(newAsteroids);
    }

    // split asteroid in half, returning a list of two asteroids
    // of half the size moving in random, opposite directions
    function splitAsteroid(astToSplit) {
        console.log('calling split asteroids...');
        let numToCreate = astToSplit.breaksInto;
        let newAsts = [];
        let newType;
        if (astToSplit.asteroidType === 'large') {
            newType = 'medium';
        }
        else if (astToSplit.asteroidType === 'medium') {
            newType = 'small';
        }
        // blew up a small. Nothing smaller than that
        else {
            return newAsts;
        }

        let velPosibilities = [
            { x: -astToSplit.velocities.x * 1.5, y: -astToSplit.velocities.y * 1.5 },
            { x: -astToSplit.velocities.x * 1.5, y: astToSplit.velocities.y * 1.5 },
            { x: astToSplit.velocities.x * 1.5, y: astToSplit.velocities.y * 1.5 },
            { x: astToSplit.velocities.x * 1.5, y: -astToSplit.velocities.y * 1.5 }
        ]

        for (let i = 0; i < numToCreate; i++) {
            let tmpAst = spec.constructors.asteroids.Asteroid({
                coords: { x: astToSplit.coords.x, y: astToSplit.coords.y },
                imageSrc: './assets/asteroid.png',
                velocities: velPosibilities[i],
                rotation: 0,
                asteroidType: newType,
                mass: astToSplit.mass / 1.5,
            });
            newAsts.push(tmpAst);
        }

        return newAsts;
    }

    function _getDistanceBetweenPoints(p1, p2) {
        let x_2 = Math.pow(p2.x - p1.x, 2)
        let y_2 = Math.pow(p2.y - p1.y, 2)
        let result = Math.sqrt(x_2 + y_2)
        return result
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