/**
 * 用指定描述文件处理数据在网络间传输
 * 
 * @author zhangkai
 */
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
} = require('./package_type');
const Int64LE = require("int64-buffer").Int64LE;
const stringify = JSON.stringify;

const LEN_INT = 4;
const LEN_INT16 = 2;
const LEN_FLOAT = 4;
const LEN_DOUBLE = 8;
const LEN_LONG = 8;
const LEN_BYTE = LEN_BOOL = 1;

// 初始化Buffer的长度
const SIZE_INIT = 1024 * 10;
const MAX_INT = Math.pow(2, 31) - 1;
const MIN_INT = -MAX_INT;
const MAX_INT16 = Math.pow(2, 15) - 1;
const MIN_INT16 = -MAX_INT16;
// const MIN_FLOAT = -Math.pow(2, -126);
// const MAX_FLOAT = Math.pow(2, 127);
const MAX_FLOAT = 3.40282 * Math.pow(10, 38);
const MIN_FLOAT = -MAX_FLOAT;
const MAX_DOUBLE = 1.79 * Math.pow(10, 308);
const MIN_DOUBLE = -MAX_DOUBLE;
const MAX_LONG = Math.pow(2, 63) - 1;
const MIN_LONG = -MAX_LONG;

let is = (() => {
    let util = {};
    ['Object', 'Array'].forEach(type => {
        util['is' + type] = (val) => {
            return ({}).toString.call(val) === '[object ' + type + ']';
        }
    });
    return util;
})();
class BufferPack {
    /**
     * 1. 单个值，分不同的数据类型
     *      {
     *          type: TYPE_INT/TYPE_FLOAT/TYPE_DOUBLE/TYPE_STRING
     *      }
     * 
     * 2. 对象类型
     *      {
     *          type: TYPE_OBJECT
     *          prop: [{
     *              type: TYPE...
     *              name: '属性名'
     *          }]
     *      }
     * 
     * 3. 数组研
     * 
     *    3.1 数值类型数组
     *      {
     *          type: TYPE_ARRAY
     *          prop: {
     *              type: TYPE_INT/TYPE...
     *          }
     *      }
     * 
     *    3.2 对象类型数组
     *      {
     *          type: TYPE_ARRAY_OBJECT
     *          prop: [{
     *              type: TYPE...
     *              name: '属性名'
     *          }]
     *      }
     */
    constructor(conf) {
        if (!conf) {
            throw Error('no config!');
        }
        this.conf = conf;
    }

    /**
     * 把指定数据转换成 Buffer
     * 
     * @param {*} data 要处理的数据
     */
    create(data) {
        const _this = this;
        if (data === null || data === undefined) {
            // return null;
            throw Error("no data to create!");
        }
        // 便于打印传入的原始数据
        function _getOldData() {
            return stringify(data);
        }
        // 得到传入的数据包定义
        function _getConf() {
            return JSON.stringify(_this.conf);
        }
        function _getError(str) {
            return new Error(str + ', data = ' + _getOldData() + ', conf = ' + _getConf());
        }
        let bf = Buffer.alloc(SIZE_INIT);

        let index = 0;
        function _resizeBf(dataLen) {
            let toLen = dataLen + index;
            if (bf.length < toLen) {
                let bf_new = Buffer.alloc(toLen);
                bf.copy(bf_new);
                bf = bf_new;
            }
        }
        // 写入数据
        function _write(data, type, prop) {
            switch (type) {
                case TYPE_BYTE:
                    let num_byte = Number(data);
                    if (isNaN(num_byte) || num_byte < -128 || num_byte > 127) {
                        throw _getError('[' + data +' not a byte]');
                    }
                    _resizeBf(LEN_BYTE);
                    bf.writeInt8(num_byte, index);
                    index += LEN_BYTE;
                    break;
                case TYPE_BOOL:
                    _resizeBf(LEN_BOOL);
                    bf.writeUInt8(!!data? 1: 0, index);
                    index += LEN_BOOL;
                    break;
                case TYPE_INT:
                    let num_int = Number(data); //强制转成数字后再处理，防止数字字符串写入
                    if (!Number.isInteger(num_int)) {
                        throw _getError('[' + data + '] not a Integer');
                    } else if (num_int > MAX_INT || num_int < MIN_INT) {
                        throw _getError('[' + data + '] not in Integer range');
                    }
                    _resizeBf(LEN_INT);
                    bf.writeInt32LE(num_int, index);
                    index += LEN_INT;
                    break;
                case TYPE_INT16:
                    let num_int16 = Number(data);
                    if (!Number.isInteger(num_int16)) {
                        throw _getError('[' + data + '] not a Integer16');
                    } else if (num_int16 > MAX_INT16 || num_int16 < MIN_INT16) {
                        throw _getError('[' + data + '] not in Integer16 range');
                    }
                    _resizeBf(LEN_INT16);
                    bf.writeInt16LE(num_int16, index);
                    index += LEN_INT16
                    break;
                case TYPE_FLOAT:
                    if (isNaN(data)) {
                        throw _getError('[' + data + '] not a Float');
                    } else if (data > MAX_FLOAT || data < MIN_FLOAT) {
                        throw _getError('[' + data + '] not in Float range');
                    }
                    _resizeBf(LEN_FLOAT);
                    bf.writeFloatLE(data, index);
                    index += LEN_FLOAT;
                    break;
                case TYPE_DOUBLE:
                    if (isNaN(data)) {
                        throw _getError('[' + data + '] not a Double');
                    } else if (data > MAX_DOUBLE || data < MIN_DOUBLE) {
                        throw _getError('[' + data + '] not in Double range');
                    }
                    _resizeBf(LEN_DOUBLE);
                    bf.writeDoubleLE(data, index);
                    index += LEN_DOUBLE;
                    break;
                case TYPE_LONG:
                    if (!Number.isInteger(data)) {
                        throw _getError('[' + data + '] not a Long');
                    } else if (data > MAX_LONG || data < MIN_LONG) {
                        throw _getError('[' + data + '] not in Long range');
                    }
                    // bf.writeDoubleLE(data, index);
                    let bf_int64 = new Int64LE(data).toBuffer();
                    _resizeBf(LEN_LONG);
                    bf_int64.copy(bf, index);

                    index += LEN_LONG;
                    break;
                case TYPE_STRING:
                    // 考虑到 ''+[] = '' 这样的操作，暂时不考虑传进来的是[]的操作
                    if (data === undefined || (typeof data !== 'string' && isNaN(data))) {
                        throw _getError('[' + data + '] not a String');
                    }
                    data = Buffer.from(data + ''); //防止中文长度不一致问题
                    let len_str = data.length;
                    _resizeBf(len_str + LEN_INT); // 长度不够时对数据进行处理
                    bf.writeInt32LE(len_str, index);
                    index += LEN_INT;
                    bf.write(data.toString(), index);
                    index += len_str;
                    break;
                case TYPE_OBJECT:
                    if (!is.isObject(data)) {
                        throw _getError('[' + data + '] not a Object');
                    }
                    prop.forEach(p => {
                        let t = p.type;
                        let val = data[p.name];
                        _write(val, t, p.prop);
                    });
                    break;
                case TYPE_ARRAY:
                    if (!is.isArray(data)) {
                        throw _getError('[' + data + '] not a Array');
                    }
                    let pt = prop.type;

                    let len_arr = data.length;
                    _write(len_arr, TYPE_INT16); // 写入数组长度

                    try {
                        data.forEach(d => {
                            _write(d, pt);
                        });
                    } catch (e) {
                        throw _getError('Array value type is error');
                    }
                    break;
                case TYPE_ARRAY_OBJECT:
                    if (!is.isArray(data)) {
                        throw _getError('not a ArrayObject');
                    }
                    let len_data = data.length;
                    _write(len_data, TYPE_INT16); // 写入数组长度

                    data.forEach(d => {
                        if (!is.isObject(d)) {
                            throw _getError('not a ArrayObject');
                        }
                        // try {
                        prop.forEach(p => {
                            let t = p.type;
                            let val = d[p.name];
                            _write(val, t, p.prop);
                        });
                        // } catch(e) {
                        //     Logger.debug(d, prop);
                        //     Logger.error(e);
                        //     throw new Error('ArrayObject value type is error');
                        // }
                    });

                    break;
                case TYPE_BUFFER:
                    if (!(data instanceof Buffer)) {
                        throw _getError('[' + data + '] not a Buffer');
                    }
                    if (!data) {
                        data = Buffer.alloc(0);
                    }
                    let len_bf = data.length;
                    _write(len_bf, TYPE_INT16);
                    data.copy(bf, index);
                    index += len_bf;
                    break;
            }
        }

        // 暂时不考虑复杂类型嵌套，嵌套深度只能为一
        let { type, prop } = this.conf;

        _write(data, type, prop);
        return bf.slice(0, index);
    }

    /**
     * 将 Buffer 按着描述文件进行还原
     * 
     * @param {*} bf 
     */
    parse(bf) {
        if (bf === null || bf === undefined) {
            // return null;
            throw Error('no buffer to parse!');
        }
        let index = 0;
        function _read(type, prop) {
            let val = null;
            switch (type) {
                case TYPE_BYTE:
                    val = bf.readInt8(index);
                    index += LEN_BYTE;
                    break;
                case TYPE_BOOL:
                    val = !!(bf.readUInt8(index));
                    index += LEN_BOOL;
                    break;
                case TYPE_INT:
                    val = bf.readInt32LE(index);
                    index += LEN_INT;
                    break;
                case TYPE_INT16:
                    val = bf.readInt16LE(index);
                    index += LEN_INT16
                    break;
                case TYPE_FLOAT:
                    val = bf.readFloatLE(index);
                    index += LEN_FLOAT;
                    break;
                case TYPE_LONG:
                    let bf_int64 = bf.slice(index, index += LEN_LONG);
                    val = new Int64LE(bf_int64).toNumber();
                    break;
                case TYPE_DOUBLE:
                    val = bf.readDoubleLE(index);
                    index += LEN_DOUBLE;
                    break;
                case TYPE_STRING:
                    let len_str = bf.readInt32LE(index);
                    index += LEN_INT;
                    let end = len_str + index;
                    val = bf.slice(index, end).toString();
                    index = end;
                    break;
                case TYPE_OBJECT:
                    let obj = {};
                    prop.forEach(p => {
                        let t = p.type;
                        let val = _read(t, p.prop);
                        obj[p.name] = val;
                    });
                    val = obj;
                    break;
                case TYPE_ARRAY:
                    let pt = prop.type;
                    let len_arr = _read(TYPE_INT16);
                    let arr_result = [];
                    for (var i = 0; i < len_arr; i++) {
                        arr_result.push(_read(pt));
                    }
                    val = arr_result;
                    break;
                case TYPE_ARRAY_OBJECT:
                    let len_data = _read(TYPE_INT16);
                    let arr_obj = [];

                    while (len_data-- > 0) {
                        let obj = {};
                        prop.forEach(p => {
                            let pt = p.type;
                            let name = p.name;
                            obj[name] = _read(pt, p.prop);
                        });
                        arr_obj.push(obj);
                    }
                    val = arr_obj;
                    break;
                case TYPE_BUFFER:
                    let len_bf = _read(TYPE_INT16);
                    let end_bf = index + len_bf;
                    val = bf.slice(index, end_bf);
                    index = end_bf;
                    break;
            }

            if (val !== null) {
                return val;
            }
        }
        let { type, prop } = this.conf;
        return _read(type, prop);
    }
}


module.exports = BufferPack;