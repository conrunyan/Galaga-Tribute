Asteroids.particles.ParticleSystemController = function (spec) {
    let nextName = 1;
    // let systems = [];

    function addNewSystem(newSystem) {
        console.log('pre-systems', spec.systems);
        spec.systems.push(newSystem);
        console.log('post-systems', spec.systems);
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
