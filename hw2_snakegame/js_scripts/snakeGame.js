// Code for the snake game engine
let firstLoop = true;
let prevBrowserTime = 0;
let scores = []; // list of scores to be kept track of
let boardPieces = [];

// Game Constants
let BOARD_WIDTH = 500;
let BOARD_HEIGHT = 500;
let BOARD_CELL_COUNT = 50; // really the number is BOARD_CELLS^2
let BOARD_CELL_SIZE = BOARD_WIDTH / BOARD_CELL_COUNT;
let BOARD_BACKGROUND_COLOR = 'blue';
let BOARD_WALL_COLOR = 'grey';
let BOARD_SNAKE_COLOR = 'green';
let BOARD_FOOD_COLOR = 'red'


makeGameBoard();



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

// TODO: Make function to generate a grid (nxn) of rectangles. Should evenly break up the board size into chunks.
//          This initial grid will have all rectangles marked as background
function makeGameBoard() {
    // generate board
    let cur_y = 0;
    // y-coord loop
    for (let i = 0; i < BOARD_CELL_COUNT; i++) {
        let tmpPieces = [];
        let cur_x = 0;
        let tmpY = (i * BOARD_CELL_SIZE)
        // x-coord loop
        for (let j = 0; j < BOARD_CELL_COUNT; j++) {
            let tmpX = (j * BOARD_CELL_SIZE)
            //console.log('Current Y: ' + tmpY + ' Current X: ' + tmpX);
        }
    }
}
// TODO: Make function to generate a rectangle, with a specified type (snake-piece, food, wall, background)
function makeGamePiece(xCoord, yCoord, type) {
    // determine color of piece
    let color = BOARD_BACKGROUND_COLOR;
    if (type === 'wall') {
        color = BOARD_WALL_COLOR;
    }
    else if (type === 'snake') {
        color = BOARD_SNAKE_COLOR;
    }
    else if (type === 'food') {
        color = BOARD_FOOD_COLOR;
    }

    return {xCoord:xCoord, yCoord:yCoord, type:type, color:color};
}
// TODO: How to get UI to work? Maybe have it be a segment of HTMl that is dynamically imported and cleared?

// TODO: Make function to add a new score. If a new score is added that is greater than one of the top 5, 
//          pop off the lowest and add the new score where it belongs.