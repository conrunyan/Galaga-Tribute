Galaga.render.Status = (function (graphics, renderer) {
    'use strict';

    //drawTexture(image, center, rotation, size)
    function renderStats(player, board) {
        // render player stats
        let playerScore = `Score: ${player.score}`;
        let playerLives = `Lives: ${player.lives}`;
        let playerLevel = `Level: ${player.level}`;
        graphics.drawText(playerScore, {x: 10, y: 30}, 'red', 20);
        graphics.drawText(playerLives, { x: 10, y: 50 }, 'red', 12);
        // graphics.drawText(playerLevel, { x: 10, y: 70 }, 'red', 12);

    }

    let api = {
        renderStats: renderStats,
    };

    return api;

}(Galaga.graphics, Galaga.render));
