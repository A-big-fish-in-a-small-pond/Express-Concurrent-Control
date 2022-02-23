const { createConcurrentQueue } = require("./conLimiter");
const { expressLimit } = require("./limiter");

module.exports.expressLimit = {
    expressLimit: expressLimit,
    createConcurrentQueue: createConcurrentQueue,
};
