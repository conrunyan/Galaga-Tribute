// Arrays
let myArray = []; // arrays are VERY similar to lists in python
let colors = ['red', 'blue', 'green'];
let mixed = [1, 'a', true, ['yet', 'another', 'array']];

console.log(colors[0]);

// c-style for loop over an array

for (let i = 0; i < colors.length; i++){
    console.log(colors[i]);
}

// foreach loop. NOTE: Returns indicies of the array, rather than items in the iterable

for (let item in colors){
    console.log(item);
}

// manipulating an array
myArray.push('Stuff');

// IMPORTANT Note: myArray[100] = 10; of an array of 50 items would fill in the remaining 49 with "undefined"

// Functional aspects of arrays

// performs the function defined below as a call-back for each element of the array
myArray.forEach(function(value, index, array){
    console.log('name: ', value, index);
});

let callFunc = function(value, index, array){
    console.log('name: ', value, index);
};

myArray.sort()

// Conditional statements:

let a = 10;
let b = '10';

// values are the same, with coersion
if (a == b){
    console.log('Equal! (But not really...) ')
}
if (a === b){
    console.log('Actually Equal!')
}
else {
    console.log('not equal')
}
