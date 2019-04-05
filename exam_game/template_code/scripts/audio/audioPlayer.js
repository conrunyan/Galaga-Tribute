//------------------------------------------------------------------
//
// This function performs the one-time game initialization.
//
//------------------------------------------------------------------
Galaga.sounds.Player = function() {
    'use strict';

    console.log('initializing...');
    initialize();

    function playSound(whichSound) {
        Galaga.sounds[whichSound].load();
        Galaga.sounds[whichSound].play();
    }

    let api = {
        playSound: playSound
    }

    return api;
}();

function initialize() {
    function loadSound(source, label, idButton) {
        let sound = new Audio();
        sound.addEventListener('canplay', function () {
            // console.log(`${source} is ready to play`);
        });
        sound.addEventListener('play', function () {
        });
        sound.addEventListener('pause', function () {
            // console.log(`${source} paused`);
        });
        sound.addEventListener('canplaythrough', function () {
            // console.log(`${source} can play through`);
        });
        sound.addEventListener('progress', function () {
            // console.log(`${source} progress in loading`);
        });
        sound.addEventListener('timeupdate', function () {
            // console.log(`${source} time update: ${this.currentTime}`);
        });
        sound.src = source;
        return sound;
    }

    function loadAudio() {
        // Reference: https://www.sounds-resource.com/nintendo_64/starfox64/sound/1442/
        Galaga.sounds['audio/player-laser-shot'] = loadSound('assets/sounds/arwing hyper laser one shot.mp3', 'Sound 1', 'id-play1');
        Galaga.sounds['audio/menu-music'] = loadSound('assets/sounds/02 Title.mp3', 'Sound 2', 'id-play2');
        Galaga.sounds['audio/game-music'] = loadSound('assets/sounds/11 Meteo.mp3', 'Sound 3', 'id-play1');
        Galaga.sounds['audio/menu-mouse-over'] = loadSound('assets/mouse-over.wav');
    }

    loadAudio();
}

//------------------------------------------------------------------
//
// Pauses the specified audio
//
//------------------------------------------------------------------
function pauseSound(whichSound, label, idButton, idStatus) {
    Galaga.sounds[whichSound].pause();

    let elementStatus = document.getElementById(idStatus);
    elementStatus.innerHTML = 'paused';

    let elementButton = document.getElementById(idButton);
    elementButton.innerHTML = `${label} - Continue!`;
    elementButton.onclick = function () { playSound(whichSound, label, idButton, idStatus); };
}

//------------------------------------------------------------------
//
// Plays the specified audio
//
//------------------------------------------------------------------
function playSound(whichSound) {
    Galaga.sounds[whichSound].play();
}

//------------------------------------------------------------------
//
// Allow the music volume to be changed
//
//------------------------------------------------------------------
function changeVolume(value) {
    Galaga.sounds['audio/bensound-extremeaction'].volume = value / 100;
}
