Asteroids.render.Asteroid = (function (graphics) {
    'use strict';

    //drawTexture(image, center, rotation, size)

    function renderAsteroid(asteroid) {
        let scale = 1
        let center = {
            x: asteroid.coords.x + (asteroid.size / 2),
            y: asteroid.coords.y + (asteroid.size / 2),
        };
        if (asteroid.image.isReady) {
            graphics.drawTexture(asteroid.image, asteroid.center, asteroid.rotation, { width: asteroid.size * scale, height: asteroid.size * scale });
        }
    }

    let api = {
        renderAsteroid: renderAsteroid,
    };

    return api;

}(Asteroids.graphics));
