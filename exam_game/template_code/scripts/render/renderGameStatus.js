Galaga.render.Status = (function (graphics, renderer) {
    'use strict';

    //drawTexture(image, center, rotation, size)
    function renderStats(player, board) {
        // render player stats
        let playerScore = `Fuel: ${player.displayFuel}`;
        let scoreColor = player.displayFuelColor;
        let playerSpeed = `Speed: ${player.displaySpeed}`;
        let speedColor = player.displaySpeedColor;
        let playerAngle = `Angle: ${player.displayRot}`;
        let angleColor = player.displayAngleColor;
        // let playerHyperspace = `Hyper-Space: N/A`;
        graphics.drawText(playerScore, { x: 10, y: 30 }, scoreColor, 12);
        graphics.drawText(playerSpeed, { x: 10, y: 50 }, speedColor, 12);
        graphics.drawText(playerAngle, { x: 10, y: 70 }, angleColor, 12);
        // graphics.drawText(playerHyperspace, { x: 10, y: 90 }, 'white', 12);

    }

    let api = {
        renderStats: renderStats,
    };

    return api;

}(Galaga.graphics, Galaga.render));
