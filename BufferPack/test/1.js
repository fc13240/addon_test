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

        let val = "hello world";
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

        let val = 3.14;
        let bf = new BufferPackLib(conf).create(val);
        let a = new BufferPackLib(conf).parse(bf);
        let b = BufferPackAddon.parse(conf, bf);
        // console.log(a);
        // console.log(b);
        expect(a).equal(b);
    });
});