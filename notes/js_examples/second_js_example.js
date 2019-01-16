// Object examples

// function that produces objects

function makeObject(firstName, lastName) {
    let person = {
        firstname: firstName,
        lastname: lastName,
        age: 42,
    };

    return person
}

// IMPORTANT! All objects are references

let john = makeObject();

console.log(john.firstname);

/*
console.log('First Name', person.firstname);
console.log('Last Name', person['lastname']); // hash table like reference

person.location = 'Somewhere'; // Adding a new attribute to an object

// objects can be nested values

let person2 = {
    name: {
        first: 'John',
        last: 'Smith'
    },
};
*/
