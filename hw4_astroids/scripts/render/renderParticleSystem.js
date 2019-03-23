Asteroids.render.ParticleSystem = (function (graphics) {
    'use strict';

    function render(systems) {
        // system controller
        // console.log('rendering particle');
        Object.getOwnPropertyNames(systems).forEach(system => {
            // individual system
            // console.log('system', system);
            if (systems[system].isReady) {
                Object.getOwnPropertyNames(systems[system].particles).forEach(function (value) {
                    let particle = systems[system].particles[value];
                    graphics.drawTexture(systems[system].image, particle.center, particle.rotation, particle.size);
                });
            }
        });
    }

    let api = {
        render: render
    };

    return api;
}(Asteroids.graphics));