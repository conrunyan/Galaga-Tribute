MyGame.graphics = (function() {
    'use strict';

    let canvas = document.getElementById('id-canvas');
    let context = canvas.getContext('2d');

    //------------------------------------------------------------------
    //
    // Public function that allows the client code to clear the canvas.
    //
    //------------------------------------------------------------------
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
            center.x - size.x / 2,
            center.y - size.y / 2,
            size.x, size.y);

        context.restore();
    }

    // --------------------------------------------------------------
    //
    // Draw a rectangle to the canvas with the following attributes:
    //      center: { x: , y: },
    //      size: { x: , y: },
    //      rotation:       // radians
    //
    // --------------------------------------------------------------
    function drawRectangle(rect, fillStyle, strokeStyle) {
        context.save();
        context.translate(rect.center.x, rect.center.y );
        context.rotate(rect.rotation);
        context.translate(-rect.center.x, -rect.center.y);
        
        context.fillStyle = fillStyle;
        context.fillRect(rect.center.x - rect.size.x / 2, rect.center.y - rect.size.y / 2, rect.size.x, rect.size.y);
        
        context.strokeStyle = strokeStyle;
        context.strokeRect(rect.center.x - rect.size.x / 2, rect.center.y - rect.size.y / 2, rect.size.x, rect.size.y);

        context.restore();
    }

    let api = {
        clear: clear,
        drawTexture: drawTexture,
        drawRectangle: drawRectangle
    };

    return api;
}());
