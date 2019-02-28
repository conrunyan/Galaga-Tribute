MyGame.main = (function(objects, renderer, graphics, input) {
    'use strict';

    let lastTimeStamp = performance.now();

    let myKeyboard = input.Keyboard();
    let myMouse = input.Mouse();

    let myText = objects.Text({
        text: 'This is a test',
        font: '32pt Arial',
        fillStyle: 'rgba(255, 0, 0, 1)',
        strokeStyle: 'rgba(0, 0, 0, 1)',
        position: { x: 50, y: 100 }
    });

    let myLogo = objects.Logo({
        imageSrc: 'assets/USU-Logo.png',
        center: { x: graphics.canvas.width / 2, y: graphics.canvas.height / 2 },
        size: { width: 100, height: 100 },
        moveRate: 500 / 1000    // pixels per millisecond
    });

    function processInput(elapsedTime) {
        myKeyboard.update(elapsedTime);
        myMouse.update(elapsedTime);
    }

    function update() {
        myLogo.updateRotation(Math.PI / 150);   // Uh, oh, fixed per frame!!
    }

    function render() {
        graphics.clear();

        renderer.Logo.render(myLogo);
        renderer.Text.render(myText);
    }

    function gameLoop(time) {
        let elapsedTime = time - lastTimeStamp;
        lastTimeStamp = time;

        processInput(elapsedTime);
        update();
        render();

        requestAnimationFrame(gameLoop);
    }

    myKeyboard.register('s', myLogo.moveDown);
    myKeyboard.register('w', myLogo.moveUp);
    myKeyboard.register('a', myLogo.moveLeft);
    myKeyboard.register('d', myLogo.moveRight);

    let canvas = document.getElementById('id-canvas');
    let mouseCapture = false;
    myMouse.register('mousedown', function(e, elapsedTime) {
        mouseCapture = true;
        myLogo.moveTo({ x : e.clientX - canvas.offsetLeft, y : e.clientY - canvas.offsetTop });
    });

    myMouse.register('mouseup', function(e, elapsedTime) {
        mouseCapture = false;
    });

    myMouse.register('mousemove', function(e, elapsedTime) {
        if (mouseCapture) {
            myLogo.moveTo({ x : e.clientX - canvas.offsetLeft, y : e.clientY - canvas.offsetTop });
        }
    });

    requestAnimationFrame(gameLoop);

}(MyGame.objects, MyGame.render, MyGame.graphics, MyGame.input));
