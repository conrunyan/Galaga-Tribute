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
MazeGame.objects.maze.Maze = (function (spec) {
    'use strict';

    let mazeBoard = [];
    let startXY = { x: 0, y: 0 }; // default locations
    let endXY = { x: spec.xSize - 1, y: spec.ySize - 1 }; // default locations
    let shortestPath = [];
    let breadCrumbs = [];

    // Function uses Randomized Prim's algorithm to generate a maze
    function generateMaze() {
        // 1 - Generate a grid of walls
        // 2 - Pick a cell, mark it as part of the maze. Add the walls of the cell to the wall list.
        // 3 - While there are walls in the list:
        //     a - Pick a random wall from the list. If only one of the two cells that the wall divides is visited, then:
        //         i - Make the wall a passage and mark the unvisited cell as part of the maze.
        //         ii - Add the neighboring walls of the cell to the wall list.
        //     b - Remove the wall from the list.
    }

    // Generates an xSize X ySize board of cells, with each cell connected to other adjacent cells
    function _generateBaseBoard() {
        for (let i = 0; i < spec.xSize; i++) {
            let mazeRow = [];
            for (let j = 0; j < spec.ySize; j++) {
                // 
            }
        }
    }

    // Function 
    function _linkCells(cellA, CellB) {

    }

    let api = {
        get mazeBoard() { return mazeBoard },
        get shortestPath() { return shortestPath },
        get breadCrumbs() { return breadCrumbs },
        generateMaze: generateMaze,
    };

    return api;
}());