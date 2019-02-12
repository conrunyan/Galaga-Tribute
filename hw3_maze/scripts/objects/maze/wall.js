// --------------------------------------------------------------
//
// Creates a Wall object, with functions for managing state.
// One Wall object can link two cells together, or exist as the end
// of the board.
// spec = {
//  wallType: ,
// }
//
// --------------------------------------------------------------
MazeGame.objects.maze.Wall = function (spec) {
    'use strict';

    spec.display = true;

    function setDisplay (displayVal) {
        display = displayVal;
    }
    
    function setNodeA(cell) {
        spec.nodeA = cell;
    }
    
    function setNodeB(cell) {
        spec.nodeB = cell;
    }

    let api = {
        get nodeA() { return spec.nodeA },
        get nodeB() { return spec.nodeB },
        get wallType() { return spec.wallType },
        setDisplay: setDisplay,
        setNodeA: setNodeA,
        setNodeB: setNodeB,
    };

    return api;
}