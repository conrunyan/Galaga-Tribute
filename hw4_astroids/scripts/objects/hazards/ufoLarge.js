// --------------------------------------------------------------
//
// Creates a ufoLarge object, with functions for managing state.
// One ufoLarge object will exist at a time. This object can manuever
// around the game board and shoot asteroids. It also has a hyperspace
// ability.
// spec = {
//  coords: {x: int, y: int} ,
//  imageSrc: ,
//  maxSpeed: ,
//  accelleration: ,
//  velocities: {x: float, y: float},
//  rotation: 45 initially,
//  size: in pixels
//  shot: objects.projectiles.ufoLargeShot
//  boardSize: needs to know where it can't go
// }
//
// UFOS: https://opengameart.org/content/green-alien-spaceship
//       https://opengameart.org/content/faction4-spacestation
// --------------------------------------------------------------
Asteroids.objects.ufo.UFOLarge = function (spec) {
    'use strict';

    // load image
    let image = new Image();
    image.isReady = false;
    image.src = spec.imageSrc;
    image.onload = function () {
        // console.log('loaded image...');
        this.isReady = true;
    };

    let projectiles = [];
    let timeSinceLastShot = 2000;
    let timeSpentOnPath = 0;
    let shotInterval = 2000;
    let didCollide = false;
    let movementSpeed = 0.05;
    let shotSpeed = .15;
    let timeForEachMovement = 3000;
    let lifeTime = 60000;
    let shotOffset = 300;

    function ufoLargeMove(elapsedTime) {
        // TODO: Add function here to move the ufoLarge in a direction
        // move in preset path around the board
        // move for three seconds
        // console.log('moving ufo', spec);
        timeSpentOnPath += elapsedTime;
        // move right
        if (timeSpentOnPath < timeForEachMovement + 500) {
            _moveUp(elapsedTime);
        }
        // move up
        else if (timeSpentOnPath < timeForEachMovement * 2) {
            _moveUpRight(elapsedTime);
        }
        else if (timeSpentOnPath < timeForEachMovement * 3) {
            _moveUpLeft(elapsedTime);
        }
        else if (timeSpentOnPath < timeForEachMovement * 3.5) {
            _moveDown(elapsedTime);
        }
        else if (timeSpentOnPath < timeForEachMovement * 4) {
            _moveLeft(elapsedTime);
        }
        // reset path
        else {
            timeSpentOnPath = 0;
        }

        lifeTime -= elapsedTime;
    }

    function _moveUp(elapsedTime) {
        spec.coords.y -= (movementSpeed * elapsedTime);
    }
    function _moveUpLeft(elapsedTime) {
        spec.coords.x -= (movementSpeed * elapsedTime);
        spec.coords.y -= (movementSpeed * elapsedTime);
    }
    function _moveLeft(elapsedTime) {
        spec.coords.x -= (movementSpeed * elapsedTime);
    }
    function _moveDownLeft(elapsedTime) {
        spec.coords.x -= (movementSpeed * elapsedTime);
        spec.coords.y += (movementSpeed * elapsedTime);
    }
    function _moveDown(elapsedTime) {
        spec.coords.y += (movementSpeed * elapsedTime);
    }
    function _moveDownRight(elapsedTime) {
        spec.coords.x += (movementSpeed * elapsedTime);
        spec.coords.y += (movementSpeed * elapsedTime);
    }
    function _moveRight(elapsedTime) {
        spec.coords.x += (movementSpeed * elapsedTime);
    }
    function _moveUpRight(elapsedTime) {
        spec.coords.x += (movementSpeed * elapsedTime);
        spec.coords.y -= (movementSpeed * elapsedTime);
    }

    function ufoLargeShootPlayer(elapsedTime, playerCoords) {
        let oLine = (playerCoords.y + shotOffset) - spec.coords.y;
        let aLine = (playerCoords.x + shotOffset) - spec.coords.x;
        let angle = Math.atan(oLine, aLine);
        let dist = _getDistanceBetweenPoints(playerCoords, spec.coords);
        let tmpShotXVel = (shotSpeed * aLine) / dist;
        let tmpShotYVel = (shotSpeed * oLine) / dist;
        ufoLargeShoot(elapsedTime, { x: tmpShotXVel, y: tmpShotYVel });
    }

    function ufoLargeShoot(elapsedTime, newVelocity) {
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
        didCollide = newVal;
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

    let api = {
        get image() { return image },
        get coords() { return spec.coords },
        get size() { return spec.size },
        get radius() { return spec.size / 2 },
        get rotation() { return spec.rotation },
        get projectiles() { return projectiles },
        get didCollide() { return didCollide },
        get ufoType() { return spec.ufoType },
        get center() { return { x: spec.coords.x + (spec.size / 2), y: spec.coords.y + (spec.size / 2), } },
        get shouldExplode() { return lifeTime <= 0 },
        setDidCollide: setDidCollide,
        ufoMove: ufoLargeMove,
        ufoShoot: ufoLargeShootPlayer,
        updateShots: updateShots,
    };

    return api;
}