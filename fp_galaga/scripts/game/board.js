// import { symlinkSync } from "fs";

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
    // let backgroundImg = new Image();
    // backgroundImg.isReady = false;
    // backgroundImg.src = spec.imageSrc;
    // backgroundImg.onload = function () {
    // console.log('loaded image...');
    // this.isReady = true;
    // };
    let levelLogic = {
        'one': {
            first: { time: 5000, wave: ['bee'], offset: 0, pattern: 'triLoop', numToSpawn: 10 },
            second: { time: 9000, wave: ['butterfly'], offset: 0, pattern: 'triLoopInvert', numToSpawn: 10 },
            third: { time: 11000, wave: ['bee', 'boss'], offset: 40, pattern: 'triLoop', numToSpawn: 20 },
        },
        'two': {
            first: { time: 5000, wave: ['bee', 'bee'], offset: 40, pattern: 'triLoopInvert', numToSpawn: 20 },
            second: { time: 9000, wave: ['butterfly', 'bee'], offset: 40, pattern: 'triLoop', numToSpawn: 20 },
            third: { time: 11000, wave: ['boss'], offset: 0, pattern: 'triLoop', numToSpawn: 5 },
        },
        'challenge': {
            first: { time: 1000, wave: ['bee'], offset: 40, pattern: 'challengePath', numToSpawn: 10 },
            second: { time: 1000, wave: ['bee'], offset: 40, pattern: 'challengePathInv', numToSpawn: 10 },
            // second: { time: 8000, wave: ['bee', 'bee'], offset: 40, pattern: 'triLoopInvert', numToSpawn: 20 },
            // third: { time: 11000, wave: ['bee', 'bee'], offset: 40, pattern: 'triLoop', numToSpawn: 20 },
            // third: { time: 12000, wave: ['bee', 'bee'], offset: 40, pattern: 'triLoopInvert', numToSpawn: 20 },
            // third: { time: 13000, wave: ['bee', 'bee'], offset: 40, pattern: 'triLoop', numToSpawn: 20 },
            // challenge: {}
        }
    }
    let levelStats = {
        'one': { spawned: { first: 0, second: 0, third: 0, }, numLeft: 40 },
        'two': { spawned: { first: 0, second: 0, third: 0, }, numLeft: 45 },
        'challenge': { spawned: { first: 0, second: 0, third: 0, }, numLeft: 100 },
    }
    let totalElapsedTime = 0;
    let timeSincePlayerDeath = 0;
    let leftPortalCoords = { x: 200, y: 200 };
    let rightPortalCoords = { x: spec.boardDimmensions - 200, y: 200 };
    let playerDead = false;
    let ufoAssets = {
        bossPurple: './assets/blue-purple-alien.png',
        boss: './assets/green-yellow-alien.png',
        butterfly: './assets/red-grey-alien.png',
        bee: './assets/bee.png',
        sasori: './assets/sasori.png',
        tonbo: './assets/tonbo.png',
        momiji: './assets/momiji.png',
        midori: './assets/midori.png',
        galflagship: './assets/galflagship.png',
        enterprise: './assets/enterprise.png',
    }

    let portalLeft = spec.constructors.ufos.Portal({
        size: { x: 75, y: 20 },
        center: { x: 250, y: 275 },
        rotation: Math.PI / 6,
    });
    let portalRight = spec.constructors.ufos.Portal({
        size: { x: 75, y: 20 },
        center: { x: spec.boardDimmensions.x - 200, y: 250 },
        rotation: Math.PI / 6,
    });
    let portalTop = spec.constructors.ufos.Portal({
        size: { x: 75, y: 20 },
        center: { x: 200, y: 250 },
        rotation: Math.PI / 6,
    });

    spec.gamePieces.portals = [portalLeft, portalRight];

    function updatePieces(elapsedTime) {
        // update player
        spec.gamePieces.player.updateShots(elapsedTime);
        // update grid
        spec.gamePieces.alienGrid.update(elapsedTime);
        // level logic:
        loadWave(levelLogic[spec.level], spec.level)
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
                // playerDied();
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
                    // playerDied();
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

        // change level, if applicable
        if (levelStats[spec.level].numLeft == 0) {
            spec.level = getNextLevel(spec.level);
            spec.boardClock = 0;
            // reset grid for next wave
            // spec.gamePieces.alienGrid.initGrid()
        }
    }

    function getNextLevel(level) {
        if (level === 'one') {
            return 'two';
        }
        else if (level === 'two') {
            return 'challenge';
        }
        else if (level === 'challenge') {
            return 'one';
        }
        else {
            console.warn('ERROR: Invalid level', level);
        }
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

    function loadWave(levelSpecs, level) {
        // load relevant wave
        Object.getOwnPropertyNames(levelSpecs).forEach(wave => {
            let curWave = levelSpecs[wave]
            if (spec.boardClock >= curWave.time) {
                _loadWave(curWave, level, wave);
            }
        });
    }

    function _loadWave(waveSpecs, level, wave) {
        // first: { time: 1000, wave: ['blue'], offset: 0, side: 'left' },
        // add a new ufo
        if (spec.unitClock >= 125 && levelStats[level].spawned[wave] < waveSpecs.numToSpawn) {
            // add alien based on wave color
            for (let colorIdx = 0; colorIdx < waveSpecs.wave.length; colorIdx++) {
                _addSmallUFO(waveSpecs.wave[colorIdx], waveSpecs.pattern, waveSpecs.offset * colorIdx);
                levelStats[level].spawned[wave]++;
            }
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
                // decrease number of ufos left
                levelStats[spec.level].numLeft--;
                console.log(`Num left: ${levelStats[spec.level].numLeft}`)
                explosion(ufo, './assets/firework_red1.png', 0.75, { mean: 15, stdev: 5 })
                explosion(ufo, './assets/firework_yellow.png', 0.75, { mean: 3, stdev: 1 })
                return false;
            }
        });
    }

    function _addSmallUFO(type, pattern, offset) {
        let smallUFO = spec.constructors.ufos.UFOSmall({
            coords: { x: - 10, y: 300 },
            imageSrc: ufoAssets[type],
            boss2ndSrc: ufoAssets['bossPurple'],
            transformSrc: ufoAssets[_transformImg(type)],
            rotation: -Math.PI / 2,
            form: 'first',
            boardSize: spec.boardDimmensions,
            size: 30,
            shotImgSource: './assets/green-yellow-alien.png',
            shot: spec.constructors.shot,
            type: type,
            maxProjectiles: 40,
            theta: Math.PI / 5,
            willDive: _willDive(),
            willTransform: _willTransform(),
            diveInterval: _nextRange(2000, 4000),
            transformTime: _nextRange(5000, 20000),
            timeInGrid: 0,
            pattern: pattern,
            patternOffset: offset,
            diveTheta: 0,
        });
        spec.gamePieces.ufos.push(smallUFO);
    }

    function _transformImg(type) {
        let newType;

        switch (type) {
            case 'bee':
                newType = 'midori';
                break;
            case 'butterfly':
                newType = 'galflagship';
                break;
            case 'boss':
                newType = 'boss';
                break;
            default:
                newType = 'enterprise';
                break;
        }

        return newType;
    }

    function _willDive() {
        let prob = 0.25;
        let result = Math.random();
        if (result < prob) {
            return true;
        }
        return false;
    }

    function _willTransform() {
        let prob = 0.1;
        let result = Math.random();
        if (result < prob) {
            console.log('alient will transform');
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
        get levelStarted() { return spec.levelStarted },
        get level() { return spec.level },
        updatePieces: updatePieces,
        updateClock: updateClock,
        // addUFO: addUFO,
    }

    return api;
};