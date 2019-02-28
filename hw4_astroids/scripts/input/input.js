Asteroids.input.Keyboard = function () {
    let that = {
        keys: {},
        handlers: {},
        prevMoves: [],
    };

    function keyPress(e) {
        that.keys[e.key] = e.key;
    }

    function keyRelease(e) {
        delete that.keys[e.key];
    }

    that.update = function (elapsedTime) {
        // console.log(that.keys)
        for (let key in that.keys) {
            if (that.keys.hasOwnProperty(key)) {
                if (this.handlers[key]) {
                    that.handlers[key](elapsedTime);
                }
            }
        }
    };

    that.register = function (key, handler) {
        that.handlers[key] = handler;
    };

    window.addEventListener('keydown', keyPress);
    window.addEventListener('keyup', keyRelease);

    return that;
};
