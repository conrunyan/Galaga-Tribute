MyGame.input.Mouse = function() {
    'use strict';

    let that = {
            mouseDown : [],
            mouseUp : [],
            mouseMove : [],
            handlersDown : [],
            handlersUp : [],
            handlersMove : []
        };

    function mouseDown(e) {
        that.mouseDown.push(e);
    }

    function mouseUp(e) {
        that.mouseUp.push(e);
    }

    function mouseMove(e) {
        that.mouseMove.push(e);
    }

    that.update = function(elapsedTime) {
        //
        // Process the mouse events for each of the different kinds of handlers
        for (let event = 0; event < that.mouseDown.length; event++) {
            for (let handler = 0; handler < that.handlersDown.length; handler++) {
                that.handlersDown[handler](that.mouseDown[event], elapsedTime);
            }
        }

        for (let event = 0; event < that.mouseUp.length; event++) {
            for (let handler = 0; handler < that.handlersUp.length; handler++) {
                that.handlersUp[handler](that.mouseUp[event], elapsedTime);
            }
        }

        for (let event = 0; event < that.mouseMove.length; event++) {
            for (let handler = 0; handler < that.handlersMove.length; handler++) {
                that.handlersMove[handler](that.mouseMove[event], elapsedTime);
            }
        }

        //
        // Now that we have processed all the inputs, reset everything back to the empty state
        that.mouseDown.length = 0;
        that.mouseUp.length = 0;
        that.mouseMove.length = 0;
    };

    that.register = function(type, handler) {
        if (type === 'mousedown') {
            that.handlersDown.push(handler);
        }
        else if (type === 'mouseup') {
            that.handlersUp.push(handler);
        }
        else if (type === 'mousemove') {
            that.handlersMove.push(handler);
        }
    };

    let canvas = document.getElementById('id-canvas');
    canvas.addEventListener('mousedown', mouseDown);
    canvas.addEventListener('mouseup', mouseUp);
    canvas.addEventListener('mousemove', mouseMove);

    return that;
};
