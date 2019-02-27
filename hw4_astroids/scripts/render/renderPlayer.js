MazeGame.render.Player = (function (graphics) {
    'use strict';

    //drawTexture(image, center, rotation, size)

    function renderPlayer(player) {
        let scale = 0.75
        let center = {
            x: player.xCoord + (player.cellSize / 2),
            y: player.yCoord + (player.cellSize / 2),
        };
        if (player.image.isReady) {
            graphics.drawTexture(player.image,center, 0, {width: player.cellSize * scale, height: player.cellSize * scale});
        }
    }

    let api = {
        renderPlayer: renderPlayer,
    };

    return api;

}(MazeGame.graphics));
