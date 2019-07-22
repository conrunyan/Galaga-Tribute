// --------------------------------------------------------------
//
// Creates a Player object, with functions for managing state.
// One player object will exist at a time. This object can manuever
// around the game board and shoot asteroids. It also has a hyperspace
// ability.
// spec = {
//   coords: { x: boardDim.x / 2, y: boardDim.y - 60 },
//   imageSrc: './assets/playerShip.png',
//   maxSpeed: 0.33, // pixels per second
//   acceleration: 40,
//   velocities: { x: 0, y: 0 },
//   rotation: -Math.PI / 2,
//   boardSize: boardDim,
//   size: 30,
//   shot: projectiles,
//   shotImgSource: './assets/shot.png',
//   shotSpeed: 150,
//   maxProjectiles: 1000,
//   sounds: sounds,
//   particleController: particleSystemController,
//   partSys: partSys,
//   myRandom: myRandom,
// }
//
// --------------------------------------------------------------
Galaga.objects.player.Player = function (spec) {
    'use strict';

    // load image
    let image = new Image();
    image.isReady = false;
    image.src = spec.imageSrc;
    image.onload = function () {
        this.isReady = true;
    };

    let projectiles = [];
    let timeSinceLastShot = 0;
    let shotInterval = 500;
    let autoSafetyRadius = 100;
    let didCollide = false;
    let displayPlayer = true;
    let movingLeft = true;
    let alive = true;
    let lives = 3;
    let score = 0;
    let level = 1;

    function autoPilot(elapsedTime, gamePieces) {
        // detect if there is something near by. If so, move right
        // otherwise, move until aliens are found. Then shoot them
        // if edge of screen is reached, go right until aliens are found.
        if (enemyNearby(gamePieces)) {
            movePlayerRight(elapsedTime);
        }
        else if (enemyAbove(gamePieces)) {
            playerShoot(elapsedTime);
        }
        else {
            moveBackAndForth(elapsedTime);
        }
    }

    function moveBackAndForth(elapsedTime) {
        // determine direction of movement
        if (spec.coords.x < spec.size) {
            movingLeft = false;
        }
        else if (spec.coords.x > (spec.boardSize.x - spec.size)) {
            movingLeft = true;
        }
        if (movingLeft) {
            movePlayerLeft(elapsedTime);
        }
        else {
            movePlayerRight(elapsedTime);
        }
    }

    function enemyAbove(gamePieces) {
        let result = false;
        gamePieces.ufos.forEach(ufo => {
            if (_entityIsAbove(ufo)) {
                result = true;
            }
        });
        return result;
    }

    function _entityIsAbove(entity) {
        if (Math.abs(entity.coords.x - spec.coords.x) < 5) {
            return true;
        }
        return false;
    }

    function enemyNearby(gamePieces) {
        // check aliens first, then their shots
        let result = false;
        gamePieces.ufos.forEach(ufo => {
            if (_entityIsClose(ufo)) {
                result = true;
            }
            ufo.projectiles.forEach(element => {
                if (_entityIsClose(element)) {
                    result = true;
                }
            });
        });

        return result;
    }

    function _entityIsClose(entity) {
        // check y axis
        if (Math.abs(entity.coords.y - spec.coords.y) < autoSafetyRadius) {
            // check x axis
            if (Math.abs(entity.coords.x - spec.coords.x) < autoSafetyRadius) {
                return true
            }
        }
        return false;
    }

    function movePlayerLeft(elapsedTime) {
        spec.coords.x -= spec.maxSpeed * elapsedTime;
    }

    function movePlayerRight(elapsedTime) {
        spec.coords.x += spec.maxSpeed * elapsedTime;
    }

    function playerShoot(elapsedTime) {
        if (projectiles.length < spec.maxProjectiles && timeSinceLastShot >= shotInterval && displayPlayer) {
            let tmpShotXVel = spec.shotSpeed * (Math.cos(spec.rotation) / 180);
            let tmpShotYVel = spec.shotSpeed * (Math.sin(spec.rotation) / 180);
            let newShot = spec.shot.PlayerShot({
                coords: _getPlayerNose(),
                imageSrc: spec.shotImgSource,
                maxSpeed: spec.shotSpeed,
                velocities: { x: tmpShotXVel, y: tmpShotYVel },
                size: 10,
                lifeTime: 0,
                rotation: 0,
                maxLifeTime: 20000,
            });
            projectiles.push(newShot);
            timeSinceLastShot = 0;
            // trigger sound of shot
            spec.sounds.playSound('audio/player-laser-shot');
        }
    }

    function respawn() {
        lives -= 1;
        didCollide = false;
        spec.coords = spec.coords;
        displayPlayer = true;
        spec.velocities = { x: 0, y: 0 }
    }

    function setAlive(val) {
        alive = val;
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

    function setShowPlayer(newVal) {
        displayPlayer = newVal;
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
        timeSinceLastShot += elapsedTime;
        projectiles.forEach(shot => {
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
        get center() { return { x: spec.coords.x + (spec.size / 2), y: spec.coords.y + (spec.size / 2), } },
        get lives() { return lives },
        get score() { return score },
        get level() { return _determineLevel() },
        get alive() { return alive },
        get showPlayer() { return displayPlayer },
        autoPilot: autoPilot,
        setAlive: setAlive,
        setDidCollide: setDidCollide,
        setShowPlayer: setShowPlayer,
        movePlayerLeft: movePlayerLeft,
        movePlayerRight: movePlayerRight,
        playerShoot: playerShoot,
        updateShots: updateShots,
        removeLife: removeLife,
        addLife: addLife,
        increaseScore: increaseScore,
        respawn: respawn,
    };

    return api;
}