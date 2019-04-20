Galaga.screens['main-menu'] = (function (controller, audio) {
    'use strict';

    function initialize() {
        //
        // Setup each of menu events for the screens
        document.getElementById('button-new-game').addEventListener(
            'click',
            function () {
                console.log('galaga-board');
                controller.showScreen('galaga-board', 'normal');
            });
        document.getElementById('button-new-game').addEventListener(
            'mouseover',
            function () {
                // console.log('help sound');
                playMouseOverSound();
            });

        document.getElementById('button-high-scores').addEventListener(
            'click',
            function () {
                console.log('high-scores');
                controller.showScreen('high-scores-screen');
            });
        document.getElementById('button-high-scores').addEventListener(
            'mouseover',
            function () {
                // console.log('help sound');
                playMouseOverSound();
            });

        // help
        document.getElementById('button-help').addEventListener(
            'click',
            function () {
                console.log('config');
                controller.showScreen('help-screen');
            });
        document.getElementById('button-help').addEventListener(
            'mouseover',
            function () {
                // console.log('help sound');
                playMouseOverSound();
            });

        document.getElementById('button-about').addEventListener(
            'click',
            function () {
                console.log('about');
                controller.showScreen('about-screen');
            });
        document.getElementById('button-about').addEventListener(
            'mouseover',
            function () {
                // console.log('help sound');
                playMouseOverSound();
            });


        document.getElementById('button-insert-coin').addEventListener(
            'click',
            function () {
                // console.log('help sound');
                insertCoin();
            });
    }

    function run() {
        //
        // I know this is empty, there isn't anything to do.
    }

    function playMouseOverSound() {
        audio.playSound('audio/menu-mouse-over');
    }

    function insertCoin() {
        audio.playSound('audio/menu-insert-coin');
        document.getElementById('button-new-game').disabled = false;
        document.getElementById('text-insert-coin').style.display = 'none';
    }

    return {
        initialize: initialize,
        run: run
    };
}(Galaga.screens.Controller, Galaga.sounds.Player));
