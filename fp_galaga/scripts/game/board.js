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
//  boardDimmensions: {x: , y:}
// }
// --------------------------------------------------------------
Galaga.game.Board = function (spec) {
    'use strict';

    // load image
    let backgroundImg = new Image();
    backgroundImg.isReady = false;
    backgroundImg.src = spec.imageSrc;
    backgroundImg.onload = function () {
        // console.log('loaded image...');
        this.isReady = true;
    };
    let levelLogic = {
        'one': {
            first: { time: 1000, wave: ['blue'], offset: 0, side: 'left' },
            second: { time: 5000, wave: ['green'], offset: 0, side: 'right' },
            third: { time: 8000, wave: ['red', 'blue'], offset: 20, side: 'top' }
        }
    }
    let totalElapsedTime = 0;
    let timeSincePlayerDeath = 0;
    let leftPortalCoords = { x: 200, y: 200 };
    let rightPortalCoords = { x: spec.boardDimmensions - 200, y: 200 };
    let ufoAssets = {
        blue: './assets/blue-purple-alien.png',
        green: './assets/green-yellow-alien.png',
        red: './assets/red-grey-alien.png',
    }

    function updatePieces(elapsedTime) {
        // update player
        spec.gamePieces.player.updateShots(elapsedTime);
        // update grid
        spec.gamePieces.alienGrid.update(elapsedTime);
        // level logic:
        if (spec.level === 'one') {
            loadWave(levelLogic['one'])
        }
        // update UFOs
        spec.gamePieces.ufos.forEach(ufo => {
            ufo.ufoMove(elapsedTime, spec.gamePieces.alienGrid, spec.gamePieces.player.coords);
        });

        // // detect colision
        // check player with ufos
        spec.gamePieces.ufos.forEach(ufo => {
            // console.log('ufo', ufo);
            let playerUfoDist = _getDistanceBetweenPoints(ufo.center, spec.gamePieces.player.center);
            let sumOfRadi = spec.gamePieces.player.radius + ufo.radius;
            if (playerUfoDist < sumOfRadi && !playerDead) {
                playerDied();
                ufo.setDidCollide(true);
            }
        });
        // // check player with ufo shots
        spec.gamePieces.ufos.forEach(ufo => {
            // console.log('ufo', ufo);
            ufo.projectiles.forEach(shot => {
                let ufoPlayerShot = _getDistanceBetweenPoints(shot.center, spec.gamePieces.player.center);
                let sumOfRadi = spec.gamePieces.player.radius + shot.radius;
                if (ufoPlayerShot < sumOfRadi && !playerDead) {
                    playerDied();
                    shot.setDidCollide(true);
                }
            })
        });

        // // check projectiles with ufos
        spec.gamePieces.ufos.forEach(ufo => {
            // console.log('ufo', ufo);
            spec.gamePieces.player.projectiles.forEach(shot => {
                let ufoShot = _getDistanceBetweenPoints(shot.center, ufo.center);
                let sumOfRadi = ufo.radius + shot.radius;
                if (ufoShot < sumOfRadi) {
                    ufo.setDidCollide(true);
                    shot.setDidCollide(true);
                    spec.gamePieces.player.increaseScore(ufo.points);
                }
            })

        });

        // clean up units
        removeUFOs();
        // update time
        spec.unitClock += elapsedTime;
        spec.boardClock += elapsedTime;
    }

    function updateClock(totalTime) {
        totalElapsedTime = totalTime;
    }

    function explosion(ast, image, time, size) {
        let newPS = spec.constructors.particleSystem.ParticleSystem({
            center: { x: ast.center.x, y: ast.center.y },
            size: size,
            speed: { mean: 65, stdev: 35 },
            lifetime: { mean: 4, stdev: 1 },
            totalLife: time,
            density: 5,
            imageSrc: image,
            alive: true,
        }, spec.Random)
        spec.particleController.addNewSystem(newPS);
    }

    /////////////////////////////////
    //        PLAYER FUNCTIONS     //
    /////////////////////////////////


    /////////////////////////////////
    //        UFO   FUNCTIONS      //
    /////////////////////////////////

    function loadWave(levelSpecs) {
        // load relevant wave
        if (spec.boardClock >= levelSpecs.third.time) {
            _loadWave(levelSpecs.third);
        }
        else if (spec.boardClock >= levelSpecs.second.time) {
            _loadWave(levelSpecs.second);
        }
        if (spec.boardClock >= levelSpecs.first.time) {
            _loadWave(levelSpecs.first);
        }
    }

    function _loadWave(waveSpecs) {
        // first: { time: 1000, wave: ['blue'], offset: 0, side: 'left' },
        // add a new ufo
        if (spec.unitClock >= 250 && spec.gamePieces.ufos.length < spec.gamePieces.alienGrid.size) {
            // add alien based on wave color
            waveSpecs.wave.forEach(color => {
                _addSmallUFO(color, 'triRose');
            })
            spec.unitClock = 0;
        }
    }

    function removeUFOs() {
        // remove UFOs that collided or are out of time
        spec.gamePieces.ufos = spec.gamePieces.ufos.filter(ufo => {
            if (!ufo.didCollide) {
                return true;
            }
            else {
                explosion(ufo, './assets/firework_red1.png', 0.75, { mean: 15, stdev: 5 })
                explosion(ufo, './assets/firework_yellow.png', 0.75, { mean: 3, stdev: 1 })
                return false;
            }
        });
    }

    function _addSmallUFO(color, pattern) {
        let smallUFO = spec.constructors.ufos.UFOSmall({
            coords: { x: - 10, y: 300 },
            imageSrc: ufoAssets[color],
            rotation: -Math.PI / 2,
            boardSize: spec.boardDimmensions,
            size: 45,
            shotImgSource: './assets/green-yellow-alien.png',
            shot: spec.constructors.shot,
            ufoType: 'small',
            maxProjectiles: 40,
            theta: Math.PI / 5,
            willDive: _willDive(),
            timeInGrid: 0,
            pattern: pattern,
        });
        spec.gamePieces.ufos.push(smallUFO);
    }

    function _willDive() {
        let prob = 0.25;
        let result = Math.random();
        if (result < prob) {
            return true;
        }
        return false;
    }


    /////////////////////////////////
    //     ASTEROID FUNCTIONS      //
    /////////////////////////////////

    // removes any asteroids that are off the screen


    function _nextRange(min, max) {
        let range = max - min;
        return Math.floor((Math.random() * range) + min);
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
        get ufos() { return spec.gamePieces.ufos },
        get alienGrid() { return spec.gamePieces.alienGrid },
        get portals() { return spec.gamePieces.portals },
        updatePieces: updatePieces,
        updateClock: updateClock,
        // addUFO: addUFO,
    }

    return api;
};