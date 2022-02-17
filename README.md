# <div align="center"> Express-Concurrent-Control </div>

<div align="center">

Express-Concurrent-Control 라이브러리는 Express 미들웨어 라이브러리 입니다.

</div>

### Alternate Rate Limiters

> 이 모듈은 기본적으로 다른 프로세스/서버와 상태를 공유하지 않습니다. 좀 더 강력한 솔루션이 필요하다면 외부 라이브러리를 이용하는 것을 추천합니다.

이 모듈은 기본 사항만 다루도록 설계되었으며 지원조차 하지 않았습니다. 작고 가볍지만 강력한 라이브러리를 사용하여 서버를 안정화시킬 수 있습니다.

## Installation

From Github Releases:

```sh
> git clone https://github.com/A-big-fish-in-a-small-pond/Express-Concurrent-Control.git
```

## Usage

### Importing

이 라이브러리는 CJS 형태로 제공되며 자바스크립트와 타입스크립트 프로젝트 모두에서 사용할 수 있습니다.

아래는 CJS 형태에서 임포트를 하기 위한 방법입니다.

```ts
const { expressLimit } = require("./limit");
```

### Examples

모든 요청에 적용해야 하는 API 전용 서버에서 사용하려면 아래와 같이 사용합니다:

```ts
import rateLimit from "express-rate-limit";

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

const conLimiter = expressLimit.createConcurrentQueue(2);

// Apply the rate limiting middleware to all requests
app.use(limiter.checkLimitHandler);
app.use(conLimiter.checkLimitHandler);
```

## Instruction

### expressLimit

expressLimit 은 한 아이피에 대하여 분당 최대 요청할 수 있는 횟수를 제한합니다.

```ts
import rateLimit from "express-rate-limit";

const limiter = expressLimit.expressLimit({
    maxPerMinute: 30, // 분당 요청할 수 있는 최대 횟수
    resetTime: 60, // 60초로 지정
    errorCodeNumber: 404, // 요청이 초과할 시에 response Code
    type: "default", // 레디스를 사용하고자 하면 redis 를 넣어줍니다.
    handler: (req, res, next) => {
        // 요청 초과 시 callback handler
        res.json({ errorHandler: "this page is exceed request page" });
    },
});

limiter.setAccessStore(); // 기본 저장소를 생성합니다.
```

다음은 저장소를 레디스로 변경하고자 할 때 사용합니다.

```ts
import rateLimit from "express-rate-limit";

const limiter = expressLimit.expressLimit({
    maxPerMinute: 30, // 분당 요청할 수 있는 최대 횟수
    resetTime: 60, // 60초로 지정
    errorCodeNumber: 404, // 요청이 초과할 시에 response Code
    type: "redis", // 레디스를 사용하고자 하면 redis 를 넣어줍니다.
    handler: (req, res, next) => {
        // 요청 초과 시 callback handler
        res.json({ errorHandler: "this page is exceed request page" });
    },
});

limiter.setAccessStore(redisclient); // 레디스 클라이언트를 지정합니다.
```

레디스 외의 다른 라이브러리를 사용하거나 추가하여 세션을 제어할 때는 클래스를 구현하여 인스턴스를 집어넣어주시면 됩니다. 클래스 생성 방법은 아래와 같습니다.

```ts
class Store {
    constructor(store) {
        this.store = store;
    }

    async get(...rest) {
        print("this is prototype...");
        return null;
    }

    async set(...rest) {
        print("this is prototype...");
        return null;
    }
}
```

저장소 클래스를 만들어서 setAccessStore 메소드를 통해 저장소를 변경하면 되겠습니다.

### createConcurrentQueue

createConcurrentQueue 은 서버가 허용할 수 있는 최대 동시 접속을 제한합니다.

```ts
const conLimiter = expressLimit.createConcurrentQueue(2); // 최대 2명까지 동시 접속이 가능
```

## Issues and Contributing

If you encounter a bug or want to see something added/changed, please go ahead
and [open an issue](https://github.com/A-big-fish-in-a-small-pond/Express-Concurrent-Control/issues/new)!
If you need help with something, feel free to
[start a discussion](https://github.com/A-big-fish-in-a-small-pond/Express-Concurrent-Control/discussions/new)!

## License

MIT © [Park and Kim](http://github.com/libtv)
