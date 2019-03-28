// --------------------------------------------------------------
//
// Creates a Player object, with functions for managing state.
// One player object will exist at a time. This object can manuever
// around the game board and shoot asteroids. It also has a hyperspace
// ability.
// spec = {
//  coords: {x: int, y: int} ,
//  imageSrc: ,
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
    let timeSinceLastShot = 300;
    let shotInterval = 300;
    let didCollide = false;
    let lives = 3;
    let score = 0;
    let level = 1;

    function movePlayerLeft(elapsedTime) {
        // console.log('turning player left');
        spec.coords.x -= spec.maxSpeed * elapsedTime;
        // console.log(spec.rotation);
    }

    function movePlayerRight(elapsedTime) {
        // console.log('turning player right');
        spec.coords.x += spec.maxSpeed * elapsedTime;
        // console.log(spec.rotation);
    }

    function playerShoot(elapsedTime) {
        if (projectiles.length < spec.maxProjectiles && timeSinceLastShot >= shotInterval) {
            // console.log('creating new shot...');
            let tmpShotXVel = spec.shotSpeed * (Math.cos(spec.rotation) / 180);
            let tmpShotYVel = spec.shotSpeed * (Math.sin(spec.rotation) / 180);
            let newShot = spec.shot.PlayerShot({
                coords: _getPlayerNose(),
                imageSrc: spec.shotImgSource,
                maxSpeed: spec.shotSpeed,
                velocities: { x: tmpShotXVel, y: tmpShotYVel },
                size: 5,
                lifeTime: 0,
                maxLifeTime: 10000,
            });
            projectiles.push(newShot);
            timeSinceLastShot = 0;
            // trigger sound of shot
            spec.sounds.playSound('audio/player-laser-shot');
        }
        else {
            timeSinceLastShot += elapsedTime
        }
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