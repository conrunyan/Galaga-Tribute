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
    let totalElapsedTime = 0;
    let timeSincePlayerDeath = 0;

    function updatePieces(elapsedTime) {
        // update player
        spec.gamePieces.player.updateShots(elapsedTime);

        // // detect colision
        // // check player with ufos
        // spec.gamePieces.ufos.forEach(ufo => {
        //     // console.log('ufo', ufo);
        //     let playerUfoDist = _getDistanceBetweenPoints(ufo.center, spec.gamePieces.player.center);
        //     let sumOfRadi = spec.gamePieces.player.radius + ufo.radius;
        //     if (playerUfoDist < sumOfRadi && !playerDead) {
        //         playerDied();
        //         ufo.setDidCollide(true);
        //     }
        // });
        // // check player with ufo shots
        // spec.gamePieces.ufos.forEach(ufo => {
        //     // console.log('ufo', ufo);
        //     ufo.projectiles.forEach(shot => {
        //         let ufoPlayerShot = _getDistanceBetweenPoints(shot.center, spec.gamePieces.player.center);
        //         let sumOfRadi = spec.gamePieces.player.radius + shot.radius;
        //         if (ufoPlayerShot < sumOfRadi && !playerDead) {
        //             playerDied();
        //             shot.setDidCollide(true);
        //         }
        //     })
        // });

        // // check projectiles with ufos
        // spec.gamePieces.ufos.forEach(ufo => {
        //     // console.log('ufo', ufo);
        //     spec.gamePieces.player.projectiles.forEach(shot => {
        //         let ufoShot = _getDistanceBetweenPoints(shot.center, ufo.center);
        //         let sumOfRadi = ufo.radius + shot.radius;
        //         if (ufoShot < sumOfRadi) {
        //             ufo.setDidCollide(true);
        //             shot.setDidCollide(true);
        //             spec.gamePieces.player.increaseScore(ufo.points);
        //         }
        //     })

        // });
        // split asteroids in two that have colided, then remove the original
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

    // function removeUFOs() {
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

    // function _addSmallUFO() {
    //     let smallUFO = spec.constructors.ufos.UFOSmall({
    //         coords: { x: 0, y: spec.boardDimmensions.y / 2 },
    //         imageSrc: './assets/Spacestation-by-MillionthVector.png',
    //         rotation: -Math.PI / 2,
    //         boardSize: spec.boardDimmensions,
    //         size: 35,
    //         shotImgSource: './assets/green_laser.png',
    //         shot: spec.constructors.shot,
    //         ufoType: 'small',
    //         maxProjectiles: 40,
    //     });
    //     spec.gamePieces.ufos.push(smallUFO);
    // }


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
        addUFO: addUFO,
        updatePieces: updatePieces,
        updateClock: updateClock,
    }

    return api;
};