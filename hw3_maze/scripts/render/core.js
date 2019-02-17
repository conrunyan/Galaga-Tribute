MazeGame.graphics = (function () {
    'use strict';

    let canvas = document.getElementById('id-canvas');
    let canvas2 = document.getElementById('id-canvas2');
    let context = canvas.getContext('2d');
    let context2 = canvas2.getContext('2d');

    function clear1() {
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    function clear2() {
        context2.clearRect(0, 0, canvas2.width, canvas2.height);
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
        context2.save();

        // context.translate(center.x, center.y);
        // context.rotate(rotation);
        // context.translate(-center.x, -center.y);

        context2.drawImage(
            image,
            center.x - size.width / 2,
            center.y - size.height / 2,
            size.width, size.height);

        context2.restore();
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
 function drawGamePiece(spec, image) {
        context.save();
        context.fillStyle = spec.color;
        context.lineWidth = 2;
        // context.drawImage(
        //     image,
        //     spec.xCoord,
        //     spec.yCoord,
        //     spec.size, spec.size);

        if (spec.edges.topWall === undefined) {
            context.moveTo(spec.xCoord, spec.yCoord);
            context.lineTo(spec.xCoord + spec.size, spec.yCoord);
        }

        if (spec.edges.bottomWall === undefined) {
            context.moveTo(spec.xCoord, spec.yCoord + spec.size);
            context.lineTo(spec.xCoord + spec.size, spec.yCoord + spec.size);
        }

        if (spec.edges.rightWall === undefined) {
            context.moveTo(spec.xCoord + spec.size, spec.yCoord);
            context.lineTo(spec.xCoord + spec.size, spec.yCoord + spec.size);
        }

        if (spec.edges.leftWall === undefined) {
            context.moveTo(spec.xCoord, spec.yCoord);
            context.lineTo(spec.xCoord, spec.yCoord + spec.size);
        }
        context.stroke();
        context.restore();
    }

    let api = {
        get canvas() { return canvas; },
        clear: clear1,
        clear2: clear2,
        drawTexture: drawTexture,
        drawGamePiece: drawGamePiece,
    };



    return api;
}());
