Galaga.utils.Storage = function () {
    'use strict';
    // let previousScores = localStorage.getItem('MyGame.highScores');

    // if (previousScores !== null) {
    //     highScores = JSON.parse(previousScores);
    // }

    function saveStorage(highScores) {
        localStorage['Galaga.highScores'] = JSON.stringify(highScores);
    }


    return {
        saveStorage: saveStorage,
    };
}();