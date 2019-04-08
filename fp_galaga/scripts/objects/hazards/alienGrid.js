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

    let movementSpeed = 0.0009;
    let timeForEachMovement = 5000;
    let timeSinceLastMove = 0;
    let numMoves = 0;
    let maxNumMoves = 10;
    let grid = [];
    let gridMargin = 50; // in pixels
    let xOffset = 0;
    let yOffset = 0;

    // moves grid containing aliens
    function moveGrid(elapsedTime) {
        // console.log('time: ', timeSinceLastMove)
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
            gridSpecs.contains = newObj;
        }

        function removeObj() {
            gridSpecs.contains = null;
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

    function _determineIfFull() {
        let usedSlots = 0;
        grid.forEach(row => {
            row.forEach(slot => {
                if (!slot.available) {
                    usedSlots++;
                }
            });
        });
        
        if (usedSlots < spec.gridHeight * spec.gridWidth) {
            return false;
        }
        return true;
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
        get full() { return _determineIfFull() },
        moveGrid: moveGrid,
        initGrid: initGrid,
        getNextOpen: getNextOpen,
    };



    initGrid();

    return api;
}