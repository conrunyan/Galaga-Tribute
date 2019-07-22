// --------------------------------------------------------------
//
// Creates a grid to store aliens on the board. 
// This grid moves back and forth slowly accross the board
// spec = {
//  coords: {x: int, y: int} ,
//  imageSrc: ,
//  gridWidth: int,
//  gridHeight: int,
//  debugging: bool
// }
// --------------------------------------------------------------
Galaga.objects.ufo.AlienGrid = function (spec) {
    'use strict';

    let movementSpeed = 0.00005;
    let timeForEachMovement = 3500;
    let timeSinceLastMove = 0;
    let grid = [];
    let gridMargin = 70; // in pixels
    let xOffset = 0;
    let yOffset = 0;

    // moves grid containing aliens
    function update(elapsedTime) {
        // move grid items
        moveGrid(elapsedTime);
        // clean up grid
        for (let row = 0; row < grid.length; row++) {
            for (let col = 0; col < grid[row].length; col++) {
                if (grid[row][col].dead) {
                    let oldCoords = grid[row][col].coords;
                    let newSlot = GridSlot({
                        coords: oldCoords,
                        imageSrc: './assets/red-grey-alien.png',
                        contains: null,
                        size: 30,
                        available: true,
                        dead: false,
                        row: row,
                    });
                    grid[row][col] = newSlot;
                }
            }
        }
    }

    function moveGrid(elapsedTime) {
        // check if grid needs to move back
        // check if it's time to move the grid
        if (timeSinceLastMove >= timeForEachMovement) {
            gridMargin = -gridMargin;
            timeSinceLastMove = timeSinceLastMove - timeForEachMovement;
        }
        else {
            timeSinceLastMove += elapsedTime;
        }

        grid.forEach(row => {
            row.forEach(slot => {

                let curX = slot.coords.x;
                let curY = slot.coords.y;
                let newCoords = { x: curX - (gridMargin * movementSpeed * elapsedTime), y: curY };
                slot.setCoords(newCoords);
            });
        });
    }

    // gridSpecs = {
    //    coords: {x: , y: },
    //    available: true,
    //    contains: alient (default null)
    //}
    function GridSlot(gridSpecs) {

        let image = new Image();

        function setCoords(coords) {
            gridSpecs.coords = coords;
        }

        function setContains(newObj) {
            gridSpecs.contains = newObj;
        }

        function removeObj() {
            gridSpecs.contains = null;
        }

        function toggleAvailable() {
            gridSpecs.available = !gridSpecs.available;
        }

        function toggleDead() {
            gridSpecs.dead = !gridSpecs.dead;
        }

        let api = {
            get image() { return image },
            get coords() { return gridSpecs.coords },
            get available() { return gridSpecs.available },
            get contains() { return gridSpecs.contains },
            get size() { return gridSpecs.size },
            get dead() { return gridSpecs.dead },
            get center() { return { x: gridSpecs.coords.x + (gridSpecs.size / 2), y: gridSpecs.coords.y + (gridSpecs.size / 2), } },
            get diveOffset() { return gridSpecs.row },
            setCoords: setCoords,
            setContains: setContains,
            removeObj: removeObj,
            toggleAvailable: toggleAvailable,
            toggleDead: toggleDead,
        }
        return api;
    }

    function _getNextSlotCoords(newXOffset, newYOffset) {
        return { x: spec.coords.x + newXOffset, y: spec.coords.y + newYOffset }
    }

    function getNextOpen() {
        let openSlot = null;
        grid.forEach(row => {
            row.forEach(slot => {
                if (slot.available) {
                    openSlot = slot;
                }
            });
        });
        return openSlot;
    }

    // set up empty grid of places for aliens
    function initGrid() {
        for (let row = 0; row < spec.gridHeight; row++) {
            let newRow = []
            for (let col = 0; col < spec.gridWidth; col++) {
                let newCoords = _getNextSlotCoords(xOffset, yOffset)
                let newSlot = GridSlot({
                    coords: newCoords,
                    imageSrc: './assets/red-grey-alien.png',
                    contains: null,
                    size: 30,
                    available: true,
                    dead: false,
                    row: row,
                });
                newRow.push(newSlot);
                // update xOffset
                xOffset = (col * gridMargin) % (gridMargin * spec.gridWidth);
            }
            grid.push(newRow);
            // update yOffset
            yOffset += gridMargin;
        }
    }

    let api = {
        get coords() { return spec.coords },
        get grid() { return grid },
        get debugging() { return spec.debugging },
        get size() { return spec.gridHeight * spec.gridWidth },
        update: update,
        initGrid: initGrid,
        getNextOpen: getNextOpen,
    };

    initGrid();

    return api;
}