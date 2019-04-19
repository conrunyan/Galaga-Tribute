Galaga.render.Life = (function (graphics) {
    'use strict';

    //drawTexture(image, center, rotation, size)

    function renderLives(player, boardSize) {
        let scale = 0.75
        let initCoords = {x: 20, y: boardSize.y - 20};
        let offset = player.size * scale + 5;
        let center = {
            x: player.coords.x + (player.size / 2),
            y: player.coords.y + (player.size / 2),
        };
        for (let i = 0; i < player.lives; i++) {
            if (player.image.isReady) {
                graphics.drawTexture(player.image, initCoords, -Math.PI / 2, { width: player.size * scale, height: player.size * scale });
            }
            initCoords.x += offset;
        }
    }

    let api = {
        renderLives: renderLives,
    };

    return api;

}(Galaga.graphics));
