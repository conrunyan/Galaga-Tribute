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
    //     // console.log('loaded image...');
    //     this.isReady = true;
    // };
    let totalElapsedTime = 0;
    let timeSincePlayerDeath = 0;
    let aliens = []
    let surface = [
        { x: 0.00, y: 0.00, safe: false },
        { x: 0.25, y: 0.25, safe: false },
        { x: 0.40, y: 0.10, safe: true },
        { x: 0.70, y: 0.10, safe: true },
        { x: 0.80, y: 0.45, safe: false },
        { x: 1.00, y: 0.00, safe: false },
    ];

    function updatePieces(elapsedTime) {
        // update player
        spec.gamePieces.player.playerMoveLocation(elapsedTime);
        // check for collision:
        // if (spotIsSafe(spec.gamePieces.player.coords)) {
        //     console.log(spec.gamePieces.player.coords)
        //     console.log('SAFE SPOT!');
        // }
        spec.gamePieces.player.printStats();
        let collResults = didCollide(spec.gamePieces.player);
        if (collResults.collision) {
            console.log(spec.gamePieces.player.center)
            
            // is place safe?
            if (collResults.safe) {
                spec.gamePieces.player.stopPlayerMovement();
                console.log('Safe!');
            }
            else {
                console.log('HIT SURFACE!');
                spec.gamePieces.player.stopPlayerMovement();
            }
        }
    }

    // function didCollide(obj1, obj2) {
    //     let dist = _getDistanceBetweenPoints(obj1.center, obj2.center);
    //     let sumOfRadi = obj1.radius + obj2.radius;
    //     if (dist < sumOfRadi) {
    //         obj1.setDidCollide(true);
    //         obj2.setDidCollide(true);
    //     }
    // }

    function didCollide(player) {
        // check all points of the mountain
        let curPoint1 = { x: surface[0].x * spec.boardDimmensions.x, y: spec.boardDimmensions.y - (surface[0].y * spec.boardDimmensions.y) };
        let collInfo = {safe: true, collision: false};
        let playerCollision = false;
        for (let i = 1; i < surface.length; i++) {
            let curPoint2 = { x: surface[i].x * spec.boardDimmensions.x, y: spec.boardDimmensions.y - (surface[i].y * spec.boardDimmensions.y) }
            if (lineCircleIntersection(curPoint1, curPoint2, player)) {
                collInfo.collision = true;
                collInfo.safe = surface[i - 1].safe && surface[i];
                break;
            }
            curPoint1 = curPoint2;
        }
        return collInfo;
    }

    // Reference: https://stackoverflow.com/questions/37224912/circle-line-segment-collision
    function lineCircleIntersection(pt2, pt1, circle) {
        let v1 = { x: pt2.x - pt1.x, y: pt2.y - pt1.y };
        let v2 = { x: pt1.x - circle.center.x, y: pt1.y - circle.center.y };
        let b = -2 * (v1.x * v2.x + v1.y * v2.y);
        let c = 2 * (v1.x * v1.x + v1.y * v1.y);
        let d = Math.sqrt(b * b - 2 * c * (v2.x * v2.x + v2.y * v2.y - circle.radius * circle.radius));
        if (isNaN(d)) { // no intercept
            return false;
        }
        // These represent the unit distance of point one and two on the line
        let u1 = (b - d) / c;
        let u2 = (b + d) / c;
        if (u1 <= 1 && u1 >= 0) {  // If point on the line segment
            return true;
        }
        if (u2 <= 1 && u2 >= 0) {  // If point on the line segment
            return true;
        }
        return false;
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
        }, spec.Random)
        spec.particleController.addNewSystem(newPS);
    }

    function spotIsSafe(coords) {
        // x: 0.40, y: 0.10
        // x: 0.70, y: 0.10
        let safeLeftX = spec.boardDimmensions.x * 0.4;
        let safeRightX = spec.boardDimmensions.x * 0.7;
        let safeYPlus = (spec.boardDimmensions.y * 0.9 + 0.1) - (spec.gamePieces.player.size - 0.2);
        let safeYMin = (spec.boardDimmensions.y * 0.9 - 0.1) - (spec.gamePieces.player.size + 0.2);

        if (coords.x >= safeLeftX && coords.x <= safeRightX && coords.y <= safeYPlus && coords.y >= safeYMin) {
            return true;
        }
        return false;
    }

    /////////////////////////////////
    //        PLAYER FUNCTIONS     //
    /////////////////////////////////


    /////////////////////////////////
    //        UFO   FUNCTIONS      //
    /////////////////////////////////

    // function addUFOs(elapsedTime) {
    //     let hasSmall = false;
    //     let hasLarge = false;
    //     spec.gamePieces.ufos.forEach(ufo => {
    //         if (ufo.ufoType === 'small') {
    //             hasSmall = true;
    //         }
    //         else if (ufo.ufoType === 'large') {
    //             hasLarge = true;
    //         }
    //     })
    //     if (!hasSmall && timeUntilSmallUFO <= 0) {
    //         // console.log('adding new UFO', timeUntilSmallUFO);
    //         _addSmallUFO();
    //     }
    //     else {
    //         timeUntilSmallUFO -= elapsedTime;
    //     }

    //     if (!hasLarge && timeUntilLargeUFO <= 0) {
    //         // console.log('adding new UFO', timeUntilSmallUFO);
    //         _addLargeUFO();
    //     }
    //     else {
    //         timeUntilLargeUFO -= elapsedTime;
    //     }
    // }

    // function addUFO() {
    // _addSmallUFO();
    // }
    //     let smallUFOAttacking = false;
    //     let largeUFOAttacking = false;
    //     // remove UFOs that collided or are out of time
    //     spec.gamePieces.ufos = spec.gamePieces.ufos.filter(ufo => {
    //         if (!ufo.shouldExplode && !ufo.didCollide) {
    //             return true;
    //         }
    //         else {
    //             explosion(ufo, './assets/firework_red1.png', 0.75, { mean: 15, stdev: 5 })
    //             return false;
    //         }
    //     }
    //     );
    //     let postSize = spec.gamePieces.ufos.length;
    //     // remove UFOs that have gone off the screen
    //     _cleanUFOsFromScreen();
    //     // reset UFO timer
    //     spec.gamePieces.ufos.forEach(ufo => {
    //         if (ufo.ufoType === 'small') {
    //             smallUFOAttacking = true;
    //         }
    //         else if (ufo.ufoType === 'large') {
    //             largeUFOAttacking = true;
    //         }
    //     });
    //     // console.log('Small UFO', smallUFOAttacking);
    //     // console.log('Large UFO', largeUFOAttacking);
    //     // reset ufo time if needed
    //     timeUntilSmallUFO = smallUFOAttacking ? ufoInterval : timeUntilSmallUFO;
    //     timeUntilLargeUFO = largeUFOAttacking ? ufoIntervalLarge : timeUntilLargeUFO;
    // }

    //function _addSmallUFO() {
    //    let smallUFO = spec.constructors.ufos.UFOSmall({
    //        coords: { x: 300, y: spec.boardDimmensions.y / 2 },
    //        imageSrc: './assets/green-yellow-alien.png',
    //        rotation: -Math.PI / 2,
    //        boardSize: spec.boardDimmensions,
    //        size: 35,
    //        shotImgSource: './assets/green-yellow-alien.png',
    //        shot: spec.constructors.shot,
    //        ufoType: 'small',
    //        maxProjectiles: 40,
    //        theta: Math.PI / 5,
    //    });
    //    spec.gamePieces.ufos.push(smallUFO);
    //}


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
        get surface() { return surface },
        updatePieces: updatePieces,
        updateClock: updateClock,
    }

    return api;
};