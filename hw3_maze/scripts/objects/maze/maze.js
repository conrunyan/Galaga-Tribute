// --------------------------------------------------------------
//
// Creates a Maze object, with functions for managing state.
// One Maze object will exist at a time. This can be thougth of as
// the game board.
// spec = {
//  size: {xSize , ySize: },
// }
//
// --------------------------------------------------------------
MazeGame.objects.maze.Maze = function (spec) {
    'use strict';

    let mazeBoard = [];
    let startXY = {x: 0, y: 0}; // default locations
    let endXY = {x: spec.xSize - 1, y: spec.ySize - 1}; // default locations
    let shortestPath = [];
    let breadCrumbs = [];
    let 

    // Function uses Randomized Prim's algorithm to generate a maze
    function generateMaze() {
        // 1 - Gnerate a grid of walls

    }

    let api = {
    };

    return api;
}