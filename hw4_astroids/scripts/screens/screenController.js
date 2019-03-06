Asteroids.screens.Controller = (function name(screens) {

    function showScreen(id) {
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

    // initialize other screens
    function initScreens() {
        for (screen in screens) {
            if (screens.hasOwnProperty(screen) && screen !== 'Controller') {
                screens[screen].initialize();
            }
        }
    }

    let api = {
        showScreen: showScreen,
        initScreens: initScreens,
    };

    return api;
}(Asteroids.screens));