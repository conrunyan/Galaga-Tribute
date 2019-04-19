// --------------------------------------------------------------
//
// Creates a ufoSmall object, with functions for managing state.
// One ufoSmall object will exist at a time. This object can manuever
// around the game board and shoot players.
// spec = {
//  coords: {x: int, y: int} ,
//  imageSrc: ,
//  maxSpeed: ,
//  accelleration: ,
//  velocities: {x: float, y: float},
//  rotation: 45 initially,
//  size: in pixels
//  shot: objects.projectiles.ufoSmallShot
//  boardSize: needs to know where it can't go
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
        // console.log('loaded image...');
        this.isReady = true;
    };

    let image2 = new Image();
    image2.isReady = false;
    image2.src = spec.type === 'boss' ? spec.boss2ndSrc : spec.transformSrc;
    image2.onload = function () {
        // console.log('loaded image...');
        this.isReady = true;
    };

    let projectiles = [];
    let timeSinceLastShot = 2000;
    let timeLimitInGrid = 1000;
    let shotInterval = 2000;
    let didCollide = false;
    let movementSpeed = 0.0003;
    let followSpeed = .075;
    let diveSpeed = 0.002;
    let shotSpeed = 0.15;
    let timeAlive = 0;
    let slot = null;

    let types = {
        boss: { lives: 2, points: 150 },
        boss2: { lives: 2, points: 150 },
        bee: { lives: 1, points: 50 },
        butterfly: { lives: 1, points: 100 },
        transformed: { lives: 1, points: 160 },
        challenge: {lives: 1, points: 160},
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
            }
            else {
                console.log('finished diving. Resetting time in grid');
                spec.timeInGrid = 0;
                spec.diveTheta = 0;
                moveToNextOpenSlotInGrid(grid, elapsedTime);
            }
        }

        // transform image, if needed
        if (timeAlive > spec.transformTime && spec.willTransform) {
            // console.log('alien transformed');
            spec.type = 'transformed';
        }
        // }

        timeAlive += elapsedTime;
    }

    function ufoStartMovement(elapsedTime, direction) {
        switch (direction) {
            case 'down':
                _moveDown(elapsedTime);
                timeSpentOnPath += elapsedTime;
                break;
            case 'left':
                _moveLeft(elapsedTime);
                timeSpentOnPath += elapsedTime;
            case 'right':
                _moveRight(elapsedTime);
                timeSpentOnPath += elapsedTime;
            default:
                console.log(`INVALID DIRECTION IN UFO START ${direction}`);
        }
    }

    function diveAtPlayer(elapsedTime, playerCoords) {
        // do a downwards sqrt function
        // x = -a\sqrt{ \left(b\left(-y - c\right) \right) } +d
        let prevX = spec.coords.x;
        let prevY = spec.coords.y;

        let r = (5 + slot.diveOffset) + (Math.cos(2*spec.diveTheta));
        let nextX = (r * Math.cos(spec.diveTheta)) + prevX;
        let nextY = (r * Math.sin(spec.diveTheta)) + prevY;
        spec.diveTheta += diveSpeed * elapsedTime;
        spec.coords.x = nextX;
        spec.coords.y = nextY;
    }

    function getDownRightY(x) {
        let result = (diveSpeed) * + (spec.coords.y);
        // console.log('result', result);
        return -result;
    }

    // function _moveUp(elapsedTime) {
    //     spec.coords.y -= (movementSpeed * elapsedTime);
    // }
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
    // function _moveUpRight(elapsedTime) {
    //     spec.coords.x += (movementSpeed * elapsedTime);
    //     spec.coords.y -= (movementSpeed * elapsedTime);
    // }

    function getNextCoordsTriLoop(elapsedTime) {
        // move in a loop pattern
        if (spec.pattern === 'triLoop') {
            let r = spec.size * Math.cos(3 * spec.theta);
            if (spec.theta < 2.8) {
                let nextX = (r * Math.cos(spec.theta) * 10) + 300 + spec.patternOffset; //(elapsedTime * movementSpeed);
                let nextY = (r * Math.sin(spec.theta) * 10) + 300 + spec.patternOffset; //(elapsedTime * movementSpeed);
                // console.log(`X: ${nextX} Y: ${nextY}`);

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
                // console.log(`X: ${nextX} Y: ${nextY}`);

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
                let nextX = (r * Math.cos(spec.theta) * 10) + (40 +spec.boardSize.x / 2 + spec.patternOffset); //(elapsedTime * movementSpeed);
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
        // TODO: given a grid of possible places for aliens, moves to the next one that is available
        if (slot === null) {
            slot = grid.getNextOpen();
            slot.toggleAvailable();
        }
        // let withinMargin = ?
        if (!_coordsAreClose(spec.coords, slot.coords)) {
            moveTo(slot.coords, elapsedTime);
        }
        else {
            // spec.coords = nextSlot.coords;
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
        let angle = Math.atan(oLine, aLine);
        let dist = _getDistanceBetweenPoints(coords, spec.coords);
        let xVel = (elapsedTime * aLine * followSpeed) / dist;
        let yVel = (elapsedTime * oLine * followSpeed) / dist;

        spec.coords.x += xVel;
        spec.coords.y += yVel;
    }

    function moveOffScreen(elapsedTime) {
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

    // function found on https://stackoverflow.com/questions/32219051/how-to-convert-cartesian-coordinates-to-polar-coordinates-in-js
    function cartesian2Polar(x, y) {
        distance = Math.sqrt(x * x + y * y)
        radians = Math.atan2(y, x) //This takes y first
        polarCoor = { distance: distance, radians: radians }
        return polarCoor
    }

    function ufoSmallShootPlayer(elapsedTime, playerCoords, playerDead) {
        if (!playerDead) {
            let oLine = (playerCoords.y - spec.coords.y) + Math.random() * 25;
            let aLine = (playerCoords.x - spec.coords.x) + Math.random() * 25;
            let angle = Math.atan(oLine, aLine);
            let dist = _getDistanceBetweenPoints(playerCoords, spec.coords);
            let tmpShotXVel = (shotSpeed * aLine) / dist;
            let tmpShotYVel = (shotSpeed * oLine) / dist;
            ufoSmallShoot(elapsedTime, { x: tmpShotXVel, y: tmpShotYVel });
        }
    }

    function ufoSmallShoot(elapsedTime, newVelocity) {
        if (timeSinceLastShot >= shotInterval) {
            // console.log('creating new shot...');
            let newShot = spec.shot.PlayerShot({
                coords: { x: spec.coords.x + (spec.size / 2), y: spec.coords.y + (spec.size / 2), },
                imageSrc: spec.shotImgSource,
                maxSpeed: shotSpeed,
                velocities: { x: newVelocity.x, y: newVelocity.y },
                size: 5,
                lifeTime: 0,
                maxLifeTime: 10000,
            });
            projectiles.push(newShot);
            timeSinceLastShot = 0;
        }
        else {
            timeSinceLastShot += elapsedTime
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

    function _getDistanceBetweenPoints(p1, p2) {
        let x_2 = Math.pow(p2.x - p1.x, 2)
        let y_2 = Math.pow(p2.y - p1.y, 2)
        let result = Math.sqrt(x_2 + y_2)
        return result
    }

    function updateShots(elapsedTime) {
        let shotsToKeep = [];
        projectiles.forEach(shot => {
            // console.log(shot)
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
        setDidCollide: setDidCollide,
        ufoMove: ufoMove,
        ufoShoot: ufoSmallShootPlayer,
        updateShots: updateShots,
    };

    return api;
}