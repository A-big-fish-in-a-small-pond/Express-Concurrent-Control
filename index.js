const express = require("express");
const { expressLimit } = require("./limit/limiter");
const app = express();

const limiter = expressLimit({
    maxPerMinute: 30,
    resetTime: 60,
    errorCodeNumber: 404,
    handler: (req, res, next) => {
        res.json({ errorHandler: "fuck" });
    },
});

/** middleware */
app.use(express.json());
app.use(limiter.checkLimitHandler);
app.use("/", (req, res) => {
    return res.json({ success: "end" });
});

app.listen(3000, "0.0.0.0", () => {
    console.log("server open");
});
