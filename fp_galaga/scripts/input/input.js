Galaga.input.Keyboard = function () {
    let that = {
        keys: {},
        pressing: false,
        lastPressed: null,
        methodToRemap: null,
        elemToUpdate: null,
        handlers: {},
        prevMoves: [],
        functions: {},
        keysToBind: {},
    };

    function keyPress(e) {
        that.pressing = true;
        that.lastPressed = e.key;
        setKeyMap(e);
        e.preventDefault();
        that.keys[e.key] = e.key;
    }

    function keyRelease(e) {
        that.pressing = false;
        that.methodToRemap = null;
        that.elemToUpdate = null
        e.preventDefault();
        delete that.keys[e.key];
    }

    function setKeyMap(e) {
        if (that.methodToRemap !== null) {
            that.keysToBind[that.methodToRemap] = e.key;
            console.log('keys', that.keysToBind);
            updateHTML(that.elemToUpdate, e.key);
            saveKeyMapToLocal();
        }
    }

    function updateHTML(id, key) {
        if (key === ' ') {
            key = 'space';
        }
        document.getElementById(id).innerHTML = `${key.toUpperCase()}`;
    }

    that.mapNewKey = function (method, htmlId) {
        that.methodToRemap = method;
        that.elemToUpdate = htmlId;
    }

    that.update = function (elapsedTime) {
        // console.log(that.keys)
        console.log('last: ', that.lastPressed);
        for (let key in that.keys) {
            if (that.keys.hasOwnProperty(key)) {
                if (this.handlers[key]) {
                    that.handlers[key](elapsedTime);
                }
            }
        }
    };

    that.register = function (key, handler, name) {
        that.handlers[key] = handler;
        that.functions[name] = handler;
    };

    window.addEventListener('keydown', keyPress);
    window.addEventListener('keyup', keyRelease);

    return that;
};
