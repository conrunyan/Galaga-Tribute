Galaga.graphics = (function () {
    'use strict';

    let canvas = document.getElementById('canvas'); // canvas for main game board. 
    let context = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function clear() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        // resizeCanvas();
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

    function drawText(text, coords, color, size) {
        context.save();

        context.fillStyle = color;
        context.font = `${size}pt Comic Sans MS`;
        context.textAlight = 'left';
        context.fillText(text, coords.x, coords.y);

        context.restore();
    }

    function drawSprite(image, center, rotation, size, subImageLocations) {
        context.save();

        context.translate(center.x, center.y);
        context.rotate(rotation);
        context.translate(-center.x, -center.y);

        context.drawImage(
            image,
            subImageLocations.sx,
            subImageLocations.sy,
            subImageLocations.sWidth,
            subImageLocations.sHeigt,
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

    function drawMoon(surface) {
        context.save();
        context.fillStyle = "#000000";
        context.strokeStyle = "#000000";
        context.lineWidth = 2;
        let mapWidth = 1000;
        let mapHeight = 750;
        // context.drawImage(
        //     spec.cellBackgroundImg,
        //     spec.xCoord,
        //     spec.yCoord,
        //     spec.size, spec.size);

        // draw breadCrumb, if applicable

        // draw shortest path, if applicable
        context.beginPath();
        let initPoint = surface[0];
        for (let i = 1; i < surface.length; i++) {
            let y1 = mapHeight - (initPoint.y * mapHeight);
            let y2 = mapHeight - (surface[i].y * mapHeight);
            let x1 = initPoint.x * mapWidth;
            let x2 = surface[i].x * mapWidth;

            context.moveTo(x1, y1);
            context.lineTo(x2, y2);
            context.stroke();
            initPoint = surface[i];
        }
        // });
        context.closePath();
        context.restore();
    }

    let api = {
        get canvas() { return canvas; },
        clear: clear,
        drawTexture: drawTexture,
        drawPlayer: drawPlayer,
        drawSprite: drawSprite,
        drawText: drawText,
        drawMoon: drawMoon,
    };

    return api;
}());
