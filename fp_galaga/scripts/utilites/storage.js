Asteroids.utils.Storage = function () {
    'use strict';
    // let previousScores = localStorage.getItem('MyGame.highScores');

    // if (previousScores !== null) {
    //     highScores = JSON.parse(previousScores);
    // }

    function saveStorage(highScores) {
        localStorage['Asteroids.highScores'] = JSON.stringify(highScores);
    }


    return {
        saveStorage: saveStorage,
    };
}();