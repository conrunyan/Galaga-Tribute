Galaga.render.Status = (function (graphics, renderer) {
    'use strict';

    function renderStats(player, board) {
        // render player stats
        let playerScore = `SCORE: ${player.score}`;
        graphics.drawText(playerScore, {x: 10, y: 30}, 'red', 20);

    }

    let api = {
        renderStats: renderStats,
    };

    return api;

}(Galaga.graphics, Galaga.render));
