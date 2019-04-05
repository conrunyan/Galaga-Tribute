Galaga.screens['help-screen'] = (function (controller) {
    'use strict';

    function initialize() {
        document.getElementById('button-help-back-menu').addEventListener(
            'click',
            function () { controller.showScreen('main-menu'); });
    }

    function run() {
        console.log('on the help screen');
    }

    return {
        initialize: initialize,
        run: run
    };
}(Galaga.screens.Controller));
