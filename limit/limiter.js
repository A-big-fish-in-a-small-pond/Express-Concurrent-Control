/** imports */
const _ = require("lodash");
const { limiterOption, errorCode, REDIS, CUSTOM } = require("./options");
const { MapStore, RedisStore } = require("./store");

/** Limit Class */
function ExpressLimit(options = limiterOption) {
    this.maxPerMinute = options.maxPerMinute;
    this.resetTime = options.resetTime;

    this.accessStore = null;
    this.objFromipv4 = {
        count: 0,
        start: 0,
        end: 0,
    };

    this.handler = options.handler;
    this.type = options.type;
}

ExpressLimit.prototype.setAccessStore = function (store = undefined) {
    if (this.type == REDIS) {
        this.accessStore = new RedisStore(store);
    } else if (this.type == CUSTOM) {
        this.accessStore = store;
    } else {
        this.accessStore = new MapStore();
    }
};

ExpressLimit.prototype.setOptions = function (options = limiterOption) {
    this.maxPerMinute = options.maxPerMinute;
    this.resetTime = options.resetTime;
    this.errorCode = options.errorCodeNumber;
    this.handler = options.handler;
};

/** set fucntion */
ExpressLimit.prototype.setObject = function (ipv4, obj) {
    this.accessStore.set(ipv4, obj);
};

ExpressLimit.prototype.endResetTime = function (ms) {
    return ms + this.resetTime * 1000;
};

ExpressLimit.prototype.createAccessObject = function (ms) {
    let obj = _.cloneDeep(this.objFromipv4);
    obj.count = 1;
    obj.start = ms;
    obj.end = this.endResetTime(ms);

    return obj;
};

ExpressLimit.prototype.checkAccessLimit = async function (ipv4) {
    let existsObject = await this.accessStore.get(ipv4);
    let currentTime = new Date().getTime();

    /** object 가 존재 하지 않으면 : 사용자가 처음 들어 온 경우 */
    if (existsObject == null) {
        let createObject = this.createAccessObject(currentTime);
        await this.accessStore.set(ipv4, createObject);
        return true;
    }

    /** object 가 존재 하지만 count 를 확인합니다  */
    let count = existsObject.count;

    /** 시간을 먼저 확인합니다. 정의된 시간이 지나면 초기화해주고 true 로 리턴해줍니다.*/
    if (currentTime > existsObject.end) {
        let createObject = this.createAccessObject(currentTime);
        await this.accessStore.set(ipv4, createObject);
        return true;
    }

    /** 카운터를 확인합니다. 카운터를 확인합니다. */
    if (count > this.maxPerMinute) {
        // 카운터가 일정 카운트 보다 넘은 경우
        return false;
    } else {
        // 카운터가 일정 카운트 보다 적은 경우
        existsObject.count = existsObject.count + 1;
        await this.accessStore.set(ipv4, existsObject);
        return true;
    }
};

/** 해당 핸들러를 통해 접근이 가능합니다.
 * app.use() 를 사용하게 되면 this 가 사라지기 떄문에 인스턴스로 반환해야합니다..
 */
ExpressLimit.prototype.checkLimitHandler = async function (req, res, next) {
    let ipv4 = req.ip;

    if (await expressLimitInstance.checkAccessLimit(ipv4)) {
        next();
    } else {
        if (expressLimitInstance.handler != null) {
            return expressLimitInstance.handler(req, res, next);
        } else {
            return res.status(expressLimitInstance.errorCode).json(errorCode);
        }
    }
};

/** Limit Instance */
const expressLimitInstance = new ExpressLimit();

/** module.export */
module.exports.expressLimit = (options) => {
    expressLimitInstance.setOptions(options);
    return expressLimitInstance;
};
