const chai = require('chai');
chai.should();
const expect = chai.expect;

const BufferPackLib = require('../lib/index');
const BufferPackAddon = require('../build/Release/BufferPack');
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

describe('#create', () => {
    it('int16', () => {
        let conf = {
            type: TYPE_INT16
        }

        let val = 100;
        let a = new BufferPackLib(conf).create(val);
        let b = BufferPackAddon.create(conf, val);
        // console.log(a);
        // console.log(b);
        expect(b).deep.equal(a);
    });
    it('int', () => {
        let conf = {
            type: TYPE_INT
        }

        let val = 100;
        let a = new BufferPackLib(conf).create(val);
        let b = BufferPackAddon.create(conf, val);
        // console.log(a);
        // console.log(b);
        expect(b).deep.equal(a);
    });
    it('long', () => {
        let conf = {
            type: TYPE_LONG
        }

        let val = 1513783069482;
        let a = new BufferPackLib(conf).create(val);
        let b = BufferPackAddon.create(conf, val);
        // console.log(a);
        // console.log(b);
        expect(b).deep.equal(a);
    });
    it('byte', () => {
        let conf = {
            type: TYPE_BYTE
        }

        let val = 10;
        let a = new BufferPackLib(conf).create(val);
        let b = BufferPackAddon.create(conf, val);
        // console.log(a);
        // console.log(b);
        expect(b).deep.equal(a);
    });
    it('bool', () => {
        let conf = {
            type: TYPE_BOOL
        }

        let val = true;
        let a = new BufferPackLib(conf).create(val);
        let b = BufferPackAddon.create(conf, val);
        // console.log(a);
        // console.log(b);
        expect(b).deep.equal(a);
    });
    it('string', () => {
        let conf = {
            type: TYPE_STRING
        }

        let val = "我们是中国人abc";
        let a = new BufferPackLib(conf).create(val);
        let b = BufferPackAddon.create(conf, val);
        // console.log(a);
        // console.log(b);
        expect(b).deep.equal(a);
    });
    it('string1', () => {
        let conf = {
            type: TYPE_STRING
        }

        let val = "我们是中a国人abc";
        let a = new BufferPackLib(conf).create(val);
        let b = BufferPackAddon.create(conf, val);
        // console.log(a);
        // console.log(b);
        expect(b).deep.equal(a);
    });
    it('array', () => {
        let conf = {
            type: TYPE_ARRAY,
            prop: {
                type: TYPE_INT16
            }
        }

        let val = [1, 2, 3, 4, 5];
        let a = new BufferPackLib(conf).create(val);
        let b = BufferPackAddon.create(conf, val);
        // console.log(a);
        // console.log(b);
        expect(b).deep.equal(a);
    });
    it('array object', () => {
        let conf = {
            type: TYPE_ARRAY_OBJECT,
            prop: [{
                name: 'name',
                type: TYPE_STRING
            }, {
                name: 'age',
                type: TYPE_INT
            }]
        }

        let val = [{
            name: 'one',
            age: 10
        }, {
            name: '中文测试',
            age: 11
        }];
        let a = new BufferPackLib(conf).create(val);
        let b = BufferPackAddon.create(conf, val);
        // console.log(a);
        // console.log(b);
        expect(b).deep.equal(a);
    });
    it('buffer', () => {
        let conf = {
            type: TYPE_BUFFER
        };
        let bf = Buffer.from('hello 我们是中国人, abc');
        let a = new BufferPackLib(conf).create(bf);
        let b = BufferPackAddon.create(conf, bf);
        // console.log(a);
        // console.log(b);
        expect(a).deep.equal(b);
    });
    it('complex object', () => {
        let conf = {
            type: TYPE_OBJECT,
            prop: [{
                name: 'child',
                type: TYPE_ARRAY_OBJECT,
                prop: [{
                    name: 'name',
                    type: TYPE_STRING
                }, {
                    name: 'age',
                    type: TYPE_INT
                }]
            }, {
                name: 'flag',
                type: TYPE_BOOL
            }, {
                name: 'type',
                type: TYPE_BYTE
            }, {
                name: 'arr',
                type: TYPE_ARRAY,
                prop: {
                    type: TYPE_INT16
                }
            }]
        }

        let val = {
            child: [{
                name: 'one',
                age: 10
            }, {
                name: '中文测试',
                age: 11
            }],
            flag: true,
            type: 1,
            arr: [1, 2, 3, 4]
        };
        let a = new BufferPackLib(conf).create(val);
        let b = BufferPackAddon.create(conf, val);
        // console.log(a);
        // console.log(b);
        expect(b).deep.equal(a);
    });
});
describe('#parse', () => {
    it('bool', () => {
        let conf = {
            type: TYPE_BOOL
        }

        let val = true;
        let bf = new BufferPackLib(conf).create(val);
        let a = new BufferPackLib(conf).parse(bf);
        let b = BufferPackAddon.parse(conf, bf);
        // console.log(a);
        // console.log(b);
        expect(a).equal(b);
    });
    it('byte', () => {
        let conf = {
            type: TYPE_BYTE
        }

        let val = 100;
        let bf = new BufferPackLib(conf).create(val);
        let a = new BufferPackLib(conf).parse(bf);
        let b = BufferPackAddon.parse(conf, bf);
        // console.log(a);
        // console.log(b);
        expect(a).equal(b);
    });
    it('int16', () => {
        let conf = {
            type: TYPE_INT16
        }

        let val = 300;
        let bf = new BufferPackLib(conf).create(val);
        let a = new BufferPackLib(conf).parse(bf);
        let b = BufferPackAddon.parse(conf, bf);
        // console.log(a);
        // console.log(b);
        expect(a).equal(b);
    });
    it('int', () => {
        let conf = {
            type: TYPE_INT
        }

        let val = 2147483647;
        let bf = new BufferPackLib(conf).create(val);
        let a = new BufferPackLib(conf).parse(bf);
        let b = BufferPackAddon.parse(conf, bf);
        // console.log(a);
        // console.log(b);
        expect(a).equal(b);
    });
    it('long', () => {
        let conf = {
            type: TYPE_LONG
        }

        let val = 1513783069482;
        let bf = new BufferPackLib(conf).create(val);
        let a = new BufferPackLib(conf).parse(bf);
        let b = BufferPackAddon.parse(conf, bf);
        // console.log(a);
        // console.log(b);
        expect(a).equal(b);
    });
    it('float', () => {
        let conf = {
            type: TYPE_FLOAT
        }

        let val = 3.14;
        let bf = new BufferPackLib(conf).create(val);
        let a = new BufferPackLib(conf).parse(bf);
        let b = BufferPackAddon.parse(conf, bf);
        // console.log(a);
        // console.log(b);
        expect(a).equal(b);
    });
    it('double', () => {
        let conf = {
            type: TYPE_DOUBLE
        }

        let val = 1.1000002365;
        let bf = new BufferPackLib(conf).create(val);
        let a = new BufferPackLib(conf).parse(bf);
        let b = BufferPackAddon.parse(conf, bf);
        // console.log(a);
        // console.log(b);
        expect(a).equal(b);
    });
    it('string', () => {
        let conf = {
            type: TYPE_STRING
        }

        let val = '我们是中a国人abc';
        let bf = new BufferPackLib(conf).create(val);
        // console.log(bf, bf.readInt32LE(0));
        let a = new BufferPackLib(conf).parse(bf);
        let b = BufferPackAddon.parse(conf, bf);
        // console.log(a);
        // console.log(b);
        // console.log(Buffer.from(a));
        // console.log(Buffer.from(b));
        expect(a).equal(b);
    });
    it('string1', () => {
        let conf = {
            type: TYPE_STRING
        }

        let val = '我们是中a国人abc';
        let bf = new BufferPackLib(conf).create(val);
        let a = new BufferPackLib(conf).parse(bf);
        let b = BufferPackAddon.parse(conf, bf);
        // console.log(a);
        // console.log(b);
        expect(a).equal(b);
    });
    it('array', () => {
        let conf = {
            type: TYPE_ARRAY,
            prop: {
                type: TYPE_INT16
            }
        }

        let val = [1, 2, 3];
        let bf = new BufferPackLib(conf).create(val);
        // console.log(bf);
        let a = new BufferPackLib(conf).parse(bf);
        let b = BufferPackAddon.parse(conf, bf);
        // console.log(a);
        // console.log(b);
        expect(a).deep.equal(b);
    });
    // it.only('test', () => {
    //     let conf = {
    //         type: TYPE_STRING
    //     }
    //     let v1 = '我们是中国人abcdcd',
    //         v2 = '我们是中a国人abc';
    //     let a = new BufferPackLib(conf).create(v1);
    //     let b = BufferPackAddon.create(conf, v1);
    //     let c = new BufferPackLib(conf).create(v2);
    //     let d = BufferPackAddon.create(conf, v2);
    //     console.log(a);
    //     console.log(b);
    //     console.log(c);
    //     console.log(d);

    //     let a1 = new BufferPackLib(conf).parse(a);
    //     let b1 = BufferPackAddon.parse(conf, a);
    //     let c1 = new BufferPackLib(conf).parse(c);
    //     let d1 = BufferPackAddon.parse(conf, d);
    //     console.log(a1);
    //     console.log(b1);
    //     console.log(c1);
    //     console.log(d1);

    //     console.log(Buffer.from(a1));
    //     console.log(Buffer.from(b1));
    //     console.log(Buffer.from(c1));
    //     console.log(Buffer.from(d1));
    // });
    it('object', () => {
        let conf = {
            type: TYPE_OBJECT,
            prop: [{
                name: 'name',
                type: TYPE_STRING
            }, {
                name: 'name1',
                type: TYPE_STRING
            }, {
                name: 'height',
                type: TYPE_FLOAT
            }]
        }

        let val = {
            age: 10,
            name: '我们是中国人abcdcd',
            name1: '我们是中a国人abc',
            height: 1.1
        };
        let bf = new BufferPackLib(conf).create(val);
        let a = new BufferPackLib(conf).parse(bf);
        let b = BufferPackAddon.parse(conf, bf);
        // console.log(a);
        // console.log(b);
        expect(a).deep.equal(b);
    });
    it('array object', () => {
        let conf = {
            type: TYPE_ARRAY_OBJECT,
            prop: [{
                name: 'name',
                type: TYPE_STRING
            }, {
                name: 'name1',
                type: TYPE_STRING
            }, {
                name: 'height',
                type: TYPE_FLOAT
            }]
        }

        let val = [{
            age: 10,
            name: '我们是中国人abcdcd',
            name1: '我们是中a国人abc',
            height: 1.1
        }];
        let bf = new BufferPackLib(conf).create(val);
        let a = new BufferPackLib(conf).parse(bf);
        let b = BufferPackAddon.parse(conf, bf);
        // console.log(a);
        // console.log(b);
        expect(a).deep.equal(b);
    });
    it('buffer', () => {
        let conf = {
            type: TYPE_BUFFER
        }

        let val = Buffer.from('hello');
        let bf = new BufferPackLib(conf).create(val);
        let a = new BufferPackLib(conf).parse(bf);
        let b = BufferPackAddon.parse(conf, bf);
        // console.log(a);
        // console.log(b);
        expect(a).deep.equal(b);
    });
    it('complex object', () => {
        let conf = {
            type: TYPE_OBJECT,
            prop: [{
                name: 'child',
                type: TYPE_ARRAY_OBJECT,
                prop: [{
                    name: 'name',
                    type: TYPE_STRING
                }, {
                    name: 'age',
                    type: TYPE_INT
                }]
            }, {
                name: 'flag',
                type: TYPE_BOOL
            }, {
                name: 'type',
                type: TYPE_BYTE
            }, {
                name: 'arr',
                type: TYPE_ARRAY,
                prop: {
                    type: TYPE_INT16
                }
            }]
        }

        let val = {
            child: [{
                name: 'one',
                age: 10
            }, {
                name: '中文测试',
                age: 11
            }],
            flag: true,
            type: 1,
            arr: [1, 2, 3, 4]
        };
        let bf = new BufferPackLib(conf).create(val);
        let a = new BufferPackLib(conf).parse(bf);
        let b = BufferPackAddon.parse(conf, bf);
        // console.log(a);
        // console.log(b);
        expect(b).deep.equal(a);
    });
});