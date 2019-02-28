MyGame.render.ParticleSystem = function (system, graphics, imageSrc) {
    let image = new Image();
    let isReady = false;

    image.onload = () => {
        isReady = true;
    };
    image.src = imageSrc;

    function render() {
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