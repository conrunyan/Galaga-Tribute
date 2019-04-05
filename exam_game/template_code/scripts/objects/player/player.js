// --------------------------------------------------------------
//
// Creates a Player object, with functions for managing state.
// One player object will exist at a time. This object can manuever
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
//  shot: objects.projectiles.playerShot
// }
//
// CREDITS: Character art from https://www.kisspng.com/png-star-fox-2-lylat-wars-super-nintendo-entertainment-4798475/preview.html
// --------------------------------------------------------------
Galaga.objects.player.Player = function (spec) {
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
    // let turnSpeed = 200; // not sure what unit yet
    let turnSpeed = 0.0015;
    let timeSinceLastShot = 300;
    let shotInterval = 300;
    let didCollide = false;
    let lives = 3;
    let score = 0;
    let level = 1;
    // const GRAVITY = 0.25;
    const GRAVITY = 0.25;
    let lastVelocity = { x: spec.velocities.x, y: spec.velocities.y };

    function playerMoveLocation(elapsedTime) {
        // console.log('calling player move');
        // check velocity and see if it's changed. If so, display engine particles
        if (lastVelocity.x !== spec.velocities.x && lastVelocity.y !== spec.velocities.y) {
            let shipCenter = { x: spec.coords.x + (spec.size / 2), y: spec.coords.y + (spec.size / 2), };
            // let newPS = spec.partSys.ParticleSystemThruster({
            //     center: { x: shipCenter.x, y: shipCenter.y },
            //     size: { mean: 15, stdev: 5 },
            //     speed: { mean: 65, stdev: 35 },
            //     lifetime: { mean: .5, stdev: .25 },
            //     totalLife: elapsedTime / 1000,
            //     imageSrc: './assets/green_laser.png',
            //     startAngle: spec.rotation - 180,
            //     range: 15,
            //     density: 2,
            // }, spec.myRandom)
            // spec.particleController.addNewSystem(newPS);
        }
        let dx = spec.velocities.x * elapsedTime / 1000;
        let dy = spec.velocities.y * elapsedTime / 1000;
        spec.coords.x += dx;
        spec.coords.y += dy;

        // if player isn't thrusting, accel down
        if (!spec.playerStop) {
            spec.velocities.y += GRAVITY;
        }

        lastVelocity = { x: spec.velocities.x, y: spec.velocities.y };

    }

    function stopPlayerMovement() {
        spec.velocities = { x: 0, y: 0 };
        spec.playerStop = true;
    }

    function playerThrust(elapsedTime) {
        // console.log('old velocity: ', spec.velocities);
        decreaseFuel(elapsedTime);
        let newXVel = (spec.velocities.x + spec.acceleration * elapsedTime) * (Math.cos(spec.rotation - (Math.PI / 2)) / 180);
        let newYVel = (spec.velocities.y + spec.acceleration * elapsedTime) * (Math.sin(spec.rotation - (Math.PI / 2)) / 180);
        // check for max velocity
        // console.log('max speed', spec.maxSpeed)
        if (Math.abs(newXVel) < spec.maxSpeed && Math.abs(newYVel) < spec.maxSpeed) {
            // console.log('accelerating');
            spec.velocities.x += newXVel;
            spec.velocities.y += newYVel;
        }
        let center = _getPlayerCenter();
        let newPS = spec.partSys.ParticleSystemThruster({
            center: _getPlayerNose(),
            size: { mean: 15, stdev: 5 },
            speed: { mean: 65, stdev: 35 },
            lifetime: { mean: 2, stdev: .25 },
            totalLife: elapsedTime / 1000,
            imageSrc: './assets/smoke-2.png',
            startAngle: spec.rotation - 180,
            range: 15,
            density: 2,
            isReady: true,
        }, spec.myRandom)
        spec.particleController.addNewSystem(newPS);
        spec.playerStop = false;
    }

    function turnPlayerLeft(elapsedTime) {
        // console.log('turning player left');
        // spec.rotation -= (Math.PI * (turnSpeed * (elapsedTime / 1000))) / 180;
        spec.rotation -= turnSpeed * elapsedTime;
        // console.log(spec.rotation);
    }

    function turnPlayerRight(elapsedTime) {
        // console.log('turning player right');
        // spec.rotation += (Math.PI * (turnSpeed * (elapsedTime / 1000))) / 180;
        spec.rotation += turnSpeed * elapsedTime;
        // console.log(spec.rotation);
    }


    function respawn(safeCoords) {
        lives -= 1;
        didCollide = false;
        spec.coords = safeCoords;
        spec.velocities = { x: 0, y: 0 }
    }

    function removeLife() {
        lives -= 1;
    }

    function addLife() {
        lives += 1;
    }

    function increaseScore(newScore) {
        score += newScore;
    }

    function setDidCollide(newVal) {
        didCollide = newVal;
    }

    function _getPlayerCenter() {
        let center = {
            x: spec.coords.x + (spec.size / 2),
            y: spec.coords.y + (spec.size / 2),
        };

        return center;
    }

    function _getPlayerNose() {
        let nose = {
            x: (spec.coords.x + (spec.size / 2)) + ((Math.cos(spec.rotation + (Math.PI / 2))) * spec.size / 2),
            y: (spec.coords.y + (spec.size / 2)) + ((Math.sin(spec.rotation + (Math.PI / 2))) * spec.size / 2),
        };

        return nose;
    }

    function _determineSpeed() {
        // let speedX = spec.velocities.x;
        let speedY = spec.velocities.y;
        // let speed = Math.sqrt((speedX * speedX) * (speedY * speedY));
        return (Math.abs(speedY) / 10).toPrecision(3);
    }

    function _determineAngle() {
        let angle = (spec.rotation * 180) / Math.PI;
        if (angle < 0) {
            angle = 360 + angle
        }
        return angle.toFixed(2);
    }

    function _determineLevel() {
        let level = '';
        if (score < 5000) {
            level = 1;
        }
        else if (score >= 5000 && score < 25000) {
            level = '2';
        }
        else if (score >= 25000 && score < 45000) {
            level = '3';
        }
        else {
            level = '4';
        }

        return level
    }

    function getDisplaySpeedColor() {
        if (_determineSpeed() < 2) {
            return 'green';
        }
        return 'white';
    }
    function getDisplayAngleColor() {
        let angle = _determineAngle();
        if (angle <= 5 || angle >= 355) {
            return 'green';
        }
        return 'white';
    }

    function decreaseFuel(elapsedTime) {
        spec.fuel -= elapsedTime;
    }

    function printStats() {
        console.log('speed:', _determineSpeed());
        console.log('fuel:', spec.fuel);
        console.log('rotation:', (spec.rotation * 180) / Math.PI);
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
        get center() { return { x: spec.coords.x + (spec.size / 2), y: spec.coords.y + (spec.size / 2), } },
        get lives() { return lives },
        get score() { return score },
        get level() { return _determineLevel() },
        get displayRot() { return _determineAngle() },
        get displaySpeed() { return _determineSpeed() },
        get displayFuel() { return (spec.fuel / 1000).toFixed(2) },
        get displayFuelColor() { return 'green' },
        get displaySpeedColor() { return getDisplaySpeedColor() },
        get displayAngleColor() { return getDisplayAngleColor() },
        setDidCollide: setDidCollide,
        playerMoveLocation: playerMoveLocation,
        turnPlayerLeft: turnPlayerLeft,
        turnPlayerRight: turnPlayerRight,
        playerThrust: playerThrust,
        removeLife: removeLife,
        addLife: addLife,
        stopPlayerMovement: stopPlayerMovement,
        increaseScore: increaseScore,
        respawn: respawn,
        printStats: printStats,
        decreaseFuel: decreaseFuel,
    };

    return api;
}