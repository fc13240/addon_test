const addon = require('../build/Release/BufferPack')
class BufferPack {
    constructor(conf) {
        if (!conf) {
            throw Error('no config!');
        }
        this.conf = conf;
    }
    create(data) {
        if (data === null || data === undefined) {
            // return null;
            throw Error("no data to create!");
        }
        const _this = this;
        try {
            return addon.create(_this.conf, data);
        } catch(e) {
            throw new Error(e.message + ', data = ' + JSON.stringify(data) + ', conf = '+JSON.stringify(_this.conf));
        }
    }
    parse(bf) {
        if (bf === null || bf === undefined) {
            // return null;
            throw Error('no buffer to parse!');
        }
        return addon.parse(this.conf, bf);
    }
}

module.exports = BufferPack;