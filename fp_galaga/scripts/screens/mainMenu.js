Asteroids.screens['main-menu'] = (function (controller) {
    'use strict';

    function initialize() {
        //
        // Setup each of menu events for the screens
        document.getElementById('button-new-game').addEventListener(
            'click',
            function() {
                console.log('asteroids-board');
                controller.showScreen('asteroids-board');
            });

        document.getElementById('button-high-scores').addEventListener(
            'click',
            function() {
                console.log('high-scores');
                controller.showScreen('high-scores-screen');
            });

        document.getElementById('button-help').addEventListener(
            'click',
            function() {
                console.log('help');
                controller.showScreen('help-screen');
            });

        document.getElementById('button-about').addEventListener(
            'click',
            function() {
                console.log('about');
                controller.showScreen('about-screen');
            });
    }

    function run() {
        //
        // I know this is empty, there isn't anything to do.
    }

    return {
        initialize: initialize,
        run: run
    };
}(Asteroids.screens.Controller));
