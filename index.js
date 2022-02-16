const express = require("express");
const { expressLimit } = require("./limit");
const app = express();

const limiter = expressLimit.expressLimit({
    maxPerMinute: 30,
    resetTime: 60,
    errorCodeNumber: 404,
    handler: (req, res, next) => {
        res.json({ errorHandler: "this page is exceed request page" });
    },
});

const conLimiter = expressLimit.createConcurrentQueue(2);

/** middle ware */
app.use(express.json());
app.use(limiter.checkLimitHandler);
app.use(conLimiter.checkLimitHandler);

app.use("/abs", (req, res) => {
    setTimeout(() => {
        res.json({ success: "end page" });
    }, 10000);
});

app.listen(3000, "0.0.0.0", () => {
    console.log("server open");
});
