const express = require("express");
const { expressLimit } = require("./limit");
const app = express();

const limiter = expressLimit.expressLimit({
    maxPerMinute: 30,
    resetTime: 60,
    errorCodeNumber: 404,
    type: "default", // 레디스를 사용하고자 하면 redis 를 넣어줍니다.
    handler: (req, res, next) => {
        res.json({ errorHandler: "this page is exceed request page" });
    },
});
/* 저장소를 생성하기 위해 사용합니다. default type 은 파라미터를 주지 않아도 되지만 
 REDIS 는 레디스 client 객체를 넣어주어야 하고, 
 커스텀 저장소를 만들기 위해서는 아래와 같이 구현하여 주시기 바랍니다..
 
 
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
    }
}
 */
limiter.setAccessStore();

/** 레디스를 등록하는 함수입니다. */
const conLimiter = expressLimit.createConcurrentQueue(1);

/** middle ware */
app.use(express.json());
app.use(limiter.checkLimitHandler);
app.use(conLimiter.checkLimitHandler);

app.use("/abs", (req, res) => {
    setTimeout(() => {
        res.json({ success: "end page" });
    }, 1);
});

app.listen(3000, "0.0.0.0", () => {
    console.log("server open");
});
