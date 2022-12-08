/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./packages/api-lib/src/errors/api-exception-factory.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.APIExceptionFactory = void 0;
const api_exception_1 = __webpack_require__("./packages/api-lib/src/errors/api-exception.ts");
function APIExceptionFactory(errors) {
    // Reformat errors to property: error string
    const extra = errors
        .map((error) => ({
        [error.property]: Object.values(error.constraints || []).join('. '),
    }))
        .reduce((acc, value) => {
        return Object.assign(Object.assign({}, acc), value);
    }, {});
    return new api_exception_1.ValidationFailedAPIException(extra);
}
exports.APIExceptionFactory = APIExceptionFactory;


/***/ }),

/***/ "./packages/api-lib/src/errors/api-exception-filter.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var APIExceptionFilter_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.APIExceptionFilter = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const api_exception_1 = __webpack_require__("./packages/api-lib/src/errors/api-exception.ts");
const shared_lib_1 = __webpack_require__("./packages/shared-lib/src/index.ts");
let APIExceptionFilter = APIExceptionFilter_1 = class APIExceptionFilter {
    constructor() {
        this.loggerService = new common_1.Logger(APIExceptionFilter_1.name);
    }
    catch(unknownException, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        // If this is an api exception from one of our other apis just pass it on
        const apiException = (0, shared_lib_1.parseAPIException)(unknownException);
        if (apiException) {
            response.status(apiException.status).json(apiException);
            return;
        }
        const request = ctx.getRequest();
        let exception;
        const traceId = String(request.id);
        if (unknownException instanceof api_exception_1.APIException) {
            exception = unknownException;
        }
        else if (unknownException instanceof common_1.NotFoundException) {
            exception = new api_exception_1.NotFoundAPIException();
        }
        else if (unknownException instanceof common_1.UnauthorizedException ||
            unknownException instanceof common_1.ForbiddenException) {
            exception = new api_exception_1.UnauthorizedAPIException();
        }
        else {
            exception = new api_exception_1.InternalServerErrorAPIException();
        }
        this.loggerService.error(Object.assign(Object.assign({}, exception), { traceId, err: unknownException }));
        const status = exception.getStatus();
        const res = {
            status,
            trace_id: traceId,
            code: exception.code,
            message: exception.getResponse().toString(),
            extra: exception.extra,
        };
        response.status(status).json(res);
    }
};
APIExceptionFilter = APIExceptionFilter_1 = tslib_1.__decorate([
    (0, common_1.Catch)()
], APIExceptionFilter);
exports.APIExceptionFilter = APIExceptionFilter;


/***/ }),

/***/ "./packages/api-lib/src/errors/api-exception.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ValidationWithMessageAPIException = exports.ZodValidationAPIException = exports.RequiredErrorAPIException = exports.RateLimitAPIException = exports.PlanNotFoundAPIException = exports.ForbiddenAPIException = exports.InvalidTokenAPIException = exports.UnauthorizedAPIException = exports.InternalServerErrorAPIException = exports.NotFoundAPIException = exports.CardInvalidYearAPIException = exports.CardInvalidMonthAPIException = exports.CardIncorrectNumberAPIException = exports.CardIncorrectCVCAPIException = exports.CardExpiredAPIException = exports.CardDeclinedAPIException = exports.GenericInvalidCardException = exports.PaymentGenericError = exports.SubScriptionLimitAPIException = exports.ValidationFailedAPIException = exports.APIException = void 0;
const common_1 = __webpack_require__("@nestjs/common");
const shared_lib_1 = __webpack_require__("./packages/shared-lib/src/index.ts");
class APIException extends common_1.HttpException {
    constructor(message, status, code, extra) {
        super(message, status);
        this.code = code;
        this.extra = extra;
    }
}
exports.APIException = APIException;
class ValidationFailedAPIException extends APIException {
    constructor(extra) {
        super('Validation Failed', common_1.HttpStatus.BAD_REQUEST, shared_lib_1.ErrorCode.ValidationFailed, extra);
    }
}
exports.ValidationFailedAPIException = ValidationFailedAPIException;
class SubScriptionLimitAPIException extends APIException {
    constructor(extra) {
        super('This user has reached the maximum number of orders allowed by the platform. Please log in as a different user to continue.', common_1.HttpStatus.BAD_REQUEST, shared_lib_1.ErrorCode.ValidationFailed, extra);
    }
}
exports.SubScriptionLimitAPIException = SubScriptionLimitAPIException;
class PaymentGenericError extends APIException {
    constructor(extra) {
        super('Payment Service generic error.', common_1.HttpStatus.BAD_REQUEST, shared_lib_1.ErrorCode.ValidationFailed, extra);
    }
}
exports.PaymentGenericError = PaymentGenericError;
class GenericInvalidCardException extends APIException {
    constructor(extra) {
        super(`The card you supplied couldn't be charged. Please check the details, or try another card.`, common_1.HttpStatus.PAYMENT_REQUIRED, shared_lib_1.ErrorCode.CardError, extra);
    }
}
exports.GenericInvalidCardException = GenericInvalidCardException;
class CardDeclinedAPIException extends APIException {
    constructor(extra) {
        super(`The provided card was declined. Please use a different card.`, common_1.HttpStatus.PAYMENT_REQUIRED, shared_lib_1.ErrorCode.CardError, extra);
    }
}
exports.CardDeclinedAPIException = CardDeclinedAPIException;
class CardExpiredAPIException extends APIException {
    constructor(extra) {
        super(`The provided card has expired. Please use a different card.`, common_1.HttpStatus.PAYMENT_REQUIRED, shared_lib_1.ErrorCode.CardError, extra);
    }
}
exports.CardExpiredAPIException = CardExpiredAPIException;
class CardIncorrectCVCAPIException extends APIException {
    constructor(extra) {
        super(`The card CVC was not accepted. Please check the CVC and try again.`, common_1.HttpStatus.PAYMENT_REQUIRED, shared_lib_1.ErrorCode.CardError, extra);
    }
}
exports.CardIncorrectCVCAPIException = CardIncorrectCVCAPIException;
class CardIncorrectNumberAPIException extends APIException {
    constructor(extra) {
        super(`The credit card number was not accepted. Please check the details or try another card.`, common_1.HttpStatus.PAYMENT_REQUIRED, shared_lib_1.ErrorCode.CardError, extra);
    }
}
exports.CardIncorrectNumberAPIException = CardIncorrectNumberAPIException;
class CardInvalidMonthAPIException extends APIException {
    constructor(extra) {
        super(`The month provided was invalid. Must be a number from 1 to 12.`, common_1.HttpStatus.PAYMENT_REQUIRED, shared_lib_1.ErrorCode.CardError, extra);
    }
}
exports.CardInvalidMonthAPIException = CardInvalidMonthAPIException;
class CardInvalidYearAPIException extends APIException {
    constructor(extra) {
        super(`The year provided was invalid. The month/year combination must be in the future.`, common_1.HttpStatus.PAYMENT_REQUIRED, shared_lib_1.ErrorCode.CardError, extra);
    }
}
exports.CardInvalidYearAPIException = CardInvalidYearAPIException;
class NotFoundAPIException extends APIException {
    constructor(extra) {
        super('Requested resource was not found', common_1.HttpStatus.NOT_FOUND, shared_lib_1.ErrorCode.NotFound, extra);
    }
}
exports.NotFoundAPIException = NotFoundAPIException;
class InternalServerErrorAPIException extends APIException {
    constructor(extra) {
        super('An internal server error occured, please contact support', common_1.HttpStatus.INTERNAL_SERVER_ERROR, shared_lib_1.ErrorCode.InternalServerError, extra);
    }
}
exports.InternalServerErrorAPIException = InternalServerErrorAPIException;
class UnauthorizedAPIException extends APIException {
    constructor(extra) {
        super('Not authorized to access requested resource', common_1.HttpStatus.UNAUTHORIZED, shared_lib_1.ErrorCode.Unauthorized, extra);
    }
}
exports.UnauthorizedAPIException = UnauthorizedAPIException;
class InvalidTokenAPIException extends APIException {
    constructor(extra) {
        super('Token is not valid', common_1.HttpStatus.BAD_REQUEST, shared_lib_1.ErrorCode.InvalidToken, extra);
    }
}
exports.InvalidTokenAPIException = InvalidTokenAPIException;
class ForbiddenAPIException extends APIException {
    constructor(extra) {
        super('Forbidden', common_1.HttpStatus.FORBIDDEN, shared_lib_1.ErrorCode.Forbidden, extra);
    }
}
exports.ForbiddenAPIException = ForbiddenAPIException;
class PlanNotFoundAPIException extends APIException {
    constructor(extra) {
        super('Order not found', common_1.HttpStatus.NOT_FOUND, shared_lib_1.ErrorCode.NotFound, extra);
    }
}
exports.PlanNotFoundAPIException = PlanNotFoundAPIException;
class RateLimitAPIException extends APIException {
    constructor(extra) {
        super('Rate limit exceeded, please throttle your requests and try again', common_1.HttpStatus.TOO_MANY_REQUESTS, shared_lib_1.ErrorCode.RateLimitError, extra);
    }
}
exports.RateLimitAPIException = RateLimitAPIException;
class RequiredErrorAPIException extends APIException {
    constructor(extra) {
        super('RequiredError on Api call', common_1.HttpStatus.BAD_REQUEST, shared_lib_1.ErrorCode.RequiredError, extra);
    }
}
exports.RequiredErrorAPIException = RequiredErrorAPIException;
class ZodValidationAPIException extends APIException {
    constructor(message, extra) {
        super(message, common_1.HttpStatus.BAD_REQUEST, shared_lib_1.ErrorCode.ValidationFailed, extra);
    }
}
exports.ZodValidationAPIException = ZodValidationAPIException;
class ValidationWithMessageAPIException extends APIException {
    constructor(message, extra) {
        super(message, common_1.HttpStatus.BAD_REQUEST, shared_lib_1.ErrorCode.ValidationFailed, extra);
    }
}
exports.ValidationWithMessageAPIException = ValidationWithMessageAPIException;


/***/ }),

/***/ "./packages/api-lib/src/errors/api-zod.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ApiZodValidationPipe = exports.ApiZodGuard = exports.zodErrorToApiError = void 0;
const nestjs_zod_1 = __webpack_require__("nestjs-zod");
const _1 = __webpack_require__("./packages/api-lib/src/errors/index.ts");
function zodErrorToApiError(error) {
    const extra = Object.fromEntries(error.issues.map((issue) => [issue.path.join('.'), issue.message]));
    return new _1.ValidationFailedAPIException(extra);
}
exports.zodErrorToApiError = zodErrorToApiError;
exports.ApiZodGuard = (0, nestjs_zod_1.createZodGuard)({
    createValidationException: zodErrorToApiError,
});
exports.ApiZodValidationPipe = (0, nestjs_zod_1.createZodValidationPipe)({
    createValidationException: zodErrorToApiError,
});


/***/ }),

/***/ "./packages/api-lib/src/errors/index.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__("tslib");
tslib_1.__exportStar(__webpack_require__("./packages/api-lib/src/errors/api-exception.ts"), exports);
tslib_1.__exportStar(__webpack_require__("./packages/api-lib/src/errors/api-exception-filter.ts"), exports);
tslib_1.__exportStar(__webpack_require__("./packages/api-lib/src/errors/api-exception-factory.ts"), exports);
tslib_1.__exportStar(__webpack_require__("./packages/api-lib/src/errors/api-zod.ts"), exports);


/***/ }),

/***/ "./packages/api-lib/src/http/index.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getInternalApiAuthorizationKey = exports.forwardHeaders = void 0;
const config_1 = __webpack_require__("@nestjs/config");
// Only forward appropiate headers
function forwardHeaders(headers, options = { enableInternalKey: true }) {
    const configService = new config_1.ConfigService();
    const result = {};
    if (options.enableInternalKey) {
        result.internal_key = configService.get('APP_INTERNAL_REQUEST_KEY') || '';
    }
    if (headers.authentication) {
        result.authentication = headers.authentication;
    }
    if (headers['trace-id']) {
        result['trace-id'] = headers['trace-id'];
    }
    return result;
}
exports.forwardHeaders = forwardHeaders;
function getInternalApiAuthorizationKey(prefix = 'Bearer') {
    const configService = new config_1.ConfigService();
    const prefixResult = prefix ? prefix + ' ' : '';
    const internalKey = configService.get('APP_INTERNAL_REQUEST_KEY') || '';
    if (!internalKey)
        throw Error('INTERNAL API KEY HAS NOT BEEN SET');
    return prefixResult + internalKey;
}
exports.getInternalApiAuthorizationKey = getInternalApiAuthorizationKey;


/***/ }),

/***/ "./packages/api-lib/src/index.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__("tslib");
tslib_1.__exportStar(__webpack_require__("./packages/api-lib/src/errors/index.ts"), exports);
tslib_1.__exportStar(__webpack_require__("./packages/api-lib/src/nest/index.ts"), exports);
tslib_1.__exportStar(__webpack_require__("./packages/api-lib/src/http/index.ts"), exports);


/***/ }),

/***/ "./packages/api-lib/src/nest/default-app-setup.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.defaultAppSetup = void 0;
const common_1 = __webpack_require__("@nestjs/common");
const __1 = __webpack_require__("./packages/api-lib/src/index.ts");
const nestjs_pino_1 = __webpack_require__("nestjs-pino");
const middleware_1 = __webpack_require__("./packages/api-lib/src/nest/middleware/index.ts");
function defaultAppSetup(app) {
    app.enableCors();
    app.use(middleware_1.traceIdMiddleware);
    const logger = app.get(nestjs_pino_1.Logger);
    app.useLogger(logger);
    app.useGlobalFilters(new __1.APIExceptionFilter());
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        exceptionFactory: __1.APIExceptionFactory,
    }));
}
exports.defaultAppSetup = defaultAppSetup;


/***/ }),

/***/ "./packages/api-lib/src/nest/guards/index.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__("tslib");
tslib_1.__exportStar(__webpack_require__("./packages/api-lib/src/nest/guards/jwt-internal-auth.guard.ts"), exports);


/***/ }),

/***/ "./packages/api-lib/src/nest/guards/jwt-internal-auth.guard.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtInternalAuthGuard = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const jwt_1 = __webpack_require__("next-auth/jwt");
const planpay_next_service_1 = __webpack_require__("./packages/api-lib/src/nest/services/planpay-next-service.ts");
let JwtInternalAuthGuard = class JwtInternalAuthGuard {
    constructor(planpayNextService) {
        this.planpayNextService = planpayNextService;
    }
    canActivate(context) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const req = context.switchToHttp().getRequest();
            if (!process.env.NEXTAUTH_SECRET) {
                throw new Error('NEXTAUTH_SECRET environment variable not set');
            }
            if (!req.headers.authorization) {
                return false;
            }
            const authToken = req.headers.authorization
                .replace('Bearer ', '')
                .toString();
            const tokenPayload = yield (0, jwt_1.decode)({
                token: authToken,
                secret: process.env.NEXTAUTH_SECRET,
            });
            if (!tokenPayload)
                return false;
            req.user = tokenPayload.user;
            this.planpayNextService.token = req.headers.authorization;
            return true;
        });
    }
};
JwtInternalAuthGuard = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof planpay_next_service_1.PlanpayNextService !== "undefined" && planpay_next_service_1.PlanpayNextService) === "function" ? _a : Object])
], JwtInternalAuthGuard);
exports.JwtInternalAuthGuard = JwtInternalAuthGuard;


/***/ }),

/***/ "./packages/api-lib/src/nest/index.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__("tslib");
tslib_1.__exportStar(__webpack_require__("./packages/api-lib/src/nest/default-app-setup.ts"), exports);
tslib_1.__exportStar(__webpack_require__("./packages/api-lib/src/nest/services/index.ts"), exports);
tslib_1.__exportStar(__webpack_require__("./packages/api-lib/src/nest/modules/index.ts"), exports);
tslib_1.__exportStar(__webpack_require__("./packages/api-lib/src/nest/guards/index.ts"), exports);


/***/ }),

/***/ "./packages/api-lib/src/nest/middleware/index.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__("tslib");
tslib_1.__exportStar(__webpack_require__("./packages/api-lib/src/nest/middleware/traceid.middleware.ts"), exports);


/***/ }),

/***/ "./packages/api-lib/src/nest/middleware/traceid.middleware.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.traceIdMiddleware = void 0;
const uuid_1 = __webpack_require__("uuid");
function traceIdMiddleware(req, _res, next) {
    const traceId = req.get('x-trace-id') || (0, uuid_1.v4)();
    req.id = traceId;
    next();
}
exports.traceIdMiddleware = traceIdMiddleware;


/***/ }),

/***/ "./packages/api-lib/src/nest/modules/index.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__("tslib");
tslib_1.__exportStar(__webpack_require__("./packages/api-lib/src/nest/modules/logger.module.ts"), exports);


/***/ }),

/***/ "./packages/api-lib/src/nest/modules/logger.module.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoggerModule = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const config_1 = __webpack_require__("@nestjs/config");
const nestjs_pino_1 = __webpack_require__("nestjs-pino");
let LoggerModule = class LoggerModule {
};
LoggerModule = tslib_1.__decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            nestjs_pino_1.LoggerModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                    const level = config.get('APP_LOG_LEVEL') || 'debug';
                    const logFormat = config.get('APP_LOG_FORMAT' || 0);
                    if (logFormat === 'pretty') {
                        return {
                            pinoHttp: {
                                level,
                                transport: {
                                    target: 'pino-pretty',
                                    options: {
                                        color: true,
                                    },
                                },
                            },
                        };
                    }
                    else {
                        return {
                            pinoHttp: {
                                level,
                            },
                        };
                    }
                }),
            }),
        ],
    })
], LoggerModule);
exports.LoggerModule = LoggerModule;


/***/ }),

/***/ "./packages/api-lib/src/nest/services/index.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__("tslib");
tslib_1.__exportStar(__webpack_require__("./packages/api-lib/src/nest/services/plan-api-service.ts"), exports);
tslib_1.__exportStar(__webpack_require__("./packages/api-lib/src/nest/services/notification-api-service.ts"), exports);
tslib_1.__exportStar(__webpack_require__("./packages/api-lib/src/nest/services/payment-api-service.ts"), exports);
tslib_1.__exportStar(__webpack_require__("./packages/api-lib/src/nest/services/planpay-next-service.ts"), exports);


/***/ }),

/***/ "./packages/api-lib/src/nest/services/notification-api-service.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationApiService = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const config_1 = __webpack_require__("@nestjs/config");
const notification_client_1 = __webpack_require__("./packages/notification-client/src/index.ts");
let NotificationApiService = class NotificationApiService extends notification_client_1.NotificationApi {
    constructor(configService) {
        const apiConfigs = new notification_client_1.Configuration({
            baseOptions: {
                headers: {
                    'Cache-Control': 'no-cache',
                    Pragma: 'no-cache',
                    Expires: '0',
                },
            },
        });
        super(apiConfigs, configService.get('APP_SERVICE_NOTIFICATION_URL'));
    }
};
NotificationApiService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], NotificationApiService);
exports.NotificationApiService = NotificationApiService;


/***/ }),

/***/ "./packages/api-lib/src/nest/services/payment-api-service.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PaymentApiService = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const config_1 = __webpack_require__("@nestjs/config");
const payment_client_1 = __webpack_require__("./packages/payment-client/src/index.ts");
let PaymentApiService = class PaymentApiService extends payment_client_1.PaymentApi {
    constructor(configService) {
        const apiConfigs = new payment_client_1.Configuration({
            baseOptions: {
                headers: {
                    'Cache-Control': 'no-cache',
                    Pragma: 'no-cache',
                    Expires: '0',
                },
            },
        });
        super(apiConfigs, configService.get('APP_SERVICE_PAYMENT_URL'));
    }
};
PaymentApiService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], PaymentApiService);
exports.PaymentApiService = PaymentApiService;


/***/ }),

/***/ "./packages/api-lib/src/nest/services/plan-api-service.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PlanApiService = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const config_1 = __webpack_require__("@nestjs/config");
const plan_client_1 = __webpack_require__("./packages/plan-client/src/index.ts");
let PlanApiService = class PlanApiService extends plan_client_1.PlanApi {
    constructor(configService) {
        const apiConfigs = new plan_client_1.Configuration({
            baseOptions: {
                headers: {
                    'Cache-Control': 'no-cache',
                    Pragma: 'no-cache',
                    Expires: '0',
                },
            },
        });
        super(apiConfigs, configService.get('APP_SERVICE_PLAN_URL'));
    }
};
PlanApiService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], PlanApiService);
exports.PlanApiService = PlanApiService;


/***/ }),

/***/ "./packages/api-lib/src/nest/services/planpay-next-service.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var PlanpayNextService_1;
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PlanpayNextService = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const config_1 = __webpack_require__("@nestjs/config");
const client_1 = __webpack_require__("@trpc/client");
const superjson_1 = tslib_1.__importDefault(__webpack_require__("superjson"));
const cross_fetch_1 = tslib_1.__importDefault(__webpack_require__("cross-fetch"));
let PlanpayNextService = PlanpayNextService_1 = class PlanpayNextService {
    constructor(configService) {
        this.loggerService = new common_1.Logger(PlanpayNextService_1.name);
        const url = configService.get('APP_SERVICE_PLANPAY_NEXT_URL');
        this.loggerService.log(`Initialising PlanpayNextService with url: ${url}`);
        const self = this; // eslint-disable-line
        this.client = (0, client_1.createTRPCProxyClient)({
            transformer: superjson_1.default,
            links: [
                (0, client_1.httpBatchLink)({
                    url: `${url}/api/trpc`,
                    fetch: cross_fetch_1.default,
                    headers() {
                        return {
                            Authorization: self.getToken(),
                        };
                    },
                }),
            ],
        });
    }
    getToken() {
        let token = this.token;
        if (!token.includes(' ')) {
            token = 'Bearer ' + token;
        }
        return token;
    }
};
PlanpayNextService = PlanpayNextService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], PlanpayNextService);
exports.PlanpayNextService = PlanpayNextService;


/***/ }),

/***/ "./packages/authnz-lib/src/casl/action.ts":
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Action = void 0;
var Action;
(function (Action) {
    Action["Create"] = "create";
    Action["Read"] = "read";
    Action["Update"] = "update";
    Action["Delete"] = "delete";
})(Action = exports.Action || (exports.Action = {}));


/***/ }),

/***/ "./packages/authnz-lib/src/casl/index.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__("tslib");
tslib_1.__exportStar(__webpack_require__("./packages/authnz-lib/src/casl/action.ts"), exports);


/***/ }),

/***/ "./packages/authnz-lib/src/index.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__("tslib");
tslib_1.__exportStar(__webpack_require__("./packages/authnz-lib/src/casl/index.ts"), exports);
tslib_1.__exportStar(__webpack_require__("./packages/authnz-lib/src/middleware/index.ts"), exports);
tslib_1.__exportStar(__webpack_require__("./packages/authnz-lib/src/utils/index.ts"), exports);


/***/ }),

/***/ "./packages/authnz-lib/src/middleware/apikey.middleware.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var ApiKeyMiddleware_1;
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ApiKeyMiddleware = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const api_lib_1 = __webpack_require__("./packages/api-lib/src/index.ts");
let ApiKeyMiddleware = ApiKeyMiddleware_1 = class ApiKeyMiddleware {
    constructor(planpayNextService) {
        this.planpayNextService = planpayNextService;
        this.loggerService = new common_1.Logger(ApiKeyMiddleware_1.name);
    }
    use(req, _res, next) {
        const apiKey = req.headers.authorization;
        if (apiKey && apiKey.toLowerCase().startsWith('basic')) {
            this.planpayNextService.token = apiKey;
            this.planpayNextService.client.auth.getPermissions
                .query()
                .then((res) => {
                req.permissions = res;
            })
                .then(() => next())
                .catch((e) => {
                this.loggerService.error(e);
                next();
            });
        }
        else {
            next();
        }
    }
};
ApiKeyMiddleware = ApiKeyMiddleware_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof api_lib_1.PlanpayNextService !== "undefined" && api_lib_1.PlanpayNextService) === "function" ? _a : Object])
], ApiKeyMiddleware);
exports.ApiKeyMiddleware = ApiKeyMiddleware;


/***/ }),

/***/ "./packages/authnz-lib/src/middleware/index.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__("tslib");
tslib_1.__exportStar(__webpack_require__("./packages/authnz-lib/src/middleware/apikey.middleware.ts"), exports);


/***/ }),

/***/ "./packages/authnz-lib/src/utils/index.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__("tslib");
tslib_1.__exportStar(__webpack_require__("./packages/authnz-lib/src/utils/utils.ts"), exports);


/***/ }),

/***/ "./packages/authnz-lib/src/utils/utils.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.parseAction = exports.parseAuthorizationHeader = exports.toMerchantApiKeyAuthorizationHeader = exports.base64Encode = void 0;
const api_lib_1 = __webpack_require__("./packages/api-lib/src/index.ts");
const casl_1 = __webpack_require__("./packages/authnz-lib/src/casl/index.ts");
const base64Encode = (str) => Buffer.from(str, 'binary').toString('base64');
exports.base64Encode = base64Encode;
const toMerchantApiKeyAuthorizationHeader = ({ merchantId, secretValue, }) => `Basic ${(0, exports.base64Encode)(`${merchantId}:${secretValue}`)}`;
exports.toMerchantApiKeyAuthorizationHeader = toMerchantApiKeyAuthorizationHeader;
function parseAuthorizationHeader(authorization) {
    const BASIC_AUTH_TYPE_LOWER = 'basic';
    if (!authorization)
        throw new api_lib_1.UnauthorizedAPIException({
            message: 'Authorization header must be provided.',
        });
    try {
        const [authType, authBase64Value] = authorization.trim().split(' ');
        switch (authType.toLowerCase()) {
            case BASIC_AUTH_TYPE_LOWER: {
                const [merchantId, password] = Buffer.from(authBase64Value, 'base64')
                    .toString('binary')
                    .split(':');
                return {
                    authType,
                    merchantId,
                    password,
                };
            }
            default: {
                // AJN 20220906t1341 JWTs are currently handled by middleware at a module level.
                return {
                    authType,
                    merchantId: null,
                    password: null,
                };
            }
        }
    }
    catch (error) {
        console.error({ message: 'Invalid Authorization header.' });
        throw new api_lib_1.UnauthorizedAPIException();
    }
}
exports.parseAuthorizationHeader = parseAuthorizationHeader;
function parseAction(action) {
    switch (action) {
        case 'create':
            return casl_1.Action.Create;
        case 'read':
            return casl_1.Action.Read;
        case 'update':
            return casl_1.Action.Update;
        case 'delete':
            return casl_1.Action.Delete;
    }
    throw new Error('Unknown action ' + action);
}
exports.parseAction = parseAction;


/***/ }),

/***/ "./packages/merchant-demo-service/src/app/app.controller.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppController = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const app_service_1 = __webpack_require__("./packages/merchant-demo-service/src/app/app.service.ts");
let AppController = class AppController {
    constructor(appService) {
        this.appService = appService;
    }
    getData() {
        return this.appService.getData();
    }
};
tslib_1.__decorate([
    (0, common_1.Get)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], AppController.prototype, "getData", null);
AppController = tslib_1.__decorate([
    (0, common_1.Controller)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof app_service_1.AppService !== "undefined" && app_service_1.AppService) === "function" ? _a : Object])
], AppController);
exports.AppController = AppController;


/***/ }),

/***/ "./packages/merchant-demo-service/src/app/app.module.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const api_lib_1 = __webpack_require__("./packages/api-lib/src/index.ts");
const checkout_session_module_1 = __webpack_require__("./packages/merchant-demo-service/src/checkouts/checkout-session.module.ts");
const app_controller_1 = __webpack_require__("./packages/merchant-demo-service/src/app/app.controller.ts");
const app_service_1 = __webpack_require__("./packages/merchant-demo-service/src/app/app.service.ts");
let AppModule = class AppModule {
};
AppModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [checkout_session_module_1.CheckoutSessionModule, api_lib_1.LoggerModule],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
exports.AppModule = AppModule;


/***/ }),

/***/ "./packages/merchant-demo-service/src/app/app.service.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppService = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
let AppService = class AppService {
    getData() {
        return { message: 'Welcome to merchant-demo-service!' };
    }
};
AppService = tslib_1.__decorate([
    (0, common_1.Injectable)()
], AppService);
exports.AppService = AppService;


/***/ }),

/***/ "./packages/merchant-demo-service/src/checkouts/checkout-session.module.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CheckoutSessionModule = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const config_1 = __webpack_require__("@nestjs/config");
const validate_checkout_session_controller_1 = __webpack_require__("./packages/merchant-demo-service/src/checkouts/validate-checkout-session.controller.ts");
const checkout_session_service_1 = __webpack_require__("./packages/merchant-demo-service/src/checkouts/checkout-session.service.ts");
const create_checkout_session_controller_1 = __webpack_require__("./packages/merchant-demo-service/src/checkouts/create-checkout-session.controller.ts");
const create_checkout_session_service_1 = __webpack_require__("./packages/merchant-demo-service/src/checkouts/create-checkout-session.service.ts");
const createCheckoutSessionSevice_interface_1 = __webpack_require__("./packages/merchant-demo-service/src/checkouts/interfaces/createCheckoutSessionSevice.interface.ts");
const shared_lib_1 = __webpack_require__("./packages/shared-lib/src/index.ts");
const envconst_1 = __webpack_require__("./packages/merchant-demo-service/src/envconst.ts");
const planpay_client_1 = __webpack_require__("./packages/planpay-client/src/index.ts");
let CheckoutSessionModule = class CheckoutSessionModule {
};
CheckoutSessionModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
        ],
        providers: [
            checkout_session_service_1.CheckoutSessionService,
            {
                provide: createCheckoutSessionSevice_interface_1.AbstractCreateCheckoutSessionService,
                useClass: create_checkout_session_service_1.CreateCheckoutSessionService,
            },
            config_1.ConfigService,
            {
                inject: [config_1.ConfigService],
                provide: planpay_client_1.CheckoutApi,
                useFactory: (configService) => {
                    const checkoutServiceBaseUrl = configService.get(envconst_1.envconst.APP_CREATE_CHECKOUT_SESSION_URL);
                    if (!checkoutServiceBaseUrl) {
                        throw new Error(`Missing required configuration value for ${envconst_1.envconst.APP_CREATE_CHECKOUT_SESSION_URL}`);
                    }
                    return new planpay_client_1.CheckoutApi(undefined, checkoutServiceBaseUrl, (0, shared_lib_1.createAxiosInstance)(checkoutServiceBaseUrl));
                },
            },
        ],
        controllers: [
            validate_checkout_session_controller_1.ValidateCheckoutSessionController,
            create_checkout_session_controller_1.CreateCheckoutSessionController,
        ],
    })
], CheckoutSessionModule);
exports.CheckoutSessionModule = CheckoutSessionModule;


/***/ }),

/***/ "./packages/merchant-demo-service/src/checkouts/checkout-session.service.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CheckoutSessionService = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const test_data_1 = __webpack_require__("./packages/test-data/src/index.ts");
const api_lib_1 = __webpack_require__("./packages/api-lib/src/index.ts");
const planpay_client_1 = __webpack_require__("./packages/planpay-client/src/index.ts");
let CheckoutSessionService = class CheckoutSessionService {
    constructor(checkoutClient) {
        this.checkoutClient = checkoutClient;
    }
    validateCheckoutSession(validateDto) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const merchant = test_data_1.merchantDemo.find(({ merchantId }) => {
                return merchantId == validateDto.merchantId;
            });
            if (!merchant) {
                throw new api_lib_1.ValidationFailedAPIException({
                    message: `Merchant with ID ${validateDto.merchantId} not found.`,
                });
            }
            const { data } = yield this.checkoutClient.queryCheckoutGetCheckout(validateDto.checkoutId, { headers: { authorization: merchant.authorization } });
            return data;
        });
    }
};
CheckoutSessionService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof planpay_client_1.CheckoutApi !== "undefined" && planpay_client_1.CheckoutApi) === "function" ? _a : Object])
], CheckoutSessionService);
exports.CheckoutSessionService = CheckoutSessionService;


/***/ }),

/***/ "./packages/merchant-demo-service/src/checkouts/create-checkout-session.controller.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var CreateCheckoutSessionController_1;
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateCheckoutSessionController = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const swagger_1 = __webpack_require__("@nestjs/swagger");
const create_checkout_session_schema_1 = __webpack_require__("./packages/merchant-demo-service/src/checkouts/dto/create-checkout-session.schema.ts");
const nestjs_zod_1 = __webpack_require__("nestjs-zod");
const createCheckoutSessionSevice_interface_1 = __webpack_require__("./packages/merchant-demo-service/src/checkouts/interfaces/createCheckoutSessionSevice.interface.ts");
class CreateCheckoutSessionDto extends (0, nestjs_zod_1.createZodDto)(create_checkout_session_schema_1.CreateCheckoutSessionSchema) {
}
let CreateCheckoutSessionController = CreateCheckoutSessionController_1 = class CreateCheckoutSessionController {
    constructor(createCheckoutSessionService) {
        this.createCheckoutSessionService = createCheckoutSessionService;
        this.loggerService = new common_1.Logger(CreateCheckoutSessionController_1.name);
    }
    create(createCheckoutSessionDto) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.createCheckoutSessionService.checkOutProduct(Object.assign(Object.assign({}, createCheckoutSessionDto), { currencyCode: 'AUD', merchantOrderId: 1 }));
        });
    }
};
tslib_1.__decorate([
    (0, common_1.Post)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [CreateCheckoutSessionDto]),
    tslib_1.__metadata("design:returntype", typeof (_b = typeof Promise !== "undefined" && Promise) === "function" ? _b : Object)
], CreateCheckoutSessionController.prototype, "create", null);
CreateCheckoutSessionController = CreateCheckoutSessionController_1 = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('create-checkout-session'),
    (0, common_1.Controller)('create-checkout-session'),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof createCheckoutSessionSevice_interface_1.AbstractCreateCheckoutSessionService !== "undefined" && createCheckoutSessionSevice_interface_1.AbstractCreateCheckoutSessionService) === "function" ? _a : Object])
], CreateCheckoutSessionController);
exports.CreateCheckoutSessionController = CreateCheckoutSessionController;


/***/ }),

/***/ "./packages/merchant-demo-service/src/checkouts/create-checkout-session.service.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateCheckoutSessionService = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const config_1 = __webpack_require__("@nestjs/config");
const test_data_1 = __webpack_require__("./packages/test-data/src/index.ts");
const planpay_client_1 = __webpack_require__("./packages/planpay-client/src/index.ts");
const envconst_1 = __webpack_require__("./packages/merchant-demo-service/src/envconst.ts");
const api_lib_1 = __webpack_require__("./packages/api-lib/src/index.ts");
let CreateCheckoutSessionService = class CreateCheckoutSessionService {
    constructor(configService, checkoutClient) {
        this.configService = configService;
        this.checkoutClient = checkoutClient;
        this.MERCHANT_ID_HEADER_NAME = 'planpay_merchant_id';
    }
    formatCheckoutSessionToCheckoutDto(checkoutSession) {
        console.log({ checkoutSession, merchantDemo: test_data_1.merchantDemo });
        const foundMerchantData = test_data_1.merchantDemo.find((merchant) => checkoutSession.merchantId === merchant.merchantId);
        if (!foundMerchantData) {
            throw new common_1.BadRequestException(404, 'Current merchant is not found.');
        }
        if ((checkoutSession.items || []).length == 0) {
            throw new common_1.BadRequestException(404, "Items can't be empty!");
        }
        if (!envconst_1.envconst.APP_CREATE_CHECKOUT_SESSION_REDIRECT_URL) {
            throw new api_lib_1.ValidationFailedAPIException({
                message: `Missing required ${envconst_1.envconst.APP_CREATE_CHECKOUT_SESSION_REDIRECT_URL} configuration.`,
            });
        }
        const redirectUrl = new URL(this.configService.get(envconst_1.envconst.APP_CREATE_CHECKOUT_SESSION_REDIRECT_URL) || '');
        redirectUrl.searchParams.set(this.MERCHANT_ID_HEADER_NAME, foundMerchantData.merchantId);
        return {
            authorization: foundMerchantData.authorization,
            createCheckoutRequestDto: {
                merchantId: foundMerchantData.merchantId,
                merchantOrderId: foundMerchantData.merchantOrderId,
                currencyCode: foundMerchantData.currencyCode,
                redirectURL: redirectUrl.toString(),
                items: checkoutSession.items.reduce((items, item) => {
                    const product = foundMerchantData.items.find((p) => p.sku === item.sku);
                    if (!product) {
                        throw new common_1.BadRequestException(400, `SKU ${item.sku} not found for merchant ${foundMerchantData.merchantId}.`);
                    }
                    console.log({ item });
                    const mappedItem = {
                        sku: product.sku,
                        quantity: item.quantity,
                        costPerItem: product.costPerItem,
                        merchantProductURL: product.merchantProductURL,
                        description: product.description,
                        paymentDeadline: product.paymentDeadline,
                        depositRefundable: product.depositRefundable,
                        redemptionDate: item.estimatedShipmentDate.toString(),
                        refundPolicies: product.refundPolicies,
                        minimumDepositPerItem: product.minimumDepositPerItem,
                    };
                    return [...items, mappedItem];
                }, []),
            },
        };
    }
    checkOutProduct(checkoutSession) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { authorization, createCheckoutRequestDto } = this.formatCheckoutSessionToCheckoutDto(checkoutSession);
            const { data } = yield this.checkoutClient.mutationCheckoutCreateCheckout(createCheckoutRequestDto, { headers: { authorization: authorization } });
            return data;
        });
    }
};
CreateCheckoutSessionService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object, typeof (_b = typeof planpay_client_1.CheckoutApi !== "undefined" && planpay_client_1.CheckoutApi) === "function" ? _b : Object])
], CreateCheckoutSessionService);
exports.CreateCheckoutSessionService = CreateCheckoutSessionService;


/***/ }),

/***/ "./packages/merchant-demo-service/src/checkouts/dto/create-checkout-session.schema.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateCheckoutSessionSchema = exports.checkoutSessionItemSchema = void 0;
const zod_1 = __webpack_require__("zod");
const futureDateSchema = (propertyName) => zod_1.z
    .preprocess((arg) => {
    if (typeof arg == 'string' || arg instanceof Date)
        return new Date(arg);
}, zod_1.z.date())
    .refine((date) => {
    const newDate = new Date(date);
    console.log(typeof new Date(date));
    return newDate > new Date(Date.now());
}, `The ${propertyName} must be after the current time.`);
exports.checkoutSessionItemSchema = zod_1.z.object({
    sku: zod_1.z
        .string({ required_error: 'SKU is required' })
        .nonempty()
        .describe('An SKU (Stock Keeping Unit) representing a discrete item that is being purchased with this checkout. Note that this will be used with the quantity property to determine how many instances of that SKU will be purchased.'),
    quantity: zod_1.z.number().int().gt(0, 'Quantity is greater than 0'),
    estimatedShipmentDate: futureDateSchema('estimatedShipmentDate'),
});
exports.CreateCheckoutSessionSchema = zod_1.z.object({
    merchantId: zod_1.z.string(),
    items: zod_1.z.array(exports.checkoutSessionItemSchema).nonempty(),
});


/***/ }),

/***/ "./packages/merchant-demo-service/src/checkouts/dto/validate-checkout-session.dto.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ValidateCheckoutRequestDto = exports.ValidateCheckoutSchema = void 0;
const zod_1 = __webpack_require__("zod");
const nestjs_zod_1 = __webpack_require__("nestjs-zod");
exports.ValidateCheckoutSchema = zod_1.z.object({
    checkoutId: zod_1.z.string().nonempty(),
    merchantId: zod_1.z.string().nonempty(),
    authorization: zod_1.z.string().optional().nullable(),
});
class ValidateCheckoutRequestDto extends (0, nestjs_zod_1.createZodDto)(exports.ValidateCheckoutSchema) {
}
exports.ValidateCheckoutRequestDto = ValidateCheckoutRequestDto;


/***/ }),

/***/ "./packages/merchant-demo-service/src/checkouts/interfaces/createCheckoutSessionSevice.interface.ts":
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AbstractCreateCheckoutSessionService = void 0;
/**
 * Provides business logic for working with Checkout objects.
 */
class AbstractCreateCheckoutSessionService {
}
exports.AbstractCreateCheckoutSessionService = AbstractCreateCheckoutSessionService;


/***/ }),

/***/ "./packages/merchant-demo-service/src/checkouts/validate-checkout-session.controller.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var ValidateCheckoutSessionController_1;
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ValidateCheckoutSessionController = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const swagger_1 = __webpack_require__("@nestjs/swagger");
const api_lib_1 = __webpack_require__("./packages/api-lib/src/index.ts");
const checkout_session_service_1 = __webpack_require__("./packages/merchant-demo-service/src/checkouts/checkout-session.service.ts");
const validate_checkout_session_dto_1 = __webpack_require__("./packages/merchant-demo-service/src/checkouts/dto/validate-checkout-session.dto.ts");
let ValidateCheckoutSessionController = ValidateCheckoutSessionController_1 = class ValidateCheckoutSessionController {
    constructor(checkoutSessionSerice) {
        this.checkoutSessionSerice = checkoutSessionSerice;
        this.loggerService = new common_1.Logger(ValidateCheckoutSessionController_1.name);
    }
    validateCheckout(validateDto) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.checkoutSessionSerice.validateCheckoutSession(validateDto);
        });
    }
};
tslib_1.__decorate([
    (0, common_1.Post)('validate'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_b = typeof validate_checkout_session_dto_1.ValidateCheckoutRequestDto !== "undefined" && validate_checkout_session_dto_1.ValidateCheckoutRequestDto) === "function" ? _b : Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ValidateCheckoutSessionController.prototype, "validateCheckout", null);
ValidateCheckoutSessionController = ValidateCheckoutSessionController_1 = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('checkout-session'),
    (0, common_1.UsePipes)(api_lib_1.ApiZodValidationPipe),
    (0, common_1.Controller)('checkout-session'),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof checkout_session_service_1.CheckoutSessionService !== "undefined" && checkout_session_service_1.CheckoutSessionService) === "function" ? _a : Object])
], ValidateCheckoutSessionController);
exports.ValidateCheckoutSessionController = ValidateCheckoutSessionController;


/***/ }),

/***/ "./packages/merchant-demo-service/src/envconst.ts":
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.envconst = void 0;
exports.envconst = {
    APP_CREATE_CHECKOUT_SESSION_URL: 'APP_CREATE_CHECKOUT_SESSION_URL',
    APP_CREATE_CHECKOUT_SESSION_REDIRECT_URL: 'APP_CREATE_CHECKOUT_SESSION_REDIRECT_URL',
};


/***/ }),

/***/ "./packages/notification-client/src/api.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/* tslint:disable */
/* eslint-disable */
/**
 * Notification Service
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationApi = exports.NotificationApiFactory = exports.NotificationApiFp = exports.NotificationApiAxiosParamCreator = void 0;
const tslib_1 = __webpack_require__("tslib");
const axios_1 = tslib_1.__importDefault(__webpack_require__("axios"));
// Some imports not used depending on template conditions
// @ts-ignore
const common_1 = __webpack_require__("./packages/notification-client/src/common.ts");
// @ts-ignore
const base_1 = __webpack_require__("./packages/notification-client/src/base.ts");
/**
 * NotificationApi - axios parameter creator
 * @export
 */
const NotificationApiAxiosParamCreator = function (configuration) {
    return {
        /**
         *
         * @param {ConfirmationPlanEmailCreateInput} confirmationPlanEmailCreateInput
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        emailControllerConfirmationEmail: (confirmationPlanEmailCreateInput, options = {}) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'confirmationPlanEmailCreateInput' is not null or undefined
            (0, common_1.assertParamExists)('emailControllerConfirmationEmail', 'confirmationPlanEmailCreateInput', confirmationPlanEmailCreateInput);
            const localVarPath = `/notification/email/plan-confirmation`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'POST' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            localVarHeaderParameter['Content-Type'] = 'application/json';
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            localVarRequestOptions.data = (0, common_1.serializeDataIfNeeded)(confirmationPlanEmailCreateInput, localVarRequestOptions, configuration);
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         *
         * @param {FailedPaymentCreateInput} failedPaymentCreateInput
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        emailControllerPlanFailedPayment: (failedPaymentCreateInput, options = {}) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'failedPaymentCreateInput' is not null or undefined
            (0, common_1.assertParamExists)('emailControllerPlanFailedPayment', 'failedPaymentCreateInput', failedPaymentCreateInput);
            const localVarPath = `/notification/email/plan-failed-payment`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'POST' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            localVarHeaderParameter['Content-Type'] = 'application/json';
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            localVarRequestOptions.data = (0, common_1.serializeDataIfNeeded)(failedPaymentCreateInput, localVarRequestOptions, configuration);
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         *
         * @param {LastPaymentCreateInput} lastPaymentCreateInput
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        emailControllerPlanFinished: (lastPaymentCreateInput, options = {}) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'lastPaymentCreateInput' is not null or undefined
            (0, common_1.assertParamExists)('emailControllerPlanFinished', 'lastPaymentCreateInput', lastPaymentCreateInput);
            const localVarPath = `/notification/email/plan-finished`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'POST' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            localVarHeaderParameter['Content-Type'] = 'application/json';
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            localVarRequestOptions.data = (0, common_1.serializeDataIfNeeded)(lastPaymentCreateInput, localVarRequestOptions, configuration);
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         *
         * @param {MissedPaymentCreateInput} missedPaymentCreateInput
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        emailControllerPlanMissedPayment: (missedPaymentCreateInput, options = {}) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'missedPaymentCreateInput' is not null or undefined
            (0, common_1.assertParamExists)('emailControllerPlanMissedPayment', 'missedPaymentCreateInput', missedPaymentCreateInput);
            const localVarPath = `/notification/email/plan-missed-payment`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'POST' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            localVarHeaderParameter['Content-Type'] = 'application/json';
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            localVarRequestOptions.data = (0, common_1.serializeDataIfNeeded)(missedPaymentCreateInput, localVarRequestOptions, configuration);
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         *
         * @param {PaidPercentCreateInput} paidPercentCreateInput
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        emailControllerPlanPaidPercent: (paidPercentCreateInput, options = {}) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'paidPercentCreateInput' is not null or undefined
            (0, common_1.assertParamExists)('emailControllerPlanPaidPercent', 'paidPercentCreateInput', paidPercentCreateInput);
            const localVarPath = `/notification/email/plan-paid-percent`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'POST' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            localVarHeaderParameter['Content-Type'] = 'application/json';
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            localVarRequestOptions.data = (0, common_1.serializeDataIfNeeded)(paidPercentCreateInput, localVarRequestOptions, configuration);
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         *
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        healthControllerCheckHealth: (options = {}) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const localVarPath = `/notification/health`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'GET' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
    };
};
exports.NotificationApiAxiosParamCreator = NotificationApiAxiosParamCreator;
/**
 * NotificationApi - functional programming interface
 * @export
 */
const NotificationApiFp = function (configuration) {
    const localVarAxiosParamCreator = (0, exports.NotificationApiAxiosParamCreator)(configuration);
    return {
        /**
         *
         * @param {ConfirmationPlanEmailCreateInput} confirmationPlanEmailCreateInput
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        emailControllerConfirmationEmail(confirmationPlanEmailCreateInput, options) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.emailControllerConfirmationEmail(confirmationPlanEmailCreateInput, options);
                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
        /**
         *
         * @param {FailedPaymentCreateInput} failedPaymentCreateInput
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        emailControllerPlanFailedPayment(failedPaymentCreateInput, options) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.emailControllerPlanFailedPayment(failedPaymentCreateInput, options);
                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
        /**
         *
         * @param {LastPaymentCreateInput} lastPaymentCreateInput
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        emailControllerPlanFinished(lastPaymentCreateInput, options) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.emailControllerPlanFinished(lastPaymentCreateInput, options);
                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
        /**
         *
         * @param {MissedPaymentCreateInput} missedPaymentCreateInput
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        emailControllerPlanMissedPayment(missedPaymentCreateInput, options) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.emailControllerPlanMissedPayment(missedPaymentCreateInput, options);
                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
        /**
         *
         * @param {PaidPercentCreateInput} paidPercentCreateInput
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        emailControllerPlanPaidPercent(paidPercentCreateInput, options) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.emailControllerPlanPaidPercent(paidPercentCreateInput, options);
                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
        /**
         *
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        healthControllerCheckHealth(options) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.healthControllerCheckHealth(options);
                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
    };
};
exports.NotificationApiFp = NotificationApiFp;
/**
 * NotificationApi - factory interface
 * @export
 */
const NotificationApiFactory = function (configuration, basePath, axios) {
    const localVarFp = (0, exports.NotificationApiFp)(configuration);
    return {
        /**
         *
         * @param {ConfirmationPlanEmailCreateInput} confirmationPlanEmailCreateInput
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        emailControllerConfirmationEmail(confirmationPlanEmailCreateInput, options) {
            return localVarFp
                .emailControllerConfirmationEmail(confirmationPlanEmailCreateInput, options)
                .then((request) => request(axios, basePath));
        },
        /**
         *
         * @param {FailedPaymentCreateInput} failedPaymentCreateInput
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        emailControllerPlanFailedPayment(failedPaymentCreateInput, options) {
            return localVarFp
                .emailControllerPlanFailedPayment(failedPaymentCreateInput, options)
                .then((request) => request(axios, basePath));
        },
        /**
         *
         * @param {LastPaymentCreateInput} lastPaymentCreateInput
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        emailControllerPlanFinished(lastPaymentCreateInput, options) {
            return localVarFp
                .emailControllerPlanFinished(lastPaymentCreateInput, options)
                .then((request) => request(axios, basePath));
        },
        /**
         *
         * @param {MissedPaymentCreateInput} missedPaymentCreateInput
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        emailControllerPlanMissedPayment(missedPaymentCreateInput, options) {
            return localVarFp
                .emailControllerPlanMissedPayment(missedPaymentCreateInput, options)
                .then((request) => request(axios, basePath));
        },
        /**
         *
         * @param {PaidPercentCreateInput} paidPercentCreateInput
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        emailControllerPlanPaidPercent(paidPercentCreateInput, options) {
            return localVarFp
                .emailControllerPlanPaidPercent(paidPercentCreateInput, options)
                .then((request) => request(axios, basePath));
        },
        /**
         *
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        healthControllerCheckHealth(options) {
            return localVarFp
                .healthControllerCheckHealth(options)
                .then((request) => request(axios, basePath));
        },
    };
};
exports.NotificationApiFactory = NotificationApiFactory;
/**
 * NotificationApi - object-oriented interface
 * @export
 * @class NotificationApi
 * @extends {BaseAPI}
 */
class NotificationApi extends base_1.BaseAPI {
    /**
     *
     * @param {ConfirmationPlanEmailCreateInput} confirmationPlanEmailCreateInput
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof NotificationApi
     */
    emailControllerConfirmationEmail(confirmationPlanEmailCreateInput, options) {
        return (0, exports.NotificationApiFp)(this.configuration)
            .emailControllerConfirmationEmail(confirmationPlanEmailCreateInput, options)
            .then((request) => request(this.axios, this.basePath));
    }
    /**
     *
     * @param {FailedPaymentCreateInput} failedPaymentCreateInput
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof NotificationApi
     */
    emailControllerPlanFailedPayment(failedPaymentCreateInput, options) {
        return (0, exports.NotificationApiFp)(this.configuration)
            .emailControllerPlanFailedPayment(failedPaymentCreateInput, options)
            .then((request) => request(this.axios, this.basePath));
    }
    /**
     *
     * @param {LastPaymentCreateInput} lastPaymentCreateInput
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof NotificationApi
     */
    emailControllerPlanFinished(lastPaymentCreateInput, options) {
        return (0, exports.NotificationApiFp)(this.configuration)
            .emailControllerPlanFinished(lastPaymentCreateInput, options)
            .then((request) => request(this.axios, this.basePath));
    }
    /**
     *
     * @param {MissedPaymentCreateInput} missedPaymentCreateInput
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof NotificationApi
     */
    emailControllerPlanMissedPayment(missedPaymentCreateInput, options) {
        return (0, exports.NotificationApiFp)(this.configuration)
            .emailControllerPlanMissedPayment(missedPaymentCreateInput, options)
            .then((request) => request(this.axios, this.basePath));
    }
    /**
     *
     * @param {PaidPercentCreateInput} paidPercentCreateInput
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof NotificationApi
     */
    emailControllerPlanPaidPercent(paidPercentCreateInput, options) {
        return (0, exports.NotificationApiFp)(this.configuration)
            .emailControllerPlanPaidPercent(paidPercentCreateInput, options)
            .then((request) => request(this.axios, this.basePath));
    }
    /**
     *
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof NotificationApi
     */
    healthControllerCheckHealth(options) {
        return (0, exports.NotificationApiFp)(this.configuration)
            .healthControllerCheckHealth(options)
            .then((request) => request(this.axios, this.basePath));
    }
}
exports.NotificationApi = NotificationApi;


/***/ }),

/***/ "./packages/notification-client/src/base.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/* tslint:disable */
/* eslint-disable */
/**
 * Notification Service
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RequiredError = exports.BaseAPI = exports.COLLECTION_FORMATS = exports.BASE_PATH = void 0;
const tslib_1 = __webpack_require__("tslib");
// Some imports not used depending on template conditions
// @ts-ignore
const axios_1 = tslib_1.__importDefault(__webpack_require__("axios"));
exports.BASE_PATH = 'http://localhost'.replace(/\/+$/, '');
/**
 *
 * @export
 */
exports.COLLECTION_FORMATS = {
    csv: ',',
    ssv: ' ',
    tsv: '\t',
    pipes: '|',
};
/**
 *
 * @export
 * @class BaseAPI
 */
class BaseAPI {
    constructor(configuration, basePath = exports.BASE_PATH, axios = axios_1.default) {
        this.basePath = basePath;
        this.axios = axios;
        if (configuration) {
            this.configuration = configuration;
            this.basePath = configuration.basePath || this.basePath;
        }
    }
}
exports.BaseAPI = BaseAPI;
/**
 *
 * @export
 * @class RequiredError
 * @extends {Error}
 */
class RequiredError extends Error {
    constructor(field, msg) {
        super(msg);
        this.field = field;
        this.name = 'RequiredError';
    }
}
exports.RequiredError = RequiredError;


/***/ }),

/***/ "./packages/notification-client/src/common.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/* tslint:disable */
/* eslint-disable */
/**
 * Notification Service
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createRequestFunction = exports.toPathString = exports.serializeDataIfNeeded = exports.setSearchParams = exports.setOAuthToObject = exports.setBearerAuthToObject = exports.setBasicAuthToObject = exports.setApiKeyToObject = exports.assertParamExists = exports.DUMMY_BASE_URL = void 0;
const tslib_1 = __webpack_require__("tslib");
const base_1 = __webpack_require__("./packages/notification-client/src/base.ts");
/**
 *
 * @export
 */
exports.DUMMY_BASE_URL = 'https://example.com';
/**
 *
 * @throws {RequiredError}
 * @export
 */
const assertParamExists = function (functionName, paramName, paramValue) {
    if (paramValue === null || paramValue === undefined) {
        throw new base_1.RequiredError(paramName, `Required parameter ${paramName} was null or undefined when calling ${functionName}.`);
    }
};
exports.assertParamExists = assertParamExists;
/**
 *
 * @export
 */
const setApiKeyToObject = function (object, keyParamName, configuration) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (configuration && configuration.apiKey) {
            const localVarApiKeyValue = typeof configuration.apiKey === 'function'
                ? yield configuration.apiKey(keyParamName)
                : yield configuration.apiKey;
            object[keyParamName] = localVarApiKeyValue;
        }
    });
};
exports.setApiKeyToObject = setApiKeyToObject;
/**
 *
 * @export
 */
const setBasicAuthToObject = function (object, configuration) {
    if (configuration && (configuration.username || configuration.password)) {
        object['auth'] = {
            username: configuration.username,
            password: configuration.password,
        };
    }
};
exports.setBasicAuthToObject = setBasicAuthToObject;
/**
 *
 * @export
 */
const setBearerAuthToObject = function (object, configuration) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (configuration && configuration.accessToken) {
            const accessToken = typeof configuration.accessToken === 'function'
                ? yield configuration.accessToken()
                : yield configuration.accessToken;
            object['Authorization'] = 'Bearer ' + accessToken;
        }
    });
};
exports.setBearerAuthToObject = setBearerAuthToObject;
/**
 *
 * @export
 */
const setOAuthToObject = function (object, name, scopes, configuration) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (configuration && configuration.accessToken) {
            const localVarAccessTokenValue = typeof configuration.accessToken === 'function'
                ? yield configuration.accessToken(name, scopes)
                : yield configuration.accessToken;
            object['Authorization'] = 'Bearer ' + localVarAccessTokenValue;
        }
    });
};
exports.setOAuthToObject = setOAuthToObject;
/**
 *
 * @export
 */
const setSearchParams = function (url, ...objects) {
    const searchParams = new URLSearchParams(url.search);
    for (const object of objects) {
        for (const key in object) {
            if (Array.isArray(object[key])) {
                searchParams.delete(key);
                for (const item of object[key]) {
                    searchParams.append(key, item);
                }
            }
            else {
                searchParams.set(key, object[key]);
            }
        }
    }
    url.search = searchParams.toString();
};
exports.setSearchParams = setSearchParams;
/**
 *
 * @export
 */
const serializeDataIfNeeded = function (value, requestOptions, configuration) {
    const nonString = typeof value !== 'string';
    const needsSerialization = nonString && configuration && configuration.isJsonMime
        ? configuration.isJsonMime(requestOptions.headers['Content-Type'])
        : nonString;
    return needsSerialization
        ? JSON.stringify(value !== undefined ? value : {})
        : value || '';
};
exports.serializeDataIfNeeded = serializeDataIfNeeded;
/**
 *
 * @export
 */
const toPathString = function (url) {
    return url.pathname + url.search + url.hash;
};
exports.toPathString = toPathString;
/**
 *
 * @export
 */
const createRequestFunction = function (axiosArgs, globalAxios, BASE_PATH, configuration) {
    return (axios = globalAxios, basePath = BASE_PATH) => {
        const axiosRequestArgs = Object.assign(Object.assign({}, axiosArgs.options), { url: ((configuration === null || configuration === void 0 ? void 0 : configuration.basePath) || basePath) + axiosArgs.url });
        return axios.request(axiosRequestArgs);
    };
};
exports.createRequestFunction = createRequestFunction;


/***/ }),

/***/ "./packages/notification-client/src/configuration.ts":
/***/ ((__unused_webpack_module, exports) => {


/* tslint:disable */
/* eslint-disable */
/**
 * Notification Service
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Configuration = void 0;
class Configuration {
    constructor(param = {}) {
        this.apiKey = param.apiKey;
        this.username = param.username;
        this.password = param.password;
        this.accessToken = param.accessToken;
        this.basePath = param.basePath;
        this.baseOptions = param.baseOptions;
        this.formDataCtor = param.formDataCtor;
    }
    /**
     * Check if the given MIME is a JSON MIME.
     * JSON MIME examples:
     *   application/json
     *   application/json; charset=UTF8
     *   APPLICATION/JSON
     *   application/vnd.company+json
     * @param mime - MIME (Multipurpose Internet Mail Extensions)
     * @return True if the given MIME is JSON, false otherwise.
     */
    isJsonMime(mime) {
        const jsonMime = new RegExp('^(application/json|[^;/ \t]+/[^;/ \t]+[+]json)[ \t]*(;.*)?$', 'i');
        return (mime !== null &&
            (jsonMime.test(mime) ||
                mime.toLowerCase() === 'application/json-patch+json'));
    }
}
exports.Configuration = Configuration;


/***/ }),

/***/ "./packages/notification-client/src/index.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/* tslint:disable */
/* eslint-disable */
/**
 * Notification Service
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__("tslib");
tslib_1.__exportStar(__webpack_require__("./packages/notification-client/src/api.ts"), exports);
tslib_1.__exportStar(__webpack_require__("./packages/notification-client/src/configuration.ts"), exports);


/***/ }),

/***/ "./packages/payment-client/src/api.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/* tslint:disable */
/* eslint-disable */
/**
 * Payment Service
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PaymentApi = exports.PaymentApiFactory = exports.PaymentApiFp = exports.PaymentApiAxiosParamCreator = exports.DefaultApi = exports.DefaultApiFactory = exports.DefaultApiFp = exports.DefaultApiAxiosParamCreator = void 0;
const tslib_1 = __webpack_require__("tslib");
const axios_1 = tslib_1.__importDefault(__webpack_require__("axios"));
// Some imports not used depending on template conditions
// @ts-ignore
const common_1 = __webpack_require__("./packages/payment-client/src/common.ts");
// @ts-ignore
const base_1 = __webpack_require__("./packages/payment-client/src/base.ts");
/**
 * DefaultApi - axios parameter creator
 * @export
 */
const DefaultApiAxiosParamCreator = function (configuration) {
    return {
        /**
         *
         * @param {string} stripeSignature
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        stripeWebhookControllerHandleWebhook: (stripeSignature, options = {}) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'stripeSignature' is not null or undefined
            (0, common_1.assertParamExists)('stripeWebhookControllerHandleWebhook', 'stripeSignature', stripeSignature);
            const localVarPath = `/stripe/webhook`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'POST' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            if (stripeSignature !== undefined && stripeSignature !== null) {
                localVarHeaderParameter['stripe-signature'] = String(stripeSignature);
            }
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
    };
};
exports.DefaultApiAxiosParamCreator = DefaultApiAxiosParamCreator;
/**
 * DefaultApi - functional programming interface
 * @export
 */
const DefaultApiFp = function (configuration) {
    const localVarAxiosParamCreator = (0, exports.DefaultApiAxiosParamCreator)(configuration);
    return {
        /**
         *
         * @param {string} stripeSignature
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        stripeWebhookControllerHandleWebhook(stripeSignature, options) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.stripeWebhookControllerHandleWebhook(stripeSignature, options);
                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
    };
};
exports.DefaultApiFp = DefaultApiFp;
/**
 * DefaultApi - factory interface
 * @export
 */
const DefaultApiFactory = function (configuration, basePath, axios) {
    const localVarFp = (0, exports.DefaultApiFp)(configuration);
    return {
        /**
         *
         * @param {string} stripeSignature
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        stripeWebhookControllerHandleWebhook(stripeSignature, options) {
            return localVarFp
                .stripeWebhookControllerHandleWebhook(stripeSignature, options)
                .then((request) => request(axios, basePath));
        },
    };
};
exports.DefaultApiFactory = DefaultApiFactory;
/**
 * DefaultApi - object-oriented interface
 * @export
 * @class DefaultApi
 * @extends {BaseAPI}
 */
class DefaultApi extends base_1.BaseAPI {
    /**
     *
     * @param {string} stripeSignature
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApi
     */
    stripeWebhookControllerHandleWebhook(stripeSignature, options) {
        return (0, exports.DefaultApiFp)(this.configuration)
            .stripeWebhookControllerHandleWebhook(stripeSignature, options)
            .then((request) => request(this.axios, this.basePath));
    }
}
exports.DefaultApi = DefaultApi;
/**
 * PaymentApi - axios parameter creator
 * @export
 */
const PaymentApiAxiosParamCreator = function (configuration) {
    return {
        /**
         *
         * @summary
         * @param {string} id
         * @param {PaymentMethodAttachInput} paymentMethodAttachInput
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        customerControllerCustomerAddCard: (id, paymentMethodAttachInput, options = {}) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'id' is not null or undefined
            (0, common_1.assertParamExists)('customerControllerCustomerAddCard', 'id', id);
            // verify required parameter 'paymentMethodAttachInput' is not null or undefined
            (0, common_1.assertParamExists)('customerControllerCustomerAddCard', 'paymentMethodAttachInput', paymentMethodAttachInput);
            const localVarPath = `/payment/customer/{id}/payment-methods`.replace(`{${'id'}}`, encodeURIComponent(String(id)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'POST' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            localVarHeaderParameter['Content-Type'] = 'application/json';
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            localVarRequestOptions.data = (0, common_1.serializeDataIfNeeded)(paymentMethodAttachInput, localVarRequestOptions, configuration);
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         *
         * @summary
         * @param {string} id
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        customerControllerCustomerListCards: (id, options = {}) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'id' is not null or undefined
            (0, common_1.assertParamExists)('customerControllerCustomerListCards', 'id', id);
            const localVarPath = `/payment/customer/{id}/payment-methods`.replace(`{${'id'}}`, encodeURIComponent(String(id)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'GET' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         *
         * @summary
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        healthControllerCheckHealth: (options = {}) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const localVarPath = `/payment/health`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'GET' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         *
         * @summary
         * @param {string} id
         * @param {ChargePaymentInvoiceInput} chargePaymentInvoiceInput
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        paymentControllerChargePaymentInvoice: (id, chargePaymentInvoiceInput, options = {}) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'id' is not null or undefined
            (0, common_1.assertParamExists)('paymentControllerChargePaymentInvoice', 'id', id);
            // verify required parameter 'chargePaymentInvoiceInput' is not null or undefined
            (0, common_1.assertParamExists)('paymentControllerChargePaymentInvoice', 'chargePaymentInvoiceInput', chargePaymentInvoiceInput);
            const localVarPath = `/payment/stripe/invoices/{id}/pay`.replace(`{${'id'}}`, encodeURIComponent(String(id)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'POST' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            localVarHeaderParameter['Content-Type'] = 'application/json';
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            localVarRequestOptions.data = (0, common_1.serializeDataIfNeeded)(chargePaymentInvoiceInput, localVarRequestOptions, configuration);
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         *
         * @summary
         * @param {CustomerCreateInput} customerCreateInput
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        paymentControllerCustomerCreate: (customerCreateInput, options = {}) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'customerCreateInput' is not null or undefined
            (0, common_1.assertParamExists)('paymentControllerCustomerCreate', 'customerCreateInput', customerCreateInput);
            const localVarPath = `/payment/stripe/customers`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'POST' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            localVarHeaderParameter['Content-Type'] = 'application/json';
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            localVarRequestOptions.data = (0, common_1.serializeDataIfNeeded)(customerCreateInput, localVarRequestOptions, configuration);
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         *
         * @summary
         * @param {string} customerId
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        paymentControllerCustomerGet: (customerId, options = {}) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'customerId' is not null or undefined
            (0, common_1.assertParamExists)('paymentControllerCustomerGet', 'customerId', customerId);
            const localVarPath = `/payment/stripe/customers/{customerId}`.replace(`{${'customerId'}}`, encodeURIComponent(String(customerId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'GET' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         *
         * @summary
         * @param {string} merchantId
         * @param {number} year
         * @param {number} month
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        paymentControllerGetTransactionReport: (merchantId, year, month, options = {}) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'merchantId' is not null or undefined
            (0, common_1.assertParamExists)('paymentControllerGetTransactionReport', 'merchantId', merchantId);
            // verify required parameter 'year' is not null or undefined
            (0, common_1.assertParamExists)('paymentControllerGetTransactionReport', 'year', year);
            // verify required parameter 'month' is not null or undefined
            (0, common_1.assertParamExists)('paymentControllerGetTransactionReport', 'month', month);
            const localVarPath = `/payment/transaction-report/by-merchant-id/{merchantId}/for-year/{year}/for-month/{month}`
                .replace(`{${'merchantId'}}`, encodeURIComponent(String(merchantId)))
                .replace(`{${'year'}}`, encodeURIComponent(String(year)))
                .replace(`{${'month'}}`, encodeURIComponent(String(month)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'GET' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         *
         * @summary
         * @param {string} customerId
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        paymentControllerInvoiceGetByCustomer: (customerId, options = {}) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'customerId' is not null or undefined
            (0, common_1.assertParamExists)('paymentControllerInvoiceGetByCustomer', 'customerId', customerId);
            const localVarPath = `/payment/stripe/invoices/by-customer/{customerId}`.replace(`{${'customerId'}}`, encodeURIComponent(String(customerId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'GET' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         *
         * @summary
         * @param {string} subscriptionId
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        paymentControllerInvoiceGetUpcomingBySubscription: (subscriptionId, options = {}) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'subscriptionId' is not null or undefined
            (0, common_1.assertParamExists)('paymentControllerInvoiceGetUpcomingBySubscription', 'subscriptionId', subscriptionId);
            const localVarPath = `/payment/stripe/invoices/upcoming/by-subscription/{subscriptionId}`.replace(`{${'subscriptionId'}}`, encodeURIComponent(String(subscriptionId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'GET' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         *
         * @summary
         * @param {string} subscriptionId
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        paymentControllerInvoiceListBySubscription: (subscriptionId, options = {}) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'subscriptionId' is not null or undefined
            (0, common_1.assertParamExists)('paymentControllerInvoiceListBySubscription', 'subscriptionId', subscriptionId);
            const localVarPath = `/payment/stripe/invoices/by-subscription/{subscriptionId}`.replace(`{${'subscriptionId'}}`, encodeURIComponent(String(subscriptionId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'GET' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         *
         * @summary
         * @param {string} planId
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        paymentControllerPaymentListByPlan: (planId, options = {}) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'planId' is not null or undefined
            (0, common_1.assertParamExists)('paymentControllerPaymentListByPlan', 'planId', planId);
            const localVarPath = `/payment/payments/by-plan/{planId}`.replace(`{${'planId'}}`, encodeURIComponent(String(planId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'GET' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         *
         * @summary
         * @param {string} id
         * @param {PaymentMethodCreateInput} paymentMethodCreateInput
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        paymentControllerPaymentMethodAttach: (id, paymentMethodCreateInput, options = {}) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'id' is not null or undefined
            (0, common_1.assertParamExists)('paymentControllerPaymentMethodAttach', 'id', id);
            // verify required parameter 'paymentMethodCreateInput' is not null or undefined
            (0, common_1.assertParamExists)('paymentControllerPaymentMethodAttach', 'paymentMethodCreateInput', paymentMethodCreateInput);
            const localVarPath = `/payment/stripe/payment-methods/{id}/attach`.replace(`{${'id'}}`, encodeURIComponent(String(id)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'POST' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            localVarHeaderParameter['Content-Type'] = 'application/json';
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            localVarRequestOptions.data = (0, common_1.serializeDataIfNeeded)(paymentMethodCreateInput, localVarRequestOptions, configuration);
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         *
         * @summary
         * @param {string} customerId
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        paymentControllerPaymentMethodsGet: (customerId, options = {}) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'customerId' is not null or undefined
            (0, common_1.assertParamExists)('paymentControllerPaymentMethodsGet', 'customerId', customerId);
            const localVarPath = `/payment/customer/{customerId}/payment-methods`.replace(`{${'customerId'}}`, encodeURIComponent(String(customerId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'GET' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         *
         * @summary
         * @param {PriceCreateInput} priceCreateInput
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        paymentControllerPriceCreate: (priceCreateInput, options = {}) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'priceCreateInput' is not null or undefined
            (0, common_1.assertParamExists)('paymentControllerPriceCreate', 'priceCreateInput', priceCreateInput);
            const localVarPath = `/payment/stripe/prices`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'POST' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            localVarHeaderParameter['Content-Type'] = 'application/json';
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            localVarRequestOptions.data = (0, common_1.serializeDataIfNeeded)(priceCreateInput, localVarRequestOptions, configuration);
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         *
         * @summary
         * @param {ProductCreateInput} productCreateInput
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        paymentControllerProductCreate: (productCreateInput, options = {}) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'productCreateInput' is not null or undefined
            (0, common_1.assertParamExists)('paymentControllerProductCreate', 'productCreateInput', productCreateInput);
            const localVarPath = `/payment/stripe/products`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'POST' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            localVarHeaderParameter['Content-Type'] = 'application/json';
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            localVarRequestOptions.data = (0, common_1.serializeDataIfNeeded)(productCreateInput, localVarRequestOptions, configuration);
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         *
         * @summary
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        paymentControllerStripeWebhook: (options = {}) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const localVarPath = `/payment/stripe/webhook`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'POST' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         *
         * @summary
         * @param {SubscriptionCreateInput} subscriptionCreateInput
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        paymentControllerSubscriptionCreate: (subscriptionCreateInput, options = {}) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'subscriptionCreateInput' is not null or undefined
            (0, common_1.assertParamExists)('paymentControllerSubscriptionCreate', 'subscriptionCreateInput', subscriptionCreateInput);
            const localVarPath = `/payment/stripe/subscriptions`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'POST' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            localVarHeaderParameter['Content-Type'] = 'application/json';
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            localVarRequestOptions.data = (0, common_1.serializeDataIfNeeded)(subscriptionCreateInput, localVarRequestOptions, configuration);
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         *
         * @summary
         * @param {string} id
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        paymentControllerSubscriptionDelete: (id, options = {}) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'id' is not null or undefined
            (0, common_1.assertParamExists)('paymentControllerSubscriptionDelete', 'id', id);
            const localVarPath = `/payment/stripe/subscriptions/{id}`.replace(`{${'id'}}`, encodeURIComponent(String(id)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'DELETE' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         *
         * @summary
         * @param {string} id
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        paymentControllerSubscriptionRetrieve: (id, options = {}) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'id' is not null or undefined
            (0, common_1.assertParamExists)('paymentControllerSubscriptionRetrieve', 'id', id);
            const localVarPath = `/payment/stripe/subscriptions/{id}`.replace(`{${'id'}}`, encodeURIComponent(String(id)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'GET' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
    };
};
exports.PaymentApiAxiosParamCreator = PaymentApiAxiosParamCreator;
/**
 * PaymentApi - functional programming interface
 * @export
 */
const PaymentApiFp = function (configuration) {
    const localVarAxiosParamCreator = (0, exports.PaymentApiAxiosParamCreator)(configuration);
    return {
        /**
         *
         * @summary
         * @param {string} id
         * @param {PaymentMethodAttachInput} paymentMethodAttachInput
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        customerControllerCustomerAddCard(id, paymentMethodAttachInput, options) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.customerControllerCustomerAddCard(id, paymentMethodAttachInput, options);
                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
        /**
         *
         * @summary
         * @param {string} id
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        customerControllerCustomerListCards(id, options) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.customerControllerCustomerListCards(id, options);
                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
        /**
         *
         * @summary
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        healthControllerCheckHealth(options) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.healthControllerCheckHealth(options);
                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
        /**
         *
         * @summary
         * @param {string} id
         * @param {ChargePaymentInvoiceInput} chargePaymentInvoiceInput
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        paymentControllerChargePaymentInvoice(id, chargePaymentInvoiceInput, options) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.paymentControllerChargePaymentInvoice(id, chargePaymentInvoiceInput, options);
                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
        /**
         *
         * @summary
         * @param {CustomerCreateInput} customerCreateInput
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        paymentControllerCustomerCreate(customerCreateInput, options) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.paymentControllerCustomerCreate(customerCreateInput, options);
                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
        /**
         *
         * @summary
         * @param {string} customerId
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        paymentControllerCustomerGet(customerId, options) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.paymentControllerCustomerGet(customerId, options);
                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
        /**
         *
         * @summary
         * @param {string} merchantId
         * @param {number} year
         * @param {number} month
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        paymentControllerGetTransactionReport(merchantId, year, month, options) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.paymentControllerGetTransactionReport(merchantId, year, month, options);
                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
        /**
         *
         * @summary
         * @param {string} customerId
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        paymentControllerInvoiceGetByCustomer(customerId, options) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.paymentControllerInvoiceGetByCustomer(customerId, options);
                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
        /**
         *
         * @summary
         * @param {string} subscriptionId
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        paymentControllerInvoiceGetUpcomingBySubscription(subscriptionId, options) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.paymentControllerInvoiceGetUpcomingBySubscription(subscriptionId, options);
                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
        /**
         *
         * @summary
         * @param {string} subscriptionId
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        paymentControllerInvoiceListBySubscription(subscriptionId, options) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.paymentControllerInvoiceListBySubscription(subscriptionId, options);
                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
        /**
         *
         * @summary
         * @param {string} planId
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        paymentControllerPaymentListByPlan(planId, options) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.paymentControllerPaymentListByPlan(planId, options);
                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
        /**
         *
         * @summary
         * @param {string} id
         * @param {PaymentMethodCreateInput} paymentMethodCreateInput
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        paymentControllerPaymentMethodAttach(id, paymentMethodCreateInput, options) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.paymentControllerPaymentMethodAttach(id, paymentMethodCreateInput, options);
                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
        /**
         *
         * @summary
         * @param {string} customerId
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        paymentControllerPaymentMethodsGet(customerId, options) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.paymentControllerPaymentMethodsGet(customerId, options);
                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
        /**
         *
         * @summary
         * @param {PriceCreateInput} priceCreateInput
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        paymentControllerPriceCreate(priceCreateInput, options) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.paymentControllerPriceCreate(priceCreateInput, options);
                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
        /**
         *
         * @summary
         * @param {ProductCreateInput} productCreateInput
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        paymentControllerProductCreate(productCreateInput, options) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.paymentControllerProductCreate(productCreateInput, options);
                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
        /**
         *
         * @summary
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        paymentControllerStripeWebhook(options) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.paymentControllerStripeWebhook(options);
                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
        /**
         *
         * @summary
         * @param {SubscriptionCreateInput} subscriptionCreateInput
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        paymentControllerSubscriptionCreate(subscriptionCreateInput, options) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.paymentControllerSubscriptionCreate(subscriptionCreateInput, options);
                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
        /**
         *
         * @summary
         * @param {string} id
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        paymentControllerSubscriptionDelete(id, options) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.paymentControllerSubscriptionDelete(id, options);
                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
        /**
         *
         * @summary
         * @param {string} id
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        paymentControllerSubscriptionRetrieve(id, options) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.paymentControllerSubscriptionRetrieve(id, options);
                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
    };
};
exports.PaymentApiFp = PaymentApiFp;
/**
 * PaymentApi - factory interface
 * @export
 */
const PaymentApiFactory = function (configuration, basePath, axios) {
    const localVarFp = (0, exports.PaymentApiFp)(configuration);
    return {
        /**
         *
         * @summary
         * @param {string} id
         * @param {PaymentMethodAttachInput} paymentMethodAttachInput
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        customerControllerCustomerAddCard(id, paymentMethodAttachInput, options) {
            return localVarFp
                .customerControllerCustomerAddCard(id, paymentMethodAttachInput, options)
                .then((request) => request(axios, basePath));
        },
        /**
         *
         * @summary
         * @param {string} id
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        customerControllerCustomerListCards(id, options) {
            return localVarFp
                .customerControllerCustomerListCards(id, options)
                .then((request) => request(axios, basePath));
        },
        /**
         *
         * @summary
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        healthControllerCheckHealth(options) {
            return localVarFp
                .healthControllerCheckHealth(options)
                .then((request) => request(axios, basePath));
        },
        /**
         *
         * @summary
         * @param {string} id
         * @param {ChargePaymentInvoiceInput} chargePaymentInvoiceInput
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        paymentControllerChargePaymentInvoice(id, chargePaymentInvoiceInput, options) {
            return localVarFp
                .paymentControllerChargePaymentInvoice(id, chargePaymentInvoiceInput, options)
                .then((request) => request(axios, basePath));
        },
        /**
         *
         * @summary
         * @param {CustomerCreateInput} customerCreateInput
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        paymentControllerCustomerCreate(customerCreateInput, options) {
            return localVarFp
                .paymentControllerCustomerCreate(customerCreateInput, options)
                .then((request) => request(axios, basePath));
        },
        /**
         *
         * @summary
         * @param {string} customerId
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        paymentControllerCustomerGet(customerId, options) {
            return localVarFp
                .paymentControllerCustomerGet(customerId, options)
                .then((request) => request(axios, basePath));
        },
        /**
         *
         * @summary
         * @param {string} merchantId
         * @param {number} year
         * @param {number} month
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        paymentControllerGetTransactionReport(merchantId, year, month, options) {
            return localVarFp
                .paymentControllerGetTransactionReport(merchantId, year, month, options)
                .then((request) => request(axios, basePath));
        },
        /**
         *
         * @summary
         * @param {string} customerId
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        paymentControllerInvoiceGetByCustomer(customerId, options) {
            return localVarFp
                .paymentControllerInvoiceGetByCustomer(customerId, options)
                .then((request) => request(axios, basePath));
        },
        /**
         *
         * @summary
         * @param {string} subscriptionId
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        paymentControllerInvoiceGetUpcomingBySubscription(subscriptionId, options) {
            return localVarFp
                .paymentControllerInvoiceGetUpcomingBySubscription(subscriptionId, options)
                .then((request) => request(axios, basePath));
        },
        /**
         *
         * @summary
         * @param {string} subscriptionId
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        paymentControllerInvoiceListBySubscription(subscriptionId, options) {
            return localVarFp
                .paymentControllerInvoiceListBySubscription(subscriptionId, options)
                .then((request) => request(axios, basePath));
        },
        /**
         *
         * @summary
         * @param {string} planId
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        paymentControllerPaymentListByPlan(planId, options) {
            return localVarFp
                .paymentControllerPaymentListByPlan(planId, options)
                .then((request) => request(axios, basePath));
        },
        /**
         *
         * @summary
         * @param {string} id
         * @param {PaymentMethodCreateInput} paymentMethodCreateInput
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        paymentControllerPaymentMethodAttach(id, paymentMethodCreateInput, options) {
            return localVarFp
                .paymentControllerPaymentMethodAttach(id, paymentMethodCreateInput, options)
                .then((request) => request(axios, basePath));
        },
        /**
         *
         * @summary
         * @param {string} customerId
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        paymentControllerPaymentMethodsGet(customerId, options) {
            return localVarFp
                .paymentControllerPaymentMethodsGet(customerId, options)
                .then((request) => request(axios, basePath));
        },
        /**
         *
         * @summary
         * @param {PriceCreateInput} priceCreateInput
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        paymentControllerPriceCreate(priceCreateInput, options) {
            return localVarFp
                .paymentControllerPriceCreate(priceCreateInput, options)
                .then((request) => request(axios, basePath));
        },
        /**
         *
         * @summary
         * @param {ProductCreateInput} productCreateInput
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        paymentControllerProductCreate(productCreateInput, options) {
            return localVarFp
                .paymentControllerProductCreate(productCreateInput, options)
                .then((request) => request(axios, basePath));
        },
        /**
         *
         * @summary
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        paymentControllerStripeWebhook(options) {
            return localVarFp
                .paymentControllerStripeWebhook(options)
                .then((request) => request(axios, basePath));
        },
        /**
         *
         * @summary
         * @param {SubscriptionCreateInput} subscriptionCreateInput
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        paymentControllerSubscriptionCreate(subscriptionCreateInput, options) {
            return localVarFp
                .paymentControllerSubscriptionCreate(subscriptionCreateInput, options)
                .then((request) => request(axios, basePath));
        },
        /**
         *
         * @summary
         * @param {string} id
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        paymentControllerSubscriptionDelete(id, options) {
            return localVarFp
                .paymentControllerSubscriptionDelete(id, options)
                .then((request) => request(axios, basePath));
        },
        /**
         *
         * @summary
         * @param {string} id
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        paymentControllerSubscriptionRetrieve(id, options) {
            return localVarFp
                .paymentControllerSubscriptionRetrieve(id, options)
                .then((request) => request(axios, basePath));
        },
    };
};
exports.PaymentApiFactory = PaymentApiFactory;
/**
 * PaymentApi - object-oriented interface
 * @export
 * @class PaymentApi
 * @extends {BaseAPI}
 */
class PaymentApi extends base_1.BaseAPI {
    /**
     *
     * @summary
     * @param {string} id
     * @param {PaymentMethodAttachInput} paymentMethodAttachInput
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PaymentApi
     */
    customerControllerCustomerAddCard(id, paymentMethodAttachInput, options) {
        return (0, exports.PaymentApiFp)(this.configuration)
            .customerControllerCustomerAddCard(id, paymentMethodAttachInput, options)
            .then((request) => request(this.axios, this.basePath));
    }
    /**
     *
     * @summary
     * @param {string} id
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PaymentApi
     */
    customerControllerCustomerListCards(id, options) {
        return (0, exports.PaymentApiFp)(this.configuration)
            .customerControllerCustomerListCards(id, options)
            .then((request) => request(this.axios, this.basePath));
    }
    /**
     *
     * @summary
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PaymentApi
     */
    healthControllerCheckHealth(options) {
        return (0, exports.PaymentApiFp)(this.configuration)
            .healthControllerCheckHealth(options)
            .then((request) => request(this.axios, this.basePath));
    }
    /**
     *
     * @summary
     * @param {string} id
     * @param {ChargePaymentInvoiceInput} chargePaymentInvoiceInput
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PaymentApi
     */
    paymentControllerChargePaymentInvoice(id, chargePaymentInvoiceInput, options) {
        return (0, exports.PaymentApiFp)(this.configuration)
            .paymentControllerChargePaymentInvoice(id, chargePaymentInvoiceInput, options)
            .then((request) => request(this.axios, this.basePath));
    }
    /**
     *
     * @summary
     * @param {CustomerCreateInput} customerCreateInput
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PaymentApi
     */
    paymentControllerCustomerCreate(customerCreateInput, options) {
        return (0, exports.PaymentApiFp)(this.configuration)
            .paymentControllerCustomerCreate(customerCreateInput, options)
            .then((request) => request(this.axios, this.basePath));
    }
    /**
     *
     * @summary
     * @param {string} customerId
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PaymentApi
     */
    paymentControllerCustomerGet(customerId, options) {
        return (0, exports.PaymentApiFp)(this.configuration)
            .paymentControllerCustomerGet(customerId, options)
            .then((request) => request(this.axios, this.basePath));
    }
    /**
     *
     * @summary
     * @param {string} merchantId
     * @param {number} year
     * @param {number} month
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PaymentApi
     */
    paymentControllerGetTransactionReport(merchantId, year, month, options) {
        return (0, exports.PaymentApiFp)(this.configuration)
            .paymentControllerGetTransactionReport(merchantId, year, month, options)
            .then((request) => request(this.axios, this.basePath));
    }
    /**
     *
     * @summary
     * @param {string} customerId
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PaymentApi
     */
    paymentControllerInvoiceGetByCustomer(customerId, options) {
        return (0, exports.PaymentApiFp)(this.configuration)
            .paymentControllerInvoiceGetByCustomer(customerId, options)
            .then((request) => request(this.axios, this.basePath));
    }
    /**
     *
     * @summary
     * @param {string} subscriptionId
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PaymentApi
     */
    paymentControllerInvoiceGetUpcomingBySubscription(subscriptionId, options) {
        return (0, exports.PaymentApiFp)(this.configuration)
            .paymentControllerInvoiceGetUpcomingBySubscription(subscriptionId, options)
            .then((request) => request(this.axios, this.basePath));
    }
    /**
     *
     * @summary
     * @param {string} subscriptionId
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PaymentApi
     */
    paymentControllerInvoiceListBySubscription(subscriptionId, options) {
        return (0, exports.PaymentApiFp)(this.configuration)
            .paymentControllerInvoiceListBySubscription(subscriptionId, options)
            .then((request) => request(this.axios, this.basePath));
    }
    /**
     *
     * @summary
     * @param {string} planId
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PaymentApi
     */
    paymentControllerPaymentListByPlan(planId, options) {
        return (0, exports.PaymentApiFp)(this.configuration)
            .paymentControllerPaymentListByPlan(planId, options)
            .then((request) => request(this.axios, this.basePath));
    }
    /**
     *
     * @summary
     * @param {string} id
     * @param {PaymentMethodCreateInput} paymentMethodCreateInput
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PaymentApi
     */
    paymentControllerPaymentMethodAttach(id, paymentMethodCreateInput, options) {
        return (0, exports.PaymentApiFp)(this.configuration)
            .paymentControllerPaymentMethodAttach(id, paymentMethodCreateInput, options)
            .then((request) => request(this.axios, this.basePath));
    }
    /**
     *
     * @summary
     * @param {string} customerId
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PaymentApi
     */
    paymentControllerPaymentMethodsGet(customerId, options) {
        return (0, exports.PaymentApiFp)(this.configuration)
            .paymentControllerPaymentMethodsGet(customerId, options)
            .then((request) => request(this.axios, this.basePath));
    }
    /**
     *
     * @summary
     * @param {PriceCreateInput} priceCreateInput
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PaymentApi
     */
    paymentControllerPriceCreate(priceCreateInput, options) {
        return (0, exports.PaymentApiFp)(this.configuration)
            .paymentControllerPriceCreate(priceCreateInput, options)
            .then((request) => request(this.axios, this.basePath));
    }
    /**
     *
     * @summary
     * @param {ProductCreateInput} productCreateInput
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PaymentApi
     */
    paymentControllerProductCreate(productCreateInput, options) {
        return (0, exports.PaymentApiFp)(this.configuration)
            .paymentControllerProductCreate(productCreateInput, options)
            .then((request) => request(this.axios, this.basePath));
    }
    /**
     *
     * @summary
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PaymentApi
     */
    paymentControllerStripeWebhook(options) {
        return (0, exports.PaymentApiFp)(this.configuration)
            .paymentControllerStripeWebhook(options)
            .then((request) => request(this.axios, this.basePath));
    }
    /**
     *
     * @summary
     * @param {SubscriptionCreateInput} subscriptionCreateInput
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PaymentApi
     */
    paymentControllerSubscriptionCreate(subscriptionCreateInput, options) {
        return (0, exports.PaymentApiFp)(this.configuration)
            .paymentControllerSubscriptionCreate(subscriptionCreateInput, options)
            .then((request) => request(this.axios, this.basePath));
    }
    /**
     *
     * @summary
     * @param {string} id
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PaymentApi
     */
    paymentControllerSubscriptionDelete(id, options) {
        return (0, exports.PaymentApiFp)(this.configuration)
            .paymentControllerSubscriptionDelete(id, options)
            .then((request) => request(this.axios, this.basePath));
    }
    /**
     *
     * @summary
     * @param {string} id
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PaymentApi
     */
    paymentControllerSubscriptionRetrieve(id, options) {
        return (0, exports.PaymentApiFp)(this.configuration)
            .paymentControllerSubscriptionRetrieve(id, options)
            .then((request) => request(this.axios, this.basePath));
    }
}
exports.PaymentApi = PaymentApi;


/***/ }),

/***/ "./packages/payment-client/src/base.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/* tslint:disable */
/* eslint-disable */
/**
 * Payment Service
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RequiredError = exports.BaseAPI = exports.COLLECTION_FORMATS = exports.BASE_PATH = void 0;
const tslib_1 = __webpack_require__("tslib");
// Some imports not used depending on template conditions
// @ts-ignore
const axios_1 = tslib_1.__importDefault(__webpack_require__("axios"));
exports.BASE_PATH = 'http://localhost'.replace(/\/+$/, '');
/**
 *
 * @export
 */
exports.COLLECTION_FORMATS = {
    csv: ',',
    ssv: ' ',
    tsv: '\t',
    pipes: '|',
};
/**
 *
 * @export
 * @class BaseAPI
 */
class BaseAPI {
    constructor(configuration, basePath = exports.BASE_PATH, axios = axios_1.default) {
        this.basePath = basePath;
        this.axios = axios;
        if (configuration) {
            this.configuration = configuration;
            this.basePath = configuration.basePath || this.basePath;
        }
    }
}
exports.BaseAPI = BaseAPI;
/**
 *
 * @export
 * @class RequiredError
 * @extends {Error}
 */
class RequiredError extends Error {
    constructor(field, msg) {
        super(msg);
        this.field = field;
        this.name = 'RequiredError';
    }
}
exports.RequiredError = RequiredError;


/***/ }),

/***/ "./packages/payment-client/src/common.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/* tslint:disable */
/* eslint-disable */
/**
 * Payment Service
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createRequestFunction = exports.toPathString = exports.serializeDataIfNeeded = exports.setSearchParams = exports.setOAuthToObject = exports.setBearerAuthToObject = exports.setBasicAuthToObject = exports.setApiKeyToObject = exports.assertParamExists = exports.DUMMY_BASE_URL = void 0;
const tslib_1 = __webpack_require__("tslib");
const base_1 = __webpack_require__("./packages/payment-client/src/base.ts");
/**
 *
 * @export
 */
exports.DUMMY_BASE_URL = 'https://example.com';
/**
 *
 * @throws {RequiredError}
 * @export
 */
const assertParamExists = function (functionName, paramName, paramValue) {
    if (paramValue === null || paramValue === undefined) {
        throw new base_1.RequiredError(paramName, `Required parameter ${paramName} was null or undefined when calling ${functionName}.`);
    }
};
exports.assertParamExists = assertParamExists;
/**
 *
 * @export
 */
const setApiKeyToObject = function (object, keyParamName, configuration) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (configuration && configuration.apiKey) {
            const localVarApiKeyValue = typeof configuration.apiKey === 'function'
                ? yield configuration.apiKey(keyParamName)
                : yield configuration.apiKey;
            object[keyParamName] = localVarApiKeyValue;
        }
    });
};
exports.setApiKeyToObject = setApiKeyToObject;
/**
 *
 * @export
 */
const setBasicAuthToObject = function (object, configuration) {
    if (configuration && (configuration.username || configuration.password)) {
        object['auth'] = {
            username: configuration.username,
            password: configuration.password,
        };
    }
};
exports.setBasicAuthToObject = setBasicAuthToObject;
/**
 *
 * @export
 */
const setBearerAuthToObject = function (object, configuration) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (configuration && configuration.accessToken) {
            const accessToken = typeof configuration.accessToken === 'function'
                ? yield configuration.accessToken()
                : yield configuration.accessToken;
            object['Authorization'] = 'Bearer ' + accessToken;
        }
    });
};
exports.setBearerAuthToObject = setBearerAuthToObject;
/**
 *
 * @export
 */
const setOAuthToObject = function (object, name, scopes, configuration) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (configuration && configuration.accessToken) {
            const localVarAccessTokenValue = typeof configuration.accessToken === 'function'
                ? yield configuration.accessToken(name, scopes)
                : yield configuration.accessToken;
            object['Authorization'] = 'Bearer ' + localVarAccessTokenValue;
        }
    });
};
exports.setOAuthToObject = setOAuthToObject;
/**
 *
 * @export
 */
const setSearchParams = function (url, ...objects) {
    const searchParams = new URLSearchParams(url.search);
    for (const object of objects) {
        for (const key in object) {
            if (Array.isArray(object[key])) {
                searchParams.delete(key);
                for (const item of object[key]) {
                    searchParams.append(key, item);
                }
            }
            else {
                searchParams.set(key, object[key]);
            }
        }
    }
    url.search = searchParams.toString();
};
exports.setSearchParams = setSearchParams;
/**
 *
 * @export
 */
const serializeDataIfNeeded = function (value, requestOptions, configuration) {
    const nonString = typeof value !== 'string';
    const needsSerialization = nonString && configuration && configuration.isJsonMime
        ? configuration.isJsonMime(requestOptions.headers['Content-Type'])
        : nonString;
    return needsSerialization
        ? JSON.stringify(value !== undefined ? value : {})
        : value || '';
};
exports.serializeDataIfNeeded = serializeDataIfNeeded;
/**
 *
 * @export
 */
const toPathString = function (url) {
    return url.pathname + url.search + url.hash;
};
exports.toPathString = toPathString;
/**
 *
 * @export
 */
const createRequestFunction = function (axiosArgs, globalAxios, BASE_PATH, configuration) {
    return (axios = globalAxios, basePath = BASE_PATH) => {
        const axiosRequestArgs = Object.assign(Object.assign({}, axiosArgs.options), { url: ((configuration === null || configuration === void 0 ? void 0 : configuration.basePath) || basePath) + axiosArgs.url });
        return axios.request(axiosRequestArgs);
    };
};
exports.createRequestFunction = createRequestFunction;


/***/ }),

/***/ "./packages/payment-client/src/configuration.ts":
/***/ ((__unused_webpack_module, exports) => {


/* tslint:disable */
/* eslint-disable */
/**
 * Payment Service
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Configuration = void 0;
class Configuration {
    constructor(param = {}) {
        this.apiKey = param.apiKey;
        this.username = param.username;
        this.password = param.password;
        this.accessToken = param.accessToken;
        this.basePath = param.basePath;
        this.baseOptions = param.baseOptions;
        this.formDataCtor = param.formDataCtor;
    }
    /**
     * Check if the given MIME is a JSON MIME.
     * JSON MIME examples:
     *   application/json
     *   application/json; charset=UTF8
     *   APPLICATION/JSON
     *   application/vnd.company+json
     * @param mime - MIME (Multipurpose Internet Mail Extensions)
     * @return True if the given MIME is JSON, false otherwise.
     */
    isJsonMime(mime) {
        const jsonMime = new RegExp('^(application/json|[^;/ \t]+/[^;/ \t]+[+]json)[ \t]*(;.*)?$', 'i');
        return (mime !== null &&
            (jsonMime.test(mime) ||
                mime.toLowerCase() === 'application/json-patch+json'));
    }
}
exports.Configuration = Configuration;


/***/ }),

/***/ "./packages/payment-client/src/index.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/* tslint:disable */
/* eslint-disable */
/**
 * Payment Service
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__("tslib");
tslib_1.__exportStar(__webpack_require__("./packages/payment-client/src/api.ts"), exports);
tslib_1.__exportStar(__webpack_require__("./packages/payment-client/src/configuration.ts"), exports);


/***/ }),

/***/ "./packages/plan-client/src/api.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/* tslint:disable */
/* eslint-disable */
/**
 * Plan Service
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PlanApi = exports.PlanApiFactory = exports.PlanApiFp = exports.PlanApiAxiosParamCreator = void 0;
const tslib_1 = __webpack_require__("tslib");
const axios_1 = tslib_1.__importDefault(__webpack_require__("axios"));
// Some imports not used depending on template conditions
// @ts-ignore
const common_1 = __webpack_require__("./packages/plan-client/src/common.ts");
// @ts-ignore
const base_1 = __webpack_require__("./packages/plan-client/src/base.ts");
/**
 * PlanApi - axios parameter creator
 * @export
 */
const PlanApiAxiosParamCreator = function (configuration) {
    return {
        /**
         *
         * @summary
         * @param {CheckoutSessionInput} checkoutSessionInput
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        checkoutSessionControllerCheckoutSessionCreate: (checkoutSessionInput, options = {}) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'checkoutSessionInput' is not null or undefined
            (0, common_1.assertParamExists)('checkoutSessionControllerCheckoutSessionCreate', 'checkoutSessionInput', checkoutSessionInput);
            const localVarPath = `/planservice/checkout-session`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'POST' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            localVarHeaderParameter['Content-Type'] = 'application/json';
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            localVarRequestOptions.data = (0, common_1.serializeDataIfNeeded)(checkoutSessionInput, localVarRequestOptions, configuration);
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         *
         * @summary
         * @param {string} sessionId
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        checkoutSessionControllerCheckoutSessionGetBySessionId: (sessionId, options = {}) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'sessionId' is not null or undefined
            (0, common_1.assertParamExists)('checkoutSessionControllerCheckoutSessionGetBySessionId', 'sessionId', sessionId);
            const localVarPath = `/planservice/checkout-session/{sessionId}`.replace(`{${'sessionId'}}`, encodeURIComponent(String(sessionId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'GET' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         *
         * @summary
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        healthControllerCheckHealth: (options = {}) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const localVarPath = `/planservice/health`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'GET' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         *
         * @summary
         * @param {CalculateInstalmentAmountsInput} calculateInstalmentAmountsInput
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        planControllerCalculateInstalmentAmounts: (calculateInstalmentAmountsInput, options = {}) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'calculateInstalmentAmountsInput' is not null or undefined
            (0, common_1.assertParamExists)('planControllerCalculateInstalmentAmounts', 'calculateInstalmentAmountsInput', calculateInstalmentAmountsInput);
            const localVarPath = `/planservice/plans/calculate-instalment-amounts`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'PUT' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            localVarHeaderParameter['Content-Type'] = 'application/json';
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            localVarRequestOptions.data = (0, common_1.serializeDataIfNeeded)(calculateInstalmentAmountsInput, localVarRequestOptions, configuration);
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         *
         * @summary
         * @param {CalculateInstalmentAmountsInput} calculateInstalmentAmountsInput
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        planControllerCalculatePlan: (calculateInstalmentAmountsInput, options = {}) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'calculateInstalmentAmountsInput' is not null or undefined
            (0, common_1.assertParamExists)('planControllerCalculatePlan', 'calculateInstalmentAmountsInput', calculateInstalmentAmountsInput);
            const localVarPath = `/planservice/plans/calculate-plan-amounts`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'POST' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            localVarHeaderParameter['Content-Type'] = 'application/json';
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            localVarRequestOptions.data = (0, common_1.serializeDataIfNeeded)(calculateInstalmentAmountsInput, localVarRequestOptions, configuration);
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         *
         * @summary
         * @param {object} body
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        planControllerCalculatePlanAmountV2: (body, options = {}) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'body' is not null or undefined
            (0, common_1.assertParamExists)('planControllerCalculatePlanAmountV2', 'body', body);
            const localVarPath = `/planservice/plans/calculate-plan-amounts-v2`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'POST' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            localVarHeaderParameter['Content-Type'] = 'application/json';
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            localVarRequestOptions.data = (0, common_1.serializeDataIfNeeded)(body, localVarRequestOptions, configuration);
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         *
         * @summary
         * @param {CheckLastInvoiceInput} checkLastInvoiceInput
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        planControllerCheckLastInvoice: (checkLastInvoiceInput, options = {}) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'checkLastInvoiceInput' is not null or undefined
            (0, common_1.assertParamExists)('planControllerCheckLastInvoice', 'checkLastInvoiceInput', checkLastInvoiceInput);
            const localVarPath = `/planservice/plans/check-last-invoice`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'POST' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            localVarHeaderParameter['Content-Type'] = 'application/json';
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            localVarRequestOptions.data = (0, common_1.serializeDataIfNeeded)(checkLastInvoiceInput, localVarRequestOptions, configuration);
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         *
         * @summary
         * @param {string} planId
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        planControllerGetPlanForTransactionReport: (planId, options = {}) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'planId' is not null or undefined
            (0, common_1.assertParamExists)('planControllerGetPlanForTransactionReport', 'planId', planId);
            const localVarPath = `/planservice/plans/transaction-report/plan/{planId}`.replace(`{${'planId'}}`, encodeURIComponent(String(planId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'GET' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         *
         * @summary
         * @param {string} id
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        planControllerOrderDetailsGetById: (id, options = {}) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'id' is not null or undefined
            (0, common_1.assertParamExists)('planControllerOrderDetailsGetById', 'id', id);
            const localVarPath = `/planservice/plans/order-details/{id}`.replace(`{${'id'}}`, encodeURIComponent(String(id)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'GET' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         *
         * @summary
         * @param {PlanCreateInput} planCreateInput
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        planControllerPlanCreate: (planCreateInput, options = {}) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'planCreateInput' is not null or undefined
            (0, common_1.assertParamExists)('planControllerPlanCreate', 'planCreateInput', planCreateInput);
            const localVarPath = `/planservice/plans`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'POST' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            localVarHeaderParameter['Content-Type'] = 'application/json';
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            localVarRequestOptions.data = (0, common_1.serializeDataIfNeeded)(planCreateInput, localVarRequestOptions, configuration);
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         *
         * @summary
         * @param {PlanRequestInput} planRequestInput
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        planControllerPlanCreateV2: (planRequestInput, options = {}) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'planRequestInput' is not null or undefined
            (0, common_1.assertParamExists)('planControllerPlanCreateV2', 'planRequestInput', planRequestInput);
            const localVarPath = `/planservice/plans/v2`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'POST' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            localVarHeaderParameter['Content-Type'] = 'application/json';
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            localVarRequestOptions.data = (0, common_1.serializeDataIfNeeded)(planRequestInput, localVarRequestOptions, configuration);
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         *
         * @summary
         * @param {string} id
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        planControllerPlanGet: (id, options = {}) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'id' is not null or undefined
            (0, common_1.assertParamExists)('planControllerPlanGet', 'id', id);
            const localVarPath = `/planservice/plans/{id}`.replace(`{${'id'}}`, encodeURIComponent(String(id)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'GET' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         *
         * @summary
         * @param {string} subscriptionId
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        planControllerPlanGetBySubscription: (subscriptionId, options = {}) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'subscriptionId' is not null or undefined
            (0, common_1.assertParamExists)('planControllerPlanGetBySubscription', 'subscriptionId', subscriptionId);
            const localVarPath = `/planservice/plans/by-subscription/{subscriptionId}`.replace(`{${'subscriptionId'}}`, encodeURIComponent(String(subscriptionId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'GET' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         *
         * @summary
         * @param {string} id
         * @param {number} [limit]
         * @param {string} [startingAfter]
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        planControllerPlanListByCustomer: (id, limit, startingAfter, options = {}) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'id' is not null or undefined
            (0, common_1.assertParamExists)('planControllerPlanListByCustomer', 'id', id);
            const localVarPath = `/planservice/plans/by-customer/{id}`.replace(`{${'id'}}`, encodeURIComponent(String(id)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'GET' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            if (limit !== undefined) {
                localVarQueryParameter['limit'] = limit;
            }
            if (startingAfter !== undefined) {
                localVarQueryParameter['startingAfter'] = startingAfter;
            }
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         *
         * @summary
         * @param {string} id
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        planControllerPlanListByMerchant: (id, options = {}) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'id' is not null or undefined
            (0, common_1.assertParamExists)('planControllerPlanListByMerchant', 'id', id);
            const localVarPath = `/planservice/plans/by-merchant/{id}`.replace(`{${'id'}}`, encodeURIComponent(String(id)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'GET' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         *
         * @summary
         * @param {PlanCreateInput} planCreateInput
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        planControllerPlanRegisterSubscription: (planCreateInput, options = {}) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'planCreateInput' is not null or undefined
            (0, common_1.assertParamExists)('planControllerPlanRegisterSubscription', 'planCreateInput', planCreateInput);
            const localVarPath = `/planservice/plans/subscriptions`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'POST' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            localVarHeaderParameter['Content-Type'] = 'application/json';
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            localVarRequestOptions.data = (0, common_1.serializeDataIfNeeded)(planCreateInput, localVarRequestOptions, configuration);
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         *
         * @summary
         * @param {PlanRequestInput} planRequestInput
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        planControllerSubscriptionsCreate: (planRequestInput, options = {}) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'planRequestInput' is not null or undefined
            (0, common_1.assertParamExists)('planControllerSubscriptionsCreate', 'planRequestInput', planRequestInput);
            const localVarPath = `/planservice/plans/subscriptions/v2`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'POST' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            localVarHeaderParameter['Content-Type'] = 'application/json';
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            localVarRequestOptions.data = (0, common_1.serializeDataIfNeeded)(planRequestInput, localVarRequestOptions, configuration);
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         *
         * @summary
         * @param {string} id
         * @param {PlanStatusInput} planStatusInput
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        planControllerUpdatePlanStatus: (id, planStatusInput, options = {}) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'id' is not null or undefined
            (0, common_1.assertParamExists)('planControllerUpdatePlanStatus', 'id', id);
            // verify required parameter 'planStatusInput' is not null or undefined
            (0, common_1.assertParamExists)('planControllerUpdatePlanStatus', 'planStatusInput', planStatusInput);
            const localVarPath = `/planservice/plans/{id}`.replace(`{${'id'}}`, encodeURIComponent(String(id)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'PUT' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            localVarHeaderParameter['Content-Type'] = 'application/json';
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            localVarRequestOptions.data = (0, common_1.serializeDataIfNeeded)(planStatusInput, localVarRequestOptions, configuration);
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
    };
};
exports.PlanApiAxiosParamCreator = PlanApiAxiosParamCreator;
/**
 * PlanApi - functional programming interface
 * @export
 */
const PlanApiFp = function (configuration) {
    const localVarAxiosParamCreator = (0, exports.PlanApiAxiosParamCreator)(configuration);
    return {
        /**
         *
         * @summary
         * @param {CheckoutSessionInput} checkoutSessionInput
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        checkoutSessionControllerCheckoutSessionCreate(checkoutSessionInput, options) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.checkoutSessionControllerCheckoutSessionCreate(checkoutSessionInput, options);
                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
        /**
         *
         * @summary
         * @param {string} sessionId
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        checkoutSessionControllerCheckoutSessionGetBySessionId(sessionId, options) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.checkoutSessionControllerCheckoutSessionGetBySessionId(sessionId, options);
                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
        /**
         *
         * @summary
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        healthControllerCheckHealth(options) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.healthControllerCheckHealth(options);
                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
        /**
         *
         * @summary
         * @param {CalculateInstalmentAmountsInput} calculateInstalmentAmountsInput
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        planControllerCalculateInstalmentAmounts(calculateInstalmentAmountsInput, options) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.planControllerCalculateInstalmentAmounts(calculateInstalmentAmountsInput, options);
                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
        /**
         *
         * @summary
         * @param {CalculateInstalmentAmountsInput} calculateInstalmentAmountsInput
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        planControllerCalculatePlan(calculateInstalmentAmountsInput, options) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.planControllerCalculatePlan(calculateInstalmentAmountsInput, options);
                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
        /**
         *
         * @summary
         * @param {object} body
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        planControllerCalculatePlanAmountV2(body, options) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.planControllerCalculatePlanAmountV2(body, options);
                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
        /**
         *
         * @summary
         * @param {CheckLastInvoiceInput} checkLastInvoiceInput
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        planControllerCheckLastInvoice(checkLastInvoiceInput, options) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.planControllerCheckLastInvoice(checkLastInvoiceInput, options);
                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
        /**
         *
         * @summary
         * @param {string} planId
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        planControllerGetPlanForTransactionReport(planId, options) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.planControllerGetPlanForTransactionReport(planId, options);
                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
        /**
         *
         * @summary
         * @param {string} id
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        planControllerOrderDetailsGetById(id, options) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.planControllerOrderDetailsGetById(id, options);
                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
        /**
         *
         * @summary
         * @param {PlanCreateInput} planCreateInput
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        planControllerPlanCreate(planCreateInput, options) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.planControllerPlanCreate(planCreateInput, options);
                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
        /**
         *
         * @summary
         * @param {PlanRequestInput} planRequestInput
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        planControllerPlanCreateV2(planRequestInput, options) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.planControllerPlanCreateV2(planRequestInput, options);
                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
        /**
         *
         * @summary
         * @param {string} id
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        planControllerPlanGet(id, options) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.planControllerPlanGet(id, options);
                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
        /**
         *
         * @summary
         * @param {string} subscriptionId
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        planControllerPlanGetBySubscription(subscriptionId, options) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.planControllerPlanGetBySubscription(subscriptionId, options);
                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
        /**
         *
         * @summary
         * @param {string} id
         * @param {number} [limit]
         * @param {string} [startingAfter]
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        planControllerPlanListByCustomer(id, limit, startingAfter, options) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.planControllerPlanListByCustomer(id, limit, startingAfter, options);
                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
        /**
         *
         * @summary
         * @param {string} id
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        planControllerPlanListByMerchant(id, options) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.planControllerPlanListByMerchant(id, options);
                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
        /**
         *
         * @summary
         * @param {PlanCreateInput} planCreateInput
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        planControllerPlanRegisterSubscription(planCreateInput, options) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.planControllerPlanRegisterSubscription(planCreateInput, options);
                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
        /**
         *
         * @summary
         * @param {PlanRequestInput} planRequestInput
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        planControllerSubscriptionsCreate(planRequestInput, options) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.planControllerSubscriptionsCreate(planRequestInput, options);
                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
        /**
         *
         * @summary
         * @param {string} id
         * @param {PlanStatusInput} planStatusInput
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        planControllerUpdatePlanStatus(id, planStatusInput, options) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.planControllerUpdatePlanStatus(id, planStatusInput, options);
                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
    };
};
exports.PlanApiFp = PlanApiFp;
/**
 * PlanApi - factory interface
 * @export
 */
const PlanApiFactory = function (configuration, basePath, axios) {
    const localVarFp = (0, exports.PlanApiFp)(configuration);
    return {
        /**
         *
         * @summary
         * @param {CheckoutSessionInput} checkoutSessionInput
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        checkoutSessionControllerCheckoutSessionCreate(checkoutSessionInput, options) {
            return localVarFp
                .checkoutSessionControllerCheckoutSessionCreate(checkoutSessionInput, options)
                .then((request) => request(axios, basePath));
        },
        /**
         *
         * @summary
         * @param {string} sessionId
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        checkoutSessionControllerCheckoutSessionGetBySessionId(sessionId, options) {
            return localVarFp
                .checkoutSessionControllerCheckoutSessionGetBySessionId(sessionId, options)
                .then((request) => request(axios, basePath));
        },
        /**
         *
         * @summary
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        healthControllerCheckHealth(options) {
            return localVarFp
                .healthControllerCheckHealth(options)
                .then((request) => request(axios, basePath));
        },
        /**
         *
         * @summary
         * @param {CalculateInstalmentAmountsInput} calculateInstalmentAmountsInput
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        planControllerCalculateInstalmentAmounts(calculateInstalmentAmountsInput, options) {
            return localVarFp
                .planControllerCalculateInstalmentAmounts(calculateInstalmentAmountsInput, options)
                .then((request) => request(axios, basePath));
        },
        /**
         *
         * @summary
         * @param {CalculateInstalmentAmountsInput} calculateInstalmentAmountsInput
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        planControllerCalculatePlan(calculateInstalmentAmountsInput, options) {
            return localVarFp
                .planControllerCalculatePlan(calculateInstalmentAmountsInput, options)
                .then((request) => request(axios, basePath));
        },
        /**
         *
         * @summary
         * @param {object} body
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        planControllerCalculatePlanAmountV2(body, options) {
            return localVarFp
                .planControllerCalculatePlanAmountV2(body, options)
                .then((request) => request(axios, basePath));
        },
        /**
         *
         * @summary
         * @param {CheckLastInvoiceInput} checkLastInvoiceInput
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        planControllerCheckLastInvoice(checkLastInvoiceInput, options) {
            return localVarFp
                .planControllerCheckLastInvoice(checkLastInvoiceInput, options)
                .then((request) => request(axios, basePath));
        },
        /**
         *
         * @summary
         * @param {string} planId
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        planControllerGetPlanForTransactionReport(planId, options) {
            return localVarFp
                .planControllerGetPlanForTransactionReport(planId, options)
                .then((request) => request(axios, basePath));
        },
        /**
         *
         * @summary
         * @param {string} id
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        planControllerOrderDetailsGetById(id, options) {
            return localVarFp
                .planControllerOrderDetailsGetById(id, options)
                .then((request) => request(axios, basePath));
        },
        /**
         *
         * @summary
         * @param {PlanCreateInput} planCreateInput
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        planControllerPlanCreate(planCreateInput, options) {
            return localVarFp
                .planControllerPlanCreate(planCreateInput, options)
                .then((request) => request(axios, basePath));
        },
        /**
         *
         * @summary
         * @param {PlanRequestInput} planRequestInput
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        planControllerPlanCreateV2(planRequestInput, options) {
            return localVarFp
                .planControllerPlanCreateV2(planRequestInput, options)
                .then((request) => request(axios, basePath));
        },
        /**
         *
         * @summary
         * @param {string} id
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        planControllerPlanGet(id, options) {
            return localVarFp
                .planControllerPlanGet(id, options)
                .then((request) => request(axios, basePath));
        },
        /**
         *
         * @summary
         * @param {string} subscriptionId
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        planControllerPlanGetBySubscription(subscriptionId, options) {
            return localVarFp
                .planControllerPlanGetBySubscription(subscriptionId, options)
                .then((request) => request(axios, basePath));
        },
        /**
         *
         * @summary
         * @param {string} id
         * @param {number} [limit]
         * @param {string} [startingAfter]
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        planControllerPlanListByCustomer(id, limit, startingAfter, options) {
            return localVarFp
                .planControllerPlanListByCustomer(id, limit, startingAfter, options)
                .then((request) => request(axios, basePath));
        },
        /**
         *
         * @summary
         * @param {string} id
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        planControllerPlanListByMerchant(id, options) {
            return localVarFp
                .planControllerPlanListByMerchant(id, options)
                .then((request) => request(axios, basePath));
        },
        /**
         *
         * @summary
         * @param {PlanCreateInput} planCreateInput
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        planControllerPlanRegisterSubscription(planCreateInput, options) {
            return localVarFp
                .planControllerPlanRegisterSubscription(planCreateInput, options)
                .then((request) => request(axios, basePath));
        },
        /**
         *
         * @summary
         * @param {PlanRequestInput} planRequestInput
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        planControllerSubscriptionsCreate(planRequestInput, options) {
            return localVarFp
                .planControllerSubscriptionsCreate(planRequestInput, options)
                .then((request) => request(axios, basePath));
        },
        /**
         *
         * @summary
         * @param {string} id
         * @param {PlanStatusInput} planStatusInput
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        planControllerUpdatePlanStatus(id, planStatusInput, options) {
            return localVarFp
                .planControllerUpdatePlanStatus(id, planStatusInput, options)
                .then((request) => request(axios, basePath));
        },
    };
};
exports.PlanApiFactory = PlanApiFactory;
/**
 * PlanApi - object-oriented interface
 * @export
 * @class PlanApi
 * @extends {BaseAPI}
 */
class PlanApi extends base_1.BaseAPI {
    /**
     *
     * @summary
     * @param {CheckoutSessionInput} checkoutSessionInput
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PlanApi
     */
    checkoutSessionControllerCheckoutSessionCreate(checkoutSessionInput, options) {
        return (0, exports.PlanApiFp)(this.configuration)
            .checkoutSessionControllerCheckoutSessionCreate(checkoutSessionInput, options)
            .then((request) => request(this.axios, this.basePath));
    }
    /**
     *
     * @summary
     * @param {string} sessionId
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PlanApi
     */
    checkoutSessionControllerCheckoutSessionGetBySessionId(sessionId, options) {
        return (0, exports.PlanApiFp)(this.configuration)
            .checkoutSessionControllerCheckoutSessionGetBySessionId(sessionId, options)
            .then((request) => request(this.axios, this.basePath));
    }
    /**
     *
     * @summary
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PlanApi
     */
    healthControllerCheckHealth(options) {
        return (0, exports.PlanApiFp)(this.configuration)
            .healthControllerCheckHealth(options)
            .then((request) => request(this.axios, this.basePath));
    }
    /**
     *
     * @summary
     * @param {CalculateInstalmentAmountsInput} calculateInstalmentAmountsInput
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PlanApi
     */
    planControllerCalculateInstalmentAmounts(calculateInstalmentAmountsInput, options) {
        return (0, exports.PlanApiFp)(this.configuration)
            .planControllerCalculateInstalmentAmounts(calculateInstalmentAmountsInput, options)
            .then((request) => request(this.axios, this.basePath));
    }
    /**
     *
     * @summary
     * @param {CalculateInstalmentAmountsInput} calculateInstalmentAmountsInput
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PlanApi
     */
    planControllerCalculatePlan(calculateInstalmentAmountsInput, options) {
        return (0, exports.PlanApiFp)(this.configuration)
            .planControllerCalculatePlan(calculateInstalmentAmountsInput, options)
            .then((request) => request(this.axios, this.basePath));
    }
    /**
     *
     * @summary
     * @param {object} body
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PlanApi
     */
    planControllerCalculatePlanAmountV2(body, options) {
        return (0, exports.PlanApiFp)(this.configuration)
            .planControllerCalculatePlanAmountV2(body, options)
            .then((request) => request(this.axios, this.basePath));
    }
    /**
     *
     * @summary
     * @param {CheckLastInvoiceInput} checkLastInvoiceInput
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PlanApi
     */
    planControllerCheckLastInvoice(checkLastInvoiceInput, options) {
        return (0, exports.PlanApiFp)(this.configuration)
            .planControllerCheckLastInvoice(checkLastInvoiceInput, options)
            .then((request) => request(this.axios, this.basePath));
    }
    /**
     *
     * @summary
     * @param {string} planId
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PlanApi
     */
    planControllerGetPlanForTransactionReport(planId, options) {
        return (0, exports.PlanApiFp)(this.configuration)
            .planControllerGetPlanForTransactionReport(planId, options)
            .then((request) => request(this.axios, this.basePath));
    }
    /**
     *
     * @summary
     * @param {string} id
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PlanApi
     */
    planControllerOrderDetailsGetById(id, options) {
        return (0, exports.PlanApiFp)(this.configuration)
            .planControllerOrderDetailsGetById(id, options)
            .then((request) => request(this.axios, this.basePath));
    }
    /**
     *
     * @summary
     * @param {PlanCreateInput} planCreateInput
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PlanApi
     */
    planControllerPlanCreate(planCreateInput, options) {
        return (0, exports.PlanApiFp)(this.configuration)
            .planControllerPlanCreate(planCreateInput, options)
            .then((request) => request(this.axios, this.basePath));
    }
    /**
     *
     * @summary
     * @param {PlanRequestInput} planRequestInput
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PlanApi
     */
    planControllerPlanCreateV2(planRequestInput, options) {
        return (0, exports.PlanApiFp)(this.configuration)
            .planControllerPlanCreateV2(planRequestInput, options)
            .then((request) => request(this.axios, this.basePath));
    }
    /**
     *
     * @summary
     * @param {string} id
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PlanApi
     */
    planControllerPlanGet(id, options) {
        return (0, exports.PlanApiFp)(this.configuration)
            .planControllerPlanGet(id, options)
            .then((request) => request(this.axios, this.basePath));
    }
    /**
     *
     * @summary
     * @param {string} subscriptionId
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PlanApi
     */
    planControllerPlanGetBySubscription(subscriptionId, options) {
        return (0, exports.PlanApiFp)(this.configuration)
            .planControllerPlanGetBySubscription(subscriptionId, options)
            .then((request) => request(this.axios, this.basePath));
    }
    /**
     *
     * @summary
     * @param {string} id
     * @param {number} [limit]
     * @param {string} [startingAfter]
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PlanApi
     */
    planControllerPlanListByCustomer(id, limit, startingAfter, options) {
        return (0, exports.PlanApiFp)(this.configuration)
            .planControllerPlanListByCustomer(id, limit, startingAfter, options)
            .then((request) => request(this.axios, this.basePath));
    }
    /**
     *
     * @summary
     * @param {string} id
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PlanApi
     */
    planControllerPlanListByMerchant(id, options) {
        return (0, exports.PlanApiFp)(this.configuration)
            .planControllerPlanListByMerchant(id, options)
            .then((request) => request(this.axios, this.basePath));
    }
    /**
     *
     * @summary
     * @param {PlanCreateInput} planCreateInput
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PlanApi
     */
    planControllerPlanRegisterSubscription(planCreateInput, options) {
        return (0, exports.PlanApiFp)(this.configuration)
            .planControllerPlanRegisterSubscription(planCreateInput, options)
            .then((request) => request(this.axios, this.basePath));
    }
    /**
     *
     * @summary
     * @param {PlanRequestInput} planRequestInput
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PlanApi
     */
    planControllerSubscriptionsCreate(planRequestInput, options) {
        return (0, exports.PlanApiFp)(this.configuration)
            .planControllerSubscriptionsCreate(planRequestInput, options)
            .then((request) => request(this.axios, this.basePath));
    }
    /**
     *
     * @summary
     * @param {string} id
     * @param {PlanStatusInput} planStatusInput
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PlanApi
     */
    planControllerUpdatePlanStatus(id, planStatusInput, options) {
        return (0, exports.PlanApiFp)(this.configuration)
            .planControllerUpdatePlanStatus(id, planStatusInput, options)
            .then((request) => request(this.axios, this.basePath));
    }
}
exports.PlanApi = PlanApi;


/***/ }),

/***/ "./packages/plan-client/src/base.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/* tslint:disable */
/* eslint-disable */
/**
 * Plan Service
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RequiredError = exports.BaseAPI = exports.COLLECTION_FORMATS = exports.BASE_PATH = void 0;
const tslib_1 = __webpack_require__("tslib");
// Some imports not used depending on template conditions
// @ts-ignore
const axios_1 = tslib_1.__importDefault(__webpack_require__("axios"));
exports.BASE_PATH = 'http://localhost'.replace(/\/+$/, '');
/**
 *
 * @export
 */
exports.COLLECTION_FORMATS = {
    csv: ',',
    ssv: ' ',
    tsv: '\t',
    pipes: '|',
};
/**
 *
 * @export
 * @class BaseAPI
 */
class BaseAPI {
    constructor(configuration, basePath = exports.BASE_PATH, axios = axios_1.default) {
        this.basePath = basePath;
        this.axios = axios;
        if (configuration) {
            this.configuration = configuration;
            this.basePath = configuration.basePath || this.basePath;
        }
    }
}
exports.BaseAPI = BaseAPI;
/**
 *
 * @export
 * @class RequiredError
 * @extends {Error}
 */
class RequiredError extends Error {
    constructor(field, msg) {
        super(msg);
        this.field = field;
        this.name = 'RequiredError';
    }
}
exports.RequiredError = RequiredError;


/***/ }),

/***/ "./packages/plan-client/src/common.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/* tslint:disable */
/* eslint-disable */
/**
 * Plan Service
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createRequestFunction = exports.toPathString = exports.serializeDataIfNeeded = exports.setSearchParams = exports.setOAuthToObject = exports.setBearerAuthToObject = exports.setBasicAuthToObject = exports.setApiKeyToObject = exports.assertParamExists = exports.DUMMY_BASE_URL = void 0;
const tslib_1 = __webpack_require__("tslib");
const base_1 = __webpack_require__("./packages/plan-client/src/base.ts");
/**
 *
 * @export
 */
exports.DUMMY_BASE_URL = 'https://example.com';
/**
 *
 * @throws {RequiredError}
 * @export
 */
const assertParamExists = function (functionName, paramName, paramValue) {
    if (paramValue === null || paramValue === undefined) {
        throw new base_1.RequiredError(paramName, `Required parameter ${paramName} was null or undefined when calling ${functionName}.`);
    }
};
exports.assertParamExists = assertParamExists;
/**
 *
 * @export
 */
const setApiKeyToObject = function (object, keyParamName, configuration) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (configuration && configuration.apiKey) {
            const localVarApiKeyValue = typeof configuration.apiKey === 'function'
                ? yield configuration.apiKey(keyParamName)
                : yield configuration.apiKey;
            object[keyParamName] = localVarApiKeyValue;
        }
    });
};
exports.setApiKeyToObject = setApiKeyToObject;
/**
 *
 * @export
 */
const setBasicAuthToObject = function (object, configuration) {
    if (configuration && (configuration.username || configuration.password)) {
        object['auth'] = {
            username: configuration.username,
            password: configuration.password,
        };
    }
};
exports.setBasicAuthToObject = setBasicAuthToObject;
/**
 *
 * @export
 */
const setBearerAuthToObject = function (object, configuration) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (configuration && configuration.accessToken) {
            const accessToken = typeof configuration.accessToken === 'function'
                ? yield configuration.accessToken()
                : yield configuration.accessToken;
            object['Authorization'] = 'Bearer ' + accessToken;
        }
    });
};
exports.setBearerAuthToObject = setBearerAuthToObject;
/**
 *
 * @export
 */
const setOAuthToObject = function (object, name, scopes, configuration) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (configuration && configuration.accessToken) {
            const localVarAccessTokenValue = typeof configuration.accessToken === 'function'
                ? yield configuration.accessToken(name, scopes)
                : yield configuration.accessToken;
            object['Authorization'] = 'Bearer ' + localVarAccessTokenValue;
        }
    });
};
exports.setOAuthToObject = setOAuthToObject;
/**
 *
 * @export
 */
const setSearchParams = function (url, ...objects) {
    const searchParams = new URLSearchParams(url.search);
    for (const object of objects) {
        for (const key in object) {
            if (Array.isArray(object[key])) {
                searchParams.delete(key);
                for (const item of object[key]) {
                    searchParams.append(key, item);
                }
            }
            else {
                searchParams.set(key, object[key]);
            }
        }
    }
    url.search = searchParams.toString();
};
exports.setSearchParams = setSearchParams;
/**
 *
 * @export
 */
const serializeDataIfNeeded = function (value, requestOptions, configuration) {
    const nonString = typeof value !== 'string';
    const needsSerialization = nonString && configuration && configuration.isJsonMime
        ? configuration.isJsonMime(requestOptions.headers['Content-Type'])
        : nonString;
    return needsSerialization
        ? JSON.stringify(value !== undefined ? value : {})
        : value || '';
};
exports.serializeDataIfNeeded = serializeDataIfNeeded;
/**
 *
 * @export
 */
const toPathString = function (url) {
    return url.pathname + url.search + url.hash;
};
exports.toPathString = toPathString;
/**
 *
 * @export
 */
const createRequestFunction = function (axiosArgs, globalAxios, BASE_PATH, configuration) {
    return (axios = globalAxios, basePath = BASE_PATH) => {
        const axiosRequestArgs = Object.assign(Object.assign({}, axiosArgs.options), { url: ((configuration === null || configuration === void 0 ? void 0 : configuration.basePath) || basePath) + axiosArgs.url });
        return axios.request(axiosRequestArgs);
    };
};
exports.createRequestFunction = createRequestFunction;


/***/ }),

/***/ "./packages/plan-client/src/configuration.ts":
/***/ ((__unused_webpack_module, exports) => {


/* tslint:disable */
/* eslint-disable */
/**
 * Plan Service
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Configuration = void 0;
class Configuration {
    constructor(param = {}) {
        this.apiKey = param.apiKey;
        this.username = param.username;
        this.password = param.password;
        this.accessToken = param.accessToken;
        this.basePath = param.basePath;
        this.baseOptions = param.baseOptions;
        this.formDataCtor = param.formDataCtor;
    }
    /**
     * Check if the given MIME is a JSON MIME.
     * JSON MIME examples:
     *   application/json
     *   application/json; charset=UTF8
     *   APPLICATION/JSON
     *   application/vnd.company+json
     * @param mime - MIME (Multipurpose Internet Mail Extensions)
     * @return True if the given MIME is JSON, false otherwise.
     */
    isJsonMime(mime) {
        const jsonMime = new RegExp('^(application/json|[^;/ \t]+/[^;/ \t]+[+]json)[ \t]*(;.*)?$', 'i');
        return (mime !== null &&
            (jsonMime.test(mime) ||
                mime.toLowerCase() === 'application/json-patch+json'));
    }
}
exports.Configuration = Configuration;


/***/ }),

/***/ "./packages/plan-client/src/index.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/* tslint:disable */
/* eslint-disable */
/**
 * Plan Service
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__("tslib");
tslib_1.__exportStar(__webpack_require__("./packages/plan-client/src/api.ts"), exports);
tslib_1.__exportStar(__webpack_require__("./packages/plan-client/src/configuration.ts"), exports);


/***/ }),

/***/ "./packages/planpay-client/src/api.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/* tslint:disable */
/* eslint-disable */
/**
 * Planpay
 * OpenAPI compliant REST API built using tRPC with Next.js
 *
 * The version of the OpenAPI document: 1.0.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CheckoutApi = exports.CheckoutApiFactory = exports.CheckoutApiFp = exports.CheckoutApiAxiosParamCreator = exports.AuthApi = exports.AuthApiFactory = exports.AuthApiFp = exports.AuthApiAxiosParamCreator = exports.MutationCheckoutCreateCheckoutRequestItemsInnerRefundPoliciesInnerTypeEnum = exports.MutationCheckoutCreateCheckoutRequestItemsInnerMinimumDepositPerItemAnyOf1UnitEnum = exports.MutationCheckoutCreateCheckoutRequestItemsInnerMinimumDepositPerItemAnyOfUnitEnum = exports.MutationCheckoutCreateCheckoutRequestItemsInnerMinimumDepositPerItemUnitEnum = exports.MutationCheckoutCreateCheckoutRequestTypeEnum = void 0;
const tslib_1 = __webpack_require__("tslib");
const axios_1 = tslib_1.__importDefault(__webpack_require__("axios"));
// Some imports not used depending on template conditions
// @ts-ignore
const common_1 = __webpack_require__("./packages/planpay-client/src/common.ts");
// @ts-ignore
const base_1 = __webpack_require__("./packages/planpay-client/src/base.ts");
exports.MutationCheckoutCreateCheckoutRequestTypeEnum = {
    Plan: 'plan',
};
exports.MutationCheckoutCreateCheckoutRequestItemsInnerMinimumDepositPerItemUnitEnum = {
    Percentage: 'Percentage',
};
exports.MutationCheckoutCreateCheckoutRequestItemsInnerMinimumDepositPerItemAnyOfUnitEnum = {
    Currency: 'Currency',
};
exports.MutationCheckoutCreateCheckoutRequestItemsInnerMinimumDepositPerItemAnyOf1UnitEnum = {
    Percentage: 'Percentage',
};
exports.MutationCheckoutCreateCheckoutRequestItemsInnerRefundPoliciesInnerTypeEnum = {
    PercentageRefundableDaysWithinRedemptionDate: 'percentage_refundable_days_within_redemption_date',
};
/**
 * AuthApi - axios parameter creator
 * @export
 */
const AuthApiAxiosParamCreator = function (configuration) {
    return {
        /**
         *
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        queryAuthGetPermissions: (options = {}) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const localVarPath = `/v2/auth/permissions`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'GET' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
    };
};
exports.AuthApiAxiosParamCreator = AuthApiAxiosParamCreator;
/**
 * AuthApi - functional programming interface
 * @export
 */
const AuthApiFp = function (configuration) {
    const localVarAxiosParamCreator = (0, exports.AuthApiAxiosParamCreator)(configuration);
    return {
        /**
         *
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        queryAuthGetPermissions(options) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.queryAuthGetPermissions(options);
                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
    };
};
exports.AuthApiFp = AuthApiFp;
/**
 * AuthApi - factory interface
 * @export
 */
const AuthApiFactory = function (configuration, basePath, axios) {
    const localVarFp = (0, exports.AuthApiFp)(configuration);
    return {
        /**
         *
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        queryAuthGetPermissions(options) {
            return localVarFp
                .queryAuthGetPermissions(options)
                .then((request) => request(axios, basePath));
        },
    };
};
exports.AuthApiFactory = AuthApiFactory;
/**
 * AuthApi - object-oriented interface
 * @export
 * @class AuthApi
 * @extends {BaseAPI}
 */
class AuthApi extends base_1.BaseAPI {
    /**
     *
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AuthApi
     */
    queryAuthGetPermissions(options) {
        return (0, exports.AuthApiFp)(this.configuration)
            .queryAuthGetPermissions(options)
            .then((request) => request(this.axios, this.basePath));
    }
}
exports.AuthApi = AuthApi;
/**
 * CheckoutApi - axios parameter creator
 * @export
 */
const CheckoutApiAxiosParamCreator = function (configuration) {
    return {
        /**
         *
         * @param {MutationCheckoutCreateCheckoutRequest} mutationCheckoutCreateCheckoutRequest
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        mutationCheckoutCreateCheckout: (mutationCheckoutCreateCheckoutRequest, options = {}) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'mutationCheckoutCreateCheckoutRequest' is not null or undefined
            (0, common_1.assertParamExists)('mutationCheckoutCreateCheckout', 'mutationCheckoutCreateCheckoutRequest', mutationCheckoutCreateCheckoutRequest);
            const localVarPath = `/v2/checkout`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'POST' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            localVarHeaderParameter['Content-Type'] = 'application/json';
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            localVarRequestOptions.data = (0, common_1.serializeDataIfNeeded)(mutationCheckoutCreateCheckoutRequest, localVarRequestOptions, configuration);
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         *
         * @param {string} checkoutId
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        queryCheckoutGetCheckout: (checkoutId, options = {}) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'checkoutId' is not null or undefined
            (0, common_1.assertParamExists)('queryCheckoutGetCheckout', 'checkoutId', checkoutId);
            const localVarPath = `/v2/checkout/{checkoutId}`.replace(`{${'checkoutId'}}`, encodeURIComponent(String(checkoutId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'GET' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
    };
};
exports.CheckoutApiAxiosParamCreator = CheckoutApiAxiosParamCreator;
/**
 * CheckoutApi - functional programming interface
 * @export
 */
const CheckoutApiFp = function (configuration) {
    const localVarAxiosParamCreator = (0, exports.CheckoutApiAxiosParamCreator)(configuration);
    return {
        /**
         *
         * @param {MutationCheckoutCreateCheckoutRequest} mutationCheckoutCreateCheckoutRequest
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        mutationCheckoutCreateCheckout(mutationCheckoutCreateCheckoutRequest, options) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.mutationCheckoutCreateCheckout(mutationCheckoutCreateCheckoutRequest, options);
                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
        /**
         *
         * @param {string} checkoutId
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        queryCheckoutGetCheckout(checkoutId, options) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.queryCheckoutGetCheckout(checkoutId, options);
                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
    };
};
exports.CheckoutApiFp = CheckoutApiFp;
/**
 * CheckoutApi - factory interface
 * @export
 */
const CheckoutApiFactory = function (configuration, basePath, axios) {
    const localVarFp = (0, exports.CheckoutApiFp)(configuration);
    return {
        /**
         *
         * @param {MutationCheckoutCreateCheckoutRequest} mutationCheckoutCreateCheckoutRequest
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        mutationCheckoutCreateCheckout(mutationCheckoutCreateCheckoutRequest, options) {
            return localVarFp
                .mutationCheckoutCreateCheckout(mutationCheckoutCreateCheckoutRequest, options)
                .then((request) => request(axios, basePath));
        },
        /**
         *
         * @param {string} checkoutId
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        queryCheckoutGetCheckout(checkoutId, options) {
            return localVarFp
                .queryCheckoutGetCheckout(checkoutId, options)
                .then((request) => request(axios, basePath));
        },
    };
};
exports.CheckoutApiFactory = CheckoutApiFactory;
/**
 * CheckoutApi - object-oriented interface
 * @export
 * @class CheckoutApi
 * @extends {BaseAPI}
 */
class CheckoutApi extends base_1.BaseAPI {
    /**
     *
     * @param {MutationCheckoutCreateCheckoutRequest} mutationCheckoutCreateCheckoutRequest
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof CheckoutApi
     */
    mutationCheckoutCreateCheckout(mutationCheckoutCreateCheckoutRequest, options) {
        return (0, exports.CheckoutApiFp)(this.configuration)
            .mutationCheckoutCreateCheckout(mutationCheckoutCreateCheckoutRequest, options)
            .then((request) => request(this.axios, this.basePath));
    }
    /**
     *
     * @param {string} checkoutId
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof CheckoutApi
     */
    queryCheckoutGetCheckout(checkoutId, options) {
        return (0, exports.CheckoutApiFp)(this.configuration)
            .queryCheckoutGetCheckout(checkoutId, options)
            .then((request) => request(this.axios, this.basePath));
    }
}
exports.CheckoutApi = CheckoutApi;


/***/ }),

/***/ "./packages/planpay-client/src/base.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/* tslint:disable */
/* eslint-disable */
/**
 * Planpay
 * OpenAPI compliant REST API built using tRPC with Next.js
 *
 * The version of the OpenAPI document: 1.0.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RequiredError = exports.BaseAPI = exports.COLLECTION_FORMATS = exports.BASE_PATH = void 0;
const tslib_1 = __webpack_require__("tslib");
// Some imports not used depending on template conditions
// @ts-ignore
const axios_1 = tslib_1.__importDefault(__webpack_require__("axios"));
exports.BASE_PATH = 'https://localhost:4200/api'.replace(/\/+$/, '');
/**
 *
 * @export
 */
exports.COLLECTION_FORMATS = {
    csv: ',',
    ssv: ' ',
    tsv: '\t',
    pipes: '|',
};
/**
 *
 * @export
 * @class BaseAPI
 */
class BaseAPI {
    constructor(configuration, basePath = exports.BASE_PATH, axios = axios_1.default) {
        this.basePath = basePath;
        this.axios = axios;
        if (configuration) {
            this.configuration = configuration;
            this.basePath = configuration.basePath || this.basePath;
        }
    }
}
exports.BaseAPI = BaseAPI;
/**
 *
 * @export
 * @class RequiredError
 * @extends {Error}
 */
class RequiredError extends Error {
    constructor(field, msg) {
        super(msg);
        this.field = field;
        this.name = 'RequiredError';
    }
}
exports.RequiredError = RequiredError;


/***/ }),

/***/ "./packages/planpay-client/src/common.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/* tslint:disable */
/* eslint-disable */
/**
 * Planpay
 * OpenAPI compliant REST API built using tRPC with Next.js
 *
 * The version of the OpenAPI document: 1.0.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createRequestFunction = exports.toPathString = exports.serializeDataIfNeeded = exports.setSearchParams = exports.setOAuthToObject = exports.setBearerAuthToObject = exports.setBasicAuthToObject = exports.setApiKeyToObject = exports.assertParamExists = exports.DUMMY_BASE_URL = void 0;
const tslib_1 = __webpack_require__("tslib");
const base_1 = __webpack_require__("./packages/planpay-client/src/base.ts");
/**
 *
 * @export
 */
exports.DUMMY_BASE_URL = 'https://example.com';
/**
 *
 * @throws {RequiredError}
 * @export
 */
const assertParamExists = function (functionName, paramName, paramValue) {
    if (paramValue === null || paramValue === undefined) {
        throw new base_1.RequiredError(paramName, `Required parameter ${paramName} was null or undefined when calling ${functionName}.`);
    }
};
exports.assertParamExists = assertParamExists;
/**
 *
 * @export
 */
const setApiKeyToObject = function (object, keyParamName, configuration) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (configuration && configuration.apiKey) {
            const localVarApiKeyValue = typeof configuration.apiKey === 'function'
                ? yield configuration.apiKey(keyParamName)
                : yield configuration.apiKey;
            object[keyParamName] = localVarApiKeyValue;
        }
    });
};
exports.setApiKeyToObject = setApiKeyToObject;
/**
 *
 * @export
 */
const setBasicAuthToObject = function (object, configuration) {
    if (configuration && (configuration.username || configuration.password)) {
        object['auth'] = {
            username: configuration.username,
            password: configuration.password,
        };
    }
};
exports.setBasicAuthToObject = setBasicAuthToObject;
/**
 *
 * @export
 */
const setBearerAuthToObject = function (object, configuration) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (configuration && configuration.accessToken) {
            const accessToken = typeof configuration.accessToken === 'function'
                ? yield configuration.accessToken()
                : yield configuration.accessToken;
            object['Authorization'] = 'Bearer ' + accessToken;
        }
    });
};
exports.setBearerAuthToObject = setBearerAuthToObject;
/**
 *
 * @export
 */
const setOAuthToObject = function (object, name, scopes, configuration) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (configuration && configuration.accessToken) {
            const localVarAccessTokenValue = typeof configuration.accessToken === 'function'
                ? yield configuration.accessToken(name, scopes)
                : yield configuration.accessToken;
            object['Authorization'] = 'Bearer ' + localVarAccessTokenValue;
        }
    });
};
exports.setOAuthToObject = setOAuthToObject;
function setFlattenedQueryParams(urlSearchParams, parameter, key = '') {
    if (typeof parameter === 'object') {
        if (Array.isArray(parameter)) {
            parameter.forEach((item) => setFlattenedQueryParams(urlSearchParams, item, key));
        }
        else {
            Object.keys(parameter).forEach((currentKey) => setFlattenedQueryParams(urlSearchParams, parameter[currentKey], `${key}${key !== '' ? '.' : ''}${currentKey}`));
        }
    }
    else {
        if (urlSearchParams.has(key)) {
            urlSearchParams.append(key, parameter);
        }
        else {
            urlSearchParams.set(key, parameter);
        }
    }
}
/**
 *
 * @export
 */
const setSearchParams = function (url, ...objects) {
    const searchParams = new URLSearchParams(url.search);
    setFlattenedQueryParams(searchParams, objects);
    url.search = searchParams.toString();
};
exports.setSearchParams = setSearchParams;
/**
 *
 * @export
 */
const serializeDataIfNeeded = function (value, requestOptions, configuration) {
    const nonString = typeof value !== 'string';
    const needsSerialization = nonString && configuration && configuration.isJsonMime
        ? configuration.isJsonMime(requestOptions.headers['Content-Type'])
        : nonString;
    return needsSerialization
        ? JSON.stringify(value !== undefined ? value : {})
        : value || '';
};
exports.serializeDataIfNeeded = serializeDataIfNeeded;
/**
 *
 * @export
 */
const toPathString = function (url) {
    return url.pathname + url.search + url.hash;
};
exports.toPathString = toPathString;
/**
 *
 * @export
 */
const createRequestFunction = function (axiosArgs, globalAxios, BASE_PATH, configuration) {
    return (axios = globalAxios, basePath = BASE_PATH) => {
        const axiosRequestArgs = Object.assign(Object.assign({}, axiosArgs.options), { url: ((configuration === null || configuration === void 0 ? void 0 : configuration.basePath) || basePath) + axiosArgs.url });
        return axios.request(axiosRequestArgs);
    };
};
exports.createRequestFunction = createRequestFunction;


/***/ }),

/***/ "./packages/planpay-client/src/configuration.ts":
/***/ ((__unused_webpack_module, exports) => {


/* tslint:disable */
/* eslint-disable */
/**
 * Planpay
 * OpenAPI compliant REST API built using tRPC with Next.js
 *
 * The version of the OpenAPI document: 1.0.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Configuration = void 0;
class Configuration {
    constructor(param = {}) {
        this.apiKey = param.apiKey;
        this.username = param.username;
        this.password = param.password;
        this.accessToken = param.accessToken;
        this.basePath = param.basePath;
        this.baseOptions = param.baseOptions;
        this.formDataCtor = param.formDataCtor;
    }
    /**
     * Check if the given MIME is a JSON MIME.
     * JSON MIME examples:
     *   application/json
     *   application/json; charset=UTF8
     *   APPLICATION/JSON
     *   application/vnd.company+json
     * @param mime - MIME (Multipurpose Internet Mail Extensions)
     * @return True if the given MIME is JSON, false otherwise.
     */
    isJsonMime(mime) {
        const jsonMime = new RegExp('^(application/json|[^;/ \t]+/[^;/ \t]+[+]json)[ \t]*(;.*)?$', 'i');
        return (mime !== null &&
            (jsonMime.test(mime) ||
                mime.toLowerCase() === 'application/json-patch+json'));
    }
}
exports.Configuration = Configuration;


/***/ }),

/***/ "./packages/planpay-client/src/index.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/* tslint:disable */
/* eslint-disable */
/**
 * Planpay
 * OpenAPI compliant REST API built using tRPC with Next.js
 *
 * The version of the OpenAPI document: 1.0.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__("tslib");
tslib_1.__exportStar(__webpack_require__("./packages/planpay-client/src/api.ts"), exports);
tslib_1.__exportStar(__webpack_require__("./packages/planpay-client/src/configuration.ts"), exports);


/***/ }),

/***/ "./packages/shared-lib/src/constants/checkout.ts":
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CHECKOUT_QUERY_PARAMETER = exports.PLANPAY_CHECKOUT_PATH = void 0;
exports.PLANPAY_CHECKOUT_PATH = '/checkout';
exports.CHECKOUT_QUERY_PARAMETER = {
    CHECKOUT_ID: 'checkoutId',
    DEPOSIT: 'deposit',
    FREQUENCY: 'frequency',
    MERCHANT_NAME: 'merchantName',
    DEPOSIT_CHANGED: 'depositChanged',
    CALLBACK_URL: 'callbackUrl',
};


/***/ }),

/***/ "./packages/shared-lib/src/constants/index.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__("tslib");
tslib_1.__exportStar(__webpack_require__("./packages/shared-lib/src/constants/regex.ts"), exports);
tslib_1.__exportStar(__webpack_require__("./packages/shared-lib/src/constants/checkout.ts"), exports);


/***/ }),

/***/ "./packages/shared-lib/src/constants/regex.ts":
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PASSWORD_POLICY_REGEX = void 0;
exports.PASSWORD_POLICY_REGEX = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/;


/***/ }),

/***/ "./packages/shared-lib/src/entities/common.ts":
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ "./packages/shared-lib/src/entities/index.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__("tslib");
tslib_1.__exportStar(__webpack_require__("./packages/shared-lib/src/entities/plan.ts"), exports);
tslib_1.__exportStar(__webpack_require__("./packages/shared-lib/src/entities/money.ts"), exports);
tslib_1.__exportStar(__webpack_require__("./packages/shared-lib/src/entities/merchant.ts"), exports);
tslib_1.__exportStar(__webpack_require__("./packages/shared-lib/src/entities/common.ts"), exports);
tslib_1.__exportStar(__webpack_require__("./packages/shared-lib/src/entities/invoice.ts"), exports);
tslib_1.__exportStar(__webpack_require__("./packages/shared-lib/src/entities/payment-method.ts"), exports);


/***/ }),

/***/ "./packages/shared-lib/src/entities/invoice.ts":
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PaymentStatusDisplayedEnum = void 0;
var PaymentStatusDisplayedEnum;
(function (PaymentStatusDisplayedEnum) {
    PaymentStatusDisplayedEnum["ON_SCHEDULE"] = "ON_SCHEDULE";
    PaymentStatusDisplayedEnum["LATE"] = "LATE";
    PaymentStatusDisplayedEnum["UPCOMING"] = "UPCOMING";
    PaymentStatusDisplayedEnum["PAID"] = "PAID";
    PaymentStatusDisplayedEnum["UNPAID"] = "UNPAID";
})(PaymentStatusDisplayedEnum = exports.PaymentStatusDisplayedEnum || (exports.PaymentStatusDisplayedEnum = {}));


/***/ }),

/***/ "./packages/shared-lib/src/entities/merchant.ts":
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ "./packages/shared-lib/src/entities/money.ts":
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CurrencyEnum = void 0;
var CurrencyEnum;
(function (CurrencyEnum) {
    CurrencyEnum["AUD"] = "AUD";
})(CurrencyEnum = exports.CurrencyEnum || (exports.CurrencyEnum = {}));


/***/ }),

/***/ "./packages/shared-lib/src/entities/payment-method.ts":
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CardBrandEnum = void 0;
var CardBrandEnum;
(function (CardBrandEnum) {
    CardBrandEnum["AmericanExpress"] = "amex";
    CardBrandEnum["DinersClub"] = "diners_club";
    CardBrandEnum["Discover"] = "discover";
    CardBrandEnum["JCB"] = "jcb";
    CardBrandEnum["MasterCard"] = "mastercard";
    CardBrandEnum["UnionPay"] = "unionpay";
    CardBrandEnum["Visa"] = "visa";
})(CardBrandEnum = exports.CardBrandEnum || (exports.CardBrandEnum = {}));


/***/ }),

/***/ "./packages/shared-lib/src/entities/plan.ts":
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DepositStatusEnum = exports.PlanStatusDisplayedEnum = exports.PaymentStatusEnum = exports.PlanStatusOrder = exports.PlanStatusEnum = exports.PlanPaymentFrequencyEnum = void 0;
var PlanPaymentFrequencyEnum;
(function (PlanPaymentFrequencyEnum) {
    PlanPaymentFrequencyEnum["WEEKLY"] = "weekly";
    PlanPaymentFrequencyEnum["FORTNIGHTLY"] = "fortnightly";
    PlanPaymentFrequencyEnum["MONTHLY"] = "monthly";
})(PlanPaymentFrequencyEnum = exports.PlanPaymentFrequencyEnum || (exports.PlanPaymentFrequencyEnum = {}));
var PlanStatusEnum;
(function (PlanStatusEnum) {
    PlanStatusEnum["ONSCHEDULE"] = "On Schedule";
    PlanStatusEnum["LATE"] = "Late";
    PlanStatusEnum["SUSPENDED"] = "Suspended";
    PlanStatusEnum["CANCELED"] = "Cancelled";
    PlanStatusEnum["COMPLETED"] = "Completed";
})(PlanStatusEnum = exports.PlanStatusEnum || (exports.PlanStatusEnum = {}));
var PlanStatusOrder;
(function (PlanStatusOrder) {
    PlanStatusOrder[PlanStatusOrder["SUSPENDED"] = 10] = "SUSPENDED";
    PlanStatusOrder[PlanStatusOrder["LATE"] = 20] = "LATE";
    PlanStatusOrder[PlanStatusOrder["ONSCHEDULE"] = 30] = "ONSCHEDULE";
    PlanStatusOrder[PlanStatusOrder["CANCELED"] = 40] = "CANCELED";
    PlanStatusOrder[PlanStatusOrder["COMPLETED"] = 50] = "COMPLETED";
})(PlanStatusOrder = exports.PlanStatusOrder || (exports.PlanStatusOrder = {}));
var PaymentStatusEnum;
(function (PaymentStatusEnum) {
    PaymentStatusEnum["DRAFT"] = "draft";
    PaymentStatusEnum["OPEN"] = "open";
    PaymentStatusEnum["UNCOLLECTIBLE"] = "uncollectible";
    PaymentStatusEnum["PAID"] = "paid";
})(PaymentStatusEnum = exports.PaymentStatusEnum || (exports.PaymentStatusEnum = {}));
var PlanStatusDisplayedEnum;
(function (PlanStatusDisplayedEnum) {
    PlanStatusDisplayedEnum["ON_SCHEDULE"] = "ON_SCHEDULE";
    PlanStatusDisplayedEnum["LATE"] = "LATE";
    PlanStatusDisplayedEnum["CANCELED"] = "CANCELED";
    PlanStatusDisplayedEnum["COMPLETE"] = "COMPLETE";
    PlanStatusDisplayedEnum["UNKNOWN"] = "UNKNOWN";
})(PlanStatusDisplayedEnum = exports.PlanStatusDisplayedEnum || (exports.PlanStatusDisplayedEnum = {}));
var DepositStatusEnum;
(function (DepositStatusEnum) {
    DepositStatusEnum["UNPAID"] = "unpaid";
    DepositStatusEnum["ACCEPTED"] = "accepted";
    DepositStatusEnum["CANCELLED"] = "cancelled";
    DepositStatusEnum["REFUNDED"] = "refunded";
    DepositStatusEnum["REJECTED"] = "rejected";
})(DepositStatusEnum = exports.DepositStatusEnum || (exports.DepositStatusEnum = {}));


/***/ }),

/***/ "./packages/shared-lib/src/enums/checkout.enum.ts":
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JavascriptEnumArray = exports.Frequency = exports.DayOfWeekEnum = void 0;
var DayOfWeekEnum;
(function (DayOfWeekEnum) {
    DayOfWeekEnum["Monday"] = "Monday";
    DayOfWeekEnum["Tuesday"] = "Tuesday";
    DayOfWeekEnum["Wednesday"] = "Wednesday";
    DayOfWeekEnum["Thursday"] = "Thursday";
    DayOfWeekEnum["Friday"] = "Friday";
    DayOfWeekEnum["Saturday"] = "Saturday";
    DayOfWeekEnum["Sunday"] = "Sunday";
})(DayOfWeekEnum = exports.DayOfWeekEnum || (exports.DayOfWeekEnum = {}));
var Frequency;
(function (Frequency) {
    Frequency["Weekly"] = "weekly";
    Frequency["Fortnightly"] = "fortnightly";
    Frequency["Monthly"] = "monthly";
})(Frequency = exports.Frequency || (exports.Frequency = {}));
exports.JavascriptEnumArray = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
];


/***/ }),

/***/ "./packages/shared-lib/src/enums/default-minimum-deposit-type.enum.ts":
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DefaultMinimumDepositTypes = void 0;
var DefaultMinimumDepositTypes;
(function (DefaultMinimumDepositTypes) {
    DefaultMinimumDepositTypes["Currency"] = "CURRENCY";
    DefaultMinimumDepositTypes["Percentage"] = "PERCENTAGE";
})(DefaultMinimumDepositTypes = exports.DefaultMinimumDepositTypes || (exports.DefaultMinimumDepositTypes = {}));


/***/ }),

/***/ "./packages/shared-lib/src/enums/index.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__("tslib");
tslib_1.__exportStar(__webpack_require__("./packages/shared-lib/src/enums/checkout.enum.ts"), exports);
tslib_1.__exportStar(__webpack_require__("./packages/shared-lib/src/enums/default-minimum-deposit-type.enum.ts"), exports);


/***/ }),

/***/ "./packages/shared-lib/src/errors/api-exception.ts":
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.parseAPIException = exports.isAPIException = void 0;
function isAPIException(x) {
    return x && x.trace_id && x.code && x.message;
}
exports.isAPIException = isAPIException;
function parseAPIException(error) {
    var _a;
    const result = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data;
    if (isAPIException(result)) {
        return result;
    }
    return null;
}
exports.parseAPIException = parseAPIException;


/***/ }),

/***/ "./packages/shared-lib/src/errors/error-code.ts":
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ErrorCode = void 0;
var ErrorCode;
(function (ErrorCode) {
    ErrorCode["ValidationFailed"] = "ValidationFailed";
    ErrorCode["NotFound"] = "NotFound";
    ErrorCode["InternalServerError"] = "InternalServerError";
    ErrorCode["Unauthorized"] = "Unauthorized";
    ErrorCode["InvalidToken"] = "InvalidToken";
    ErrorCode["Forbidden"] = "Forbidden";
    ErrorCode["CardError"] = "CardError";
    ErrorCode["RateLimitError"] = "RateLimitError";
    ErrorCode["RequiredError"] = "RequiredError";
})(ErrorCode = exports.ErrorCode || (exports.ErrorCode = {}));


/***/ }),

/***/ "./packages/shared-lib/src/errors/index.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__("tslib");
tslib_1.__exportStar(__webpack_require__("./packages/shared-lib/src/errors/api-exception.ts"), exports);
tslib_1.__exportStar(__webpack_require__("./packages/shared-lib/src/errors/error-code.ts"), exports);


/***/ }),

/***/ "./packages/shared-lib/src/index.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__("tslib");
tslib_1.__exportStar(__webpack_require__("./packages/shared-lib/src/constants/index.ts"), exports);
tslib_1.__exportStar(__webpack_require__("./packages/shared-lib/src/entities/index.ts"), exports);
tslib_1.__exportStar(__webpack_require__("./packages/shared-lib/src/errors/index.ts"), exports);
tslib_1.__exportStar(__webpack_require__("./packages/shared-lib/src/utils/index.ts"), exports);
tslib_1.__exportStar(__webpack_require__("./packages/shared-lib/src/enums/index.ts"), exports);


/***/ }),

/***/ "./packages/shared-lib/src/utils/api.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createAxiosInstance = void 0;
const tslib_1 = __webpack_require__("tslib");
const axios_1 = tslib_1.__importDefault(__webpack_require__("axios"));
const auth_1 = __webpack_require__("./packages/shared-lib/src/utils/auth.ts");
const attachAuthToken = (config) => {
    const authenticationToken = (0, auth_1.getTokens)();
    if ((authenticationToken === null || authenticationToken === void 0 ? void 0 : authenticationToken.accessToken) && config.headers) {
        if (authenticationToken.accessToken.includes(' ')) {
            config.headers['Authorization'] = authenticationToken.accessToken;
        }
        else {
            config.headers['Authorization'] =
                'Bearer ' + (authenticationToken === null || authenticationToken === void 0 ? void 0 : authenticationToken.accessToken);
        }
    }
    return config;
};
const createAxiosInstance = (baseURL) => {
    const axiosInstance = axios_1.default.create({
        baseURL,
    });
    axiosInstance.interceptors.request.use(function (config) {
        attachAuthToken(config);
        return config;
    }, function (error) {
        return Promise.reject(error);
    });
    return axiosInstance;
};
exports.createAxiosInstance = createAxiosInstance;


/***/ }),

/***/ "./packages/shared-lib/src/utils/auth.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.calculateExpiry = exports.removeAuthData = exports.getAuthData = exports.storeAuthData = exports.setTokens = exports.getTokens = void 0;
const tslib_1 = __webpack_require__("tslib");
const js_cookie_1 = tslib_1.__importDefault(__webpack_require__("js-cookie"));
const date_fns_1 = __webpack_require__("date-fns");
let tokens;
const getTokens = () => {
    return tokens;
};
exports.getTokens = getTokens;
const setTokens = (data) => {
    tokens = data;
};
exports.setTokens = setTokens;
const storeAuthData = (key, data, staySignIn) => {
    if (staySignIn) {
        js_cookie_1.default.set(key, data, { expires: 365 });
    }
    else {
        js_cookie_1.default.set(key, data); // Session cookies
    }
};
exports.storeAuthData = storeAuthData;
const getAuthData = (key) => {
    return js_cookie_1.default.get(key);
};
exports.getAuthData = getAuthData;
const removeAuthData = (key) => {
    js_cookie_1.default.remove(key);
};
exports.removeAuthData = removeAuthData;
const calculateExpiry = (expiresIn) => {
    const expiresAt = new Date(new Date().getTime() + 1000 * expiresIn);
    return (0, date_fns_1.differenceInSeconds)(expiresAt, new Date());
};
exports.calculateExpiry = calculateExpiry;


/***/ }),

/***/ "./packages/shared-lib/src/utils/currency.ts":
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.formatCurrencyV2 = exports.toWholeCents = exports.formatCurrency = void 0;
/** Format currency in client */
const formatCurrency = (value, fractionDigits = 2) => {
    if (value !== 0 && (!value || isNaN(Number(value)))) {
        return '';
    }
    return Number(value).toLocaleString(undefined, {
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
    });
};
exports.formatCurrency = formatCurrency;
const toWholeCents = (value) => Math.round((Number(value) + Number.EPSILON) * 100) / 100;
exports.toWholeCents = toWholeCents;
/** Format currency in API response */
const formatCurrencyV2 = (value) => {
    return (0, exports.toWholeCents)(Number(value)).toFixed(2);
};
exports.formatCurrencyV2 = formatCurrencyV2;


/***/ }),

/***/ "./packages/shared-lib/src/utils/date.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getLastDayOfMonth = exports.getTimeZone = exports.formatDate = void 0;
const date_fns_1 = __webpack_require__("date-fns");
const formatDate = (value, template = 'dd MMM, yyyy') => {
    const date = typeof value === 'string' ? new Date(value) : value;
    if (!date || !(0, date_fns_1.isValid)(date)) {
        return '';
    }
    return (0, date_fns_1.format)(date, template);
};
exports.formatDate = formatDate;
const getTimeZone = () => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || '';
};
exports.getTimeZone = getTimeZone;
function getLastDayOfMonth(month, year = new Date().getFullYear()) {
    return new Date(year, month + 1, 0).getDate();
}
exports.getLastDayOfMonth = getLastDayOfMonth;


/***/ }),

/***/ "./packages/shared-lib/src/utils/estimate-plan.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.estimateInstalmentDates = exports.estimateFirstInstalmentDateWraper = exports.estimateInstalmentAmountAndCount = exports.roundCurrencyByACCCStandard = exports.roundAmountAndDeposit = exports.estimateInstalmentCount = exports.estimateFirstInstalmentDate = exports.compareDateInTimeZone = exports.toNextOrPreviousDayOfWeek = exports.JavascriptDayOfWeeks = exports.getDaysInMonth = void 0;
const date_fns_1 = __webpack_require__("date-fns");
const date_fns_tz_1 = __webpack_require__("date-fns-tz");
const enums_1 = __webpack_require__("./packages/shared-lib/src/enums/index.ts");
const currency_1 = __webpack_require__("./packages/shared-lib/src/utils/currency.ts");
const date_1 = __webpack_require__("./packages/shared-lib/src/utils/date.ts");
function getDaysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
}
exports.getDaysInMonth = getDaysInMonth;
exports.JavascriptDayOfWeeks = [
    enums_1.DayOfWeekEnum.Sunday,
    enums_1.DayOfWeekEnum.Monday,
    enums_1.DayOfWeekEnum.Tuesday,
    enums_1.DayOfWeekEnum.Wednesday,
    enums_1.DayOfWeekEnum.Thursday,
    enums_1.DayOfWeekEnum.Friday,
    enums_1.DayOfWeekEnum.Saturday,
];
/** from index 0 -> 6, 0 is sunday -> 6 is saturday */
const toNextOrPreviousDayOfWeek = (currentDayOfWeek, type) => {
    switch (type) {
        case 'next':
            return currentDayOfWeek + 1 >= exports.JavascriptDayOfWeeks.length
                ? 0
                : currentDayOfWeek + 1;
        case 'previous':
            return currentDayOfWeek - 1 < 0
                ? exports.JavascriptDayOfWeeks.length - 1
                : currentDayOfWeek - 1;
        default:
            throw new Error('type must be in next or previous');
    }
};
exports.toNextOrPreviousDayOfWeek = toNextOrPreviousDayOfWeek;
/**
 * Convert from dayOfWeek and dayOfMonth in local timezone to server timezone
 * @param dateNow
 * @param timeZone
 * @param earliestPaymentDate
 * @param dayofMonth
 * @param dayOfWeekNumberUserInput
 * @returns
 */
const compareDateInTimeZone = (dateNow, timeZone) => {
    const dateInLocalTime = (0, date_fns_tz_1.utcToZonedTime)(dateNow, timeZone);
    const isLocalTimeBehind = dateInLocalTime > dateNow;
    const isDifferentDay = dateInLocalTime.getDate() !== dateNow.getDate();
    return {
        isLocalTimeBehind,
        isDifferentDay,
    };
};
exports.compareDateInTimeZone = compareDateInTimeZone;
const estimateFirstInstalmentDate = (frequency, nextDayOfWeek, dayofMonth, timeZone, checkoutDate) => {
    /** Estimate first instalment date */
    /** Remember to pre process the dayofmonth before use this function */
    const dateNow = checkoutDate || new Date();
    let paymentDateRange = 0;
    let dayOfWeekNumberUserInput = 0;
    let earliestPaymentDate;
    switch (frequency) {
        case enums_1.Frequency.Weekly:
            paymentDateRange = 7;
            earliestPaymentDate = (0, date_fns_1.addDays)(dateNow, 7);
            break;
        case enums_1.Frequency.Fortnightly:
            paymentDateRange = 7;
            earliestPaymentDate = (0, date_fns_1.addDays)(dateNow, 14);
            break;
        case enums_1.Frequency.Monthly:
            earliestPaymentDate = (0, date_fns_1.addDays)(dateNow, 17);
            paymentDateRange = 47;
            break;
        default:
            return null;
    }
    if (nextDayOfWeek) {
        dayOfWeekNumberUserInput = exports.JavascriptDayOfWeeks.findIndex((dayOfWeek) => dayOfWeek === nextDayOfWeek);
    }
    // Convert dayOfWeek in time customer's timezone to server timezone
    const { isDifferentDay, isLocalTimeBehind } = (0, exports.compareDateInTimeZone)(dateNow, timeZone);
    if (isDifferentDay) {
        dayOfWeekNumberUserInput = isLocalTimeBehind
            ? (0, exports.toNextOrPreviousDayOfWeek)(dayOfWeekNumberUserInput, 'previous')
            : (0, exports.toNextOrPreviousDayOfWeek)(dayOfWeekNumberUserInput, 'next');
    }
    if (dayofMonth) {
        //process day of month in time zone
        const dateTemp = (0, date_fns_tz_1.utcToZonedTime)(new Date(earliestPaymentDate.toISOString()), timeZone);
        const totalDaysInMonth = getDaysInMonth(dateTemp.getFullYear(), dateTemp.getMonth() + 1);
        if (dayofMonth > totalDaysInMonth) {
            // If the day of month (selected by customer) is greater than the total days in that month,
            // Then we take the end date of that month.
            dateTemp.setDate(totalDaysInMonth);
            const dateToLocal = (0, date_fns_tz_1.zonedTimeToUtc)(dateTemp, timeZone);
            dayofMonth = dateToLocal.getDate();
        }
        else {
            if (dayofMonth >= dateTemp.getDate()) {
                dateTemp.setDate(dayofMonth);
            }
            else {
                dateTemp.setMonth(dateTemp.getMonth() + 1);
                dateTemp.setDate(dayofMonth);
            }
            const dateToLocal = (0, date_fns_tz_1.zonedTimeToUtc)(dateTemp, timeZone);
            dayofMonth = dateToLocal.getDate();
        }
    }
    let dateFound = null;
    let paymentDate = earliestPaymentDate;
    for (let i = 0; i < paymentDateRange; i++) {
        if (frequency === enums_1.Frequency.Weekly ||
            frequency === enums_1.Frequency.Fortnightly) {
            if (paymentDate.getDay() === dayOfWeekNumberUserInput) {
                dateFound = paymentDate;
                break;
            }
        }
        if (frequency === enums_1.Frequency.Monthly && dayofMonth) {
            if (paymentDate.getDate() === dayofMonth) {
                dateFound = paymentDate;
                break;
            }
        }
        paymentDate = (0, date_fns_1.addDays)(paymentDate, 1);
    }
    return dateFound;
};
exports.estimateFirstInstalmentDate = estimateFirstInstalmentDate;
const estimateInstalmentCount = (frequency, nextDayOfWeek, dayofMonth, completionDate, timeZone, checkoutDate) => {
    /** Set time of completion date at the end of date */
    const firstInstalmentDate = (0, exports.estimateFirstInstalmentDate)(frequency, nextDayOfWeek, dayofMonth, timeZone, checkoutDate);
    if (firstInstalmentDate) {
        const endDate = (0, date_fns_1.subDays)(completionDate, 1);
        let count = 0;
        let date = firstInstalmentDate;
        while (date <= endDate) {
            count += 1;
            switch (frequency) {
                case enums_1.Frequency.Weekly:
                    date = (0, date_fns_1.addDays)(date, 7);
                    break;
                case enums_1.Frequency.Fortnightly:
                    date = (0, date_fns_1.addDays)(date, 14);
                    break;
                case enums_1.Frequency.Monthly:
                    date = (0, date_fns_1.addMonths)(date, 1);
                    break;
            }
        }
        return count;
    }
    return 0;
};
exports.estimateInstalmentCount = estimateInstalmentCount;
function roundAmountAndDeposit({ count, totalCost, depositAmount, }) {
    const due = (0, currency_1.toWholeCents)(totalCost - depositAmount);
    count = depositAmount !== 0 ? count : count + 1;
    const instalmentAmount = Math.trunc((due / count) * 100) / 100;
    const remainder = (0, currency_1.toWholeCents)(totalCost - instalmentAmount * count - depositAmount);
    return {
        remainder,
        roundInstalmentAmount: instalmentAmount,
    };
}
exports.roundAmountAndDeposit = roundAmountAndDeposit;
const roundCurrencyByACCCStandard = (currency) => {
    const numberToString = currency.toString();
    const splitedCurrency = numberToString.split('.');
    const decimalDigitString = splitedCurrency[1] || null;
    const integerCurrencyString = splitedCurrency[0];
    if (!decimalDigitString)
        return currency;
    if (decimalDigitString.length === 1)
        return Number(`${integerCurrencyString}.${decimalDigitString[0]}`);
    const shortDecimal = decimalDigitString.length > 2
        ? `${decimalDigitString[0]}${decimalDigitString[1]}`
        : decimalDigitString;
    let shortDecimalNumber = Number(shortDecimal);
    const lastNumberOfDecimalDigit = Number(shortDecimal[shortDecimal.length - 1]);
    switch (lastNumberOfDecimalDigit) {
        case 1:
            // 1 & 2 cents – rounded DOWN to the nearest 10
            shortDecimalNumber = shortDecimalNumber - 1;
            break;
        case 2:
            // 1 & 2 cents – rounded DOWN to the nearest 10
            shortDecimalNumber = shortDecimalNumber - 2;
            break;
        case 3:
            // 3 & 4 cents – rounded UP to the nearest 5
            shortDecimalNumber = shortDecimalNumber + 2;
            break;
        case 4:
            // 3 & 4 cents – rounded UP to the nearest 5
            shortDecimalNumber = shortDecimalNumber + 1;
            break;
        case 6:
            // 6 & 7 cents – rounded DOWN to the nearest 5
            shortDecimalNumber = shortDecimalNumber - 1;
            break;
        case 7:
            // 6 & 7 cents – rounded DOWN to the nearest 5
            shortDecimalNumber = shortDecimalNumber - 2;
            break;
        case 8:
            // 8 & 9 cents – rounded UP to the nearest 10
            shortDecimalNumber = shortDecimalNumber + 2;
            break;
        case 9:
            // 8 & 9 cents – rounded UP to the nearest 10
            shortDecimalNumber = shortDecimalNumber + 1;
            break;
    }
    const shortDecimalNumberToCurrency = shortDecimalNumber / 100;
    return Number(`${integerCurrencyString}`) + shortDecimalNumberToCurrency;
};
exports.roundCurrencyByACCCStandard = roundCurrencyByACCCStandard;
const estimateInstalmentAmountAndCount = (params) => {
    const { totalAmount, minimumDepositAmount } = params;
    let { depositAmount } = params;
    const userProvidedDepositAmount = depositAmount === null ? false : true;
    const count = (0, exports.estimateInstalmentCount)(params.frequency, params.dayOfWeek, params.dayOfMonth, params.completionDate, params.timeZone, params.checkoutDate);
    const { remainder, roundInstalmentAmount } = roundAmountAndDeposit({
        count,
        totalCost: totalAmount,
        depositAmount: depositAmount !== null ? depositAmount : 0,
    });
    if (depositAmount === null)
        depositAmount = roundInstalmentAmount;
    if (depositAmount < minimumDepositAmount && !userProvidedDepositAmount) {
        // if deposit amount less than minimum deposit and the user does not input deposit amount , then recalculate.
        depositAmount = minimumDepositAmount;
        const count = (0, exports.estimateInstalmentCount)(params.frequency, params.dayOfWeek, params.dayOfMonth, params.completionDate, params.timeZone);
        const { remainder, roundInstalmentAmount } = roundAmountAndDeposit({
            count,
            totalCost: totalAmount,
            depositAmount,
        });
        return {
            count,
            instalmentAmount: roundInstalmentAmount,
            depositAmount,
            remainder,
        };
    }
    return {
        count,
        instalmentAmount: roundInstalmentAmount,
        depositAmount,
        remainder,
    };
};
exports.estimateInstalmentAmountAndCount = estimateInstalmentAmountAndCount;
const estimateFirstInstalmentDateWraper = (frequency, nextDayOfWeek, dayofMonth, timeZone) => {
    return (0, exports.estimateFirstInstalmentDate)(frequency, nextDayOfWeek, dayofMonth, timeZone);
};
exports.estimateFirstInstalmentDateWraper = estimateFirstInstalmentDateWraper;
const estimateInstalmentDates = (frequency, nextDayOfWeek, dayofMonth, completionDate, checkoutDate, timeZone) => {
    const firstInstalmentDate = (0, exports.estimateFirstInstalmentDate)(frequency, nextDayOfWeek, dayofMonth, timeZone, checkoutDate);
    const instalmentDates = [];
    if (firstInstalmentDate) {
        let date = firstInstalmentDate;
        const endDate = (0, date_fns_1.subDays)(completionDate, 1);
        while (date <= endDate) {
            instalmentDates.push(date.toISOString());
            switch (frequency) {
                case enums_1.Frequency.Weekly:
                    date = (0, date_fns_1.addDays)(date, 7);
                    break;
                case enums_1.Frequency.Fortnightly:
                    date = (0, date_fns_1.addDays)(date, 14);
                    break;
                case enums_1.Frequency.Monthly:
                    date = (0, date_fns_1.addMonths)(date, 1);
                    break;
            }
            if (dayofMonth) {
                /**
                 *  if dayOfMonth that user have set is valid
                 * ==> keep the original instalment day of month
                 */
                const day = dayofMonth <= (0, date_1.getLastDayOfMonth)(date.getMonth(), date.getFullYear())
                    ? dayofMonth
                    : date.getDate();
                date.setDate(day);
            }
        }
        return instalmentDates;
    }
    return [];
};
exports.estimateInstalmentDates = estimateInstalmentDates;


/***/ }),

/***/ "./packages/shared-lib/src/utils/index.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__("tslib");
tslib_1.__exportStar(__webpack_require__("./packages/shared-lib/src/utils/date.ts"), exports);
tslib_1.__exportStar(__webpack_require__("./packages/shared-lib/src/utils/number.ts"), exports);
tslib_1.__exportStar(__webpack_require__("./packages/shared-lib/src/utils/auth.ts"), exports);
tslib_1.__exportStar(__webpack_require__("./packages/shared-lib/src/utils/api.ts"), exports);
tslib_1.__exportStar(__webpack_require__("./packages/shared-lib/src/utils/currency.ts"), exports);
tslib_1.__exportStar(__webpack_require__("./packages/shared-lib/src/utils/estimate-plan.ts"), exports);


/***/ }),

/***/ "./packages/shared-lib/src/utils/number.ts":
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.minTwoDigits = void 0;
const minTwoDigits = (value) => {
    return (value >= 0 && value < 10 ? '0' : '') + value;
};
exports.minTwoDigits = minTwoDigits;


/***/ }),

/***/ "./packages/test-data/src/index.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__("tslib");
tslib_1.__exportStar(__webpack_require__("./packages/test-data/src/merchants.ts"), exports);


/***/ }),

/***/ "./packages/test-data/src/merchants.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.merchantDemo = void 0;
const authnz_lib_1 = __webpack_require__("./packages/authnz-lib/src/index.ts");
const planpay_client_1 = __webpack_require__("./packages/planpay-client/src/index.ts");
const process_1 = __webpack_require__("process");
exports.merchantDemo = [
    // Merchant 0
    {
        merchantId: process_1.env.ENAD_MERCHANT_ID || '',
        merchantOrderId: 'yrcmpny-123-abcsdha9gck65e5',
        authorization: (0, authnz_lib_1.toMerchantApiKeyAuthorizationHeader)({
            merchantId: process_1.env.ENAD_MERCHANT_ID || '',
            secretValue: process_1.env.API_SECRET_VALUE_ENAD_1 || '',
        }),
        currencyCode: 'AUD',
        items: [
            {
                sku: '613123',
                description: 'Sofa',
                costPerItem: 2000.0,
                merchantProductURL: 'https://i.pinimg.com/originals/c5/16/73/c51673a32c76796a4ba5c6d8b2c579d8.jpg',
                depositRefundable: true,
                paymentDeadline: 0,
                minimumDepositPerItem: {
                    unit: 'Percentage',
                    value: 10.0,
                },
                refundPolicies: [
                    {
                        type: planpay_client_1.MutationCheckoutCreateCheckoutRequestItemsInnerRefundPoliciesInnerTypeEnum.PercentageRefundableDaysWithinRedemptionDate,
                        daysWithinRedemptionDate: 20,
                        refundablePercentage: 50,
                    },
                    {
                        type: planpay_client_1.MutationCheckoutCreateCheckoutRequestItemsInnerRefundPoliciesInnerTypeEnum.PercentageRefundableDaysWithinRedemptionDate,
                        daysWithinRedemptionDate: 30,
                        refundablePercentage: 75,
                    },
                    {
                        type: planpay_client_1.MutationCheckoutCreateCheckoutRequestItemsInnerRefundPoliciesInnerTypeEnum.PercentageRefundableDaysWithinRedemptionDate,
                        daysWithinRedemptionDate: 60,
                        refundablePercentage: 100,
                    },
                ],
            },
            {
                sku: '6479500',
                description: 'Laptop',
                costPerItem: 50.0,
                merchantProductURL: 'https://cdn.tgdd.vn/Products/Images/44/270831/lenovo-ideapad-3-15itl6-i5-82h801p9vn-thumb-600x600.jpg',
                depositRefundable: true,
                paymentDeadline: 10,
                minimumDepositPerItem: {
                    unit: 'Currency',
                    value: 1000.0,
                },
                refundPolicies: [
                    {
                        type: planpay_client_1.MutationCheckoutCreateCheckoutRequestItemsInnerRefundPoliciesInnerTypeEnum.PercentageRefundableDaysWithinRedemptionDate,
                        daysWithinRedemptionDate: 20,
                        refundablePercentage: 50,
                    },
                    {
                        type: planpay_client_1.MutationCheckoutCreateCheckoutRequestItemsInnerRefundPoliciesInnerTypeEnum.PercentageRefundableDaysWithinRedemptionDate,
                        daysWithinRedemptionDate: 30,
                        refundablePercentage: 75,
                    },
                    {
                        type: planpay_client_1.MutationCheckoutCreateCheckoutRequestItemsInnerRefundPoliciesInnerTypeEnum.PercentageRefundableDaysWithinRedemptionDate,
                        daysWithinRedemptionDate: 60,
                        refundablePercentage: 100,
                    },
                ],
            },
            {
                sku: '30185',
                description: 'Motorbike',
                costPerItem: 10000.0,
                merchantProductURL: 'https://www.vayaaustralia.com.au/wp-content/uploads/2020/08/vaya-supernova-e-motorbike.jpg',
                depositRefundable: true,
                paymentDeadline: 15,
                minimumDepositPerItem: {
                    unit: 'Currency',
                    value: 1000.0,
                },
                refundPolicies: [
                    {
                        type: planpay_client_1.MutationCheckoutCreateCheckoutRequestItemsInnerRefundPoliciesInnerTypeEnum.PercentageRefundableDaysWithinRedemptionDate,
                        daysWithinRedemptionDate: 20,
                        refundablePercentage: 50,
                    },
                    {
                        type: planpay_client_1.MutationCheckoutCreateCheckoutRequestItemsInnerRefundPoliciesInnerTypeEnum.PercentageRefundableDaysWithinRedemptionDate,
                        daysWithinRedemptionDate: 30,
                        refundablePercentage: 75,
                    },
                    {
                        type: planpay_client_1.MutationCheckoutCreateCheckoutRequestItemsInnerRefundPoliciesInnerTypeEnum.PercentageRefundableDaysWithinRedemptionDate,
                        daysWithinRedemptionDate: 60,
                        refundablePercentage: 100,
                    },
                ],
            },
            {
                sku: '421451',
                description: 'Car',
                costPerItem: 50000.0,
                merchantProductURL: 'https://maserati.scene7.com/is/image/maserati/maserati/international/Models/my22/grecale/my22/modena/169/Maserati_Grecale_Modena_FULL_FRONT.jpg?$1920x2000$&fit=constrain',
                depositRefundable: true,
                paymentDeadline: 20,
                minimumDepositPerItem: {
                    unit: 'Percentage',
                    value: 30.0,
                },
                refundPolicies: [
                    {
                        type: planpay_client_1.MutationCheckoutCreateCheckoutRequestItemsInnerRefundPoliciesInnerTypeEnum.PercentageRefundableDaysWithinRedemptionDate,
                        daysWithinRedemptionDate: 20,
                        refundablePercentage: 50,
                    },
                    {
                        type: planpay_client_1.MutationCheckoutCreateCheckoutRequestItemsInnerRefundPoliciesInnerTypeEnum.PercentageRefundableDaysWithinRedemptionDate,
                        daysWithinRedemptionDate: 30,
                        refundablePercentage: 75,
                    },
                    {
                        type: planpay_client_1.MutationCheckoutCreateCheckoutRequestItemsInnerRefundPoliciesInnerTypeEnum.PercentageRefundableDaysWithinRedemptionDate,
                        daysWithinRedemptionDate: 60,
                        refundablePercentage: 100,
                    },
                ],
            },
            {
                sku: '6789',
                description: 'Holiday',
                costPerItem: 20000.0,
                merchantProductURL: 'https://media.istockphoto.com/photos/couple-relax-on-the-beach-enjoy-beautiful-sea-on-the-tropical-island-picture-id1160947136?k=20&m=1160947136&s=612x612&w=0&h=TdExAS2--H3tHQv2tc5woAl7e0zioUVB5dbIz6At0I4=',
                depositRefundable: false,
                paymentDeadline: 25,
                minimumDepositPerItem: {
                    unit: 'Percentage',
                    value: 50.0,
                },
                refundPolicies: [
                    {
                        type: planpay_client_1.MutationCheckoutCreateCheckoutRequestItemsInnerRefundPoliciesInnerTypeEnum.PercentageRefundableDaysWithinRedemptionDate,
                        daysWithinRedemptionDate: 20,
                        refundablePercentage: 50,
                    },
                    {
                        type: planpay_client_1.MutationCheckoutCreateCheckoutRequestItemsInnerRefundPoliciesInnerTypeEnum.PercentageRefundableDaysWithinRedemptionDate,
                        daysWithinRedemptionDate: 30,
                        refundablePercentage: 75,
                    },
                    {
                        type: planpay_client_1.MutationCheckoutCreateCheckoutRequestItemsInnerRefundPoliciesInnerTypeEnum.PercentageRefundableDaysWithinRedemptionDate,
                        daysWithinRedemptionDate: 60,
                        refundablePercentage: 100,
                    },
                ],
            },
        ],
    },
    // Merchant 1
    {
        merchantId: process_1.env.NORAA_MERCHANT_ID || '',
        merchantOrderId: 'yrcmpny-123-abcsdha9gck65e5',
        authorization: (0, authnz_lib_1.toMerchantApiKeyAuthorizationHeader)({
            merchantId: process_1.env.NORAA_MERCHANT_ID || '',
            secretValue: process_1.env.API_SECRET_VALUE_NORAA_1 || '',
        }),
        currencyCode: 'AUD',
        items: [
            {
                sku: 'WD2134',
                description: 'Wedding dress',
                costPerItem: 50.0,
                merchantProductURL: 'https://i.pinimg.com/originals/2c/55/81/2c5581cce9ea9e060ba7b2dd064a07f4.jpg',
                depositRefundable: true,
                paymentDeadline: 0,
                refundPolicies: [
                    {
                        type: planpay_client_1.MutationCheckoutCreateCheckoutRequestItemsInnerRefundPoliciesInnerTypeEnum.PercentageRefundableDaysWithinRedemptionDate,
                        daysWithinRedemptionDate: 20,
                        refundablePercentage: 50,
                    },
                    {
                        type: planpay_client_1.MutationCheckoutCreateCheckoutRequestItemsInnerRefundPoliciesInnerTypeEnum.PercentageRefundableDaysWithinRedemptionDate,
                        daysWithinRedemptionDate: 30,
                        refundablePercentage: 75,
                    },
                    {
                        type: planpay_client_1.MutationCheckoutCreateCheckoutRequestItemsInnerRefundPoliciesInnerTypeEnum.PercentageRefundableDaysWithinRedemptionDate,
                        daysWithinRedemptionDate: 60,
                        refundablePercentage: 100,
                    },
                ],
            },
            {
                sku: 'WV1234',
                description: 'Wedding veil',
                costPerItem: 500.0,
                merchantProductURL: 'https://cdn.tgdd.vn/Products/Images/44/270831/lenovo-ideapad-3-15itl6-i5-82h801p9vn-thumb-600x600.jpg',
                depositRefundable: false,
                paymentDeadline: 0,
            },
            {
                sku: 'WC5678',
                description: 'Wedding crown',
                costPerItem: 1000.0,
                merchantProductURL: 'https://www.vayaaustralia.com.au/wp-content/uploads/2020/08/vaya-supernova-e-motorbike.jpg',
                depositRefundable: false,
                paymentDeadline: 0,
            },
            {
                sku: 'WS9876',
                description: 'Wedding shoes',
                costPerItem: 1500.0,
                merchantProductURL: 'https://maserati.scene7.com/is/image/maserati/maserati/international/Models/my22/grecale/my22/modena/169/Maserati_Grecale_Modena_FULL_FRONT.jpg?$1920x2000$&fit=constrain',
                depositRefundable: true,
                paymentDeadline: 0,
            },
        ],
    },
    // Merchant 2
    {
        merchantId: process_1.env.OVOLO_MERCHANT_ID || '',
        merchantOrderId: 'yrcmpny-123-abcsdha9gck65e5',
        authorization: (0, authnz_lib_1.toMerchantApiKeyAuthorizationHeader)({
            merchantId: process_1.env.OVOLO_MERCHANT_ID || '',
            secretValue: process_1.env.API_SECRET_VALUE_OVOLO_HOTELS_1 || '',
        }),
        currencyCode: 'AUD',
        items: [
            {
                sku: 'PP-FLT-123',
                description: 'Airline flight',
                costPerItem: 50.0,
                paymentDeadline: 30,
                merchantProductURL: 'https://www.hptourism.org/wp-content/uploads/2020/01/Cheap-Flights-to-Florida.jpg',
                depositRefundable: false,
                minimumDepositPerItem: {
                    unit: 'Percentage',
                    value: 50.0,
                },
            },
            {
                sku: 'BK-HTL-456',
                description: 'Hotel booking',
                costPerItem: 500.0,
                merchantProductURL: 'https://imgcy.trivago.com/c_limit,d_dummy.jpeg,f_auto,h_1300,q_auto,w_2000/itemimages/10/57/105742_v8.jpeg',
                depositRefundable: true,
                paymentDeadline: 0,
                minimumDepositPerItem: {
                    unit: 'Currency',
                    value: 250.0,
                },
            },
        ],
    },
    // Merchant 3
    {
        merchantId: process_1.env.SHONRATE_MERCHANT_ID || '',
        merchantOrderId: 'shonrate-123-asdjajasfsdljls',
        authorization: (0, authnz_lib_1.toMerchantApiKeyAuthorizationHeader)({
            merchantId: process_1.env.SHONRATE_MERCHANT_ID || '',
            secretValue: process_1.env.API_SECRET_VALUE_SHONRATE_HOTELS_1 || '',
        }),
        currencyCode: 'AUD',
        items: [
            {
                sku: 'SKU-2564853',
                description: 'Superior Deluxe King, Guest room, 1 King',
                costPerItem: 200,
                merchantProductURL: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
                depositRefundable: true,
                paymentDeadline: 0,
                refundPolicies: [
                    {
                        type: planpay_client_1.MutationCheckoutCreateCheckoutRequestItemsInnerRefundPoliciesInnerTypeEnum.PercentageRefundableDaysWithinRedemptionDate,
                        daysWithinRedemptionDate: 20,
                        refundablePercentage: 50,
                    },
                    {
                        type: planpay_client_1.MutationCheckoutCreateCheckoutRequestItemsInnerRefundPoliciesInnerTypeEnum.PercentageRefundableDaysWithinRedemptionDate,
                        daysWithinRedemptionDate: 30,
                        refundablePercentage: 75,
                    },
                    {
                        type: planpay_client_1.MutationCheckoutCreateCheckoutRequestItemsInnerRefundPoliciesInnerTypeEnum.PercentageRefundableDaysWithinRedemptionDate,
                        daysWithinRedemptionDate: 60,
                        refundablePercentage: 100,
                    },
                ],
            },
            {
                sku: 'SKU-9250513',
                description: 'Superior Deluxe Twin, Guest room, 2 Twin/Single Bed(s)',
                costPerItem: 500,
                merchantProductURL: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
                depositRefundable: false,
                paymentDeadline: 0,
            },
            {
                sku: 'SKU-6723570',
                description: 'Superior Studio Twin, Larger Guest room, 2 Double',
                costPerItem: 1000,
                merchantProductURL: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
                depositRefundable: false,
                paymentDeadline: 0,
            },
            {
                sku: 'SKU-8129803',
                description: 'Club King, Club lounge access, Guest room, 1 King',
                costPerItem: 1500,
                merchantProductURL: 'https://images.unsplash.com/photo-1559841644-08984562005a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
                depositRefundable: true,
                paymentDeadline: 0,
            },
            {
                sku: 'SKU-3622103',
                description: 'Presidential Suite, Club lounge access, High floor',
                costPerItem: 2000,
                merchantProductURL: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1174&q=80',
                depositRefundable: false,
                paymentDeadline: 0,
            },
        ],
    },
];


/***/ }),

/***/ "@nestjs/common":
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),

/***/ "@nestjs/config":
/***/ ((module) => {

module.exports = require("@nestjs/config");

/***/ }),

/***/ "@nestjs/core":
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),

/***/ "@nestjs/swagger":
/***/ ((module) => {

module.exports = require("@nestjs/swagger");

/***/ }),

/***/ "@trpc/client":
/***/ ((module) => {

module.exports = require("@trpc/client");

/***/ }),

/***/ "axios":
/***/ ((module) => {

module.exports = require("axios");

/***/ }),

/***/ "cross-fetch":
/***/ ((module) => {

module.exports = require("cross-fetch");

/***/ }),

/***/ "date-fns":
/***/ ((module) => {

module.exports = require("date-fns");

/***/ }),

/***/ "date-fns-tz":
/***/ ((module) => {

module.exports = require("date-fns-tz");

/***/ }),

/***/ "js-cookie":
/***/ ((module) => {

module.exports = require("js-cookie");

/***/ }),

/***/ "nestjs-pino":
/***/ ((module) => {

module.exports = require("nestjs-pino");

/***/ }),

/***/ "nestjs-zod":
/***/ ((module) => {

module.exports = require("nestjs-zod");

/***/ }),

/***/ "next-auth/jwt":
/***/ ((module) => {

module.exports = require("next-auth/jwt");

/***/ }),

/***/ "process":
/***/ ((module) => {

module.exports = require("process");

/***/ }),

/***/ "superjson":
/***/ ((module) => {

module.exports = require("superjson");

/***/ }),

/***/ "tslib":
/***/ ((module) => {

module.exports = require("tslib");

/***/ }),

/***/ "uuid":
/***/ ((module) => {

module.exports = require("uuid");

/***/ }),

/***/ "zod":
/***/ ((module) => {

module.exports = require("zod");

/***/ }),

/***/ "path":
/***/ ((module) => {

module.exports = require("path");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__("tslib");
const path_1 = __webpack_require__("path");
const core_1 = __webpack_require__("@nestjs/core");
const swagger_1 = __webpack_require__("@nestjs/swagger");
const app_module_1 = __webpack_require__("./packages/merchant-demo-service/src/app/app.module.ts");
const nestjs_zod_1 = __webpack_require__("nestjs-zod");
const api_lib_1 = __webpack_require__("./packages/api-lib/src/index.ts");
function bootstrap() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const app = yield core_1.NestFactory.create(app_module_1.AppModule);
        app.useStaticAssets((0, path_1.join)(__dirname, '..', 'public'));
        app.setBaseViewsDir((0, path_1.join)(__dirname, '..', 'views'));
        app.setViewEngine('hbs');
        (0, api_lib_1.defaultAppSetup)(app);
        app.enableCors();
        const config = new swagger_1.DocumentBuilder()
            .setTitle('Merchant Demo Service')
            .setDescription('Provides endpoints for a merchant to create checkout sessions.')
            .setVersion('1.0')
            .build();
        (0, nestjs_zod_1.patchNestJsSwagger)();
        const document = swagger_1.SwaggerModule.createDocument(app, config);
        swagger_1.SwaggerModule.setup('api', app, document);
        yield app.listen(process.env.APP_PORT || 4007, '0.0.0.0');
    });
}
bootstrap();

})();

var __webpack_export_target__ = exports;
for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;
//# sourceMappingURL=main.js.map