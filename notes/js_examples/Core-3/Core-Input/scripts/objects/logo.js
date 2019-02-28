// --------------------------------------------------------------
//
// Creates a Logo object, with functions for managing state.
//
// spec = {
//    imageSrc: ,   // Web server location of the image
//    center: { x: , y: },
//    size: { width: , height: }
// }
//
// --------------------------------------------------------------
MyGame.objects.Logo = function(spec) {
    'use strict';

    let rotation = 0;
    let imageReady = false;
    let image = new Image();

    image.onload = function() {
        imageReady = true;
    };
    image.src = spec.imageSrc;

    function updateRotation(howMuch) {
        rotation += howMuch;
    }

    function moveLeft(elapsedTime) {
        spec.center.x -= (spec.moveRate * elapsedTime);
    }

    function moveRight(elapsedTime) {
        spec.center.x += (spec.moveRate * elapsedTime);
    }

    function moveUp(elapsedTime) {
        spec.center.y -= (spec.moveRate * elapsedTime);
    }

    function moveDown(elapsedTime) {
        spec.center.y += (spec.moveRate * elapsedTime);
    }

    function moveTo(pos) {
        spec.center.x = pos.x;
        spec.center.y = pos.y;
    }

    let api = {
        updateRotation: updateRotation,
        moveLeft: moveLeft,
        moveRight: moveRight,
        moveUp: moveUp,
        moveDown: moveDown,
        moveTo: moveTo,
        get imageReady() { return imageReady; },
        get rotation() { return rotation; },
        get image() { return image; },
        get center() { return spec.center; },
        get size() { return spec.size; }
    };

    return api;
}
