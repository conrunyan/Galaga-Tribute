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
        // if (!spec.isThrusting) {
        //     spec.velocities.y -= GRAVITY;
        // }

        // // wrap around coords
        // if (spec.coords.x > spec.boardSize.x) {
        //     spec.coords.x = 0;
        // }
        // else if (spec.coords.x < 0) {
        //     spec.coords.x = spec.boardSize.x;
        // }

        // if (spec.coords.y > spec.boardSize.y) {
        //     spec.coords.y = 0;
        // }
        // else if (spec.coords.y < 0) {
        //     spec.coords.y = spec.boardSize.y;
        // }
        // // console.log('player coords: ', spec.coords);
        // // console.log('dX:', dx, 'dY:', dy);

        lastVelocity = { x: spec.velocities.x, y: spec.velocities.y };

    }

    function stopPlayerMovement() {
        spec.velocities = {x: 0, y: 0};
        spec.playerStop = true;
    }

    function playerThrust(elapsedTime) {
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
        // console.log('new velocity: ', spec.velocities);
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

    // function playerShoot(elapsedTime) {
    //     if (projectiles.length < spec.maxProjectiles && timeSinceLastShot >= shotInterval) {
    //         // console.log('creating new shot...');
    //         let tmpShotXVel = spec.shotSpeed * (Math.cos(spec.rotation) / 180);
    //         let tmpShotYVel = spec.shotSpeed * (Math.sin(spec.rotation) / 180);
    //         let newShot = spec.shot.PlayerShot({
    //             coords: _getPlayerNose(),
    //             imageSrc: spec.shotImgSource,
    //             maxSpeed: spec.shotSpeed,
    //             velocities: { x: tmpShotXVel, y: tmpShotYVel },
    //             size: 5,
    //             lifeTime: 0,
    //             maxLifeTime: 10000,
    //         });
    //         projectiles.push(newShot);
    //         timeSinceLastShot = 0;
    //         // trigger sound of shot
    //         spec.sounds.playSound('audio/player-laser-shot');
    //     }
    //     else {
    //         timeSinceLastShot += elapsedTime
    //     }
    // }

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
            x: (spec.coords.x + (spec.size / 2)) + ((Math.cos(spec.rotation)) * spec.size / 2),
            y: (spec.coords.y + (spec.size / 2)) + ((Math.sin(spec.rotation)) * spec.size / 2),
        };

        return nose;
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
    };

    return api;
}