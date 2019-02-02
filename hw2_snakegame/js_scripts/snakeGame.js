// Code for the snake game engine
let firstLoop = true;
let snakeCanMove = false; // only move the after the first direction key has been pressed
let prevBrowserTime = performance.now();
let scores = []; // list of scores to be kept track of
let boardPieces = [];
let snakePieces = [];
let canvas = document.getElementById('id-canvas');
let context = canvas.getContext('2d');
let KeyEventCodes = {
    DOM_VK_A: 65,
    DOM_VK_D: 68,
    DOM_VK_S: 83,
    DOM_VK_W: 87,
};

// Game Constants
let BOARD_WIDTH = 500;
let BOARD_HEIGHT = 500;
let BOARD_CELL_COUNT = 50; // really the number is BOARD_CELLS^2
let BOARD_CELL_SIZE = BOARD_WIDTH / BOARD_CELL_COUNT;
let BOARD_BACKGROUND_COLOR = 'rgba(125, 125, 125, .5)';
let BOARD_WALL_COLOR = 'rgba(50, 30, 255, .5)';
let BOARD_SNAKE_COLOR = 'rgba(0, 255, 0, .5)';
let BOARD_FOOD_COLOR = 'rgba(255, 0, 0, .5)';
let BOARD_BLOCK_BORDER = 'rgba(0, 0, 0, 1)';
let BOARD_OBSTACLE_COLOR = 'rgba(0, 255, 255, 1)';


makeGameBoard();
window.addEventListener('keydown', onKeyDown);
gameLoop();



function gameLoop(browserTime) {
    // Get elapsed time
    let elapsedTime = 0
    if (!firstLoop) {
        elapsedTime = browserTime - prevBrowserTime;
        prevBrowserTime = browserTime;
    }
    update(elapsedTime);
    render();
    firstLoop = false;
    requestAnimationFrame(gameLoop);
}

function update(elapsedTime) {
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
}
////////////////////////////////////////////////////////////////////////////////
function onKeyDown(e) {
    snakeCanMove = true;
    
    if (e.keyCode === KeyEventCodes.DOM_VK_A) {
        
    }
    else if (e.keyCode === KeyEventCodes.DOM_VK_D) {
        console.log('Pressing: D');
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

    console.log(boardPieces);

    // place the snake
    let snakeXY = snakeStartPos();
    let snake = SnakePiece({
        xCoord: snakeXY.x,
        yCoord: snakeXY.y,
        direction: 'up',
        newDirection: 'down',
        speed: 100,
        type:'snake-head',
    });
    snake.info()
    boardPieces[snakeXY.y/BOARD_CELL_SIZE][snakeXY.x/BOARD_CELL_SIZE] = snake;
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
    };
}


// Function generates a snake piece
function SnakePiece(specs) {
        // determine color of piece
        let color = BOARD_SNAKE_COLOR;
        let width = BOARD_CELL_SIZE;
        let border = BOARD_BLOCK_BORDER;
        let height = width;
    
        function drawGamePiece() {
            context.save();
            context.fillStyle = color;
            context.lineWidth = 3;
            context.fillRect(
                specs.xCoord,
                specs.yCoord,
                width,
                height);
            context.lineWidth = 2;
            context.strokeStyle = border;
            context.stroke();

            context.restore();
        }

        function moveSnakeFoward() {
            // make sure we can't move back into ourself
            if (specs.newDirection === 'up' && specs.direction !== 'down') {
                specs.yCoord -= specs.speed * specs.elapsedTime;
            }
            else if (specs.newDirection === 'down' && specs.direction !== 'up') {
                specs.yCoord += specs.speed * specs.elapsedTime;
            }
            else if (specs.newDirection === 'left' && specs.direction !== 'right') {
                specs.xCoord -= specs.speed * specs.elapsedTime;
            }
            else if (specs.newDirection === 'right' && specs.direction !== 'left') {
                specs.xCoord += specs.speed * specs.elapsedTime;
            }
        }
    
        function info() {
            console.log(`SNAKE -> x: ${specs.xCoord} y: ${specs.yCoord} type: ${specs.type} color: ${color}`);
        };
    
        return {
            // Functions
            info: info, 
            drawGamePiece: drawGamePiece,
            moveSnakeFoward: moveSnakeFoward,
            // Properties
            color: color,
            width: width,
            height: height,
        };
}

// TODO: How to get UI to work? Maybe have it be a segment of HTMl that is dynamically imported and cleared?

// TODO: Make function to add a new score. If a new score is added that is greater than one of the top 5, 
//          pop off the lowest and add the new score where it belongs.