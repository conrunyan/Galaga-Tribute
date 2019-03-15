Asteroids.render.Projectile = (function (graphics) {
    'use strict';

    //drawTexture(image, center, rotation, size)

    function renderProjectile(spec) {
        let scale = 0.5
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

}(Asteroids.graphics));
