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
