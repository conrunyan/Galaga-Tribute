MazeGame.render.Marker = (function (graphics) {
    'use strict';

    //drawTexture(image, center, rotation, size)

    function renderMarker(cell) {
        let scale = 0.25
        let center = {
            x: cell.xCoord + (cell.size * 0.75),
            y: cell.yCoord + (cell.size * 0.75),
        };
        if (cell.markerImage.isReady) {
            graphics.drawTexture(cell.markerImage, center, 0, { width: cell.size * scale, height: cell.size * scale });
        }
    }

    let api = {
        renderMarker: renderMarker,
    };

    return api;

}(MazeGame.graphics));
