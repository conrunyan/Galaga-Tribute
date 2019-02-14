MazeGame.graphics = (function () {
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
        context.lineWidth = 2;
        context.fillRect(
            spec.xCoord,
            spec.yCoord,
            spec.size,
            spec.size);
        if (spec.edges.topWall === undefined) {
            context.moveTo(spec.rowIdx * spec.size, spec.colIdx * spec.size);
            context.lineTo((spec.rowIdx + 1) * spec.size, spec.colIdx * spec.size);
        }

        if (spec.edges.bottomWall === undefined) {
            context.moveTo(spec.rowIdx * spec.size, (spec.colIdx + 1) * spec.size);
            context.lineTo((spec.rowIdx + 1) * spec.size, (spec.colIdx + 1) * spec.size);
        }

        if (spec.edges.rightWall === undefined) {
            context.moveTo((spec.rowIdx + 1) * spec.size, spec.colIdx * spec.size);
            context.lineTo((spec.rowIdx + 1) * spec.size, (spec.colIdx + 1) * spec.size);
        }

        if (spec.edges.leftWall === undefined) {
            context.moveTo(spec.rowIdx * spec.size, spec.colIdx * spec.size);
            context.lineTo(spec.rowIdx * spec.size, (spec.colIdx + 1) * spec.size);
        }
        context.stroke();
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
