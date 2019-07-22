Galaga.render.LevelText = (function (graphics) {
    'use strict';

    function renderLevelText(gameLevel, boardSize) {
        let scale = 1
        let initCoords = {x: boardSize.x / 2 - 50, y: boardSize.y / 2};
        let levelText = `STAGE ${gameLevel}`.toUpperCase();
        if (gameLevel === 'challenge') {
            levelText = 'CHALLENGE STAGE';
        }
        graphics.drawText(levelText, initCoords, 'white', 20);
    }

    let api = {
        renderLevelText: renderLevelText,
    };

    return api;

}(Galaga.graphics));
