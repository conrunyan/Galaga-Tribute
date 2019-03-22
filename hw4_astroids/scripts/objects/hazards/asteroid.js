// --------------------------------------------------------------
//
// Creates an Asteroid object, with functions for managing state.
// spec = {
//  coords: {x: int, y: int} ,
//  imageSrc: ,
//  velocities: {x: float, y: float},
//  rotation: 45 initially,
//  size: in pixels
//  mass: used to determine collision velocity
// }
//
// CREDITS: Character art from 
// --------------------------------------------------------------
Asteroids.objects.asteroid.Asteroid = function (spec) {
    'use strict';

    // load image
    let image = new Image();
    image.isReady = false;
    image.src = spec.imageSrc;
    image.onload = function () {
        // console.log('loaded image...');
        this.isReady = true;
    };

    let breaksInto = {
        'large': 3,
        'medium': 4,
    }

    let sizes = {
        'large': 80,
        'medium': 50,
        'small': 25,
    }

    let turnSpeed = 0.0125; // not sure what unit yet
    let didCollide = false;

    function asteroidMoveLocation(elapsedTime) {
        // TODO: Add function here to move the player in a direction
        let dx = spec.velocities.x * elapsedTime / 1000;
        let dy = spec.velocities.y * elapsedTime / 1000;
        spec.coords.x += dx;
        spec.coords.y += dy;
        spec.rotation += turnSpeed

        // console.log('asteroid coords: ', spec.coords);
        // console.log('dX:', dx, 'dY:', dy);

    }

    function setDidCollide(newVal) {
        didCollide = newVal;
    }

    let api = {
        get image() { return image },
        get coords() { return spec.coords },
        get size() { return sizes[spec.asteroidType] },
        get radius() { return sizes[spec.asteroidType] / 2 },
        get rotation() { return spec.rotation },
        get center() { return { x: spec.coords.x + (sizes[spec.asteroidType] / 2), y: spec.coords.y + (sizes[spec.asteroidType] / 2), } },
        get didCollide() { return didCollide },
        get velocities() { return spec.velocities },
        get breaksInto() { return breaksInto[spec.asteroidType] },
        get asteroidType() { return spec.asteroidType },
        setDidCollide: setDidCollide,
        asteroidMoveLocation: asteroidMoveLocation,
    };

    return api;
}