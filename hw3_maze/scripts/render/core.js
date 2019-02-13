MazeGame.graphics = (function() {
    'use strict';

    let canvas = document.getElementById('id-canvas');
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

    /*
    spec = {
        color: ,
        xCoord: ,
        yCoord: ,
        height: ,
        width: ,
    } 
    */
    function drawGamePiece(spec) {
        context.save();
        context.fillStyle = spec.color;
        context.lineWidth = 1;
        context.fillRect(
            spec.xCoord,
            spec.yCoord,
            spec.width,
            spec.height);
        // if (specs.type !== 'background') {
        //     context.strokeRect(
        //         specs.xCoord,
        //         specs.yCoord,
        //         spec.width,
        //         spec.height
        //     );
        // }
        // context.lineWidth = 5;
        // context.strokeStyle = border;
        // context.stroke();

        context.restore();
    }

    let api = {
        get canvas() { return canvas; },
        clear: clear,
        drawTexture: drawTexture,
        drawGamePiece: drawGamePiece,
    };

    return api;
}());
