//------------------------------------------------------------------
//
// This function performs the one-time game initialization.
//
//------------------------------------------------------------------
Asteroids.game.sounds.initialize = () {
    'use strict';

    function loadSound(source, label, idButton) {
        let sound = new Audio();
        sound.addEventListener('canplay', function () {
            console.log(`${source} is ready to play`);
        });
        sound.addEventListener('play', function () {
            let elementButton = document.getElementById(idButton);
            elementButton.innerHTML = label + ' - Pause!'
            console.log(`${source} started playing`);
        });
        sound.addEventListener('pause', function () {
            console.log(`${source} paused`);
        });
        sound.addEventListener('canplaythrough', function () {
            console.log(`${source} can play through`);
        });
        sound.addEventListener('progress', function () {
            console.log(`${source} progress in loading`);
        });
        sound.addEventListener('timeupdate', function () {
            console.log(`${source} time update: ${this.currentTime}`);
        });
        sound.src = source;
        return sound;
    }

    function loadAudio() {
        Asteroids.sounds = {}
        // Reference: https://www.sounds-resource.com/nintendo_64/starfox64/sound/1442/
        Asteroids.sounds['audio/player-laser-shot'] = loadSound('assets/sounds/arwing hyper laser one shot.mp3', 'Sound 1', 'id-play1');
    }

    console.log('initializing...');

    loadAudio();
}

//------------------------------------------------------------------
//
// Pauses the specified audio
//
//------------------------------------------------------------------
function pauseSound(whichSound, label, idButton, idStatus) {
    Asteroids.sounds[whichSound].pause();

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
    Asteroids.sounds[whichSound].play();
}

//------------------------------------------------------------------
//
// Allow the music volume to be changed
//
//------------------------------------------------------------------
function changeVolume(value) {
    Asteroids.sounds['audio/bensound-extremeaction'].volume = value / 100;
}
