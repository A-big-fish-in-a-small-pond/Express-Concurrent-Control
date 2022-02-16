class Concurrentqueue {
    constructor(SCVLength) {
        this.queue = [];
        this.SCV = [];
        for (let i = 0; i < SCVLength; i++) {
            this.SCV[i] = true; //SCV = true : rest,       SCV = false : work
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

    async process(idx) {
        while (true) {
            if (this.queue.length > 0) {
                let func = this.queue.shift();
                await func();
            } else {
                this.SCV[idx] = true;
                return;
            }
        }
    }
}
