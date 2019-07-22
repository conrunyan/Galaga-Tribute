Galaga.utils.Storage = function () {
    'use strict';
    // let previousScores = localStorage.getItem('MyGame.highScores');

    // if (previousScores !== null) {
    //     highScores = JSON.parse(previousScores);
    // }

    function saveStorage(highScores) {
        localStorage['Galaga.highScores'] = JSON.stringify(highScores);
    }

    function saveMapping(mapping) {
        localStorage['Galaga.keymaps'] = JSON.stringify(mapping);
    }


    return {
        saveStorage: saveStorage,
        saveMapping: saveMapping,
    };
}();