MazeGame.input.Keyboard = function () {
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
        let idx = that.prevMoves.indexOf(e.key);
        that.prevMoves.splice(idx, 1);
    }

    that.update = function (elapsedTime) {
        // console.log(that.keys)
        for (let key in that.keys) {
            if (that.keys.hasOwnProperty(key)) {
                if (that.handlers[key] && !that.prevMoves.includes(key)) {
                    that.prevMoves.push(key);
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
