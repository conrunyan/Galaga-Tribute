Asteroids.graphics = (function () {
    'use strict';

    let canvas = document.getElementById('canvas'); // canvas for main game board. 
    let context = canvas.getContext('2d');

    function clear() {
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    // --------------------------------------------------------------
    //
    // Draws a texture to the canvas with the following specification:
    //    image: Image
    //    center: {x: , y: }
    //    size: { width: , height: }
    //
    // --------------------------------------------------------------
    function drawTexture(image, center, rotation, size) {
        context.save();

        context.translate(center.x, center.y);
        context.rotate(rotation);
        context.translate(-center.x, -center.y);

        context.drawImage(
            image,
            center.x - size.width / 2,
            center.y - size.height / 2,
            size.width, size.height);

        context.restore();
    }

    // spec = {
    //  coords: {x: y:},
    //  velocities: {x: y:},
    //  rotation: {x: y:},
    //  image: imgSrc,
    //}
    function drawPlayer(spec) {
        context.save();
        context.fillStyle = spec.color;
        context.strokeStyle = "#FFFFFF";
        context.lineWidth = 2;
        context.drawImage(
            spec.cellBackgroundImg,
            spec.xCoord,
            spec.yCoord,
            spec.size, spec.size);

        // draw breadCrumb, if applicable

        // draw shortest path, if applicable
        context.restore();

    }

    let api = {
        get canvas() { return canvas; },
        clear: clear,
        drawTexture: drawTexture,
        drawPlayer: drawPlayer,
    };

    return api;
}());
