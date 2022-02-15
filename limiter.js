class Concurrentqueue {
    constructor(QLength) {
        this.queue = [];
        this.SCV = [];
        for (let i = 0; i < QLength; i++) {
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
}

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
q.qpush(a);
q.qpush(a);
q.qpush(a);
