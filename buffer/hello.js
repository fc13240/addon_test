var addon = require('./build/Release/hello.node');

// console.log(addon.hello()); // 'world'
let bf = Buffer.alloc(100);

bf[0] = 1;
bf[9] = 1;
console.log(bf);
let result = addon.hello(bf);
console.log(result)