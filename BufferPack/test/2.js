const chai = require('chai');
chai.should();
const expect = chai.expect;

const BufferPack = require('../lib/BufferPackAddon');
// const BufferPack = require('../lib')

const {
    TYPE_INT,
    TYPE_INT16,
    TYPE_FLOAT,
    TYPE_DOUBLE,
    TYPE_LONG,
    TYPE_STRING,
    TYPE_ARRAY_OBJECT,
    TYPE_ARRAY,
    TYPE_OBJECT,
    TYPE_BUFFER,
    TYPE_BYTE,
    TYPE_BOOL,
} = require('../lib/package_type');

describe('2.js', () => {
    describe('Error', () => {
        it('should get Error("not config!")', () => {
            (() => {
                new BufferPack();
            }).should.throw(Error);;
        });
        it('should get Error("no data to create!")', () => {
            (() => {
                new BufferPack({}).create();
            }).should.throw(Error);
        });
        it('should get Error("no buffer to parse!")', () => {
            (() => {
                new BufferPack({}).parse();
            }).should.throw(Error);
        });
    });

    describe('Error', () => {
    
        it('parameter bounds',() => {
            (() => {

                let bf = new BufferPack({
                    type: TYPE_INT
                })

                let str = 9999999999;

                var buffer = bf.create(str);

                var result = bf.parse(buffer);

                result.should.equal(str);
            }).should.throw(Error);
        });

        it('create parameter type Error', () => {
            (() => {

                let str = "hello world";

                let bf = new BufferPack({
                    type: TYPE_INT
                })
                
                var buffer = bf.create(str);

                var result = bf.parse(buffer);

                result.should.equal(str);

            }).should.throw(Error);
        });
    });

    describe('USEAGE', () => {
        it('should get a byte', () => {
            let bf = new BufferPack({
                type: TYPE_BYTE
            });
            let buffer = bf.create(10);
            let result = bf.parse(buffer);
            result.should.equal(10);
        });
        it('should get a bool', () => {
            let bf = new BufferPack({
                type: TYPE_BOOL
            });
            let buffer = bf.create(10);
            let result = bf.parse(buffer);
            result.should.be.true;

            bf.parse(bf.create(false)).should.be.false;
        });
        it('should get a Number', () => {
            let bf = new BufferPack({
                type: TYPE_INT
            });
            let buffer = bf.create(10);
            let result = bf.parse(buffer);

            result.should.equal(10);

            bf = new BufferPack({
                type: TYPE_FLOAT
            });
            buffer = bf.create(10.1);
            result = bf.parse(buffer);
            // float 有精度问题，要特殊处理
            (Math.abs(10.1 - result) <= 0.0001).should.equal(true);

            bf = new BufferPack({
                type: TYPE_DOUBLE
            });
            buffer = bf.create(10.1);
            result = bf.parse(buffer);
            result.should.equal(10.1);

            bf = new BufferPack({
                type: TYPE_LONG
            });
            buffer = bf.create(126);
            result = bf.parse(buffer);
            result.should.equal(126);

            let val_long = 1444444444444;
            buffer = bf.create(val_long);
            result = bf.parse(buffer);
            result.should.equal(val_long);
            // 验证Buffer序列
            buffer.should.deep.equal(Buffer.from([0x1c, 0x17, 0x99, 0x4f, 0x50, 0x1, 0x0, 0x0]));
        })

        it('should get a String', () => {
            let bf = new BufferPack({
                type: TYPE_STRING
            });
            let str = "hello world";
            let buffer = bf.create(str);
            let result = bf.parse(buffer);

            result.should.equal(str);
        })

        it('should get a utf8 string', () => {
            let bf = new BufferPack({
                type: TYPE_STRING
            });
            let str = '中文';
            let buffer = bf.create(str);
            let result = bf.parse(buffer);

            result.should.equal(str);
        });

        it('should get a Array', () => {
            let val = [1, 2, 3, 11, 12, 13];
            let bf = new BufferPack({
                type: TYPE_ARRAY,
                prop: {
                    type: TYPE_INT
                }
            });
            let buffer = bf.create(val);
            let result = bf.parse(buffer);
            result.should.deep.equal(val);
        });

        it('should get a Buffer', () => {
            let bf = Buffer.alloc(10);
            bf.fill(10);

            let confBf = new BufferPack({
                type: TYPE_BUFFER
            });
            let buffer = confBf.create(bf);
            let result = confBf.parse(buffer);
            result.should.deep.equal(bf);
        });
        it('should get a Buffer from object', () => {
            let bf = Buffer.alloc(10);
            bf.fill(10);

            let confBf = new BufferPack({
                type: TYPE_OBJECT,
                prop: [{
                    type: TYPE_BUFFER,
                    name: 'bf'
                }]
            });
            let val = {
                bf: bf
            };
            let buffer = confBf.create(val);
            let result = confBf.parse(buffer);
            result.should.deep.equal(val);
        });

        it('should get a object array', () => {
            let val = [{
                name: 'one',
                age: 1
            }, {
                name: 'two',
                age: 12
            }, {
                name: 'three',
                age: 13
            }]

            let bf = new BufferPack({
                type: TYPE_ARRAY_OBJECT,
                prop: [{
                    type: TYPE_STRING,
                    name: 'name'
                }, {
                    type: TYPE_INT,
                    name: 'age'
                }]
            });
            let buffer = bf.create(val);
            let result = bf.parse(buffer);
            result.should.deep.equal(val);
        });
        it('should get a object array length is 0', () => {
            let val = []

            let bf = new BufferPack({
                type: TYPE_ARRAY_OBJECT,
                prop: [{
                    type: TYPE_STRING,
                    name: 'name'
                }, {
                    type: TYPE_INT,
                    name: 'age'
                }]
            });
            let buffer = bf.create(val);
            let result = bf.parse(buffer);
            result.should.deep.equal(val);

            let bf1 = new BufferPack({
                type: TYPE_OBJECT,
                prop: [{
                    type: TYPE_INT,
                    name: 'id'
                }, {
                    type: TYPE_ARRAY_OBJECT,
                    name: 'arr',
                    prop: [{
                        type: TYPE_STRING,
                        name: 'name'
                    }, {
                        type: TYPE_INT,
                        name: 'age'
                    }]
                }]
            });
            let var1 = {
                id: 1,
                arr: []
            };
            let buffer1 = bf1.create(var1);
            let result1 = bf1.parse(buffer1);
            result1.should.deep.equal(var1);
        });

        it('should get a complex Object', () => {
            let bfVal = Buffer.alloc(10);
            bfVal.fill(10);
            let val = {
                name: 'one',
                age: 10,
                height: 1.1,
                bf: bfVal,
                child: [{
                    name: 'one',
                    ids: [1,2,3,4]
                }, {
                    name: '中文',
                    ids: [11, 12, 14]
                }],
                order: [1,2,3],
                test: ['one', 'two', 'three']
            }

            let bf = new BufferPack({
                type: TYPE_OBJECT,
                prop: [
                {
                    type: TYPE_INT,
                    name: 'age'
                }, 
                {
                    type: TYPE_STRING,
                    name: 'name'
                }, 
                {
                    type: TYPE_BUFFER,
                    name: 'bf'
                },
                {
                    type: TYPE_DOUBLE,
                    name: 'height'
                }, 
                {
                    type: TYPE_ARRAY_OBJECT,
                    name: 'child',
                    prop: [
                    {
                        type: TYPE_STRING,
                        name: 'name'
                    }, 
                    {
                        type: TYPE_ARRAY,
                        name: 'ids',
                        prop: {
                            type: TYPE_INT,
                        }
                    }]
                },
                {
                    type: TYPE_ARRAY,
                    name: 'order',
                    prop: {
                        type: TYPE_INT16
                    }
                },
                {
                    type: TYPE_ARRAY,
                    name: 'test',
                    prop: {
                        type: TYPE_STRING
                    }
                }
                ]
            });

            let buffer = bf.create(val);
            let result = bf.parse(buffer);
            result.should.deep.equal(val);
        });
    });

    describe('USERAGE ERROR', () => {
        describe('BYTE', () => {
            let bf = new BufferPack({
                type: TYPE_BYTE
            });
            it('should get Error(not a byte)', () => {
                (() => {
                    bf.create(200);
                }).should.throw(Error);
                (() => {
                    bf.create(-129);
                }).should.throw(Error);
            });
        });
        describe('INT', () => {
            let bf = new BufferPack({
                type: TYPE_INT
            });
            it('should get Error(not a Integer)', () => {
                (() => {
                    bf.create('test');
                }).should.throw(Error);
            });
            it('should get Error(not in Integer range)', () => {
                (() => {
                    bf.create(Math.pow(2, 40));
                }).should.throw(Error);
            })
        });
        describe('INT16', () => {
            let bf = new BufferPack({
                type: TYPE_INT16
            });
            it('should get Error(not a Integer16)', () => {
                (() => {
                    bf.create('test');
                }).should.throw(Error);
            });
            it('should get Error(not in Integer16 range)', () => {
                (() => {
                    bf.create(Math.pow(2, 16));
                }).should.throw(Error);
            })
        });
        describe('INT16', () => {
            let bf = new BufferPack({
                type: TYPE_INT16
            });
            it('should get Error(not a Integer16)', () => {
                (() => {
                    bf.create('test');
                }).should.throw(Error);
            });
            it('should get Error(not in Integer16 range)', () => {
                (() => {
                    bf.create(Math.pow(2, 16));
                }).should.throw(Error);
            })
        });
        describe('FLOAT', () => {
            let bf = new BufferPack({
                type: TYPE_FLOAT
            });
            it('should get Error(not a Float)', () => {
                (() => {
                    bf.create('test');
                }).should.throw(Error);

                (() => {
                    bf.create();
                }).should.throw(Error);
            });
            it('should get Error(not in Float range)', () => {
                (() => {
                    bf.create(Math.pow(2, 200));
                }).should.throw(Error);
            })
        });
        describe('DOUBLE', () => {
            let bf = new BufferPack({
                type: TYPE_DOUBLE
            });
            it('should get Error(not a Double)', () => {
                (() => {
                    bf.create('test');
                }).should.throw(Error);

                (() => {
                    bf.create();
                }).should.throw(Error);
            });
            it('should get Error(not in Double range)', () => {
                (() => {
                    bf.create(Math.pow(2, 2000));
                }).should.throw(Error);
            })
        });
        describe('LONG', () => {
            let bf = new BufferPack({
                type: TYPE_LONG
            });
            it('should get Error(not a Long)', () => {
                (() => {
                    bf.create('test');
                }).should.throw(Error);

                (() => {
                    bf.create();
                }).should.throw(Error);
            });
            it('should get Error(not in Long range)', () => {
                (() => {
                    bf.create(Math.pow(2, 200));
                }).should.throw(Error);
            })
        });
        describe('STRING', () => {
            let bf = new BufferPack({
                type: TYPE_STRING
            });
            it('should get Error(not a String)', () => {
                // '' + [] = '' 会内部转成字符串，这里暂时不处理[]
                // (() => {
                //     bf.create([]);
                // }).should.throw(Error);

                (() => {
                    bf.create([1,2]);
                }).should.throw(Error);
                (() => {
                    bf.create(123);
                }).should.throw(Error);

                // let buffer = bf.create(123);
                // bf.parse(buffer).should.equal('123');
            });
        });
        describe('OBJECT', () => {
            let bf = new BufferPack({
                type: TYPE_OBJECT,
                prop: [{
                    name: 'name',
                    type: TYPE_STRING
                }]
            });
            it('should get Error(not a Object)', () => {
                (() => {
                    bf.create([]);
                }).should.throw(Error);

                (() => {
                    bf.create(1);
                }).should.throw(Error);
            });
            it('should get Error(not a String)', () => {
                (() => {
                    bf.create({});
                }).should.throw(Error);
            });
        });
        describe('ARRAY', () => {
            let bf = new BufferPack({
                type: TYPE_ARRAY,
                prop: {
                    type: TYPE_INT
                }
            });
            it('should get Error(not a Array)', () => {
                (() => {
                    bf.create({});
                }).should.throw(Error);

                (() => {
                    bf.create(1);
                }).should.throw(Error);
            });
            it('should get Error(Array value type is error)', () => {
                (() => {
                    bf.create(['one', 'two']);
                }).should.throw(Error);

                (() => {
                    bf.create([1, 'test']);
                }).should.throw(Error);
            });
        });
        describe('ARRAY_OBJECT', () => {
            let bf = new BufferPack({
                type: TYPE_ARRAY_OBJECT,
                prop: [{
                    name: 'name',
                    type: TYPE_STRING
                }, {
                    name: 'age',
                    type: TYPE_INT
                }]
            });
            it('should get Error(not a ArrayObject)', () => {
                (() => {
                    bf.create(['one', 'two']);
                }).should.throw(Error);
            });
            it('should get Error(ArrayObject value type is error)', () => {
                (() => {
                    bf.create([{
                        name: 123,
                        age: 'test'
                    }]);
                }).should.throw(Error);
            });
        });
        describe('BUFFER', () => {
            let bf = new BufferPack({
                type: TYPE_BUFFER
            });
            it('should get Error(not a Buffer)', () => {
                (() => {
                    bf.create(123);
                }).should.throw(Error);
                (() => {
                    bf.create({});
                }).should.throw(Error);
            });
        });
        describe('big data', () => {
            let bf = new BufferPack({
                type: TYPE_STRING
            });
            it('should get right data use big data', () => {
                let lenData = 1024*20;
                let bfStr = Buffer.alloc(lenData);
                bfStr.fill(1);
                let strBig = bfStr.toString();
                let bfResult = bf.create(strBig);

                expect(bfResult.length).equal(lenData + 4);

                let result = bf.parse(bfResult);
                expect(result).equal(strBig);
            });
        });
    });
});