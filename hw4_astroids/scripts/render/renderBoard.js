Asteroids.render.Board = (function (graphics, renderer) {
    'use strict';

    //drawTexture(image, center, rotation, size)
    function renderPieces(gamePieces) {
        // render player
        renderer.Player.renderPlayer(gamePieces.player);
        // render player shots
        gamePieces.player.projectiles.forEach(shot => {
            renderer.Projectile.renderProjectile(shot);
        });
        // render astroids
        let asteroids = gamePieces.asteroids;
        for (let asteroid = 0; asteroid < asteroids.length; asteroid++) {
            renderer.Asteroid.renderAsteroid(asteroids[asteroid]);
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
