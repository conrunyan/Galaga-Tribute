Asteroids.screens['asteroids-board'] = (function (game) {
    'use strict';

    function initialize() {
        // document.getElementById('button-help-back-menu').addEventListener(
        //     'click',
        //     function () { controller.showScreen('main-menu'); });
        console.log('initializing game screen');
    }

    function run() {
        console.log('on the game screen');
        // let myGame = game.Main();
        // myGame.init();
    }

    return {
        initialize: initialize,
        run: run
    };
}(Asteroids));
