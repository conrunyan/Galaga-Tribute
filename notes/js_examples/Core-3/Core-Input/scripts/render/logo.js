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

    //drawTexture(image, center, rotation, size)

    function render(spec) {
        if (spec.imageReady) {
            graphics.drawTexture(spec.image, spec.center, spec.rotation, spec.size);
        }
    }

    return {
        render: render
    };
}(MyGame.graphics));
