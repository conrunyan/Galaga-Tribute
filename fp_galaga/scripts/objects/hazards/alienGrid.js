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
    let timeSinceLastMove = 0;
    let grid = [];
    let gridMargin = 20; // in pixels
    let xOffset = 0;
    let yOffset = 0;

    // moves grid containing aliens
    function moveGrid(elapsedTime) {
        // check if it's time to move the grid
        if (timeSinceLastMove >= timeForEachMovement) {
            grid.forEach(row => {
                row.forEach(slot => {

                    let curX = slot.coords.x;
                    let curY = slot.coords.y;
                    let newCoords = { x: curX - gridMargin, y: curY };
                    slot.setCoords(newCoords);
                    

                });
            });
            timeSinceLastMove = timeSinceLastMove - timeForEachMovement;
        }
        else {
            timeForEachMovement += elapsedTime;
        }
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
        image.src = gridSpecs.imageSrc;
        image.onload = function () {
            console.log('loaded grid image...');
            this.isReady = true;
        };

        function setCoords(coords) {
            gridSpecs.coords = coords;
        }

        function setContains(newObj) {
            spec.contains = newObj;
        }

        function removeObj() {
            spec.contains = null;
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
            get size() { return gridSpecs.size },
            get center() { return { x: gridSpecs.coords.x + (gridSpecs.size / 2), y: gridSpecs.coords.y + (gridSpecs.size / 2), } },
            setCoords: setCoords,
            setContains: setContains,
            removeObj: removeObj,
        }
        return api;
    }

    function _getNextSlotCoords(newXOffset, newYOffset) {
        return { x: spec.coords.x + newXOffset, y: spec.coords.y + newYOffset }
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
                    size: 10,
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
        moveGrid: moveGrid,
        initGrid: initGrid,
    };



    initGrid();

    return api;
}