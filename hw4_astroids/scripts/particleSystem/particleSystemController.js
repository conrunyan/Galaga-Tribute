Asteroids.particles.ParticleSystemController = function () {
    let nextName = 1;
    let systems = {};

    function addNewSystem(spec) {
        console.log('pre-systems', systems);
        systems[spec] = spec;
        console.log('post-systems', systems);
    }



    function update(elapsedTime) {
        Object.getOwnPropertyNames(systems).forEach(system => {
            systems[system].update(elapsedTime);
        });

        // TODO: Determine when a system needs to be removed
        Object.getOwnPropertyNames(systems).forEach(system => {
            if (systems[system].timeLeft <= 0) {
                delete systems[system]
            }
        });
    }

    let api = {
        get systems() { return systems; },
        update: update,
        addNewSystem: addNewSystem,
    };

    return api;
};
