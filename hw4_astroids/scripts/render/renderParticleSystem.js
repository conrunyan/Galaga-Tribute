Asteroids.render.ParticleSystem = function (systems, graphics, imageSrc) {
    let image = new Image();
    let isReady = false;

    image.onload = () => {
        isReady = true;
    };
    image.src = imageSrc;

    function render() {
        // Object.getOwnPropertyNames(systems) {

        // }
        if (isReady) {
            Object.getOwnPropertyNames(system.particles).forEach(function (value) {
                let particle = system.particles[value];
                graphics.drawTexture(image, particle.center, particle.rotation, particle.size);
            });
        }
    }

    let api = {
        render: render
    };

    return api;
};