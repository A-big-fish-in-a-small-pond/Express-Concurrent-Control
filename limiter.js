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
        console.log("현재 " + this.queue.length + "번 째 입니다.");
        this.queue2SCV();
    }

    queue2SCV() {
        let func = this.queue.shift();
        let k = 0;
        for (let i = 0; i < this.SCV.length; i++) {
            if (this.SCV[i] == true) {
                this.SCV[i] = false;
                k = 1;
                func();
                this.SCV[i] = true;
            }
        }
    }
}

// module.exports.Concurrentqueue = Concurrentqueue;

let q = new Concurrentqueue(2);
console.log(q.SCV.length);
let k = 0;

async function a() {
    setTimeout(() => {
        console.log("gdgd");
    }, 1000);
}

q.qpush(a);
q.qpush(a);
q.qpush(a);
q.qpush(a);
q.qpush(a);
