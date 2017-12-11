var addon = require('./build/Release/hello.node');
const path = require('path');

// console.log(addon.hello()); // 'world'
let bf = Buffer.alloc(10);

bf[0] = 1;
bf[9] = 1;
console.log(bf);
let result = addon.hello(bf);
console.log(result);
let bfResult = addon.encode(bf);
console.log(bfResult);

let filepath = path.join(__dirname, '.key');
// filepath = 'q wu ';
console.log('filepath = ', filepath);

console.log(addon.encode(Buffer.from(filepath)));
console.log('-----');

let bfResultFile = addon.encode(filepath);
console.log('bfResultFile:', bfResultFile);
console.log('bf in node:', Buffer.from(filepath));
console.log(bfResultFile.toString());