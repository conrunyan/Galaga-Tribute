MazeGame.render.Planet = (function (graphics) {
    'use strict';

    //drawTexture(image, center, rotation, size)

    function renderPlanet(cell) {
        let scale = 0.75
        let center = {
            x: cell.xCoord + (cell.size / 2),
            y: cell.yCoord + (cell.size / 2),
        };
        if (cell.planetImage.isReady) {
            graphics.drawTexture(cell.planetImage, center, 0, { width: cell.size * scale, height: cell.size * scale });
        }
    }

    let api = {
        renderPlanet: renderPlanet,
    };

    return api;

}(MazeGame.graphics));
