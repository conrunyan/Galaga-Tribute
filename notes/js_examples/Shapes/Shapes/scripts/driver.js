let canvas = document.getElementById('id-canvas');
let context = canvas.getContext('2d');
let rotation = 0;

function update() {
    rotation += Math.PI / 150;
}

function drawRectangle() {
    context.save();

    context.strokeStyle = 'rgba(0, 0, 255, 1)';
    context.lineWidth = 3;
    context.shadowColor = 'rgba(255, 0, 0, 1)';
    context.shadowBlur = 10;
    context.strokeRect(
        canvas.width / 4 + 0.5, canvas.height / 4 + 0.5,
        canvas.width / 2, canvas.height / 2);

    context.restore();
}

function drawTriangle() {
    context.save();

    context.beginPath();

    context.moveTo(canvas.width / 2, canvas.width / 4);
    context.lineTo(
        canvas.width / 2 + canvas.width / 4,
        canvas.height / 2 + canvas.height / 4);
    context.lineTo(
        canvas.width / 2 - canvas.width / 4,
        canvas.height / 2 + canvas.height / 4);

    context.closePath();

    context.fillStyle = 'rgba(0, 0, 255, 1)';
    context.fill();

    context.strokeStyle = 'rgba(0, 0, 0, 1)';
    context.lineWidth = 1;
    context.stroke();

    context.restore();
}

function render() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.save();
    context.translate(canvas.width / 2, canvas.height / 2);
    context.rotate(rotation);
    context.translate(-(canvas.width /2), -(canvas.height / 2));

    drawRectangle();
    context.restore();

    drawTriangle();
}

function gameLoop() {
    update();
    render();

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
