const { ExpressLimit } = require("./limiter");
const expressLimit = new ExpressLimit();
let q = new Concurrentqueue(4);

async function a() {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("gdgd");
            resolve();
        }, 1000);
    });
}

q.qpush(a);
q.qpush(a);
q.qpush(a);
q.qpush(a);
q.qpush(a);
q.qpush(a);
q.qpush(a);
q.qpush(a);
q.qpush(a);
q.qpush(a);
q.qpush(a);

setTimeout(() => {
    console.log("000000000000000000");
    q.qpush(a);
    q.qpush(a);
}, 8000);
