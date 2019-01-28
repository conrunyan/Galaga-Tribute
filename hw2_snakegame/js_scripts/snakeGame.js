// Code for the snake game engine
let firstLoop = true;
let prevBrowserTime = 0;
let scores = []; // list of scores to be kept track of

function gameLoop(browserTime) {
    // Get elapsed time
    let elapsedTime = 0
    if (!firstLoop) {
        elapsedTime = browserTime - prevBrowserTime;
        prevBrowserTime = browserTime;
    }
    update(elapsedTime);
    render()
    firstLoop = false;
    requestAnimationFrame(gameLoop);
}

// TODO: Make function to generate a grid (nxn) of rectangles. Should evenly break up the board size into chunks.
//          This initial grid will have all rectangles marked as background

// TODO: Make function to generate a rectangle, with a specified type (snake-piece, food, wall, background)

// TODO: How to get UI to work? Maybe have it be a segment of HTMl that is dynamically imported and cleared?

// TODO: Make function to add a new score. If a new score is added that is greater than one of the top 5, 
//          pop off the lowest and add the new score where it belongs.