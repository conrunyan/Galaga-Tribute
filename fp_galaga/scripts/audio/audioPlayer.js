//------------------------------------------------------------------
//
// This function performs the one-time game initialization.
//
//------------------------------------------------------------------
Galaga.sounds.Player = function () {
    'use strict';

    console.log('initializing...');
    initialize();

    function playSound(whichSound) {
        // Galaga.sounds[whichSound].load();
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
        Galaga.sounds['audio/player-laser-shot'] = loadSound('assets/sfx/shipFireSound.mp3', 'Sound 1', 'id-play1');
        Galaga.sounds['audio/start-game-music'] = loadSound('assets/music/01 Stage Intro.mp3', 'Game start music', 'id-play-start-music');
        Galaga.sounds['audio/menu-mouse-over'] = loadSound('assets/mouse-over.mp3');
        // Galaga.sounds['audio/player-1UP'] = loadSound('assets/sfx/08 1-Up.mp3');
        Galaga.sounds['audio/player-explode'] = loadSound('assets/sfx/09 Die-Start Up Sound.mp3');
        Galaga.sounds['audio/alien-die'] = loadSound('assets/sfx/alien-die.mp3');
        Galaga.sounds['audio/alien-dive'] = loadSound('assets/sfx/alien-dive.mp3');
        Galaga.sounds['audio/menu-end-game-music'] = loadSound('assets/music/11 Name Entry.mp3');
        Galaga.sounds['audio/menu-insert-coin'] = loadSound('assets/sfx/10 Coin.mp3');
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
