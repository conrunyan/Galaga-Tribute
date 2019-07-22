Galaga.render.ParticleSystem = (function (graphics) {
    'use strict';

    function render(systems) {
        // system controller
        systems.forEach(system => {
            // individual system
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
}(Galaga.graphics));