Galaga.render.Player = (function (graphics) {
    'use strict';

    function renderPlayer(player) {
        let scale = 1
        let center = {
            x: player.coords.x + (player.size / 2),
            y: player.coords.y + (player.size / 2),
        };
        if (player.image.isReady && !player.didCollide && player.showPlayer) {
            graphics.drawTexture(player.image, center, player.rotation, { width: player.size * scale, height: player.size * scale });
        }
    }

    let api = {
        renderPlayer: renderPlayer,
    };

    return api;

}(Galaga.graphics));
