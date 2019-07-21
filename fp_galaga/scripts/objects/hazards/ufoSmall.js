// --------------------------------------------------------------
//
// Creates a ufoSmall object, with functions for managing state.
// Multiple ufoSmall objects may exist at a time. This object can manuever
// around the game board and shoot players.
// spec = {
//     coords: { x: - 10, y: 300 },
//     imageSrc: ufoAssets[type],
//     boss2ndSrc: ufoAssets['bossPurple'],
//     transformSrc: ufoAssets[_transformImg(type)],
//     rotation: -Math.PI / 2,
//     form: 'first',
//     boardSize: spec.boardDimmensions,
//     size: 30,
//     shotImgSource: './assets/shot.png',
//     shot: spec.constructors.shot,
//     type: type,
//     maxProjectiles: 40,
//     theta: Math.PI / 5,
//     willDive: _willDive(),
//     willTransform: _willTransform(),
//     diveInterval: _nextRange(2000, 4000),
//     transformTime: _nextRange(5000, 20000),
//     timeInGrid: 0,
//     pattern: pattern,
//     patternOffset: offset,
//     diveTheta: 0,
//     deleteMe: false,
//     playerCoords: spec.gamePieces.player.coords,
//     playerSize: spec.gamePieces.player.size,
//     showPlayer: spec.gamePieces.player.showPlayer,
//     sounds: spec.sounds,
// }
//
// UFOS: https://opengameart.org/content/green-alien-spaceship
//       https://opengameart.org/content/faction4-spacestation
// --------------------------------------------------------------
Galaga.objects.ufo.UFOSmall = function (spec) {
    'use strict';

    // load image
    let image = new Image();
    image.isReady = false;
    image.src = spec.imageSrc;
    image.onload = function () {
        this.isReady = true;
    };

    let image2 = new Image();
    image2.isReady = false;
    image2.src = spec.type === 'boss' ? spec.boss2ndSrc : spec.transformSrc;
    image2.onload = function () {
        this.isReady = true;
    };

    let projectiles = [];
    let timeSinceLastShot = 0;
    let timeLimitInGrid = 1000;
    let shotInterval = 2000;
    let didCollide = false;
    let movementSpeed = 0.0003;
    let followSpeed = .075;
    let diveSpeed = 0.002;
    let shotSpeed = 0.3;
    let timeAlive = 0;
    let slot = null;
    let showPlayer = true;

    let types = {
        boss: { lives: 2, points: 150 },
        boss2: { lives: 2, points: 150 },
        bee: { lives: 1, points: 50 },
        butterfly: { lives: 1, points: 100 },
        transformed: { lives: 1, points: 160 },
        challenge: { lives: 1, points: 160 },
    }

    function ufoMove(elapsedTime, grid, playerCoords) {
        // move in preset path around the board

        if (spec.pattern.includes('challenge')) {
            spec.willDive = false;
        }

        if (!getNextCoordsTriLoop(elapsedTime) && !spec.willDive || !getNextCoordsTriLoop(elapsedTime) && spec.timeInGrid < timeLimitInGrid) {
            if (spec.pattern.includes('challenge')) {
                moveOffScreen(elapsedTime);
            }
            else {
                moveToNextOpenSlotInGrid(grid, elapsedTime);
            }
        }
        else if ((spec.willDive && spec.timeInGrid > timeLimitInGrid || spec.timeInGrid >= spec.diveInterval) && !spec.pattern.includes('challenge')) {
            if (spec.diveTheta < 2 * Math.PI) {
                diveAtPlayer(elapsedTime, playerCoords);
                // play dive sound if sound isnt' playing, and dive theta < 2 Math.PI/3
                _playDiveSound();
                if (_isLinedUpWithPlayer()) {
                    ufoSmallShootPlayer(elapsedTime, spec.playerCoords);
                }
            }
            else {
                spec.timeInGrid = 0;
                spec.diveTheta = 0;
                moveToNextOpenSlotInGrid(grid, elapsedTime);
            }
        }

        // transform image, if needed
        if (timeAlive > spec.transformTime && spec.willTransform) {
            spec.type = 'transformed';
        }

        timeAlive += elapsedTime;
        timeSinceLastShot += elapsedTime;
    }

    function _playDiveSound() {
        if (Galaga.sounds['audio/alien-dive'].currentTime === 0 && spec.diveTheta < 2 * Math.PI / 3) {
            spec.sounds.playSound('audio/alien-dive');
        }
        else if (Galaga.sounds['audio/alien-dive'].currentTime == Galaga.sounds['audio/alien-dive'].duration && spec.diveTheta < 2 * Math.PI / 3) {
            spec.sounds.playSound('audio/alien-dive');
        }
    }

    function diveAtPlayer(elapsedTime, playerCoords) {
        // do a downwards sqrt function
        let prevX = spec.coords.x;
        let prevY = spec.coords.y;

        let r = (5 + slot.diveOffset) + (Math.cos(2 * spec.diveTheta));
        let nextX = (r * Math.cos(spec.diveTheta)) + prevX;
        let nextY = (r * Math.sin(spec.diveTheta)) + prevY;
        spec.diveTheta += diveSpeed * elapsedTime;
        spec.coords.x = nextX;
        spec.coords.y = nextY;
    }

    function _moveUp(elapsedTime) {
        spec.coords.y -= (movementSpeed * elapsedTime);
    }
    function _moveUpLeft(elapsedTime) {
        spec.coords.x -= (movementSpeed * elapsedTime * spec.size * 30);
        spec.coords.y -= (movementSpeed * elapsedTime * spec.size * 30);
    }
    function _moveLeft(elapsedTime) {
        spec.coords.x -= (movementSpeed * elapsedTime);
    }
    function _moveDownLeft(elapsedTime) {
        spec.coords.x -= (movementSpeed * elapsedTime * spec.size * 30);
        spec.coords.y += (movementSpeed * elapsedTime * spec.size * 30);
    }
    function _moveDown(elapsedTime) {
        spec.coords.y += (movementSpeed * elapsedTime);
    }
    function _moveDownRight(elapsedTime) {
        spec.coords.x += (movementSpeed * elapsedTime * spec.size * 30);
        spec.coords.y += (movementSpeed * elapsedTime * spec.size * 30);
    }
    function _moveRight(elapsedTime) {
        spec.coords.x += (movementSpeed * elapsedTime);
    }
    function _moveUpRight(elapsedTime) {
        spec.coords.x += (movementSpeed * elapsedTime);
        spec.coords.y -= (movementSpeed * elapsedTime);
    }

    function getNextCoordsTriLoop(elapsedTime) {
        // move in a loop pattern
        if (spec.pattern === 'triLoop') {
            let r = spec.size * Math.cos(3 * spec.theta);
            if (spec.theta < 2.8) {
                let nextX = (r * Math.cos(spec.theta) * 10) + 300 + spec.patternOffset; //(elapsedTime * movementSpeed);
                let nextY = (r * Math.sin(spec.theta) * 10) + 300 + spec.patternOffset; //(elapsedTime * movementSpeed);

                spec.coords.x = nextX;
                spec.coords.y = nextY;

                spec.theta += movementSpeed * elapsedTime;
                return true;
            }
        }
        else if (spec.pattern === 'triLoopInvert') {
            let r = -spec.size * Math.cos(3 * spec.theta);
            if (spec.theta < 2.8) {
                let nextX = (r * Math.cos(spec.theta) * 10) + (spec.boardSize.x - 300 + spec.patternOffset); //(elapsedTime * movementSpeed);
                let nextY = (r * Math.sin(spec.theta) * 10) + (200 + spec.patternOffset); //(elapsedTime * movementSpeed);

                spec.coords.x = nextX;
                spec.coords.y = nextY;

                spec.theta += movementSpeed * elapsedTime;
                return true;
            }
        }
        else if (spec.pattern === 'challengePath') {
            let r = 50 + 8 * Math.sin(10 * spec.theta);
            if (spec.theta < 13) {
                let nextX = (r * Math.cos(spec.theta) * 10) + (300 + spec.patternOffset); //(elapsedTime * movementSpeed);
                let nextY = (r * Math.sin(spec.theta) * 10) + (-250 + spec.patternOffset); //(elapsedTime * movementSpeed);

                spec.coords.x = nextX;
                spec.coords.y = nextY;
                spec.theta += (0.6 * movementSpeed * elapsedTime);

                return true;
            }
        }
        else if (spec.pattern === 'challengePathInv') {
            let r = 20 + 5 * Math.sin(10 * spec.theta);
            if (spec.theta < 7) {
                let nextX = (-r * Math.cos(spec.theta) * 10) + (spec.boardSize.x - 550 + spec.patternOffset); //(elapsedTime * movementSpeed);
                let nextY = (-r * Math.sin(spec.theta) * 10) + (100 + spec.patternOffset); //(elapsedTime * movementSpeed);

                spec.coords.x = nextX;
                spec.coords.y = nextY;

                spec.theta += movementSpeed * elapsedTime;

                return true;
            }
        }
        else if (spec.pattern === 'challengePath2') {
            let r = 10 + spec.size * Math.cos(4 * spec.theta) + Math.sin(3 * spec.theta) * 0.0005;
            if (spec.theta < 14) {
                let nextX = (r * Math.cos(spec.theta) * 10) + (spec.boardSize.x / 2 + spec.patternOffset); //(elapsedTime * movementSpeed);
                let nextY = (r * Math.sin(spec.theta) * 10) + (100 + spec.patternOffset); //(elapsedTime * movementSpeed);

                spec.coords.x = nextX;
                spec.coords.y = nextY;

                spec.theta += movementSpeed * elapsedTime;

                return true;
            }
        }
        else if (spec.pattern === 'challengePath2Inv') {
            let r = 10 + spec.size * Math.cos(4 * spec.theta) + Math.sin(3 * spec.theta) * 0.0005;
            if (spec.theta > -14) {
                let nextX = (r * Math.cos(spec.theta) * 10) + (40 + spec.boardSize.x / 2 + spec.patternOffset); //(elapsedTime * movementSpeed);
                let nextY = (r * Math.sin(spec.theta) * 10) + (140 + spec.patternOffset); //(elapsedTime * movementSpeed);

                spec.coords.x = nextX;
                spec.coords.y = nextY;

                spec.theta -= movementSpeed * elapsedTime;

                return true;
            }
        }

        return false;
    }

    function moveToNextOpenSlotInGrid(grid, elapsedTime) {
        // given a grid of possible places for aliens, moves to the next one that is available
        if (slot === null) {
            slot = grid.getNextOpen();
            slot.toggleAvailable();
        }
        if (!_coordsAreClose(spec.coords, slot.coords)) {
            moveTo(slot.coords, elapsedTime);
        }
        else {
            spec.timeInGrid += elapsedTime;
        }
    }

    function _coordsAreClose(coord1, coord2) {
        let margin = 2; // distance in pixels
        return ((Math.abs(coord1.x - coord2.x) < margin) && (Math.abs(coord1.y - coord2.y) < margin));
    }

    function moveTo(coords, elapsedTime) {
        let oLine = (coords.y - spec.coords.y);
        let aLine = (coords.x - spec.coords.x);
        let dist = _getDistanceBetweenPoints(coords, spec.coords);
        let xVel = (elapsedTime * aLine * followSpeed) / dist;
        let yVel = (elapsedTime * oLine * followSpeed) / dist;

        spec.coords.x += xVel;
        spec.coords.y += yVel;
    }

    function moveOffScreen(elapsedTime) {
        // check if ready to mark for deletion
        if ((spec.coords.x < -spec.size || spec.coords.x > spec.boardSize.x || spec.coords.y < -spec.size || spec.coords.y > spec.boardSize.y)) {
            spec.deleteMe = true;
        }
        else {
            if (spec.pattern === 'challengePath') {
                _moveDownRight(elapsedTime);
            }
            else if (spec.pattern === 'challengePathInv') {
                _moveUpLeft(elapsedTime);
            }
            else if (spec.pattern === 'challengePath2') {
                _moveDownLeft(elapsedTime);
            }
        }
    }

    function ufoSmallShootPlayer(elapsedTime, playerCoords, playerDead) {
        let oLine = (playerCoords.y - spec.coords.y) + Math.random() * 25;
        let aLine = (playerCoords.x - spec.coords.x) + Math.random() * 25;
        let angle = Math.atan(oLine, aLine);
        let dist = _getDistanceBetweenPoints(playerCoords, spec.coords);
        let tmpShotXVel = 0;
        let tmpShotYVel = (shotSpeed * oLine) / dist;
        ufoSmallShoot(elapsedTime, { x: tmpShotXVel, y: tmpShotYVel });
    }

    function ufoSmallShoot(elapsedTime, newVelocity) {
        if (timeSinceLastShot >= shotInterval) {
            let newShot = spec.shot.PlayerShot({
                coords: { x: spec.coords.x + (spec.size / 2), y: spec.coords.y + (spec.size / 2), },
                imageSrc: spec.shotImgSource,
                maxSpeed: shotSpeed,
                velocities: { x: newVelocity.x, y: newVelocity.y },
                size: 10,
                lifeTime: 0,
                rotation: Math.PI,
                maxLifeTime: 10000,
            });
            projectiles.push(newShot);
            timeSinceLastShot = 0;
        }
    }

    function setDidCollide(newVal) {
        if (spec.type !== 'boss') {
            if (slot !== null) {
                slot.toggleDead();
            }
            didCollide = newVal;
        }
        // boss galaga died
        else if (spec.type === 'boss' && spec.form === 'second') {
            if (slot !== null) {
                slot.toggleDead();
            }
            didCollide = newVal;
        }
        // boss galaga swap to 2nd phase
        else if (spec.type === 'boss' && spec.form === 'first') {
            spec.form = 'second';
        }


    }

    function _isLinedUpWithPlayer() {
        if (Math.abs(spec.playerCoords.x - spec.coords.x) <= 5 && spec.coords.y < (spec.boardSize.y - spec.playerSize) && spec.showPlayer) {
            return true;
        }
        return false;
    }

    function _getDistanceBetweenPoints(p1, p2) {
        let x_2 = Math.pow(p2.x - p1.x, 2)
        let y_2 = Math.pow(p2.y - p1.y, 2)
        let result = Math.sqrt(x_2 + y_2)
        return result
    }

    function updateShots(elapsedTime) {
        projectiles.forEach(shot => {
            shot.moveProjectileFoward(elapsedTime);
        });
        // check if a shot needs to be removed, based on how long it's been alive
        // also remove if it's run into something
        projectiles = projectiles.filter(shot => (shot.lifeTime < shot.maxLifeTime) && !shot.didCollide);
    }

    function _getImage() {
        if (spec.form === 'second' && spec.type === 'boss' || spec.type === 'challenge') {
            return image2;
        }
        else if (spec.type === 'transformed' && spec.form !== 'second') {
            return image2;
        }
        else {
            return image;
        }
    }

    let api = {
        get image() { return _getImage() },
        get coords() { return spec.coords },
        get size() { return spec.size },
        get radius() { return spec.size / 2 },
        get rotation() { return spec.rotation },
        get projectiles() { return projectiles },
        get didCollide() { return didCollide },
        get ufoType() { return spec.ufoType },
        get center() { return { x: spec.coords.x + (spec.size / 2), y: spec.coords.y + (spec.size / 2), } },
        get shouldExplode() { return false },
        get points() { return types[spec.type].points },
        get spec() { return spec },
        get alive() { return spec.alive },
        get deleteMe() { return spec.deleteMe },
        get showPlayer() { return showPlayer },
        setDidCollide: setDidCollide,
        ufoMove: ufoMove,
        ufoShoot: ufoSmallShootPlayer,
        updateShots: updateShots,
    };

    return api;
}