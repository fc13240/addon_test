const BufferPack = require('./build/Release/BufferPack');
const Int64LE = require("int64-buffer").Int64LE;

const TYPE_INT = 0,              // 32位整形
TYPE_INT16 = 1,            // 16位整形
TYPE_FLOAT = 2,            // 浮点类型
TYPE_DOUBLE = 3,           // Double 可以保留很好的精度
TYPE_STRING = 4,           // 字符串类型
TYPE_LONG = 5,             // 长整形整数
TYPE_BYTE = 6,             // byte类型
TYPE_BOOL = 7,             // bool类型
TYPE_OBJECT = 100,         // 对象类型
TYPE_ARRAY = 101,          // 基本类型数组
TYPE_ARRAY_OBJECT = 102,   // 对象数组
TYPE_BUFFER = 103;         // Buffer 对象
// let bf = Buffer.alloc(4);
// bf.writeInt32LE(200);
// console.log(bf);
// let result = BufferPack.create({
//     type: 0
// }, 200);
// console.log('====');
// console.log(result);


// let bf = Buffer.alloc(1);
// let val_byte = 10;
// bf.writeInt8(val_byte);
// console.log(bf);
// let result = BufferPack.create({
//     type: TYPE_BYTE
// }, val_byte);
// console.log('====');
// console.log(result);

// let bf = Buffer.alloc(1);
// let val_bool = false;
// bf.writeInt8(0);
// console.log(bf);
// let result = BufferPack.create({
//     type: TYPE_BOOL
// }, val_bool);
// console.log('====');
// console.log(result);

// let bf = Buffer.alloc(4);
// bf.writeInt16LE(200);
// console.log(bf);
// let result = BufferPack.create({
//     type: TYPE_INT16
// }, 200);
// console.log('====');
// console.log(result);

// let val_long = new Date().getTime();
// console.log(val_long);
// let bf_int64 = new Int64LE(val_long).toBuffer();
// console.log(bf_int64, new Int64LE(bf_int64).toNumber());
// let result = BufferPack.create({
//     type: TYPE_LONG
// }, val_long);
// console.log('====');
// console.log(result);

// let bf = Buffer.alloc(4);
// let val_float = 3.14;
// bf.writeFloatLE(val_float);
// console.log(bf);
// let result = BufferPack.create({
//     type: TYPE_FLOAT
// }, val_float);
// console.log('====');
// console.log(result);

// let test = Buffer.from([0x1f, 0x85, 0xeb , 0x51 , 0x00 , 0x00 , 0x00 , 0x00]);
// console.log(test.readDoubleLE(0));
// let bf = Buffer.alloc(8);
// let val_double = 3.14;
// bf.writeDoubleLE(val_double);
// console.log(bf, bf.readDoubleLE(0));
// let result = BufferPack.create({
//     type: TYPE_DOUBLE
// }, val_double);
// console.log('====');
// console.log(result);

// let val_str = 'hello中文abc';
// let bf = Buffer.from(val_str);
// console.log(bf);
// let result = BufferPack.create({
//     type: TYPE_STRING
// }, val_str);
// console.log('====');
// console.log(result, result.toString());

// let val_str = 'hello中文abc';
// let bf = Buffer.alloc(20);
// bf.writeInt32LE(10);
// console.log(bf, Buffer.from('test'));
// let result = BufferPack.create({
//     type: TYPE_OBJECT,
//     prop: [{
//         type: TYPE_INT,
//         name: 'age'
//     }, {
//         type: TYPE_STRING,
//         name: 'name'
//     }, {
//         name: 'obj',
//         type: TYPE_OBJECT,
//         prop: [{
//             type: TYPE_BOOL,
//             name: 'flag'
//         }]
//     }]
// }, {
//     name: 'test',
//     age: 10,
//     obj: {
//         flag: true
//     }
// });
// console.log('====');
// console.log(result, result.toString());

let result = BufferPack.create({
    type: TYPE_ARRAY,
    prop: {
        type: TYPE_INT
    }
}, [1,2,3, 4]);
console.log(result);

console.log('=====');
let result_arr_obj = BufferPack.create({
    type: TYPE_ARRAY_OBJECT,
    prop: [{
        name: 'name',
        type: TYPE_STRING
    }, {
        name: 'age',
        type: TYPE_INT
    }]
}, [{
    name: 'one',
    age: 10
}, {
    name: 'two',
    age: 11
}]);
console.log(result_arr_obj);

// try {
//     BufferPack.create();
// } catch(e) {
//     console.log('should get error', e);
// };
// try {
//     BufferPack.create({
//         type: 0
//     }, '200');
// } catch(e) {
//     console.log('should get error', e);
// };