MyGame = {
    input: {},
    components: {},
    renderer: {},
    utilities: {},
    assets: {}
};

//------------------------------------------------------------------
//
// Purpose of this code is to bootstrap (maybe I should use that as the name)
// the rest of the application.  Only this file is specified in the index.html
// file, then the code in this file gets all the other code and assets
// loaded.
//
//------------------------------------------------------------------
MyGame.loader = (function () {
    'use strict';
    let scriptOrder = [
        {
            scripts: [
                'scripts/screens/screenController.js',
                'scripts/screens/gameScreen.js',
                'scripts/screens/highscoreScreen.js',
                'scripts/screens/helpScreen.js',
                'scripts/screens/aboutScreen.js',
                'scripts/screens/mainMenu.js',
            ],
            message: 'Screens loaded',
            onComplete: null,
        }, {
            scripts: ['scripts/input/input.js'],
            message: 'Input loaded',
            onComplete: null
        }, {
            scripts: [
                'scripts/objects/player/player.js',
                'scripts/objects/projectiles/playerShot.js',
                'scripts/objects/hazards/ufoSmall.js',
                'scripts/objects/hazards/alienGrid.js',
                'scripts/objects/hazards/portal.js',
            ],
            message: 'Models loaded',
            onComplete: null,
        }, {
            scripts: [
                'scripts/utilites/random.js',
                'scripts/utilites/storage.js',
            ],
            message: 'Utilities loaded',
            onComplete: null
        }, {
            scripts: [
                'scripts/render/core.js',
                'scripts/render/renderPlayer.js',
                'scripts/render/renderBoard.js',
                'scripts/render/renderProjectile.js',
                'scripts/render/renderParticleSystem.js',
                'scripts/render/renderGameStatus.js',
                'scripts/render/renderAnimatedModel.js',
            ],
            message: 'Renderers loaded',
            onComplete: null
        },
        {
            scripts: [
                'scripts/particleSystem/particle-system.js',
                'scripts/particleSystem/particleSystemController.js',
            ],
            message: 'Particle systems loaded',
            onComplete: null,
        }, {
            scripts: [
                'scripts/game/board.js',
            ],
            message: 'Board loaded',
            onComplete: null
        }, {
            scripts: [
                'scripts/audio/audioPlayer.js',
            ],
            message: 'Audio player loaded',
            onComplete: null
        }, {
            scripts: ['scripts/game.js'],
            message: 'Gameplay model loaded',
            onComplete: null
        }],

        assetOrder = [{
            key: 'alien-bee',
            source: 'assets/bee.png'
        }, {
            key: 'alien-galflagship',
            source: 'assets/galflagship.png'
        }, {
            key: 'alien-green-yellow-alien',
            source: 'assets/green-yellow-alien.png'
        }, {
            key: 'alien-midori',
            source: 'assets/midori.png'
        }, {
            key: 'alien-momiji',
            source: 'assets/momiji.png'
        }, {
            key: 'alien-playerShip',
            source: 'assets/playerShip.png'
        }, {
            key: 'alien-red-grey-alien',
            source: 'assets/red-grey-alien.png'
        }, {
            key: 'alien-sasori',
            source: 'assets/sasori.png'
        }, {
            key: 'alien-tonbo',
            source: 'assets/tonbo.png'
        }, {
            key: 'other-firework_red1',
            source: 'assets/firework_red1.png'
        }, {
            key: 'other-firework_red2',
            source: 'assets/firework_red2.png'
        }, {
            key: 'other-firework_yellow',
            source: 'assets/firework_yellow.png'
        }, {
            key: 'other-gameBackground',
            source: 'assets/gameBackground.png'
        }, {
            key: 'other-mouse-over',
            source: 'assets/mouse-over.wav'
        }, {
            key: 'other-portal_strip4',
            source: 'assets/portal_strip4.png'
        }, {
            key: 'sound-ship-fire',
            source: 'assets/sfx/shipFireSound.mp3'
        }];

    //------------------------------------------------------------------
    //
    // Helper function used to load scripts in the order specified by the
    // 'scripts' parameter.  'scripts' expects an array of objects with
    // the following format...
    //    {
    //        scripts: [script1, script2, ...],
    //        message: 'Console message displayed after loading is complete',
    //        onComplete: function to call when loading is complete, may be null
    //    }
    //
    //------------------------------------------------------------------
    function loadScripts(scripts, onComplete) {
        //
        // When we run out of things to load, that is when we call onComplete.
        if (scripts.length > 0) {
            let entry = scripts[0];
            require(entry.scripts, function () {
                console.log(entry.message);
                if (entry.onComplete) {
                    entry.onComplete();
                }
                scripts.splice(0, 1);
                loadScripts(scripts, onComplete);
            });
        } else {
            onComplete();
        }
    }

    //------------------------------------------------------------------
    //
    // Helper function used to load assets in the order specified by the
    // 'assets' parameter.  'assets' expects an array of objects with
    // the following format...
    //    {
    //        key: 'asset-1',
    //        source: 'assets/url/asset.png'
    //    }
    //
    // onSuccess is invoked per asset as: onSuccess(key, asset)
    // onError is invoked per asset as: onError(error)
    // onComplete is invoked once per 'assets' array as: onComplete()
    //
    //------------------------------------------------------------------
    function loadAssets(assets, onSuccess, onError, onComplete) {
        //
        // When we run out of things to load, that is when we call onComplete.
        if (assets.length > 0) {
            let entry = assets[0];
            loadAsset(entry.source,
                function (asset) {
                    onSuccess(entry, asset);
                    assets.splice(0, 1);
                    loadAssets(assets, onSuccess, onError, onComplete);
                },
                function (error) {
                    onError(error);
                    assets.splice(0, 1);
                    loadAssets(assets, onSuccess, onError, onComplete);
                });
        } else {
            onComplete();
        }
    }

    //------------------------------------------------------------------
    //
    // This function is used to asynchronously load image and audio assets.
    // On success the asset is provided through the onSuccess callback.
    // Reference: http://www.html5rocks.com/en/tutorials/file/xhr2/
    //
    //------------------------------------------------------------------
    function loadAsset(source, onSuccess, onError) {
        let xhr = new XMLHttpRequest(),
            asset = null,
            fileExtension = source.substr(source.lastIndexOf('.') + 1);    // Source: http://stackoverflow.com/questions/680929/how-to-extract-extension-from-filename-string-in-javascript

        if (fileExtension) {
            xhr.open('GET', source, true);
            xhr.responseType = 'blob';

            xhr.onload = function () {
                if (xhr.status === 200) {
                    if (fileExtension === 'png' || fileExtension === 'jpg') {
                        asset = new Image();
                    } else if (fileExtension === 'mp3') {
                        asset = new Audio();
                    } else {
                        if (onError) { onError('Unknown file extension: ' + fileExtension); }
                    }
                    asset.onload = function () {
                        window.URL.revokeObjectURL(asset.src);
                    };
                    asset.src = window.URL.createObjectURL(xhr.response);
                    if (onSuccess) { onSuccess(asset); }
                } else {
                    if (onError) { onError('Failed to retrieve: ' + source); }
                }
            };
        } else {
            if (onError) { onError('Unknown file extension: ' + fileExtension); }
        }

        xhr.send();
    }

    //------------------------------------------------------------------
    //
    // Called when all the scripts are loaded, it kicks off the demo app.
    //
    //------------------------------------------------------------------
    function mainComplete() {
        console.log('it is all loaded up');
        // Galaga.main.initialize();
    }

    //
    // Start with loading the assets, then the scripts.
    console.log('Starting to dynamically load project assets');
    loadAssets(assetOrder,
        function (source, asset) {    // Store it on success
            Galaga.assets[source.key] = asset;
        },
        function (error) {
            console.log(error);
        },
        function () {
            console.log('All assets loaded');
            console.log('Starting to dynamically load project scripts');
            loadScripts(scriptOrder, mainComplete);
        }
    );

}());
