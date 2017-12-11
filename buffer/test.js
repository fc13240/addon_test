var addon = require('./build/Release/hello.node');
const path = require('path');

let bf = Buffer.from('test');
let result = addon.encode(bf);
console.log(result, result.toString());


let bfNum = Buffer.alloc(4);
bfNum.writeInt32LE(-1);
let resultNum = addon.encode(bfNum);
console.log('====');
console.log(resultNum);