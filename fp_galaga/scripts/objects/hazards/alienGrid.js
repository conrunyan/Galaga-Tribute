// --------------------------------------------------------------
//
// Creates a grid to store aliens on the board. 
// This grid moves back and forth slowly accross the board
// spec = {
//  coords: {x: int, y: int} ,
//  imageSrc: ,
//  gridWidth: int,
//  gridHeight: int,
// }
// --------------------------------------------------------------
Galaga.objects.ufo.AlienGrid = function (spec) {
    'use strict';

    let movementSpeed = 0.0002;
    let timeForEachMovement = 1000;
    let grid = [];
    let gridMargin = 20; // in pixels
    let xOffset = 0;
    let yOffset = 0;

    // moves grid containing aliens
    function moveGrid(elapsedTime) {

    }

    function addToGrid(obj) {

    }

    function removeFromGrid(obj) {

    }

    // spec = {
    //    coords: {x: , y: },
    //    available: true,
    //    contains: alient (default null)
    //}
    function GridSlot(gridSpecs) {

        let image = new Image();
        image.isReady = false;
        image.src = spec.imageSrc;
        image.onload = function () {
            // console.log('loaded image...');
            this.isReady = true;
        };

        function setCoords(coords) {
            gridSpecs.coords = coords;
        }

        function _isAvailable() {
            if (gridSpecs.contains === null) {
                return true;
            }
            else {
                return false;
            }
        }

        let api = {
            get image() { return image },
            get coords() { return gridSpecs.coords },
            get available() { return _isAvailable() },
            get contains() { return gridSpecs.contains },

        }
    }

    function _getNextSlotCoords(newXOffset, newXOffset) {
        return { x: spec.coords.x + newXOffset, y: spec.coords.y + newXOffset }
    }

    // set up empty grid of places for aliens
    function initGrid() {
        for (let row = 0; row < spec.gridHeight; row++) {
            let newRow = []
            for (let col = 0; col < spec.gridWidth; col++) {
                let newCoords = _getNextSlotCoords(xOffset, yOffset)
                let newSlot = GridSlot({
                    coords: newCoords,

                });
                newRow.push(newSlot);
                // update xOffset
                xOffset += gridMargin;
            }
            grid.push(newRow);
            // update yOffset
            yOffset += gridMargin;
        }
    }

    let api = {
        get coords() { return spec.coords },
        get grid() { return grid },
        moveGrid: moveGrid,
    };



    initGrid();

    return api;
}