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
        console.log('loaded image...');
        this.isReady = true;
    };

    let turnSpeed = 0.0125; // not sure what unit yet

    function asteroidMoveLocation(elapsedTime) {
        // TODO: Add function here to move the player in a direction
        let dx = spec.velocities.x * elapsedTime / 1000;
        let dy = spec.velocities.y * elapsedTime / 1000;
        spec.coords.x += dx;
        spec.coords.y += dy;
        spec.rotation += turnSpeed

        console.log('asteroid coords: ', spec.coords);
        // console.log('dX:', dx, 'dY:', dy);

    }

    function _getCenter() {
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

    let api = {
        get image() { return image },
        get coords() { return spec.coords },
        get size() { return spec.size },
        get rotation() { return spec.rotation },
        get center() { return {x: spec.coords.x + (spec.size / 2), y: spec.coords.y + (spec.size / 2),}},
        asteroidMoveLocation: asteroidMoveLocation,
    };

    return api;
}