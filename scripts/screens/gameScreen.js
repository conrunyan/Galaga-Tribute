Galaga.screens['galaga-board'] = (function (controller, sounds) {
    'use strict';

    function initialize() {
        // document.getElementById('button-help-back-menu').addEventListener(
        //     'click',
        //     function () { controller.showScreen('main-menu'); });
        console.log('initializing game screen');
    }

    function run(gameType) {
        Galaga.main.initGame(gameType);
    }

    return {
        initialize: initialize,
        run: run,
    };
}(Galaga.screens.Controller, Galaga.sounds.Player));
