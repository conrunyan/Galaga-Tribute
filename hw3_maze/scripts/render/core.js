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

    function renderCharacter(character, spec) {
        if (character.image.isReady) {
            context.drawImage(character.image,
            character.location.x * spec.size, character.location.y * spec.size);
        }
    }

    let api = {
        get canvas() { return canvas; },
        clear: clear,
        drawTexture: drawTexture,
        renderCharacter: renderCharacter,
        drawGamePiece: drawGamePiece,
    };

    

    return api;
}());
