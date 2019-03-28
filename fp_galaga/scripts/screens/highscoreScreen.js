Asteroids.screens['high-scores-screen'] = (function (controller, game) {
    'use strict';

    function initialize() {
        document.getElementById('button-score-back-menu').addEventListener(
            'click',
            function () { controller.showScreen('main-menu'); });
    }

    function run() {
        console.log('on the highscore screen');
    }

    return {
        initialize: initialize,
        run: run
    };
}(Asteroids.screens.Controller, Asteroids.game));
