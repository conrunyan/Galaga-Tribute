Asteroids.render.ParticleSystem = (function (graphics) {
    'use strict';

    function render(systems) {
        // system controller
        // console.log('rendering particle');
        if (systems.length > 0) {
            console.log('rendering particles...');
        }
        systems.forEach(system => {
            // individual system
            // console.log('system', system);
            if (system.isReady) {
                Object.getOwnPropertyNames(system.particles).forEach(value => {
                    let particle = system.particles[value];
                    graphics.drawTexture(system.image, particle.center, particle.rotation, particle.size);
                });
            }
        });
    }

    let api = {
        render: render
    };

    return api;
}(Asteroids.graphics));