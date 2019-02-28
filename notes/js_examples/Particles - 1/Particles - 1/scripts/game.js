//------------------------------------------------------------------
//
// This provides the "game" code.
//
//------------------------------------------------------------------
MyGame.main = (function (systems, renderer, graphics) {
    'use strict';

    console.log('game initializing...');

    let lastTimeStamp = performance.now();
    let particlesFire = systems.ParticleSystem({
        center: { x: 300, y: 300 },
        size: { mean: 15, stdev: 5 },
        speed: { mean: 65, stdev: 35 },
        lifetime: { mean: 4, stdev: 1}
    });
    let particlesSmoke = systems.ParticleSystem({
        center: { x: 300, y: 300 },
        size: { mean: 12, stdev: 3 },
        speed: { mean: 65, stdev: 35 },
        lifetime: { mean: 4, stdev: 1}
    });
    let fireRenderer = renderer.ParticleSystem(particlesFire, graphics, 
        'assets/fire.png');
    let smokeRenderer = renderer.ParticleSystem(particlesSmoke, graphics, 
        'assets/smoke-2.png');

    //------------------------------------------------------------------
    //
    // Update the particles
    //
    //------------------------------------------------------------------
    function update(elapsedTime) {
        particlesFire.update(elapsedTime);
        particlesSmoke.update(elapsedTime);
    }

    //------------------------------------------------------------------
    //
    // Render the particles
    //
    //------------------------------------------------------------------
    function render() {
        graphics.clear();
        smokeRenderer.render();
        fireRenderer.render();
    }

    //------------------------------------------------------------------
    //
    // This is the Game Loop function!
    //
    //------------------------------------------------------------------
    function gameLoop(time) {
        let elapsedTime = (time - lastTimeStamp);

        update(elapsedTime);
        lastTimeStamp = time;

        render();

        requestAnimationFrame(gameLoop);
    };

    requestAnimationFrame(gameLoop);
}(MyGame.systems, MyGame.render, MyGame.graphics));
