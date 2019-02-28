// --------------------------------------------------------------
//
// Renders a Logo object.
//
// spec = {
//    image: ,
//    center: { x: , y: },
//    size: { width: , height: }
// }
//
// --------------------------------------------------------------
MyGame.render.Logo = (function(graphics) {
    'use strict';

    function render(spec) {
        if (spec.imageReady) {
            graphics.drawTexture(spec.image, spec.center, spec.rotation, spec.size);
        }
    }

    return {
        render: render
    };
}(MyGame.graphics));
