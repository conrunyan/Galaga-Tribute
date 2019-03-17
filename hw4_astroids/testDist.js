let x1 = 128.05;
let x2 = 75.9;
let y1 = 112.56;
let y2 = 75.9;

let p1 = {x: x1, y: y1};
let p2 = {x: x2, y: y2};

function _getDistanceBetweenPoints(p1, p2) {
    let x_2 = Math.pow(p2.x - p1.x, 2)
    let y_2 = Math.pow(p2.y - p1.y, 2)
    let result = Math.sqrt(x_2 + y_2)
    return result
}

let result = _getDistanceBetweenPoints(p1, p2);

console.log(result);