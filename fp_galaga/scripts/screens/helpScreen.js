Galaga.screens['help-screen'] = (function (controller) {
    'use strict';

    function initialize() {
        document.getElementById('button-help-back-menu').addEventListener(
            'click',
            function () {
                controller.showScreen('main-menu');
            });

        document.getElementById('button-move-left').addEventListener(
            'click',
            function () {
                controller.keyboard.mapNewKey('left', 'button-move-left');
            });

        document.getElementById('button-move-right').addEventListener(
            'click',
            function () {
                controller.keyboard.mapNewKey('right', 'button-move-right');
            });

        document.getElementById('button-shoot').addEventListener(
            'click',
            function () {
                controller.keyboard.mapNewKey('shoot', 'button-shoot');
            });
    }

    function run() {
        console.log('on the help screen');
    }

    return {
        initialize: initialize,
        run: run
    };
}(Galaga.screens.Controller));
