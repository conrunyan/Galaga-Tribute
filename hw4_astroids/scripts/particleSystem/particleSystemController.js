Asteroids.particles.ParticleSystemController = function () {
    let nextName = 1;
    let systems = {};

    function addNewSystem(spec) {
        systems[spec] = {};
    }



    function update(elapsedTime) {
        Object.getOwnPropertyNames(systems).forEach(system => {
            system.update(elapsedTime);
        });

        // TODO: Determine when a system needs to be removed
    }

    let api = {
        get systems() { return systems; },
        update: update,
        addNewSystem: addNewSystem,
    };

    return api;
};
