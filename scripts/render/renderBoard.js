Galaga.render.Board = (function (graphics, renderer) {
    'use strict';

    //drawTexture(image, center, rotation, size)
    function renderPieces(gamePieces) {
        // render player
        renderer.Player.renderPlayer(gamePieces.player);
        // render player shots
        gamePieces.player.projectiles.forEach(shot => {
            renderer.Projectile.renderProjectile(shot);
        });
        // // render UFOs
        let ufos = gamePieces.ufos;
        for (let ufo = 0; ufo < ufos.length; ufo++) {
            renderer.Player.renderPlayer(ufos[ufo]);
            ufos[ufo].projectiles.forEach(shot => {
                renderer.Projectile.renderProjectile(shot);
            })
        }

        // render grid
        if (gamePieces.alienGrid.debugging) {
            let grid = gamePieces.alienGrid.grid;
            grid.forEach(row => {
                row.forEach(slot => {
                    renderer.Player.renderPlayer(slot);
                })
            })
        }
        
    }

    let api = {
        renderPieces: renderPieces,
    };

    return api;

}(Galaga.graphics, Galaga.render));
