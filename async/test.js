const addon = require('./build/Release/index');

// let result = addon.a();
// console.log(result);

// addon.a(1000*5, (...args) => {
//     console.log(args);
// });
// console.log('after function');

let t1 = new Date();
console.log('begin', t1);
let result = addon.b();
let t2 = new Date();
console.log(result, t2 - t1);
let t3 = new Date();
console.log(result, t3 - t1);
while(new Date() - t1 < 1000*6) {
    
}
console.log(new Date() - t3)
setInterval(() => {
    console.log(new Date());
}, 100);