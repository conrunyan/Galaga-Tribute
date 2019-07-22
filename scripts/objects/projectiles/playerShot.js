// --------------------------------------------------------------
//
// Creates a player shot object, with functions for managing state.
// spec = {
//  coords: _getPlayerNose(),
//  imageSrc: spec.shotImgSource,
//  maxSpeed: spec.shotSpeed,
//  velocities: { x: tmpShotXVel, y: tmpShotYVel },
//  size: 10,
//  lifeTime: 0,
//  rotation: 0,
//  maxLifeTime: 20000,
// }
//
// --------------------------------------------------------------
Galaga.objects.projectile.PlayerShot = function (spec) {
    'use strict';

    // load image
    let image = new Image();
    image.isReady = false;
    image.src = spec.imageSrc;
    image.onload = function () {
        this.isReady = true;
    };

    let didCollide = false;

    function moveProjectileFoward(elapsedTime) {
        spec.coords.x += (spec.velocities.x * elapsedTime);
        spec.coords.y += (spec.velocities.y * elapsedTime);
        spec.lifeTime += elapsedTime;
    }

    function setDidCollide(newVal) {
        didCollide = newVal;
    }

    let api = {
        get image() { return image },
        get coords() { return spec.coords },
        get size() { return spec.size },
        get radius() { return spec.size / 2 },
        get center() { return { x: spec.coords.x + (spec.size / 2), y: spec.coords.y + (spec.size / 2), } },
        get lifeTime() { return spec.lifeTime },
        get maxLifeTime() { return spec.maxLifeTime },
        get didCollide() { return didCollide },
        get rotation() { return spec.rotation },
        setDidCollide: setDidCollide,
        moveProjectileFoward: moveProjectileFoward,
    };

    return api;
}