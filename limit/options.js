const limiterOption = {
    maxPerMinute: 30,
    resetTime: 60,
    errorCodeNumber: 404,
    handler: null,
};

const errorCode = {
    errorCode: "404",
    errorMessage: "페이지를 요청하는 도중 요청량 초과로 인해 잠시 차단되었습니다. 잠시 후 다시 요청해주시기 바랍니다.",
};

module.exports.limiterOption = limiterOption;
module.exports.errorCode = errorCode;
