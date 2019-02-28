Asteroids.screens.Controller = (function name(screens) {

    // init main menu
    screens.MainMenu.initialize();

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

    let api = {
        showScreen: showScreen,
    };
    
    return api;
}(Asteroids.screens));