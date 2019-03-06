Asteroids.render.BoardPieces = (function (graphics) {
    'use strict';

    //drawTexture(image, center, rotation, size)
    function renderPieces(gamePieces) {
        // render player
        gamePieces.player.render();
        // render astroids
        let asteroids = gamePieces.asteroids;
        for (let asteroid = 0; asteroid < asteroids.length; asteroid++) {
            asteroids[i].render();
        }
        // render UFOs
        let ufos = gamePieces.ufos;
        for (let ufo = 0; ufo < ufos.length; ufo++) {
            ufos[i].render();
        }
    }

    let api = {
        renderPlayer: renderPlayer,
    };

    return api;

}(Asteroids.graphics));
