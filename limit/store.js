/** store class */
class Store {
    constructor(store) {
        this.store = store;
    }

    async get(...rest) {
        print("this is prototype...");
        return null;
    }

    async set(...rest) {
        print("this is prototype...");
        return null;
    }
}

/** redisStore */
class RedisStore extends Store {
    constructor(store) {
        super(store);
    }

    async get(ipv4) {
        let result = this.store.get(ipv4);

        if (result != null && result != undefined) {
            return result;
        } else {
            return null;
        }
    }

    async set(ipv4, obj) {
        await this.store.set(ipv4, obj);
        return true;
    }
}

/** redisStore */
class MapStore extends Store {
    constructor() {
        super(new Map());
    }

    async get(ipv4) {
        if (this.store.has(ipv4)) {
            return this.store.get(ipv4);
        } else {
            return null;
        }
    }

    async set(ipv4, obj) {
        this.store.set(ipv4, obj);
        return true;
    }
}

module.exports.BlankStore = Store;
module.exports.RedisStore = RedisStore;
module.exports.MapStore = MapStore;
