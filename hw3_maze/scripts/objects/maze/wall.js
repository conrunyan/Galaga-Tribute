// --------------------------------------------------------------
//
// Creates a Wall object, with functions for managing state.
// One Wall object can link two cells together, or exist as the end
// of the board.
// spec = {
//  nodeA: mazeCellA,
//  nodeB: mazeCellB,
// }
//
// --------------------------------------------------------------
MazeGame.objects.maze.Wall = function (spec) {
    'use strict';

    let display = true;

    function setDisplay (displayVal) {
        display = displayVal;
    }

    let api = {
        get nodeA() { return spec.nodeA },
        get nodeB() { return spec.nodeB },
        setDisplay: setDisplay,
    };

    return api;
}