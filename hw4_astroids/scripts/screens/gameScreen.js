Asteroids.screens['asteroids-board'] = (function (controller, sounds) {
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
        let menuSound = document.getElementById('menu-theme');
        sounds.playSound('audio/game-music')
        controller.gameInitFunc();
    }

    return {
        initialize: initialize,
        run: run,
    };
}(Asteroids.screens.Controller, Asteroids.sounds.Player));
