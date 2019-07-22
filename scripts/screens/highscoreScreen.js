Galaga.screens['high-scores-screen'] = (function (controller, game) {
    'use strict';

    function initialize() {
        document.getElementById('button-score-back-menu').addEventListener(
            'click',
            () => { goHome(); });
    }

    function goHome() {
        // Stop menu screen music, if playing
        if (Galaga.sounds['audio/menu-end-game-music'].currentTime !== 0) {
            Galaga.sounds['audio/menu-end-game-music'].load();
        }

        controller.showScreen('main-menu')
    }

    function run() {
        console.log('on the highscore screen');
    }

    return {
        initialize: initialize,
        run: run
    };
}(Galaga.screens.Controller, Galaga.game));
