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

    function movePlayer(direction, elapsedTime) {
        // TODO: Add function here to move the player in a direction
    }

    let api = {
        get image() { return image },
        get coords() { return spec.coords },
        movePlayer: movePlayer,
    };

    return api;
}