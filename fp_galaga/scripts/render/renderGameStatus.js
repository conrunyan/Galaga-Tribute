Asteroids.render.Status = (function (graphics, renderer) {
    'use strict';

    //drawTexture(image, center, rotation, size)
    function renderStats(player, board) {
        // render player stats
        let playerScore = `Score: ${player.score}`;
        let playerLives = `Lives: ${player.lives}`;
        let playerLevel = `Level: ${player.level}`;
        let playerHyperspace = `Hyper-Space: N/A`;
        graphics.drawText(playerScore, {x: 10, y: 30}, 'white', 12);
        graphics.drawText(playerLives, { x: 10, y: 50 }, 'white', 12);
        graphics.drawText(playerLevel, { x: 10, y: 70 }, 'white', 12);
        graphics.drawText(playerHyperspace, { x: 10, y: 90 }, 'white', 12);

    }

    let api = {
        renderStats: renderStats,
    };

    return api;

}(Asteroids.graphics, Asteroids.render));
