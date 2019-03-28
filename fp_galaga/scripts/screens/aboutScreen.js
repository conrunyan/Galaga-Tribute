Galaga.screens['about-screen'] = (function (controller) {
    'use strict';

    function initialize() {
        document.getElementById('button-about-back-menu').addEventListener(
            'click',
            function () { controller.showScreen('main-menu'); });
    }

    function run() {
        console.log('on the about screen');
    }

    return {
        initialize: initialize,
        run: run
    };
}(Galaga.screens.Controller));
