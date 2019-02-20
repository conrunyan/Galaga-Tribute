MazeGame.render.Crumb = (function (graphics) {
    'use strict';

    //drawTexture(image, center, rotation, size)

    function renderCrumb(cell) {
        let scale = 0.33
        let center = {
            x: cell.xCoord + (cell.size / 2),
            y: cell.yCoord + (cell.size / 2),
        };
        if (cell.breadCrumbImage.isReady) {
            graphics.drawTexture(cell.breadCrumbImage, center, 0, { width: cell.size * scale, height: cell.size * scale });
        }
    }

    let api = {
        renderCrumb: renderCrumb,
    };

    return api;

}(MazeGame.graphics));
