Galaga.particles.ParticleSystem = function (spec, Random) {
    let nextName = 1;
    let particles = {};
    let timeAliveSoFar = 0;

    let image = new Image();
    let isReady = false;

    image.onload = () => {
        isReady = true;
    };
    image.src = spec.imageSrc;

    function create() {
        let size = Random.nextGaussian(spec.size.mean, spec.size.stdev);
        let p = {
            center: { x: spec.center.x, y: spec.center.y },
            size: { width: size, height: size },
            direction: Random.nextCircleVector(),
            speed: Random.nextGaussian(spec.speed.mean, spec.speed.stdev), // pixels per second
            rotation: 0,
            lifetime: Random.nextGaussian(spec.lifetime.mean, spec.lifetime.stdev), // seconds
            alive: 0
        };

        return p;
    }

    function update(elapsedTime) {
        let removeMe = [];

        elapsedTime = elapsedTime / 1000;

        for (let particle = 0; particle < spec.density; particle++) {
            particles[nextName++] = create();
        }

        Object.getOwnPropertyNames(particles).forEach(value => {
            let particle = particles[value];

            particle.alive += elapsedTime;
            particle.center.x += (elapsedTime * particle.speed * particle.direction.x);
            particle.center.y += (elapsedTime * particle.speed * particle.direction.y);

            particle.rotation += particle.speed / 500;

            if (particle.alive > particle.lifetime) {
                removeMe.push(value);
            }
        });

        for (let particle = 0; particle < removeMe.length; particle++) {
            delete particles[removeMe[particle]];
        }

        timeAliveSoFar += elapsedTime;
    }

    let api = {
        get particles() { return particles; },
        get image() { return image; },
        get isReady() { return isReady },
        get timeLeft() { return spec.totalLife - timeAliveSoFar },
        update: update,
    };

    return api;
};
