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

    spec.isPassage = false;
    spec.nodeA = { xIdx: undefined, yIdx: undefined };
    spec.nodeB = { xIdx: undefined, yIdx: undefined };


    function setIsPassage(isPassage) {
        spec.isPassage = isPassage;
    }

    function setNodeA(cell) {
        spec.nodeA = cell;
    }

    function setNodeB(cell) {
        spec.nodeB = cell;
    }

    function setType(newType) {
        spec.type = newType;
    }

    function info() {
        console.log(`NodeA: ${spec.nodeA.xIdx},${spec.nodeA.yIdx} NodeB: ${spec.nodeB.xIdx},${spec.nodeB.yIdx}`);
    }

    let api = {
        get nodeA() { return spec.nodeA },
        get nodeB() { return spec.nodeB },
        get type() { return spec.type },
        get isPassage() { return spec.isPassage },
        setIsPassage: setIsPassage,
        setNodeA: setNodeA,
        setNodeB: setNodeB,
        setType: setType,
        info: info,
    };

    return api;
}