Asteroids.render.Board = (function (graphics, renderer) {
    'use strict';

    //drawTexture(image, center, rotation, size)
    function renderPieces(gamePieces) {
        // render player
        renderer.Player.renderPlayer(gamePieces.player);
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
        renderPieces: renderPieces,
    };

    return api;

}(Asteroids.graphics, Asteroids.render));
