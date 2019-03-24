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
Asteroids.game.Board = function (spec) {
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
    let ufoInterval = 20000;
    let ufoIntervalLarge = 30000;
    let playerDeathInterval = 2000;
    let timeSincePlayerDeath = 0;
    let playerDead = false;
    let timeUntilSmallUFO = ufoInterval;
    let timeUntilLargeUFO = ufoIntervalLarge;

    let asteroidCount = {
        '1': spec.maxNumAsteroids,
        '2': spec.maxNumAsteroids + 2,
        '3': spec.maxNumAsteroids + 5,
        '4': spec.maxNumAsteroids + 9,
    }

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
        // update ufo
        spec.gamePieces.ufos.forEach(ufo => {
            ufo.ufoMove(elapsedTime);
            ufo.ufoShoot(elapsedTime, spec.gamePieces.player.coords, playerDead);
            ufo.updateShots(elapsedTime);
        });

        // detect colision
        // check player with asteroids
        // if distance between two centers is less than the sum of two radi
        let astToSplit = [];
        spec.gamePieces.asteroids.forEach(asteroid => {
            // console.log('asteroid', asteroid);
            let playerAstDist = _getDistanceBetweenPoints(asteroid.center, spec.gamePieces.player.center);
            let sumOfRadi = spec.gamePieces.player.radius + asteroid.radius;
            if (playerAstDist < sumOfRadi && !playerDead) {
                playerDied();
                asteroid.setDidCollide(true);
                astToSplit.push(asteroid);
            }
        });
        // check projectiles with asteroids
        spec.gamePieces.player.projectiles.forEach(shot => {
            // console.log('shot', shot);
            spec.gamePieces.asteroids.forEach(asteroid => {
                let shotAstDist = _getDistanceBetweenPoints(shot.center, asteroid.center);
                let sumOfRadi = shot.radius + asteroid.radius;
                // console.log('SAD:', shotAstDist, 'SOR:', sumOfRadi);
                if (shotAstDist < sumOfRadi && !shot.didCollide) {
                    shot.setDidCollide(true);
                    asteroid.setDidCollide(true);
                    astToSplit.push(asteroid);
                    spec.gamePieces.player.increaseScore(asteroid.points);
                }
            });
        });
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
        // check player with ufo shots
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

        // check projectiles with ufos
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

        // check for player collision. subtract lives, if needed or end the game if out of lives
        updatePlayerSpawn(elapsedTime);

        // fill board with asteroids
        cleanAsteroids();
        fillAsteroids();

        // add or remove ufos if needed
        addUFOs(elapsedTime);
        removeUFOs();
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

    function playerDied() {
        if (!playerDead) {
            spec.gamePieces.player.setDidCollide(true);
            playerDead = true;
            explosion(spec.gamePieces.player, './assets/firework_yellow.png', 0.75, { mean: 5, stdev: 1 });
        }
    }

    function updatePlayerSpawn(elapsedTime) {
        if (playerDead && timeSincePlayerDeath >= playerDeathInterval) {
            let newCoords = _getSafePlayerCoords();
            spec.gamePieces.player.respawn(newCoords);
            timeSincePlayerDeath = 0;
            playerDead = false;
        }
        else if (playerDead) {
            timeSincePlayerDeath += elapsedTime;
        }
    }

    /////////////////////////////////
    //        UFO   FUNCTIONS      //
    /////////////////////////////////

    function addUFOs(elapsedTime) {
        let hasSmall = false;
        let hasLarge = false;
        spec.gamePieces.ufos.forEach(ufo => {
            if (ufo.ufoType === 'small') {
                hasSmall = true;
            }
            else if (ufo.ufoType === 'large') {
                hasLarge = true;
            }
        })
        if (!hasSmall && timeUntilSmallUFO <= 0) {
            // console.log('adding new UFO', timeUntilSmallUFO);
            _addSmallUFO();
        }
        else {
            timeUntilSmallUFO -= elapsedTime;
        }

        if (!hasLarge && timeUntilLargeUFO <= 0) {
            // console.log('adding new UFO', timeUntilSmallUFO);
            _addLargeUFO();
        }
        else {
            timeUntilLargeUFO -= elapsedTime;
        }
    }

    function removeUFOs() {
        let smallUFOAttacking = false;
        let largeUFOAttacking = false;
        // remove UFOs that collided or are out of time
        spec.gamePieces.ufos = spec.gamePieces.ufos.filter(ufo => {
            if (!ufo.shouldExplode && !ufo.didCollide) {
                return true;
            }
            else {
                explosion(ufo, './assets/firework_red1.png', 0.75, { mean: 15, stdev: 5 })
                return false;
            }
        }
        );
        let postSize = spec.gamePieces.ufos.length;
        // remove UFOs that have gone off the screen
        _cleanUFOsFromScreen();
        // reset UFO timer
        spec.gamePieces.ufos.forEach(ufo => {
            if (ufo.ufoType === 'small') {
                smallUFOAttacking = true;
            }
            else if (ufo.ufoType === 'large') {
                largeUFOAttacking = true;
            }
        });
        // console.log('Small UFO', smallUFOAttacking);
        // console.log('Large UFO', largeUFOAttacking);
        // reset ufo time if needed
        timeUntilSmallUFO = smallUFOAttacking ? 0 : timeUntilSmallUFO;
        timeUntilLargeUFO = largeUFOAttacking ? 0 : timeUntilLargeUFO;
    }

    function _cleanUFOsFromScreen() {
        spec.gamePieces.ufos = spec.gamePieces.ufos.filter(ufo => {
            if (ufo.coords.y < 0 - ufo.size && ufo.ufoType === 'large') {
                return false;
            }
            else if (ufo.coords.x > spec.boardDimmensions.x + ufo.size && ufo.ufoType === 'small') {
                return false;
            }
            return true;
        });
    }

    function _addSmallUFO() {
        let smallUFO = spec.constructors.ufos.UFOSmall({
            coords: { x: 0, y: spec.boardDimmensions.y / 2 },
            imageSrc: './assets/Spacestation-by-MillionthVector.png',
            rotation: -Math.PI / 2,
            boardSize: spec.boardDimmensions,
            size: 35,
            shotImgSource: './assets/green_laser.png',
            shot: spec.constructors.shot,
            ufoType: 'small',
            maxProjectiles: 40,
        });
        spec.gamePieces.ufos.push(smallUFO);
    }

    function _addLargeUFO() {
        let largeUFO = spec.constructors.ufos.UFOLarge({
            coords: { x: spec.boardDimmensions.x / 2, y: spec.boardDimmensions.y },
            imageSrc: './assets/alienshiptex.png',
            rotation: -Math.PI / 2,
            boardSize: spec.boardDimmensions,
            size: 55,
            shotImgSource: './assets/green_laser.png',
            shot: spec.constructors.shot,
            ufoType: 'large',
            maxProjectiles: 40,
        });
        spec.gamePieces.ufos.push(largeUFO);
    }


    /////////////////////////////////
    //     ASTEROID FUNCTIONS      //
    /////////////////////////////////

    // removes any asteroids that are off the screen
    function cleanAsteroids() {
        spec.gamePieces.asteroids = spec.gamePieces.asteroids.filter(asteroid => {
            if (_shouldRemoveAsteroid(asteroid.coords, asteroid.size)) {
                return false;
            }
            else {
                return true;
            }
        });
    }

    // fills the gamepieces with large asteroids to the max number
    function fillAsteroids() {
        let numLargeToMake = spec.maxNumAsteroids;
        spec.gamePieces.asteroids.forEach(asteroid => {
            if (asteroid.asteroidType === 'large') {
                numLargeToMake -= 1;
            }
        })
        generateAsteroids(numLargeToMake);
    }

    // split asteroid in chunks, returning a list of asteroids
    // of half the size moving in random, opposite directions
    function splitAsteroid(astToSplit) {
        // console.log('calling split asteroids...');
        explosion(astToSplit, './assets/firework_red2.png', 0.75, { mean: 15, stdev: 5 });
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

    function generateAsteroids(numToGenerate) {
        // check for next level
        
        for (let i = 0; i < numToGenerate; i++) {
            let newAst = _getNewAsteroid();
            //console.log(i);
            //console.log(`new asteroid - Coords: {x:${newAst.coords.x}, y:${newAst.coords.y}} Vel: {x: ${newAst.velocities.x}, y: ${newAst.velocities.y}}`)
            spec.gamePieces.asteroids.push(newAst);
        }
    }

    function _getNewAsteroid() {
        let newAstCoords = _getNewAsteroidCoords();
        let newAstVelocity = _getNewAsteroidVel(newAstCoords);

        let newAst = spec.constructors.asteroids.Asteroid({
            coords: { x: newAstCoords.x, y: newAstCoords.y },
            imageSrc: './assets/asteroid.png',
            velocities: { x: newAstVelocity.x, y: newAstVelocity.y },
            rotation: 0,
            asteroidType: 'large',
            mass: 100,
        });

        return newAst;
    }

    function _getNewAsteroidCoords() {
        let newX = _nextRange(-10, spec.boardDimmensions.x + 10);
        let randYIdx = _nextRange(0, 1);
        let yRange = [-spec.asteroidSize, spec.boardDimmensions.y + spec.asteroidSize]

        return { x: newX, y: yRange[randYIdx] };
    }

    function _getNewAsteroidVel(coords) {
        let xVel, yVel;
        // upper left quadrant
        if (coords.y < 0 && coords.x <= spec.boardDimmensions.x / 2) {
            xVel = _nextRange(spec.asteroidInitMinVel, spec.asteroidInitMaxVel);
            yVel = _nextRange(spec.asteroidInitMinVel, spec.asteroidInitMaxVel);
        }
        // upper right quadrant
        else if (coords.y < 0 && coords.x > spec.boardDimmensions.x / 2) {
            xVel = _nextRange(-spec.asteroidInitMaxVel, -spec.asteroidInitMinVel);
            yVel = _nextRange(spec.asteroidInitMinVel, spec.asteroidInitMaxVel);
        }
        // lower left quadrant
        else if (coords.y > spec.boardDimmensions.y && coords.x < spec.boardDimmensions.x / 2) {
            xVel = _nextRange(spec.asteroidInitMinVel, spec.asteroidInitMaxVel);
            yVel = _nextRange(-spec.asteroidInitMaxVel, -spec.asteroidInitMinVel);
        }
        // lower right quadrant
        else if (coords.y > spec.boardDimmensions.y && coords.x < spec.boardDimmensions.x / 2) {
            xVel = _nextRange(-spec.asteroidInitMaxVel, -spec.asteroidInitMinVel);
            yVel = _nextRange(-spec.asteroidInitMaxVel, -spec.asteroidInitMinVel);
        }

        return { x: xVel, y: yVel };
    }

    function _shouldRemoveAsteroid(coords, size) {
        if (coords.x < 0 - size
            || coords.y < 0 - size
            || coords.y > spec.boardDimmensions.y + size
            || coords.x > spec.boardDimmensions.x + size) {
            return true;
        }
        return false;
    }

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

    // returns coords in a "safe" area
    function _getSafePlayerCoords() {
        let searchSegments = 12;
        let newPlayerCoords = {x: 40, y: 40};
        let safeZoneFound = false;
        // search horizontal
        let xSize = spec.boardDimmensions.x - 30;
        let ySize = spec.boardDimmensions.y - 30;
        for (let xSegment = 1; xSegment < searchSegments; xSegment++) {
            let currentXCoord = xSize * (xSegment / 10);
            // search verticle
            for (let ySegment = 1; ySegment < searchSegments; ySegment++) {
                let currentYCoord = ySize * (ySegment / 10);
                let searchArea = { 
                    center: {x: currentXCoord, y: currentYCoord},
                    radius: 150,
                }
                // search all asteroids, and determine if they're in the search radius.
                // If not, put the ship there
                let safeZoneFound = true;
                newPlayerCoords = searchArea.center;
                spec.gamePieces.asteroids.forEach(asteroid => {
                    let asteroidSearchDist = _getDistanceBetweenPoints(searchArea.center, asteroid.center);
                    let sumOfRadi = searchArea.radius + asteroid.radius;
                    if (asteroidSearchDist < sumOfRadi) {
                        safeZoneFound = false;
                    }
                });
                // check all ufos and their projectiles
                spec.gamePieces.ufos.forEach(ufo => {
                    let ufoSearchDist = _getDistanceBetweenPoints(searchArea.center, ufo.center);
                    let sumOfRadi = searchArea.radius + ufo.radius;
                    if (ufoSearchDist < sumOfRadi) {
                        safeZoneFound = false;
                    }
                    ufo.projectiles.forEach(shot => {
                        let shotSearchDistance = _getDistanceBetweenPoints(searchArea.center, shot.center);
                        let sumOfRadi = searchArea.radius + shot.radius;
                        if (shotSearchDistance < sumOfRadi) {
                            safeZoneFound = false;
                        }
                    });
                });

                if (safeZoneFound) {
                    return newPlayerCoords;
                };
            }
        }
        return newPlayerCoords;
    }

    let api = {
        get image() { return backgroundImg },
        get player() { return spec.gamePieces.player },
        get asteroids() { return spec.gamePieces.asteroids },
        get ufos() { return spec.gamePieces.ufos },
        addAsteroid: addAsteroid,
        addUFO: addUFO,
        updatePieces: updatePieces,
        generateAsteroids: generateAsteroids,
        updateClock: updateClock,
    }

    return api;
};