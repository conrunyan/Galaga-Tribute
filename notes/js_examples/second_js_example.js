// Object examples
let person = {
    firstname: 'John',
    lastname: 'Smith',
    age: 42,
};

console.log('First Name', person.firstname);
console.log('Last Name', person['lastname']); // hash table like reference

person.location = 'Somewhere'; // Adding a new attribute to an object