Galaga.render.Projectile = (function (graphics) {
    'use strict';

    function renderProjectile(spec) {
        let scale = 1
        let center = {
            x: spec.coords.x + (spec.size / 2),
            y: spec.coords.y + (spec.size / 2),
        };

        if (spec.image.isReady) {
            graphics.drawTexture(spec.image, center, spec.rotation, { width: spec.size * scale, height: spec.size * scale });
        }
    }

    let api = {
        renderProjectile: renderProjectile,
    };

    return api;

}(Galaga.graphics));
