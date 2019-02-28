// --------------------------------------------------------------
//
// Creates a Player object, with functions for managing state.
// One player object will exist at a time. This object can manuever
// around the game board and interact with the maze (exit, run into walls, etc.)
// spec = {
//  coords: {x: int, y: int} ,
//  imageSrc: ,
//  maxSpeed: ,
//  accelleration: ,
//  velocities: {x: float, y: float},
//  rotation: 45 initially,
//  size: in pixels
// }
//
// CREDITS: Character art from https://opengameart.org/content/jumping-galaxy-asset-cc-by-30
// --------------------------------------------------------------
Asteroids.objects.player.Player = function (spec) {
    'use strict';

    // load image
    let image = new Image(); 
    image.isReady = false;
    image.src = spec.imageSrc;
    image.onload = function () {
        console.log('loaded image...');
        this.isReady = true;
    };

    let turnSpeed = 200; // not sure what unit yet

    function playerMoveLocation(elapsedTime) {
        // TODO: Add function here to move the player in a direction
        let dx = spec.velocities.x * elapsedTime / 1000;
        let dy = spec.velocities.y * elapsedTime / 1000;
        spec.coords.x += dx;
        spec.coords.y += dy;

        // wrap around coords
        if (spec.coords.x > spec.boardSize) {
            spec.coords.x = 0;
        }
        else if (spec.coords.x < 0) {
            spec.coords.x = spec.boardSize;
        }

        if (spec.coords.y > spec.boardSize) {
            spec.coords.y = 0;
        }
        else if (spec.coords.y < 0) {
            spec.coords.y = spec.boardSize;
        }
        // console.log('player coords: ', spec.coords);
        // console.log('dX:', dx, 'dY:', dy);

    }

    function playerThrust(elapsedTime) {
        console.log('old velocity: ', spec.velocities);
        let newXVel = (spec.velocities.x + spec.acceleration * 100) * (Math.cos(spec.rotation) / 180);
        let newYVel = (spec.velocities.y + spec.acceleration * 100) * (Math.sin(spec.rotation) / 180);
        // check for max velocity
        console.log('max speed', spec.maxSpeed)
        if (Math.abs(newXVel) < spec.maxSpeed && Math.abs(newYVel) < spec.maxSpeed) {
            console.log('accelerating');
            spec.velocities.x += newXVel;
            spec.velocities.y += newYVel;
        }
        console.log('new velocity: ', spec.velocities);
    }

    function turnPlayerLeft(elapsedTime) {
        console.log('turning player left');
        spec.rotation -= (Math.PI * (turnSpeed * (elapsedTime / 1000))) / 180;
        console.log(spec.rotation);
    }

    function turnPlayerRight(elapsedTime) {
        console.log('turning player right');
        spec.rotation += (Math.PI * (turnSpeed * (elapsedTime / 1000))) / 180;
        console.log(spec.rotation);
    }

    let api = {
        get image() { return image },
        get coords() { return spec.coords },
        get size() { return spec.size },
        get rotation() { return spec.rotation },
        playerMoveLocation: playerMoveLocation,
        turnPlayerLeft: turnPlayerLeft,
        turnPlayerRight: turnPlayerRight,
        playerThrust: playerThrust,
    };

    return api;
}