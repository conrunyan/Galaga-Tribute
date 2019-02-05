// Code for the snake game engine
let firstLoop = true;
let snakeCanMove = false; // only move the after the first direction key has been pressed
let gameOver = false;
let prevBrowserTime = performance.now();
let scores = []; // list of scores to be kept track of
let currentScore = 0;
let boardPieces = [];
let snakePieces = [];
let foodPiece = {x: 0, y: 0};
let nextDirection = '';
let canvas = document.getElementById('id-canvas');
let context = canvas.getContext('2d');
let KeyEventCodes = {
    DOM_VK_LEFT: 37,
    DOM_VK_RIGHT: 39,
    DOM_VK_DOWN: 40,
    DOM_VK_UP: 38,
};

// Game Constants
let BOARD_SNAKE_SPEED = 100;  // ms per square
let BOARD_WIDTH = 500;
let BOARD_HEIGHT = 500;
let BOARD_CELL_COUNT = 50; // really the number is BOARD_CELLS^2
let SNAKE_PIECES_TO_ADD = 3;
let BOARD_CELL_SIZE = BOARD_WIDTH / BOARD_CELL_COUNT;
let BOARD_BACKGROUND_COLOR = 'rgba(125, 125, 125, .5)';
let BOARD_WALL_COLOR = 'rgba(50, 30, 255, .5)';
let BOARD_SNAKE_COLOR = 'rgba(0, 255, 0, 1)';
let BOARD_FOOD_COLOR = 'rgba(255, 0, 0, .5)';
let BOARD_BLOCK_BORDER = 'rgba(0, 0, 0, 1)';
let BOARD_OBSTACLE_COLOR = 'rgba(0, 255, 255, 1)';


makeGameBoard();
window.addEventListener('keydown', onKeyDown);
// for (let i = 0; i < boardPieces.length; i++) {
//     for (let j = 0; j < boardPieces[i].length; j++) {
//         console.log(i + ' : ' + j);
//         boardPieces[i][j].info();
//     }
// }
// render();
// nextDirection = 'down'
// snakeCanMove = true;
// update();
// render();
gameLoop();



function gameLoop(browserTime) {
    // Get elapsed time
    let elapsedTime = performance.now();
    if (!firstLoop) {
        elapsedTime = Math.floor(browserTime - prevBrowserTime);
        prevBrowserTime = browserTime;
    }
    update(elapsedTime);
    render();
    firstLoop = false;
    if (gameOver) {
        // window.alert('GAME OVER')
        // TODO: Add stuff to be cleared/saved at the end of a game
        console.log('GAME OVER!');
        console.log('printing snake sate...')
        snakePieces.forEach((piece) => {
            piece.info();
        })
        return;
    }
    requestAnimationFrame(gameLoop);
}

function update(elapsedTime) {
    if (snakeCanMove) {
        // update head and snake pieces
        let tmpHead = snakePieces[0];
        snakePieces[0].changeDirection(nextDirection);
        snakePieces[0].updateElapsedTime(elapsedTime);
        let snakeDidMove = snakePieces[0].moveSnakeFoward();
        snakePieces[0].shouldSnakeRender();

        let snakeHeadX_idx = snakePieces[0].getXYCoords().x / BOARD_CELL_SIZE;
        let snakeHeadY_idx = snakePieces[0].getXYCoords().y / BOARD_CELL_SIZE;
        let curSnakeHeadX = snakePieces[0].getXYCoords().x;
        let curSnakeHeadY = snakePieces[0].getXYCoords().y;
        let pieceHeadIsOn = boardPieces[snakeHeadY_idx][snakeHeadX_idx];
        // check if current block is a food piece
        if (pieceHeadIsOn.type === 'food') {

            // increment score
            currentScore += SNAKE_PIECES_TO_ADD;
            // add new pieces to the snake
            for (let i = 0; i < SNAKE_PIECES_TO_ADD; i++) {
                makeSnakeBody();
            }
            // move food

            placeFood();
        }
        // loop over snake pieces and move then if needed
        let nextBodyX = curSnakeHeadX;
        let nextBodyY = curSnakeHeadY;
        if (snakeDidMove) {
            // for (let i = 1; i < snakePieces.length; i++) {
            //     let curBodyX = snakePieces[i].getXYCoords().x;
            //     let curBodyY = snakePieces[i].getXYCoords().y;
            //     // move current body position, then set nextBody positions to current
                
            //         snakePieces[i].moveSnakeBodyPiece({x: nextBodyX, y: nextBodyY});
            //         nextBodyX = curBodyX;
            //         nextBodyY = curBodyY;
            // }
            // Lose conditions.
            if (!(pieceHeadIsOn.type === 'background') && !(pieceHeadIsOn.type === 'snake-head') && !(pieceHeadIsOn.type === 'food')) {
                gameOver = true;
            }
            // check if head has hit any part of its tail
            for (let i = 1; i < snakePieces.length; i++) {
                // snakePieces[i].info()
                // console.log('CX: ' + curSnakeHeadX + ' CY: ' + curSnakeHeadY);
                if (curSnakeHeadX === snakePieces[i].getXYCoords().x && curSnakeHeadY === snakePieces[i].getXYCoords().y) {
                    gameOver = true;
                }
            }
        }
    }
    // TODO: Add step to move the snake
    // TODO: Add step to move food, if needed
}

function render() {
    // clear board
    context.clearRect(0, 0, canvas.width, canvas.height);
    // render game board
    for (let i = 0; i < boardPieces.length; i++) {
        for (let j = 0; j < boardPieces[i].length; j++) {
            boardPieces[i][j].drawGamePiece();
        }
    }
    for (let i = 0; i < snakePieces.length; i++) {
        if (snakePieces[i].render) {
            snakePieces[i].drawGamePiece();
        }
        // snakePieces[i].info()
    }

    let domScore = document.getElementById('id-highscore')

    domScore.innerHTML 
}
////////////////////////////////////////////////////////////////////////////////
function onKeyDown(e) {
    snakeCanMove = true;
    
    if (e.keyCode === KeyEventCodes.DOM_VK_LEFT) {
        console.log('Pressing: A');
        nextDirection = 'left';
    }
    else if (e.keyCode === KeyEventCodes.DOM_VK_RIGHT) {
        console.log('Pressing: D');
        nextDirection = 'right';
    }
    else if (e.keyCode === KeyEventCodes.DOM_VK_DOWN) {
        console.log('Pressing: S');
        nextDirection = 'down';
    }
    else if (e.keyCode === KeyEventCodes.DOM_VK_UP) {
        console.log('Pressing: W');
        nextDirection = 'up';
    }
} 
////////////////////////////////////////////////////////////////////////////////
// DONE: Make function to generate a grid (nxn) of rectangles. Should evenly break up the board size into chunks.
//          This initial grid will have all rectangles marked as background
function makeGameBoard() {
    // generate board
    let obstacles = randomWalls(15); // generate n number of obstacle coordinates
    // y-coord loop
    for (let i = 0; i < BOARD_CELL_COUNT; i++) {
        let tmpY = (i * BOARD_CELL_SIZE)
        let tmpGamePieces = [];
        // x-coord loop
        for (let j = 0; j < BOARD_CELL_COUNT; j++) {
            let tmpX = (j * BOARD_CELL_SIZE)
            // condition for initial walls
            let tmpType = 'background';
            if ((j === 0 || i === 0 || j === BOARD_CELL_COUNT-1 || i === BOARD_CELL_COUNT-1)) {
                tmpType = 'wall';
            }
            // generate obstacles
            obstacles.forEach(function(ob){
                if (ob.x === (j * BOARD_CELL_SIZE) && ob.y === (i * BOARD_CELL_SIZE)) {
                    //console.log('Wall Obstacle: ', ob);
                    tmpType = 'obstacle';
                }
            });
            let tmpSpec = {
                xCoord: tmpX,
                yCoord: tmpY,
                type: tmpType
            };
            let tmpGamePiece = GamePiece(tmpSpec);
            tmpGamePieces.push(tmpGamePiece);
        }
        // save a row
        boardPieces.push(tmpGamePieces);
    }
    placeSnakeHead();
    placeFood();
}

function makeSnakeBody(curSnakeHeadX, curSnakeHeadY) {
    let newSnakePiece = SnakePiece({
        xCoord: curSnakeHeadX,
        yCoord: curSnakeHeadY,
        direction: '',
        newDirection: '',
        speed: BOARD_SNAKE_SPEED,
        type:'snake-body',
        color: BOARD_SNAKE_COLOR,
        width: BOARD_CELL_SIZE,
        border: BOARD_BLOCK_BORDER,
        height: BOARD_CELL_SIZE,
        eTime: 0,
        render: true,
    });
    snakePieces.push(newSnakePiece);
}

function placeSnakeHead() {
    // place the snake
    let snakeXY = findOpenPos();
    let snake = SnakePiece({
        xCoord: snakeXY.x,
        yCoord: snakeXY.y,
        direction: '',
        newDirection: '',
        speed: BOARD_SNAKE_SPEED,
        type:'snake-head',
        color: BOARD_SNAKE_COLOR,
        width: BOARD_CELL_SIZE,
        border: BOARD_BLOCK_BORDER,
        height: BOARD_CELL_SIZE,
        eTime: 0,
        render: true,
        snakeWillMove: false,
    });
    // snake.info()
    snakePieces.push(snake);
}

function placeFood() {
    // remove any existing food
    if (foodPiece.x !== 0 && foodPiece.y !== 0) {
        let tmpSpec = {
            xCoord: foodPiece.x * BOARD_CELL_SIZE,
            yCoord: foodPiece.y * BOARD_CELL_SIZE,
            type: 'background',
        };
        let tmpGamePiece = GamePiece(tmpSpec);
        boardPieces[foodPiece.y][foodPiece.x] = tmpGamePiece;
    }
    // place the food
    let foodXY = findOpenPos();
    let food = GamePiece({
        xCoord: foodXY.x,
        yCoord: foodXY.y,
        type: 'food',
    });
    foodPiece = {x: foodXY.x / BOARD_CELL_SIZE, y: foodXY.y / BOARD_CELL_SIZE};
    boardPieces[foodXY.yIdx][foodXY.xIdx] = food;
}

// Function generates a list of coordinates to turn into obstacles throughout the board
function randomWalls(numBlocks) {
    let counter = 0;
    let blockOffsets = [];
    while (counter < numBlocks) {
        let tmpX = getRandomInt(BOARD_WIDTH);
        let tmpY = getRandomInt(BOARD_HEIGHT);
        let tmpXY = {x: tmpX, y: tmpY}
        // only add a block if it hasn't been encountered before
        if (!blockOffsets.includes(tmpXY) && (tmpX != 0 && tmpX != (BOARD_HEIGHT - BOARD_CELL_SIZE)) && (tmpY != 0 && tmpY != (BOARD_HEIGHT - BOARD_CELL_SIZE))) {
            //console.log(`Pushing new block {x:${tmpXY.x}, y:${tmpXY.y}}`);
            blockOffsets.push(tmpXY);
            counter++;
        }
    }
    return blockOffsets;
}
////////////////////////////////////////////////////////////////////////////////
// Function determines where the snake will start
function findOpenPos() {
    while (true) {
        let tmpX = getRandomInt(BOARD_WIDTH) - BOARD_CELL_SIZE;
        let tmpY = getRandomInt(BOARD_HEIGHT) - BOARD_CELL_SIZE;
        if (tmpX === 0 || tmpY === 0 || tmpX === (BOARD_WIDTH - BOARD_CELL_SIZE) || tmpY === (BOARD_WIDTH - BOARD_CELL_SIZE)) {
            continue;
        }
        // make sure x,y coord are valid for the snake
        filteredPieces = boardPieces.filter(piece => piece.xCoord === tmpX);
        foundPiece = filteredPieces.filter(piece => piece.yCoord === tmpY);
        // if piece is not a wall or food, place the snake there;
        if (foundPiece.type !== 'wall' && foundPiece.type !== 'food' && foundPiece.type !== 'obstacle' && foundPiece.type !== 'snake-head' && foundPiece.type !== 'snake-body') {
            return {x: tmpX, y:tmpY, xIdx: tmpX / BOARD_CELL_SIZE, yIdx: tmpY / BOARD_CELL_SIZE};
        }
    }
}



// Function found on Mozilla's documentation site: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(max) {
    let val = Math.floor(Math.random() * Math.floor(max));
    return (Math.ceil((val + 1)/10) * 10); 

}

// DONE: Make function to generate a board piece, with a specified type (snake-piece, food, wall, background)
function GamePiece(specs) {
    // determine color of piece
    let color = BOARD_BACKGROUND_COLOR;
    let width = BOARD_CELL_SIZE;
    let border = '';
    let height = width;
    if (specs.type === 'wall') {
        color = BOARD_WALL_COLOR;
        border = BOARD_BLOCK_BORDER;
    }
    else if (specs.type === 'snake-body') {
        color = BOARD_SNAKE_COLOR;
        border = BOARD_BLOCK_BORDER;
    }
    else if (specs.type === 'food') {
        color = BOARD_FOOD_COLOR;
    }
    else if (specs.type === 'obstacle') {
        color = BOARD_OBSTACLE_COLOR;
    }

    function changeType(newType) {
        specs.type = newType;
    }

    function changeColor(newColor) {
        color = newColor;
    }

    function drawGamePiece() {
        context.save();

        context.fillStyle = color;
        context.lineWidth = 3;
        context.fillRect(
            specs.xCoord,
            specs.yCoord,
            width,
            height);
        context.lineWidth = 5;
        context.strokeStyle = border;
        context.stroke();

        context.restore();
    }

    function info() {
        console.log(`x: ${specs.xCoord} y: ${specs.yCoord} type: ${specs.type} color: ${color}`);
    };

    return {
        // Functions
        info: info, 
        changeType: changeType,
        drawGamePiece: drawGamePiece,
        changeColor: changeColor,
        // Properties
        color: color,
        width: width,
        height: height,
        type: specs.type,
    };
}


// Function generates a snake piece
function SnakePiece(specs) {
    // determine color of piece    
    function drawGamePiece() {
        context.save();
        context.fillStyle = specs.color;
        context.lineWidth = 3;
        context.fillRect(
            specs.xCoord,
            specs.yCoord,
            specs.width,
            specs.height);
        context.lineWidth = 2;
        context.strokeStyle = specs.border;
        context.stroke();
        context.restore();
    }

    function moveSnakeFoward() {
        // make sure we can't move back into ourself
        if (snakeShouldMove()) {
            let nextBodyX = specs.xCoord;
            let nextBodyY = specs.yCoord;
            if (specs.newDirection === 'up' && specs.direction !== 'down') {
                specs.yCoord -= BOARD_CELL_SIZE;
                specs.direction = specs.newDirection;
                specs.eTime = 0;
            }
            else if (specs.newDirection === 'down' && specs.direction !== 'up') {

                specs.yCoord += BOARD_CELL_SIZE;
                specs.direction = specs.newDirection;
                specs.eTime = 0;
            }
            else if (specs.newDirection === 'left' && specs.direction !== 'right') {
                specs.xCoord -= BOARD_CELL_SIZE;
                specs.direction = specs.newDirection;
                specs.eTime = 0;
            }
            else if (specs.newDirection === 'right' && specs.direction !== 'left') {
                specs.xCoord += BOARD_CELL_SIZE;
                specs.direction = specs.newDirection;
                specs.eTime = 0;
            }
            console.log(`MOVED SNAKE HEAD from x: ${nextBodyX} y: ${nextBodyY} -> X: ${specs.xCoord} y: ${specs.yCoord}`);
            // move snake body as well
            for (let i = 1; i < snakePieces.length; i++) {
                let curBodyX = snakePieces[i].getXYCoords().x;
                let curBodyY = snakePieces[i].getXYCoords().y;
                // move current body position, then set nextBody positions to current
                snakePieces[i].moveSnakeBodyPiece({x: nextBodyX, y: nextBodyY});
                nextBodyX = curBodyX;
                nextBodyY = curBodyY;
            }
            return true;
        }

        else {
            return false;
        }
    }

    // set body piece to the x/y coord passed (should be coords or piece right before it)
    function moveSnakeBodyPiece(lastXY) {
        if (specs.type === 'snake-body') {
            specs.xCoord = lastXY.x;
            specs.yCoord = lastXY.y;
            console.log(`MOVING SNAKE BODY from x: ${specs.xCoord} y: ${specs.yCoord} -> X: ${lastXY.x} y: ${lastXY.y}`);
        }
    }

    function getXYCoords() {
        return {x: specs.xCoord, y: specs.yCoord};
    }

    function getType() {
        return specs.type;
    }

    function snakeShouldMove() {
        if (specs.eTime >= specs.speed) {
            specs.snakeWillMove = true;
            return true;
        }
        specs.snakeWillMove = false;
        return false;
    }

    function changeDirection(newDirection) {
        specs.newDirection = newDirection;
    }

    function updateElapsedTime(updateTime) {
        specs.eTime += updateTime;
    }

    function shouldSnakeRender() {
        if (specs.xCoord % BOARD_CELL_SIZE == 0 && specs.yCoord % BOARD_CELL_SIZE == 0) {
            specs.render = true;
        }
        else {
            specs.render = false;
        }
    }

    function info() {
        console.log(`SNAKE -> x: ${specs.xCoord}\ny: ${specs.yCoord}\ntype: ${specs.type}\ncolor: ${specs.color}\ndirection: ${specs.direction}\nnewDirection: ${specs.newDirection}\nelapsedTime: ${specs.eTime}\nrender: ${specs.render}`);
    };

    return {
        // Functions
        info: info, 
        drawGamePiece: drawGamePiece,
        moveSnakeFoward: moveSnakeFoward,
        changeDirection: changeDirection,
        updateElapsedTime: updateElapsedTime,
        shouldSnakeRender: shouldSnakeRender,
        snakeShouldMove: snakeShouldMove,
        getXYCoords: getXYCoords,
        getType: getType,
        moveSnakeBodyPiece: moveSnakeBodyPiece,
        // Properties
        color: specs.color,
        width: specs.width,
        height: specs.height,
        render: specs.render,
        snakeWillMove: specs.snakeWillMove,
    };
}

// TODO: How to get UI to work? Maybe have it be a segment of HTMl that is dynamically imported and cleared?

// TODO: Make function to add a new score. If a new score is added that is greater than one of the top 5, 
//          pop off the lowest and add the new score where it belongs.