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
//  size: in pixels
// }
//
// CREDITS: Character art from https://www.kisspng.com/png-star-fox-2-lylat-wars-super-nintendo-entertainment-4798475/preview.html
// --------------------------------------------------------------
Galaga.objects.projectile.PlayerShot = function (spec) {
    'use strict';

    // load image
    let image = new Image();
    image.isReady = false;
    image.src = spec.imageSrc;
    image.onload = function () {
        // console.log('loaded image...');
        this.isReady = true;
    };

    let didCollide = false;

    function moveProjectileFoward(elapsedTime) {
        // console.log('PROJ BEFORE: ', spec.coords);
        spec.coords.x += (spec.velocities.x * elapsedTime);
        spec.coords.y += (spec.velocities.y * elapsedTime);
        spec.lifeTime += elapsedTime;
        // console.log('PROJ AFTER :', spec.coords);
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
        setDidCollide: setDidCollide,
        moveProjectileFoward: moveProjectileFoward,
    };

    return api;
}