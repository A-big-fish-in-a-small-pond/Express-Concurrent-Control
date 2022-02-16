const express = require("express");
const { ExpressLimit } = require("./limiter");
const app = express();
const expressLimit = new ExpressLimit();

/** middle ware */
app.use(express.json());
app.use(expressLimit.checkLimitHandler);
app.use("/", (req, res) => {
    return res.json({ success: "end" });
});

app.listen(3000, "0.0.0.0", () => {
    console.log("server open");
});
