const moment = require('moment')


// let date = moment();
// // let createdAt = 1234
// console.log(date.format('MMM do, YYYY h:ma'));

// console.log(date.format('h:mm a'));

let someTimestamp = moment().valueOf(); // same as Date.now()
console.log(someTimestamp);

let createdAt = Date.now();
let date = moment(createdAt);
console.log(date.format('h:mm a'));
