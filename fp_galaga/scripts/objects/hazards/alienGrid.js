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

    // load image
    let image = new Image();
    image.isReady = false;
    image.src = spec.imageSrc;
    image.onload = function () {
        // console.log('loaded image...');
        this.isReady = true;
    };

    let movementSpeed = 0.0002;
    let timeForEachMovement = 1000;
    let grid = [];
    let gridMargin = 20; // in pixels

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
            get coords() { return gridSpecs.coords },
            get available() { return _isAvailable() },
            get contains() { return gridSpecs.contains },

        }
    }

    // set up empty grid of places for aliens
    function initGrid() {
        for (let row = 0; row < spec.gridHeight; row++) {
            let newRow = []
            for (let col = 0; col < spec.gridWidth; col++) {

            }
        }
    }

    let api = {
        get image() { return image },
        get coords() { return spec.coords },
        get size() { return spec.size },
        get radius() { return spec.size / 2 },
        get rotation() { return spec.rotation },
        get projectiles() { return projectiles },
        get didCollide() { return didCollide },
        get ufoType() { return spec.ufoType },
        get center() { return { x: spec.coords.x + (spec.size / 2), y: spec.coords.y + (spec.size / 2), } },
        get shouldExplode() { return lifeTime <= 0 },
        get points() { return points },
        moveGrid: moveGrid,
    };



    initGrid();

    return api;
}