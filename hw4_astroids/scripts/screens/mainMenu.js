Asteroids.screens.MainMenu = (function (screens) {
    'use strict';

    function initialize() {
        //
        // Setup each of menu events for the screens
        document.getElementById('new-game').addEventListener(
            'click',
            function() {
                console.log('asteroids-board');
                _showScreen('asteroids-board');
            });

        document.getElementById('high-scores').addEventListener(
            'click',
            function() {
                console.log('high-scores');
                _showScreen('high-scores-screen');
            });

        document.getElementById('help').addEventListener(
            'click',
            function() {
                console.log('help');
                _showScreen('help-screen');
            });

        document.getElementById('about').addEventListener(
            'click',
            function() {
                console.log('about');
                _showScreen('about-screen');
            });
    }

    function _showScreen(id) {
        // Remove the active state from all screens.
        let active = document.getElementsByClassName('active');
        for (let screen = 0; screen < active.length; screen++) {
            active[screen].classList.remove('active');
        }
        // Tell the screen to start actively running
        screens[id].run();
        // Then, set the new screen to be active
        document.getElementById(id).classList.add('active');
    }

    function run() {
        //
        // I know this is empty, there isn't anything to do.
    }

    return {
        initialize: initialize,
        run: run
    };
}(Asteroids.screens));
