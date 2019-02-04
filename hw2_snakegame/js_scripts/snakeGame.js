// Code for the snake game engine
let firstLoop = true;
let snakeCanMove = false; // only move the after the first direction key has been pressed
let gameOver = false;
let prevBrowserTime = performance.now();
let scores = []; // list of scores to be kept track of
let boardPieces = [];
let snakePieces = [];
let nextDirection = '';
let canvas = document.getElementById('id-canvas');
let context = canvas.getContext('2d');
let KeyEventCodes = {
    DOM_VK_A: 65,
    DOM_VK_D: 68,
    DOM_VK_S: 83,
    DOM_VK_W: 87,
};

// Game Constants
let BOARD_SNAKE_SPEED = 300;  // ms per square
let BOARD_WIDTH = 500;
let BOARD_HEIGHT = 500;
let BOARD_CELL_COUNT = 50; // really the number is BOARD_CELLS^2
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
        return;
    }
    requestAnimationFrame(gameLoop);
}

function update(elapsedTime) {
    if (snakeCanMove) {
        // update head
        let tmpHead = snakePieces[0];
        snakePieces[0].changeDirection(nextDirection);
        snakePieces[0].updateElapsedTime(elapsedTime);
        snakePieces[0].moveSnakeFoward();
        snakePieces[0].drawGamePiece();
        snakePieces[0].shouldSnakeRender();
        //snakePieces[0] = tmpHead;
        // check if snake has hit a wall
        let snakeHeadX_idx = snakePieces[0].getXYCoords().x / BOARD_CELL_SIZE;
        let snakeHeadY_idx = snakePieces[0].getXYCoords().y / BOARD_CELL_SIZE;
        console.log(snakeHeadX_idx, snakeHeadY_idx);
        let pieceHeadIsOn = boardPieces[snakeHeadY_idx][snakeHeadX_idx];
        if (!(pieceHeadIsOn.type === 'background') && !(pieceHeadIsOn.type === 'snake-head')) {
            console.log('GAME OVER');
            gameOver = true;
        }
    }
    // TODO: Add step to move the snake
    // TODO: Add step to add tail to snake
    // TODO: Add step to move food, if needed
}

function render() {
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
}
////////////////////////////////////////////////////////////////////////////////
function onKeyDown(e) {
    snakeCanMove = true;
    
    if (e.keyCode === KeyEventCodes.DOM_VK_A) {
        console.log('Pressing: A');
        nextDirection = 'left';
    }
    else if (e.keyCode === KeyEventCodes.DOM_VK_D) {
        console.log('Pressing: D');
        nextDirection = 'right';
    }
    else if (e.keyCode === KeyEventCodes.DOM_VK_S) {
        console.log('Pressing: S');
        nextDirection = 'down';
    }
    else if (e.keyCode === KeyEventCodes.DOM_VK_W) {
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

    // place the snake
    let snakeXY = snakeStartPos();
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
    });
    snake.info()
    snakePieces.push(snake);
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
function snakeStartPos() {
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
        if (foundPiece.type !== 'wall' && foundPiece.type !== 'food' && foundPiece.type !== 'obstacle') {
            return {x: tmpX, y:tmpY};
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
    else if (specs.type === 'snake') {
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
            if (specs.newDirection === 'up' && specs.direction !== 'down') {
                if (snakeShouldMove()) {
                    specs.yCoord -= BOARD_CELL_SIZE;
                    specs.direction = specs.newDirection;
                    specs.eTime = 0;
                }
            }
            else if (specs.newDirection === 'down' && specs.direction !== 'up') {
                if (snakeShouldMove()) {
                    specs.yCoord += BOARD_CELL_SIZE;
                    specs.direction = specs.newDirection;
                    specs.eTime = 0;
                }
            }
            else if (specs.newDirection === 'left' && specs.direction !== 'right') {
                if (snakeShouldMove()) {
                    specs.xCoord -= BOARD_CELL_SIZE;
                    specs.direction = specs.newDirection;
                    specs.eTime = 0;
                }
            }
            else if (specs.newDirection === 'right' && specs.direction !== 'left') {
                if (snakeShouldMove()) {
                    specs.xCoord += BOARD_CELL_SIZE;
                    specs.direction = specs.newDirection;
                    specs.eTime = 0;
                }
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
                return true;
            }
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
            // Properties
            color: specs.color,
            width: specs.width,
            height: specs.height,
        };
}

// TODO: How to get UI to work? Maybe have it be a segment of HTMl that is dynamically imported and cleared?

// TODO: Make function to add a new score. If a new score is added that is greater than one of the top 5, 
//          pop off the lowest and add the new score where it belongs.