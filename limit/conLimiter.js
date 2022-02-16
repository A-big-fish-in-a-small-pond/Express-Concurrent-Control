class Concurrentqueue {
    constructor(SCVLength) {
        this.queue = [];
        this.SCV = [];
        for (let i = 0; i < SCVLength; i++) {
            this.SCV[i] = true; //SCV = true : rest,       SCV = false : work
        }
        this.conCurrent = 0;
    }

    createQueue(max) {
        for (let i = 0; i < max; i++) {
            this.SCV[i] = true;
        }
    }

    qpush(active) {
        this.queue.push(active);
        this.queue2SCV();
    }

    queue2SCV() {
        for (let i = 0; i < this.SCV.length; i++) {
            if (this.SCV[i] == true) {
                this.SCV[i] = false;
                return this.process(i);
            }
        }
    }

    process(idx) {
        return new Promise(async (resolve) => {
            while (true) {
                if (this.queue.length > 0) {
                    let func = this.queue.shift();
                    await func();
                } else {
                    this.SCV[idx] = true;
                    return resolve();
                }
            }
        });
    }

    checkLimitHandler(req, res, next) {
        req.on("close", () => {
            concurrentQueue.conCurrent = concurrentQueue.conCurrent - 1;
        });

        concurrentQueue.qpush(active);

        function active() {
            return new Promise(async (resolve) => {
                const maximumConcurrent = concurrentQueue.SCV.length;

                if (concurrentQueue.conCurrent < maximumConcurrent) {
                    concurrentQueue.conCurrent = concurrentQueue.conCurrent + 1;
                    next();
                    return resolve();
                } else {
                    await waitForTime(1000);
                    return active();
                }

                function waitForTime(ms) {
                    return new Promise((resolve) => {
                        setTimeout(() => {
                            resolve();
                        }, ms);
                    });
                }
            });
        }
    }
}

const concurrentQueue = new Concurrentqueue(1);

module.exports.createConcurrentQueue = (max) => {
    concurrentQueue.createQueue(max);
    return concurrentQueue;
};
