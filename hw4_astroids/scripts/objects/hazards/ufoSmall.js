// --------------------------------------------------------------
//
// Creates a ufoSmall object, with functions for managing state.
// One ufoSmall object will exist at a time. This object can manuever
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
//  shot: objects.projectiles.ufoSmallShot
//  boardSize: needs to know where it can't go
// }
//
// UFOS: https://opengameart.org/content/green-alien-spaceship
//       https://opengameart.org/content/faction4-spacestation
// --------------------------------------------------------------
Asteroids.objects.ufo.UFOSmall = function (spec) {
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
    let timeSinceLastShot = 250;
    let timeSpentOnPath = 0;
    let shotInterval = 250;
    let didCollide = false;
    let movementSpeed = 0.1;
    let timeForEachMovement = 3000;
    let lifeTime = 60000;

    function ufoSmallMove(elapsedTime) {
        // TODO: Add function here to move the ufoSmall in a direction
        // move in preset path around the board
        // move for three seconds
        // console.log('moving ufo', spec);
        timeSpentOnPath += elapsedTime;
        // move right
        if (timeSpentOnPath < timeForEachMovement + 500) {
            _moveRight(elapsedTime);
        }
        // move up
        else if (timeSpentOnPath < timeForEachMovement * 2) {
            _moveUp(elapsedTime);
        }
        else if (timeSpentOnPath < timeForEachMovement * 3) {
            _moveDownLeft(elapsedTime);
        }
        else if (timeSpentOnPath < timeForEachMovement * 3.5) {
            _moveRight(elapsedTime);
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


    function ufoSmallThrust(elapsedTime) {
        // console.log('old velocity: ', spec.velocities);
        let newXVel = (spec.velocities.x + spec.acceleration * elapsedTime) * (Math.cos(spec.rotation) / 180);
        let newYVel = (spec.velocities.y + spec.acceleration * elapsedTime) * (Math.sin(spec.rotation) / 180);
        // check for max velocity
        // console.log('max speed', spec.maxSpeed)
        if (Math.abs(newXVel) < spec.maxSpeed && Math.abs(newYVel) < spec.maxSpeed) {
            // console.log('accelerating');
            spec.velocities.x += newXVel;
            spec.velocities.y += newYVel;
        }
        // console.log('new velocity: ', spec.velocities);
    }

    function ufoSmallShoot(elapsedTime) {
        if (projectiles.length < spec.maxProjectiles && timeSinceLastShot >= shotInterval) {
            // console.log('creating new shot...');
            let tmpShotXVel = spec.shotSpeed * (Math.cos(spec.rotation) / 180);
            let tmpShotYVel = spec.shotSpeed * (Math.sin(spec.rotation) / 180);
            let newShot = spec.shot.ufoSmallShot({
                coords: _getufoSmallNose(),
                imageSrc: spec.shotImgSource,
                maxSpeed: spec.shotSpeed,
                velocities: { x: tmpShotXVel, y: tmpShotYVel },
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

    function _getufoSmallCenter() {
        let center = {
            x: spec.coords.x + (spec.size / 2),
            y: spec.coords.y + (spec.size / 2),
        };

        return center;
    }

    function _getufoSmallNose() {
        let nose = {
            x: (spec.coords.x + (spec.size / 2)) + ((Math.cos(spec.rotation)) * spec.size / 2),
            y: (spec.coords.y + (spec.size / 2)) + ((Math.sin(spec.rotation)) * spec.size / 2),
        };

        return nose;
    }

    function updateShots(elapsedTime) {
        let shotsToKeep = [];
        projectiles.forEach(shot => {
            // console.log(shot)
            shot.moveProjectileFoward(elapsedTime);
            // TODO: check if a shot needs to be removed, based on how long it's been alive
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
        get shouldExplode() { return lifeTime <= 0},
        setDidCollide: setDidCollide,
        ufoMove: ufoSmallMove,
        ufoShoot: ufoSmallShoot,
        updateShots: updateShots,
    };

    return api;
}