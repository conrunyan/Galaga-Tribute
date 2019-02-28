MyGame.main = (function(graphics) {
    'use strict';

    let rotation = 0;
    let lastTimeStamp = performance.now();
    let elapsedTime = 0;

    let specTexture = {
        imageSrc: 'assets/USU-Logo.png',
        center: { x: graphics.canvas.width / 2, y: graphics.canvas.height / 2 },
        width: 100,
        height: 100,
        rotation: 0,
        moveRate: 500 / 1000    // pixels per second
    };
    let myTexture = graphics.Texture(specTexture);

    function onKeyDown(e) {
        if (e.keyCode === KeyEvent.DOM_VK_A) {
            specTexture.center.x -= (specTexture.moveRate * elapsedTime);
        }
        else if (e.keyCode === KeyEvent.DOM_VK_D) {
            specTexture.center.x += (specTexture.moveRate * elapsedTime);
        }
    }

    function update() {
        rotation += Math.PI / 150;
        //myTexture.updateRotation(Math.PI / 40);
    }

    function drawRectangle() {
        graphics.context.save();

        graphics.context.strokeStyle = 'rgba(0, 0, 255, 1)';
        graphics.context.lineWidth = 3;
        graphics.context.shadowColor = 'rgba(255, 0, 0, 1)';
        graphics.context.shadowBlur = 10;
        graphics.context.strokeRect(
            graphics.canvas.width / 4 + 0.5, graphics.canvas.height / 4 + 0.5,
            graphics.canvas.width / 2, graphics.canvas.height / 2);

        graphics.context.restore();
    }

    function drawTriangle() {
        graphics.context.save();

        graphics.context.beginPath();

        graphics.context.moveTo(graphics.canvas.width / 2, graphics.canvas.width / 4);
        graphics.context.lineTo(
            graphics.canvas.width / 2 + graphics.canvas.width / 4,
            graphics.canvas.height / 2 + graphics.canvas.height / 4);
        graphics.context.lineTo(
            graphics.canvas.width / 2 - graphics.canvas.width / 4,
            graphics.canvas.height / 2 + graphics.canvas.height / 4);

        graphics.context.closePath();

        graphics.context.fillStyle = 'rgba(0, 0, 255, 1)';
        graphics.context.fill();

        graphics.context.strokeStyle = 'rgba(0, 0, 0, 1)';
        graphics.context.lineWidth = 1;
        graphics.context.stroke();

        graphics.context.restore();
    }

    function render() {
        graphics.clear();

        // graphics.context.save();
        // graphics.context.translate(graphics.canvas.width / 2, graphics.canvas.height / 2);
        // graphics.context.rotate(rotation);
        // graphics.context.translate(-(graphics.canvas.width /2), -(graphics.canvas.height / 2));

        // drawRectangle();
        // graphics.context.restore();

        // drawTriangle();

        myTexture.draw();
    }

    function gameLoop(time) {
        elapsedTime = time - lastTimeStamp;
        lastTimeStamp = time;
        update();
        render();

        requestAnimationFrame(gameLoop);
    }

    window.addEventListener('keydown', onKeyDown);
    requestAnimationFrame(gameLoop);

}(MyGame.graphics));
