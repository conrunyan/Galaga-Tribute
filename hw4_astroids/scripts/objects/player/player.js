// --------------------------------------------------------------
//
// Creates a Player object, with functions for managing state.
// One player object will exist at a time. This object can manuever
// around the game board and interact with the maze (exit, run into walls, etc.)
// spec = {
//  coords: {x: int, y: int} ,
//  imageSrc: ,
//  maxSpeed: ,
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

    let turnSpeed = 150; // not sure what unit yet

    function playerThrust(elapsedTime) {
        // TODO: Add function here to move the player in a direction

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
        playerThrust: playerThrust,
        turnPlayerLeft: turnPlayerLeft,
        turnPlayerRight: turnPlayerRight,
    };

    return api;
}