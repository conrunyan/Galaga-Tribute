Asteroids.particles.ParticleSystemController = function (spec) {

    function addNewSystem(newSystem) {
        spec.systems.push(newSystem);
    }



    function update(elapsedTime) {
        spec.systems.forEach(system => {
            system.update(elapsedTime);
        })

        // Determine when a system needs to be removed
        spec.systems = spec.systems.filter(system => system.timeLeft >= 0);
    }

    let api = {
        get systems() { return spec.systems; },
        update: update,
        addNewSystem: addNewSystem,
    };

    return api;
};
