MyGame.graphics = (function() {
    'use strict';

    let canvas = document.getElementById('id-canvas');
    let context = canvas.getContext('2d');

    function clear() {
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    function Texture(spec) {
        let ready = false;
        let image = new Image();

        image.onload = function() {
            ready = true;
        };
        image.src = spec.imageSrc;

        function draw() {
            if (ready) {
                context.save();

                context.translate(spec.center.x, spec.center.y);
                context.rotate(spec.rotation);
                context.translate(-spec.center.x, -spec.center.y);

                context.drawImage(
                    image,
                    spec.center.x - spec.width / 2,
                    spec.center.y - spec.height / 2,
                    spec.width, spec.height);

                context.restore();
            }
        }

        function updateRotation(howMuch) {
            spec.rotation += howMuch;
        }

        return {
            draw: draw,
            updateRotation: updateRotation
        };
    }

    let api = {
        clear: clear,
        Texture: Texture
    };

    Object.defineProperty(api, 'context', {
        value: context,
        writable: false,
        enumerable: true,
        configurable: false
    });

    Object.defineProperty(api, 'canvas', {
        value: canvas,
        writable: false,
        enumerable: true,
        configurable: false
    });

    return api;
}());
