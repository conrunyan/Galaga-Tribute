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
        resetFunc: null,
        keysToBind: {'left': '', 'right': '', 'shoot': ''},
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
            updateHTML(that.elemToUpdate, e.key);
            saveKeyMapToLocal();
        }
    }

    function updateHTML(id, key) {
        if (key === ' ') {
            key = 'space';
        }
        document.getElementById(id).innerHTML = `${key.toUpperCase()}`;
        // hide key enter message
        document.getElementById('remap-message').style.display = 'none';
    }

    function saveKeyMapToLocal() {
        Galaga.utils.Storage.saveMapping(that.keysToBind);
    }

    function loadKeyMaps() {
        let mapping = localStorage.getItem('Galaga.keymaps');
        if (mapping !== null) {
            mapping = JSON.parse(mapping);
            that.keysToBind = mapping;
        }
    }

    that.mapNewKey = function (method, htmlId) {
        that.methodToRemap = method;
        that.elemToUpdate = htmlId;
        document.getElementById('remap-message').style.display = 'block';
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

    that.register = function (key, handler, name) {
        that.handlers[key] = handler;
        that.functions[name] = handler;
    };

    that.setResetFunc = function (resetFunc) {
        that.resetFunc = resetFunc;
    }
    
    loadKeyMaps();
    window.addEventListener('keydown', keyPress);
    window.addEventListener('keyup', keyRelease);
    window.addEventListener('mousedown', that.resetFunc);
    window.addEventListener('mouseup', that.resetFunc);
    window.addEventListener('mousemove', that.resetFunc);
// 
    return that;
};
