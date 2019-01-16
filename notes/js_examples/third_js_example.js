// More objects and properties
let circle = {
    radius: 4,
    get diameter() { return this.radius * 2; }, // property of the circle object
    set diameter(value) { this.radius = value / 2; }
};

// define properties of an object
let circle2 = {
    radius: 4,
};

Object.defineProperty(circle2, 'diameter', {
    value: circle.radius * 2,
    writable: false,
    enumerable: true,
    configurable: true
});



console.log(circle.radius);
console.log(circle.diameter);

// enumerating over proerties of an object
for (let p in circle) {
    console.log(p)
}

// 
