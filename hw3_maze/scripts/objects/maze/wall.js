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
    spec.nodeA = { xIdx: undefined, yIdx: undefined };
    spec.nodeB = { xIdx: undefined, yIdx: undefined };


    function setDisplay(displayVal) {
        display = displayVal;
    }

    function setNodeA(cell) {
        spec.nodeA = cell;
    }

    function setNodeB(cell) {
        spec.nodeB = cell;
    }

    function info() {
        console.log(`NodeA: ${spec.nodeA.xIdx},${spec.nodeA.yIdx} NodeB: ${spec.nodeB.xIdx},${spec.nodeB.yIdx}`);
    }

    let api = {
        get nodeA() { return spec.nodeA },
        get nodeB() { return spec.nodeB },
        get wallType() { return spec.wallType },
        setDisplay: setDisplay,
        setNodeA: setNodeA,
        setNodeB: setNodeB,
        info: info,
    };

    return api;
}