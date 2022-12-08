/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./apps/event-processor/src/event-loop.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.eventLoop = void 0;
const tslib_1 = __webpack_require__("tslib");
const planpay_next_lib_1 = __webpack_require__("./packages/planpay-next-lib/src/index.ts");
const event_processor_1 = __webpack_require__("./apps/event-processor/src/event-processor.ts");
const handlers_1 = __webpack_require__("./apps/event-processor/src/handlers/index.ts");
function eventLoop(interval) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        // eslint-disable-next-line no-constant-condition
        while (true) {
            console.log('Starting event processor');
            yield (0, event_processor_1.eventProcessor)(planpay_next_lib_1.prisma, [new handlers_1.TransactionHandler()]);
            console.log('Event processing completed');
            console.log(`Sleeping ${interval / 1000} seconds`);
            yield new Promise((res) => setInterval(res, interval));
        }
    });
}
exports.eventLoop = eventLoop;


/***/ }),

/***/ "./apps/event-processor/src/event-processor.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.eventProcessor = void 0;
const tslib_1 = __webpack_require__("tslib");
function eventProcessor(prisma, handlers, maximumErrorCount = 3) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        for (const handler of handlers) {
            if (!handler.constructor.name) {
                throw new Error('unable to get handler name, must be a class');
            }
            const handlerName = handler.constructor.name;
            let eventProcessor = yield prisma.eventProcessor.findFirst({
                where: {
                    handlerName,
                },
            });
            if (!eventProcessor) {
                eventProcessor = {
                    handlerName,
                    eventPosition: BigInt(0),
                    errorCount: 0,
                };
            }
            if (eventProcessor.errorCount >= maximumErrorCount) {
                continue;
            }
            const events = yield prisma.event.findMany({
                where: {
                    id: {
                        gt: eventProcessor.eventPosition,
                    },
                },
            });
            console.log({ events });
            for (const event of events) {
                try {
                    yield handler.handle(event);
                    yield prisma.eventProcessor.upsert({
                        where: {
                            handlerName,
                        },
                        create: {
                            handlerName,
                            eventPosition: event.id,
                            errorCount: 0,
                        },
                        update: {
                            eventPosition: event.id,
                            errorCount: 0,
                        },
                    });
                }
                catch (e) {
                    console.error(e);
                    eventProcessor.errorCount += 1;
                    yield prisma.eventProcessor.upsert({
                        where: {
                            handlerName,
                        },
                        create: {
                            handlerName,
                            eventPosition: BigInt(0),
                            errorCount: eventProcessor.errorCount,
                        },
                        update: {
                            errorCount: eventProcessor.errorCount,
                        },
                    });
                    break;
                }
            }
        }
    });
}
exports.eventProcessor = eventProcessor;


/***/ }),

/***/ "./apps/event-processor/src/handlers/handler.ts":
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ "./apps/event-processor/src/handlers/index.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__("tslib");
tslib_1.__exportStar(__webpack_require__("./apps/event-processor/src/handlers/handler.ts"), exports);
tslib_1.__exportStar(__webpack_require__("./apps/event-processor/src/handlers/transaction-handler.ts"), exports);


/***/ }),

/***/ "./apps/event-processor/src/handlers/transaction-handler.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TransactionHandler = void 0;
const tslib_1 = __webpack_require__("tslib");
class TransactionHandler {
    handle(event) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log(event);
        });
    }
}
exports.TransactionHandler = TransactionHandler;


/***/ }),

/***/ "./packages/planpay-next-lib/src/auth/auth.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.generateOTP = exports.authorize = exports.verifyHash = exports.createHash = exports.authenticateRequest = exports.AuthnType = void 0;
const tslib_1 = __webpack_require__("tslib");
const argon2_1 = tslib_1.__importDefault(__webpack_require__("argon2"));
const jwt_1 = __webpack_require__("next-auth/jwt");
const prisma_1 = __webpack_require__("./packages/planpay-next-lib/src/prisma/index.ts");
var AuthnType;
(function (AuthnType) {
    AuthnType[AuthnType["Jwt"] = 0] = "Jwt";
    AuthnType[AuthnType["MerchantApiKey"] = 1] = "MerchantApiKey";
    AuthnType[AuthnType["InternalApiKey"] = 2] = "InternalApiKey";
})(AuthnType = exports.AuthnType || (exports.AuthnType = {}));
function authenticateRequest(req) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const token = yield (0, jwt_1.getToken)({ req });
        if (token) {
            const tokenString = yield (0, jwt_1.encode)({
                token,
                secret: process.env.NEXTAUTH_SECRET,
            });
            return {
                type: AuthnType.Jwt,
                token,
                authHeader: tokenString,
                user: token.user,
            };
        }
        const { authorization } = req.headers;
        if (!authorization) {
            return null;
        }
        const [authType, authBase64Value] = authorization.trim().split(' ');
        if (authType.toLowerCase() === 'basic') {
            const [merchantId, key] = Buffer.from(authBase64Value, 'base64')
                .toString('binary')
                .split(':');
            const merchant = yield prisma_1.prisma.merchant.findUnique({
                where: { id: merchantId },
            });
            if (!merchant) {
                throw new Error('MERCHANT ID NOT VALID');
            }
            const merchantServiceIdentity = yield prisma_1.prisma.merchantServiceIdentity.findMany({
                where: { merchantId: merchant.id },
            });
            if (!merchantServiceIdentity) {
                throw new Error('MERCHANT HAS NO SERVICE IDENTITY');
            }
            let isKey = false;
            for (let i = 0; i < merchantServiceIdentity.length; i++) {
                isKey = yield verifyHash(key, merchantServiceIdentity[i].secretHash);
                if (isKey) {
                    break;
                }
            }
            if (!isKey) {
                throw new Error('KEY NOT VALID');
            }
            return {
                type: AuthnType.MerchantApiKey,
                merchantId: merchant.id,
                key,
                authHeader: authorization,
            };
        }
        else if (authType.toLowerCase() === 'bearer' &&
            process.env.APP_INTERNAL_REQUEST_KEY &&
            authBase64Value === process.env.APP_INTERNAL_REQUEST_KEY) {
            return {
                type: AuthnType.InternalApiKey,
                key: authBase64Value,
                authHeader: authorization,
            };
        }
        return null;
    });
}
exports.authenticateRequest = authenticateRequest;
function createHash(string) {
    const secret = process.env.NEXTAUTH_SECRET;
    if (!secret) {
        throw new Error('NEXTAUTH_SECRET not set');
    }
    return argon2_1.default.hash(string, {
        secret: Buffer.from(secret, 'utf-8'),
    });
}
exports.createHash = createHash;
function verifyHash(string, hash) {
    const secret = process.env.NEXTAUTH_SECRET;
    if (!secret) {
        throw new Error('NEXTAUTH_SECRET not set');
    }
    return argon2_1.default.verify(hash, string, {
        secret: Buffer.from(secret, 'utf-8'),
    });
}
exports.verifyHash = verifyHash;
function authorize(emailAddress, password) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const user = yield prisma_1.prisma.user.findFirst({
            where: { emailAddress },
        });
        if (!user) {
            return null;
        }
        const verified = yield verifyHash(password, user.passwordHash);
        if (!verified) {
            return null;
        }
        return user;
    });
}
exports.authorize = authorize;
function generateOTP() {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < 6; i++) {
        otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
}
exports.generateOTP = generateOTP;


/***/ }),

/***/ "./packages/planpay-next-lib/src/auth/authService.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthService = exports.ResetPasswordParams = exports.RequestPasswordResetParams = exports.GetPermissionsResult = exports.GetPermissionsParams = exports.SignupParams = exports.VerifyEmailParams = void 0;
const tslib_1 = __webpack_require__("tslib");
const client_1 = __webpack_require__("@prisma/client");
const server_1 = __webpack_require__("@trpc/server");
const date_fns_1 = __webpack_require__("date-fns");
const tsyringe_1 = __webpack_require__("tsyringe");
const uuid_1 = __webpack_require__("uuid");
const zod_1 = __webpack_require__("zod");
const notification_1 = __webpack_require__("./packages/planpay-next-lib/src/notification/index.ts");
const nanoid_1 = __webpack_require__("./packages/planpay-next-lib/src/utils/nanoid.ts");
const auth_1 = __webpack_require__("./packages/planpay-next-lib/src/auth/auth.ts");
exports.VerifyEmailParams = zod_1.z.object({ emailAddress: zod_1.z.string() });
exports.SignupParams = zod_1.z.object({
    emailAddress: zod_1.z.string(),
    firstName: zod_1.z.string(),
    lastName: zod_1.z.string(),
    phoneNumber: zod_1.z.string(),
    password: zod_1.z.string(),
    otpCode: zod_1.z.string(),
});
exports.GetPermissionsParams = zod_1.z.void();
exports.GetPermissionsResult = zod_1.z.nullable(zod_1.z.object({
    merchant: zod_1.z.object({ id: zod_1.z.string() }),
    permissions: zod_1.z.array(zod_1.z.object({
        action: zod_1.z.string(),
        subject: zod_1.z.string(),
    })),
}));
exports.RequestPasswordResetParams = zod_1.z.object({
    emailAddress: zod_1.z.string(),
    resetPasswordPath: zod_1.z.string(),
});
exports.ResetPasswordParams = zod_1.z.object({
    emailAddress: zod_1.z.string(),
    newPassword: zod_1.z.string(),
    token: zod_1.z.string(),
});
let AuthService = class AuthService {
    constructor(prisma, notificationService) {
        this.prisma = prisma;
        this.notificationService = notificationService;
    }
    verifyEmail({ emailAddress }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const user = yield this.prisma.user.findUnique({
                where: {
                    emailAddress,
                },
            });
            if (user) {
                throw new server_1.TRPCError({
                    message: 'Email already exists',
                    code: 'BAD_REQUEST',
                });
            }
            yield this.prisma.emailVerification.deleteMany({
                where: { emailAddress },
            });
            const token = (0, auth_1.generateOTP)();
            const tokenHash = yield (0, auth_1.createHash)(token);
            yield this.prisma.emailVerification.create({
                data: {
                    emailAddress,
                    tokenHash,
                },
            });
            yield this.notificationService.send(emailAddress, (0, notification_1.emailVerificationTemplate)({ token }));
        });
    }
    signup({ emailAddress, firstName, lastName, phoneNumber, password, otpCode, }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const verification = yield this.prisma.emailVerification.findFirst({
                where: {
                    emailAddress,
                    createdAt: {
                        gt: (0, date_fns_1.sub)(new Date(), { hours: 1 }),
                    },
                },
            });
            if (!verification) {
                throw new server_1.TRPCError({ message: 'Invalid email', code: 'UNAUTHORIZED' });
            }
            if (!(yield (0, auth_1.verifyHash)(otpCode, verification.tokenHash))) {
                throw new server_1.TRPCError({ message: 'Invalid token', code: 'UNAUTHORIZED' });
            }
            if (yield this.prisma.user.findUnique({
                where: {
                    emailAddress,
                },
            })) {
                throw new server_1.TRPCError({
                    message: 'Email already exists',
                    code: 'BAD_REQUEST',
                });
            }
            // Create new User
            const userId = (0, nanoid_1.generateId)();
            const passwordHash = yield (0, auth_1.createHash)(password);
            yield this.prisma.user.create({
                data: {
                    id: userId,
                    emailAddress,
                    firstName,
                    lastName,
                    phoneNumber,
                    passwordHash,
                },
            });
            // LOGIC TO CREATE STRIPE AS USER PAYMENT ID
            // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
            //   apiVersion: '2020-08-27',
            // });
            // let clockOnStripe;
            // let customer;
            // if (emailAddress.startsWith('planpaytesting')) {
            //   clockOnStripe = await stripe.testHelpers.testClocks.create({
            //     frozen_time: Math.floor(new Date().getTime() / 1000),
            //     name: 'Test Clocks',
            //   });
            //   customer = await stripe.customers.create({
            //     email: emailAddress,
            //     name: firstName + ' ' + lastName,
            //     phone: phoneNumber,
            //     test_clock: clockOnStripe.id,
            //   });
            // } else {
            //   customer = await stripe.customers.create({
            //     email: emailAddress,
            //     name: firstName + ' ' + lastName,
            //     phone: phoneNumber,
            //   });
            // }
            // const externalCustomerId = customer.id;
            // const userPaymentIdentityId = generateId();
            // await this.prisma.userPaymentIdentity.create({
            //   data: {
            //     id: userPaymentIdentityId,
            //     userId,
            //     externalCustomerId,
            //     merchantPaymentPlatformId: '1',
            //   },
            // });
            // Clean up emailVerification table
            yield this.prisma.emailVerification.deleteMany({
                where: {
                    emailAddress,
                    tokenHash: verification.tokenHash,
                },
            });
        });
    }
    resetPassword({ emailAddress, token, newPassword, }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const validation = yield this.prisma.resetPassword.findFirst({
                where: {
                    emailAddress,
                    createdAt: {
                        gt: (0, date_fns_1.sub)(new Date(), { hours: 1 }),
                    },
                },
            });
            if (!validation) {
                throw new server_1.TRPCError({
                    message: 'Unable to find user',
                    code: 'BAD_REQUEST',
                });
            }
            if (!(yield (0, auth_1.verifyHash)(token, validation.tokenHash))) {
                throw new server_1.TRPCError({
                    message: 'Invalid token',
                    code: 'UNAUTHORIZED',
                });
            }
            const passwordHash = yield (0, auth_1.createHash)(newPassword);
            const updatedUser = yield this.prisma.user.update({
                where: {
                    emailAddress,
                },
                data: {
                    passwordHash,
                },
            });
            if (!updatedUser) {
                throw new server_1.TRPCError({
                    message: 'Unable to update user password',
                    code: 'INTERNAL_SERVER_ERROR',
                });
            }
            yield this.prisma.resetPassword.deleteMany({
                where: {
                    emailAddress,
                },
            });
        });
    }
    requestPasswordReset({ emailAddress, resetPasswordPath, }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!(yield this.prisma.user.findUnique({
                where: {
                    emailAddress,
                },
            }))) {
                return;
            }
            yield this.prisma.resetPassword.deleteMany({
                where: {
                    emailAddress,
                },
            });
            const token = (0, uuid_1.v4)();
            const tokenHash = yield (0, auth_1.createHash)(token);
            yield this.prisma.resetPassword.create({
                data: {
                    emailAddress,
                    tokenHash,
                },
            });
            const resetPasswordURL = `${process.env.URI_SCHEME}://${process.env.VERCEL_URL}${resetPasswordPath}?email=${emailAddress}&token=${token}`;
            yield this.notificationService.send(emailAddress, (0, notification_1.passwordResetTemplate)({ resetPasswordURL }));
        });
    }
    getPermissions(merchantId, key) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const serviceIdentities = yield this.prisma.merchantServiceIdentity.findMany({
                where: {
                    merchantId: {
                        equals: merchantId,
                    },
                    OR: [
                        {
                            expiry: {
                                equals: null,
                            },
                        },
                        {
                            expiry: {
                                gt: new Date(),
                            },
                        },
                    ],
                },
                include: {
                    MerchantServiceIdentityRole: {
                        include: {
                            Role: {
                                select: {
                                    RolePermission: {
                                        select: {
                                            Permission: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });
            const authorizedServiceIdentity = serviceIdentities.find(({ secretHash }) => {
                return (0, auth_1.verifyHash)(key, secretHash);
            });
            if (!authorizedServiceIdentity) {
                return null;
            }
            const permissions = authorizedServiceIdentity.MerchantServiceIdentityRole.flatMap((serviceIdentityRole) => serviceIdentityRole.Role.RolePermission.flatMap((rolePermission) => rolePermission.Permission)).map(({ action, subject }) => ({ action, subject }));
            return {
                merchant: {
                    id: merchantId,
                },
                permissions,
            };
        });
    }
};
AuthService = tslib_1.__decorate([
    (0, tsyringe_1.injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof client_1.PrismaClient !== "undefined" && client_1.PrismaClient) === "function" ? _a : Object, typeof (_b = typeof notification_1.NotificationService !== "undefined" && notification_1.NotificationService) === "function" ? _b : Object])
], AuthService);
exports.AuthService = AuthService;


/***/ }),

/***/ "./packages/planpay-next-lib/src/auth/index.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__("tslib");
tslib_1.__exportStar(__webpack_require__("./packages/planpay-next-lib/src/auth/auth.ts"), exports);
tslib_1.__exportStar(__webpack_require__("./packages/planpay-next-lib/src/auth/authService.ts"), exports);


/***/ }),

/***/ "./packages/planpay-next-lib/src/checkout/checkout.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createRefundPolicies = exports.createCheckoutItems = exports.getDeadlineDate = exports.getCompletionDate = exports.getTotalMinimumDeposit = exports.getTotalCost = exports.getISODateString = exports.getMinimumDeposit = void 0;
const tslib_1 = __webpack_require__("tslib");
const client_1 = __webpack_require__("@prisma/client");
const date_fns_1 = __webpack_require__("date-fns");
const nanoid_1 = __webpack_require__("./packages/planpay-next-lib/src/utils/nanoid.ts");
function getMinimumDeposit(costPerItem, unit, value) {
    if (unit === client_1.Merchant_minimumDepositType.Currency)
        return value;
    else if (unit === client_1.Merchant_minimumDepositType.Percentage)
        return (100 / costPerItem) * value;
    else
        return 0;
}
exports.getMinimumDeposit = getMinimumDeposit;
function getISODateString(date) {
    // TODO Make this pretty.
    return date.toISOString().split('T')[0];
}
exports.getISODateString = getISODateString;
function getTotalCost(items) {
    return items.reduce((aggr, item) => aggr + item.costPerItem.toNumber(), 0);
}
exports.getTotalCost = getTotalCost;
function getTotalMinimumDeposit(items, defaultUnit, defaultValue) {
    return items.reduce((aggr, item) => {
        var _a;
        return (aggr +
            (item.minimumDepositPerItem
                ? getMinimumDeposit(item.costPerItem, item.minimumDepositPerItem.unit, (_a = item.minimumDepositPerItem) === null || _a === void 0 ? void 0 : _a.value)
                : getMinimumDeposit(item.costPerItem, defaultUnit, defaultValue))) *
            item.quantity;
    }, 0);
}
exports.getTotalMinimumDeposit = getTotalMinimumDeposit;
function getCompletionDate(items) {
    return (0, date_fns_1.min)(items.map((v) => (0, date_fns_1.sub)(new Date(v.redemptionDate), { days: v.paymentDeadline })));
}
exports.getCompletionDate = getCompletionDate;
function getDeadlineDate(redemptionDate, paymentDeadlineInDays) {
    return (0, date_fns_1.sub)(redemptionDate, { days: paymentDeadlineInDays });
}
exports.getDeadlineDate = getDeadlineDate;
function createCheckoutItems(tx, checkoutId, items, defaultMinimumDepositType, defaultMinimumDepositValue) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const checkoutItems = items.map((item) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e;
            const itemId = (0, nanoid_1.generateId)();
            const prismaObject = yield tx.checkoutItem.create({
                data: {
                    id: itemId,
                    checkoutId: checkoutId,
                    sku: item.sku,
                    merchantProductURL: (_a = item.merchantProductURL) !== null && _a !== void 0 ? _a : '',
                    quantity: item.quantity,
                    description: item.description,
                    costPerItem: item.costPerItem,
                    minimumDepositPerItemType: (_c = (_b = item.minimumDepositPerItem) === null || _b === void 0 ? void 0 : _b.unit) !== null && _c !== void 0 ? _c : defaultMinimumDepositType,
                    minimumDepositPerItemValue: (_e = (_d = item.minimumDepositPerItem) === null || _d === void 0 ? void 0 : _d.value) !== null && _e !== void 0 ? _e : defaultMinimumDepositValue,
                    depositRefundable: item.depositRefundable,
                    redemptionDate: new Date(item.redemptionDate),
                    paymentDeadline: item.paymentDeadline,
                },
            });
            return {
                itemId,
                prismaObject,
                policies: item.refundPolicies,
            };
        }));
        return Promise.all(checkoutItems);
    });
}
exports.createCheckoutItems = createCheckoutItems;
function createRefundPolicies(tx, checkoutItems, defaultMerchantRefundPolicy) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        let defaultMerchantPolicy = undefined;
        const refundPolicyItems = checkoutItems.map((policy) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (policy.policies !== undefined) {
                const generatedPolicies = policy.policies.map(({ daysWithinRedemptionDate, refundablePercentage, type }) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    return yield tx.checkoutRefundPolicy.create({
                        data: {
                            id: (0, nanoid_1.generateId)(),
                            checkoutItemId: policy.itemId,
                            type: type !== null && type !== void 0 ? type : 'percentage_refundable_days_within_redemption_date',
                            daysWithinRedemptionDate,
                            refundablePercentage,
                        },
                    });
                }));
                return [
                    policy.itemId,
                    generatedPolicies && (yield Promise.all(generatedPolicies)),
                ];
            }
            else {
                if (!defaultMerchantPolicy)
                    defaultMerchantPolicy = yield tx.refundPolicy.findMany({
                        where: {
                            id: {
                                in: defaultMerchantRefundPolicy.map((v) => v.refundPolicyId),
                            },
                        },
                    });
                const generatedPolicies = defaultMerchantPolicy === null || defaultMerchantPolicy === void 0 ? void 0 : defaultMerchantPolicy.map(({ daysWithinRedemptionDate, refundablePercentage, type }) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    return yield tx.checkoutRefundPolicy.create({
                        data: {
                            id: (0, nanoid_1.generateId)(),
                            checkoutItemId: policy.itemId,
                            type: type,
                            daysWithinRedemptionDate,
                            refundablePercentage,
                        },
                    });
                }));
                return [
                    policy.itemId,
                    generatedPolicies && (yield Promise.all(generatedPolicies)),
                ];
            }
        }));
        return Object.fromEntries(yield Promise.all(refundPolicyItems));
    });
}
exports.createRefundPolicies = createRefundPolicies;


/***/ }),

/***/ "./packages/planpay-next-lib/src/checkout/checkoutService.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CheckoutService = exports.SupportedPaymentPlatformsParams = exports.GetCheckoutOutput = exports.GetCheckoutParams = exports.CreateCheckoutOutput = exports.CreateCheckoutParams = exports.CreateItemParams = exports.CreateRefundPolicies = void 0;
const tslib_1 = __webpack_require__("tslib");
const client_1 = __webpack_require__("@prisma/client");
const server_1 = __webpack_require__("@trpc/server");
const date_fns_1 = __webpack_require__("date-fns");
const tsyringe_1 = __webpack_require__("tsyringe");
const zod_1 = __webpack_require__("zod");
const nanoid_1 = __webpack_require__("./packages/planpay-next-lib/src/utils/nanoid.ts");
const schema_1 = __webpack_require__("./packages/planpay-next-lib/src/utils/schema.ts");
const checkout_1 = __webpack_require__("./packages/planpay-next-lib/src/checkout/checkout.ts");
const estimations_1 = __webpack_require__("./packages/planpay-next-lib/src/checkout/estimations.ts");
exports.CreateRefundPolicies = zod_1.z.object({
    type: zod_1.z.nativeEnum(client_1.RefundPolicy_type).nullable(),
    daysWithinRedemptionDate: zod_1.z.number().min(0),
    refundablePercentage: zod_1.z.number().min(0).max(100),
});
exports.CreateItemParams = zod_1.z.object({
    sku: zod_1.z.string().nonempty().regex(schema_1.whitespace, 'must be a non-whitespace'),
    merchantProductURL: zod_1.z.string().url().optional(),
    quantity: zod_1.z.number().min(1),
    description: zod_1.z.string().min(1).nonempty(),
    costPerItem: zod_1.z.number().min(0.01).multipleOf(0.01),
    minimumDepositPerItem: schema_1.minimumDepositSchema,
    depositRefundable: zod_1.z.boolean(),
    redemptionDate: (0, schema_1.futureDateSchema)('redemptionDate'),
    paymentDeadline: zod_1.z.number(),
    refundPolicies: zod_1.z.array(exports.CreateRefundPolicies).optional(),
});
exports.CreateCheckoutParams = zod_1.z.object({
    type: zod_1.z.enum(['plan']).default('plan'),
    merchantId: zod_1.z
        .string()
        .min(5)
        .max(256)
        .regex(schema_1.whitespace, 'must be a non-whitespace'),
    merchantOrderId: zod_1.z
        .string()
        .min(1)
        .max(256)
        .regex(schema_1.whitespace, 'must be a non-whitespace'),
    currencyCode: zod_1.z
        .string()
        .length(3, { message: 'must be ISO 4217' })
        .regex(schema_1.whitespace, 'must be a non-whitespace'),
    redirectURL: zod_1.z
        .string()
        .url()
        .min(5)
        .max(2048)
        .regex(schema_1.whitespace, 'must be a non-whitespace'),
    callbackURL: zod_1.z
        .string()
        .url()
        .min(5)
        .max(2048)
        .regex(schema_1.whitespace, 'must be a non-whitespace')
        .optional(),
    expiry: zod_1.z.number().min(0).default(1440).optional(),
    items: zod_1.z
        .array(exports.CreateItemParams)
        .nonempty({ message: 'count must be greater than or equal to 1' }),
});
exports.CreateCheckoutOutput = zod_1.z.object({
    id: zod_1.z.string(),
    created: zod_1.z.string(),
    merchantId: zod_1.z.string().regex(schema_1.whitespace, 'must be a non-whitespace'),
    merchantOrderId: zod_1.z.string().regex(schema_1.whitespace, 'must be a non-whitespace'),
    totalCost: zod_1.z.number(),
    totalMinimumDeposit: zod_1.z.number(),
    completionDate: zod_1.z.string(),
    currencyCode: zod_1.z.string(),
    redirectURL: zod_1.z.string().regex(schema_1.whitespace, 'must be a non-whitespace'),
    callbackURL: zod_1.z.string().regex(schema_1.whitespace, 'must be a non-whitespace'),
    items: zod_1.z.array(zod_1.z.object({
        sku: zod_1.z.string().nonempty().regex(schema_1.whitespace, 'must be a non-whitespace'),
        merchantProductURL: zod_1.z.string().nullable(),
        quantity: zod_1.z.number().int(),
        description: zod_1.z.string(),
        costPerItem: zod_1.z.number(),
        minimumDepositPerItem: zod_1.z.object({
            unit: zod_1.z.string(),
            value: zod_1.z.number(),
        }),
        depositRefundable: zod_1.z.boolean(),
        redemptionDate: zod_1.z.string(),
        paymentDeadline: zod_1.z.number(),
        refundPolicies: zod_1.z.array(zod_1.z.object({
            type: zod_1.z.string(),
            daysWithinRedemptionDate: zod_1.z.number(),
            refundablePercentage: zod_1.z.number(),
        })),
    })),
    checkoutWorkflow: zod_1.z.object({
        sdkWidget: zod_1.z.object({
            type: zod_1.z.string(),
            id: zod_1.z.string(),
            scriptUrl: zod_1.z.string(),
        }),
    }),
});
exports.GetCheckoutParams = zod_1.z.object({ checkoutId: zod_1.z.string() });
exports.GetCheckoutOutput = zod_1.z.object({ id: zod_1.z.string() }).nullable();
exports.SupportedPaymentPlatformsParams = zod_1.z.object({
    checkoutId: zod_1.z.string(),
    userId: zod_1.z.string(),
});
let CheckoutService = class CheckoutService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    createCheckout({ merchantId, redirectURL, callbackURL, merchantOrderId, currencyCode, expiry, items, }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const merchant = yield (prisma === null || prisma === void 0 ? void 0 : prisma.merchant.findFirst({
                where: {
                    id: merchantId,
                },
                include: {
                    MerchantDefaultRefundPolicy: true,
                },
            }));
            if (!merchant)
                throw new server_1.TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Merchant not found.',
                });
            const { defaultMinimumDepositType, defaultMinimumDepositValue } = merchant;
            const firstPaymentAmount = items.reduce((aggr, item) => {
                var _a;
                return aggr +
                    (0, checkout_1.getMinimumDeposit)(item.costPerItem, item.minimumDepositPerItem
                        ? (_a = item.minimumDepositPerItem) === null || _a === void 0 ? void 0 : _a.unit
                        : defaultMinimumDepositType, item.minimumDepositPerItem
                        ? item.minimumDepositPerItem.value
                        : defaultMinimumDepositValue.toNumber()) *
                        item.quantity;
            }, 0);
            const result = yield (prisma === null || prisma === void 0 ? void 0 : prisma.$transaction((tx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                const checkout = yield tx.checkout.create({
                    data: {
                        id: (0, nanoid_1.generateId)(),
                        merchantId: merchant.id,
                        merchantOrderId,
                        checkoutExpiry: expiry
                            ? (0, date_fns_1.add)(new Date(Date.now()), { hours: expiry })
                            : (0, date_fns_1.add)(new Date(Date.now()), { days: 1 }),
                        redirectURL,
                        callbackURL,
                        firstPaymentAmount,
                        currencyCode,
                        updatedAt: new Date(Date.now()),
                    },
                });
                if (!checkout)
                    throw new server_1.TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
                const { MerchantDefaultRefundPolicy: defaultRefundPolicy } = merchant;
                const checkoutTransaction = yield (0, checkout_1.createCheckoutItems)(tx, checkout.id, items, defaultMinimumDepositType, defaultMinimumDepositValue);
                const refundPolicyItems = yield (0, checkout_1.createRefundPolicies)(tx, checkoutTransaction, defaultRefundPolicy);
                const checkoutItems = checkoutTransaction
                    .map((v) => v.prismaObject)
                    .filter((v) => v !== undefined);
                return {
                    id: checkout.id,
                    created: (0, checkout_1.getISODateString)(checkout.created),
                    merchantId: checkout.merchantId,
                    merchantOrderId: checkout.merchantOrderId,
                    totalCost: (0, checkout_1.getTotalCost)(checkoutItems),
                    totalMinimumDeposit: (0, checkout_1.getTotalMinimumDeposit)(items, defaultMinimumDepositType, defaultMinimumDepositValue.toNumber()),
                    completionDate: (0, checkout_1.getISODateString)((0, checkout_1.getCompletionDate)(items)),
                    currencyCode: checkout.currencyCode,
                    redirectURL,
                    callbackURL: callbackURL !== null && callbackURL !== void 0 ? callbackURL : '',
                    items: checkoutItems.map((item) => ({
                        sku: item.sku,
                        merchantProductURL: item.merchantProductURL,
                        quantity: item.quantity,
                        description: item.description,
                        costPerItem: item.costPerItem.toNumber(),
                        minimumDepositPerItem: {
                            unit: item.minimumDepositPerItemType,
                            value: item.minimumDepositPerItemValue.toNumber(),
                        },
                        depositRefundable: item.depositRefundable,
                        redemptionDate: (0, checkout_1.getISODateString)(item.redemptionDate),
                        paymentDeadline: item.paymentDeadline,
                        refundPolicies: refundPolicyItems[item.id].map(({ type, daysWithinRedemptionDate, refundablePercentage, }) => ({
                            type,
                            daysWithinRedemptionDate,
                            refundablePercentage: refundablePercentage === null || refundablePercentage === void 0 ? void 0 : refundablePercentage.toNumber(),
                        })),
                    })),
                };
            })));
            return Object.assign(Object.assign({}, result), { checkoutWorkflow: {
                    sdkWidget: {
                        type: process.env.PLANPAY_SDK_V2_TYPE,
                        id: process.env.PLANPAY_SDK_V2_ID,
                        scriptUrl: process.env.PLANPAY_SDK_V2_URL,
                    },
                } });
        });
    }
    getCheckout({ checkoutId }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.checkout.findUnique({
                where: { id: checkoutId },
                include: { items: true },
            });
        });
    }
    supportedPaymentPlatforms(userId, checkoutId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const checkout = yield this.prisma.checkout.findUnique({
                where: { id: checkoutId },
            });
            if (!checkout) {
                throw new server_1.TRPCError({ code: 'NOT_FOUND', message: 'Invalid checkoutId' });
            }
            const { merchantId, currencyCode } = checkout;
            const merchantPaymentMethodsForUser = yield this.prisma.merchant.findFirst({
                where: { id: merchantId },
                include: {
                    MerchantPaymentPlatform: {
                        include: {
                            MerchantPaymentPlatformCurrency: {
                                where: { currencyCode },
                            },
                            UserPaymentIdentity: {
                                where: { userId },
                                include: { UserPaymentMethod: true },
                            },
                            PaymentPlatform: true,
                        },
                    },
                },
            });
            if (!merchantPaymentMethodsForUser) {
                throw new server_1.TRPCError({ code: 'NOT_FOUND' });
            }
            return merchantPaymentMethodsForUser.MerchantPaymentPlatform[0];
        });
    }
    estimatePlan(params) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const checkout = yield this.prisma.checkout.findUnique({
                where: {
                    id: params.checkoutId,
                },
            });
            if (!checkout) {
                throw new server_1.TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'Unknown checkout id',
                });
            }
            // TODO: HARDCODED TEST
            const output = {
                deposit: { amount: 1000.1 },
                instalments: {
                    amount: 391.3,
                    count: 23,
                    remainder: 0.1,
                    cadence: {
                        frequency: estimations_1.FrequencyEnum.Weekly,
                        on: { dayOfWeek: 'Tuesday' },
                    },
                },
                totalCost: 10000.0,
                currencyCode: 'AUD',
                redirectURL: 'https://merchant-testing.dev.planpaytech.com/merchant/merchant-checkout-outcome?planpay_merchant_id=62972bbf7919',
            };
            return output;
        });
    }
};
CheckoutService = tslib_1.__decorate([
    (0, tsyringe_1.injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof client_1.PrismaClient !== "undefined" && client_1.PrismaClient) === "function" ? _a : Object])
], CheckoutService);
exports.CheckoutService = CheckoutService;


/***/ }),

/***/ "./packages/planpay-next-lib/src/checkout/estimations.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EstimatePlanOutput = exports.EstimatePlanParams = exports.PaymentMethod = exports.InstalmentRequestSchema = exports.Cadence = exports.FrequencyEnum = exports.JavascriptDayOfWeeks = exports.DayOfWeekEnum = exports.DepositRequestSchema = void 0;
const zod_1 = __webpack_require__("zod");
const depositAmountErrorMessage = `must be a decimal amount to two decimal places`;
const dayOfMonthErrorMessage = `must be a whole number integer between 1 and 31`;
const validateDecimal = (value) => {
    const numberToString = String(value);
    const numberBehindDot = numberToString.split('.')[1] || null;
    if (numberBehindDot === null)
        return true;
    return numberBehindDot.length <= 2;
};
const handleDecimalError = () => ({
    message: depositAmountErrorMessage,
});
exports.DepositRequestSchema = zod_1.z
    .object({
    amount: zod_1.z
        .number({
        errorMap: () => {
            return {
                message: depositAmountErrorMessage,
            };
        },
    })
        .refine(validateDecimal, handleDecimalError),
})
    .optional();
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
exports.JavascriptDayOfWeeks = [
    DayOfWeekEnum.Sunday,
    DayOfWeekEnum.Monday,
    DayOfWeekEnum.Tuesday,
    DayOfWeekEnum.Wednesday,
    DayOfWeekEnum.Thursday,
    DayOfWeekEnum.Friday,
    DayOfWeekEnum.Saturday,
];
var FrequencyEnum;
(function (FrequencyEnum) {
    FrequencyEnum["Weekly"] = "weekly";
    FrequencyEnum["Fortnightly"] = "fortnightly";
    FrequencyEnum["Monthly"] = "monthly";
})(FrequencyEnum = exports.FrequencyEnum || (exports.FrequencyEnum = {}));
const InstalmentDayOfWeek = zod_1.z.object({
    dayOfWeek: zod_1.z.string().refine((value) => {
        return exports.JavascriptDayOfWeeks.includes(value);
    }, () => ({
        message: 'must be a day of the week',
    })),
});
const InstalmentDayOfMonth = zod_1.z.object({
    dayOfMonth: zod_1.z
        .number()
        .min(1, { message: dayOfMonthErrorMessage })
        .max(31, { message: dayOfMonthErrorMessage }),
});
exports.Cadence = zod_1.z.discriminatedUnion('frequency', [
    zod_1.z.object({
        frequency: zod_1.z.literal(FrequencyEnum.Weekly),
        on: InstalmentDayOfWeek,
    }),
    zod_1.z.object({
        frequency: zod_1.z.literal(FrequencyEnum.Fortnightly),
        on: InstalmentDayOfWeek,
    }),
    zod_1.z.object({
        frequency: zod_1.z.literal(FrequencyEnum.Monthly),
        on: InstalmentDayOfMonth,
    }),
]);
exports.InstalmentRequestSchema = zod_1.z
    .object({
    cadence: exports.Cadence,
})
    .optional();
exports.PaymentMethod = zod_1.z.object({
    id: zod_1.z.string(),
    type: zod_1.z.enum(['card']),
    source: zod_1.z.enum(['stripe']),
});
exports.EstimatePlanParams = zod_1.z.object({
    type: zod_1.z.enum(['plan']),
    checkoutId: zod_1.z.string(),
    paymentMethod: exports.PaymentMethod.optional(),
    deposit: exports.DepositRequestSchema.optional(),
    instalments: exports.InstalmentRequestSchema.optional(),
    timeZone: zod_1.z.string(),
});
exports.EstimatePlanOutput = zod_1.z.object({
    deposit: zod_1.z.object({
        amount: zod_1.z.number(),
    }),
    instalments: zod_1.z.object({
        amount: zod_1.z.number(),
        remainder: zod_1.z.number(),
        count: zod_1.z.number().int(),
        cadence: exports.Cadence,
    }),
    totalCost: zod_1.z.number(),
    currencyCode: zod_1.z.string(),
    redirectURL: zod_1.z.string(),
});


/***/ }),

/***/ "./packages/planpay-next-lib/src/checkout/index.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__("tslib");
tslib_1.__exportStar(__webpack_require__("./packages/planpay-next-lib/src/checkout/checkoutService.ts"), exports);
tslib_1.__exportStar(__webpack_require__("./packages/planpay-next-lib/src/checkout/estimations.ts"), exports);


/***/ }),

/***/ "./packages/planpay-next-lib/src/index.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__("tslib");
tslib_1.__exportStar(__webpack_require__("./packages/planpay-next-lib/src/auth/auth.ts"), exports);
tslib_1.__exportStar(__webpack_require__("./packages/planpay-next-lib/src/logging/index.ts"), exports);
tslib_1.__exportStar(__webpack_require__("./packages/planpay-next-lib/src/prisma/index.ts"), exports);
tslib_1.__exportStar(__webpack_require__("./packages/planpay-next-lib/src/trpc/index.ts"), exports);
tslib_1.__exportStar(__webpack_require__("./packages/planpay-next-lib/src/notification/index.ts"), exports);
tslib_1.__exportStar(__webpack_require__("./packages/planpay-next-lib/src/checkout/index.ts"), exports);


/***/ }),

/***/ "./packages/planpay-next-lib/src/logging/index.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__("tslib");
tslib_1.__exportStar(__webpack_require__("./packages/planpay-next-lib/src/logging/logger.ts"), exports);
tslib_1.__exportStar(__webpack_require__("./packages/planpay-next-lib/src/logging/logging-middleware.ts"), exports);


/***/ }),

/***/ "./packages/planpay-next-lib/src/logging/logger.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createLogger = void 0;
const tslib_1 = __webpack_require__("tslib");
const pino_http_1 = tslib_1.__importDefault(__webpack_require__("pino-http"));
const uuid_1 = __webpack_require__("uuid");
function getOptions() {
    const level = process.env.APP_LOG_LEVEL || 'debug';
    const logFormat = process.env.APP_LOG_FORMAT || 'pretty';
    if (logFormat === 'pretty') {
        return {
            level,
            transport: {
                target: 'pino-pretty',
                options: {
                    color: true,
                },
            },
        };
    }
    else {
        return {
            level,
        };
    }
}
function createLogger(req, res) {
    const logger = (0, pino_http_1.default)(getOptions());
    req.id = (0, uuid_1.v4)();
    res.setHeader('traceid', req.id);
    logger(req, res);
    return logger.logger;
}
exports.createLogger = createLogger;


/***/ }),

/***/ "./packages/planpay-next-lib/src/logging/logging-middleware.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.loggedProcedure = exports.loggerMiddleware = void 0;
const tslib_1 = __webpack_require__("tslib");
const trpc_1 = __webpack_require__("./packages/planpay-next-lib/src/trpc/trpc.ts");
exports.loggerMiddleware = trpc_1.t.middleware(({ next, ctx }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const result = yield next();
    if (!result.ok) {
        ctx.logger.error({ error: result.error });
    }
    return result;
}));
exports.loggedProcedure = trpc_1.t.procedure.use(exports.loggerMiddleware);


/***/ }),

/***/ "./packages/planpay-next-lib/src/merchant/index.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__("tslib");
tslib_1.__exportStar(__webpack_require__("./packages/planpay-next-lib/src/merchant/merchantService.ts"), exports);


/***/ }),

/***/ "./packages/planpay-next-lib/src/merchant/merchantService.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MerchantService = exports.GetMerchantsParams = exports.GetMerchantParams = void 0;
const tslib_1 = __webpack_require__("tslib");
const client_1 = __webpack_require__("@prisma/client");
const server_1 = __webpack_require__("@trpc/server");
const tsyringe_1 = __webpack_require__("tsyringe");
const auth_1 = __webpack_require__("./packages/planpay-next-lib/src/auth/index.ts");
const zod_1 = __webpack_require__("zod");
exports.GetMerchantParams = zod_1.z.object({ id: zod_1.z.string() });
exports.GetMerchantsParams = zod_1.z.void();
let MerchantService = class MerchantService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    getMerchant(authn, { id }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            switch (authn.type) {
                case auth_1.AuthnType.Jwt:
                    if (!(yield this.prisma.userMerchantRole.findFirst({
                        where: {
                            userId: authn.user.id,
                            merchantId: id,
                        },
                    }))) {
                        throw new server_1.TRPCError({ code: 'UNAUTHORIZED' });
                    }
                    break;
                case auth_1.AuthnType.MerchantApiKey:
                    if (!(yield this.prisma.merchant.findFirst({
                        where: {
                            id: authn.merchantId,
                        },
                    }))) {
                        throw new server_1.TRPCError({ code: 'UNAUTHORIZED' });
                    }
                    break;
                case auth_1.AuthnType.InternalApiKey:
                    break;
                default:
                    throw new server_1.TRPCError({ code: 'UNAUTHORIZED' });
            }
            const merchant = yield this.prisma.merchant.findUnique({
                where: { id },
                include: { Address: { include: { Country: true } } },
            });
            if (!merchant) {
                throw new server_1.TRPCError({ code: 'NOT_FOUND' });
            }
            return Object.assign(Object.assign({}, merchant), { lateFeeApply: 0.2, serviceFeePercentage: merchant.serviceFeePercentage.toNumber() });
        });
    }
    getMerchants(authn) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (authn.type == auth_1.AuthnType.Jwt) {
                const result = yield this.prisma.userMerchantRole.findMany({
                    where: {
                        userId: authn.user.id,
                    },
                    include: {
                        Merchant: true,
                    },
                    distinct: ['userId', 'merchantId'],
                });
                if (result) {
                    return result.map((x) => x.Merchant);
                }
            }
            else if (authn.type == auth_1.AuthnType.MerchantApiKey) {
                const result = yield this.prisma.merchant.findFirst({
                    where: {
                        id: authn.merchantId,
                    },
                });
                if (result) {
                    return [result];
                }
            }
            else if (auth_1.AuthnType.InternalApiKey) {
                const result = yield this.prisma.merchant.findMany();
                if (result) {
                    return result;
                }
            }
            return [];
        });
    }
};
MerchantService = tslib_1.__decorate([
    (0, tsyringe_1.injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof client_1.PrismaClient !== "undefined" && client_1.PrismaClient) === "function" ? _a : Object])
], MerchantService);
exports.MerchantService = MerchantService;


/***/ }),

/***/ "./packages/planpay-next-lib/src/notification/index.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__("tslib");
tslib_1.__exportStar(__webpack_require__("./packages/planpay-next-lib/src/notification/notification.service.ts"), exports);
tslib_1.__exportStar(__webpack_require__("./packages/planpay-next-lib/src/notification/template-renderer.ts"), exports);


/***/ }),

/***/ "./packages/planpay-next-lib/src/notification/notification.service.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationService = exports.NotificationServiceParamsSchema = void 0;
const tslib_1 = __webpack_require__("tslib");
const zod_1 = __webpack_require__("zod");
const nodemailer_1 = tslib_1.__importDefault(__webpack_require__("nodemailer"));
exports.NotificationServiceParamsSchema = zod_1.z.object({
    smtpHost: zod_1.z.string(),
    smtpPort: zod_1.z.string(),
    smtpUser: zod_1.z.string(),
    smtpPassword: zod_1.z.string(),
    smtpFrom: zod_1.z.string(),
    imageBaseURL: zod_1.z.string(),
});
class NotificationService {
    constructor(params) {
        const smtpConfig = {
            host: params.smtpHost,
            port: parseInt(params.smtpPort),
            secure: false,
            auth: {
                user: params.smtpUser,
                pass: params.smtpPassword,
            },
        };
        this.mailTransporter = nodemailer_1.default.createTransport(smtpConfig);
        this.from = params.smtpFrom;
        this.imageBaseURL = params.imageBaseURL;
    }
    send(to, template) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.mailTransporter.sendMail({
                from: this.from,
                to,
                subject: template.title,
                html: template.body,
                attachments: template.attachments &&
                    template.attachments.map((attachment) => (Object.assign(Object.assign({}, attachment), { path: `${this.imageBaseURL}/${attachment.filename}` }))),
            });
        });
    }
}
exports.NotificationService = NotificationService;


/***/ }),

/***/ "./packages/planpay-next-lib/src/notification/template-renderer.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.passwordResetTemplate = exports.emailVerificationTemplate = void 0;
const tslib_1 = __webpack_require__("tslib");
const server_1 = tslib_1.__importDefault(__webpack_require__("react-dom/server"));
const emailVerification_1 = tslib_1.__importDefault(__webpack_require__("./packages/planpay-next-lib/src/notification/templates/emailVerification.tsx"));
const passwordReset_1 = tslib_1.__importDefault(__webpack_require__("./packages/planpay-next-lib/src/notification/templates/passwordReset.tsx"));
function emailVerificationTemplate(props) {
    const body = server_1.default.renderToStaticMarkup((0, emailVerification_1.default)(props));
    return {
        title: 'Welcome to Planpay, please verify your email address',
        body,
        attachments: [
            {
                filename: 'planpay-logo.png',
                cid: 'logo',
            },
        ],
    };
}
exports.emailVerificationTemplate = emailVerificationTemplate;
function passwordResetTemplate(props) {
    const body = server_1.default.renderToStaticMarkup((0, passwordReset_1.default)(props));
    return {
        title: 'Reset your password',
        body,
        attachments: [
            {
                filename: 'planpay-logo.png',
                cid: 'logo',
            },
        ],
    };
}
exports.passwordResetTemplate = passwordResetTemplate;


/***/ }),

/***/ "./packages/planpay-next-lib/src/notification/templates/emailVerification.tsx":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__("tslib");
const react_1 = tslib_1.__importDefault(__webpack_require__("react"));
function EmailVerification({ token }) {
    return (react_1.default.createElement("body", null,
        react_1.default.createElement("table", { align: "center", id: "bodyTable" },
            react_1.default.createElement("tr", null,
                react_1.default.createElement("td", { align: "center", valign: "top", id: "bodyCell" },
                    react_1.default.createElement("div", { className: "main" },
                        react_1.default.createElement("p", null,
                            react_1.default.createElement("img", { src: "cid:logo", width: "150px", alt: "PlanPay Logo" })),
                        react_1.default.createElement("p", null,
                            "Your verification code is: ",
                            react_1.default.createElement("b", null, token)),
                        react_1.default.createElement("p", null, "If you are having any issues with your account, please don't hesitate to contact us by replying to this mail."),
                        react_1.default.createElement("br", null),
                        "Thanks!",
                        react_1.default.createElement("br", null),
                        react_1.default.createElement("hr", null),
                        react_1.default.createElement("p", null, "If you did not make this request, please contact us by replying to this mail.")))))));
}
exports["default"] = EmailVerification;


/***/ }),

/***/ "./packages/planpay-next-lib/src/notification/templates/passwordReset.tsx":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__("tslib");
const react_1 = tslib_1.__importDefault(__webpack_require__("react"));
function PasswordReset({ resetPasswordURL }) {
    return (react_1.default.createElement("div", { className: "main" },
        react_1.default.createElement("table", { align: "center", id: "bodyTable" },
            react_1.default.createElement("tr", null,
                react_1.default.createElement("td", { align: "center", valign: "top", id: "bodyCell" },
                    react_1.default.createElement("img", { src: "cid:logo", width: "150px", alt: "PlanPay Logo" }),
                    react_1.default.createElement("p", null, "Click the following link to reset your password"),
                    react_1.default.createElement("a", { href: resetPasswordURL }, "Link"),
                    react_1.default.createElement("p", null, "If you are having any issues with your account, please don't hesitate to contact us by replying to this mail."),
                    react_1.default.createElement("br", null),
                    react_1.default.createElement("hr", null),
                    react_1.default.createElement("p", null, "If you did not make this request, please contact us by replying to this mail."))))));
}
exports["default"] = PasswordReset;


/***/ }),

/***/ "./packages/planpay-next-lib/src/payment/index.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__("tslib");
tslib_1.__exportStar(__webpack_require__("./packages/planpay-next-lib/src/payment/paymentService.ts"), exports);


/***/ }),

/***/ "./packages/planpay-next-lib/src/payment/paymentPlatforms/stripePlatform.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StripePlatform = exports.userPaymentIdentityIdParam = exports.MakePaymentParams = exports.GetUserPaymentIdentityParams = exports.SetupPaymentIdentityParams = void 0;
const tslib_1 = __webpack_require__("tslib");
const client_1 = __webpack_require__("@prisma/client");
const server_1 = __webpack_require__("@trpc/server");
const tsyringe_1 = __webpack_require__("tsyringe");
const zod_1 = __webpack_require__("zod");
const stripe_1 = __webpack_require__("stripe");
const nanoid_1 = __webpack_require__("./packages/planpay-next-lib/src/utils/nanoid.ts");
exports.SetupPaymentIdentityParams = zod_1.z.object({
    userId: zod_1.z.string(),
    merchantPaymentPlatformId: zod_1.z.string(),
});
exports.GetUserPaymentIdentityParams = zod_1.z.object({
    userPaymentIdentityId: zod_1.z.string(),
});
exports.MakePaymentParams = zod_1.z.object({
    userId: zod_1.z.string(),
    merchantPaymentPlatformId: zod_1.z.string(),
    checkoutId: zod_1.z.string(),
});
exports.userPaymentIdentityIdParam = zod_1.z.object({
    userPaymentIdentityId: zod_1.z.string(),
});
let StripePlatform = class StripePlatform {
    constructor(prisma, stripe) {
        this.prisma = prisma;
        this.stripe = stripe;
    }
    getUserPaymentIdentity({ userPaymentIdentityId, }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const userPaymentIdentity = yield this.prisma.userPaymentIdentity.findUnique({
                where: { id: userPaymentIdentityId },
            });
            return userPaymentIdentity;
        });
    }
    createOrGetUserPaymentIdentityId({ userId, merchantPaymentPlatformId, }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const user = yield this.prisma.user.findUnique({
                where: { id: userId },
            });
            if (!user) {
                throw new server_1.TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Cannot identify user',
                });
            }
            // Create Stripe Customer Id
            const customer = yield this.stripe.customers.create({
                email: user.emailAddress,
                name: user.firstName + ' ' + user.lastName,
                phone: user.phoneNumber,
            });
            //TO CLARIFY
            let userPaymentIdentity = yield this.prisma.userPaymentIdentity.findFirst({
                where: { userId, merchantPaymentPlatformId },
            });
            if (!userPaymentIdentity) {
                userPaymentIdentity = yield this.prisma.userPaymentIdentity.create({
                    data: {
                        id: (0, nanoid_1.generateId)(),
                        userId,
                        externalCustomerId: customer.id,
                        merchantPaymentPlatformId,
                    },
                });
            }
            return userPaymentIdentity.id;
        });
    }
    setUpPaymentIntent({ userPaymentIdentityId, }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const userPaymentIdentity = yield this.getUserPaymentIdentity({
                userPaymentIdentityId,
            });
            if (!userPaymentIdentity) {
                throw new server_1.TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Cannot identify stripe user',
                });
            }
            const setupIntent = yield this.stripe.setupIntents.create({
                customer: userPaymentIdentity.externalCustomerId,
            });
            return {
                clientSecret: setupIntent.client_secret,
                userPaymentIdentityId: userPaymentIdentity.id,
            };
        });
    }
    saveStripePaymentMethod({ userPaymentIdentityId, }) {
        var _a, _b, _c, _d, _e;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const userPaymentIdentity = yield this.getUserPaymentIdentity({
                userPaymentIdentityId,
            });
            if (!userPaymentIdentity) {
                throw new server_1.TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Cannot identify stripe user',
                });
            }
            const paymentMethods = yield this.stripe.paymentMethods.list({
                customer: userPaymentIdentity.externalCustomerId,
                type: 'card',
            });
            for (let i = 0; i < paymentMethods.data.length; i++) {
                yield this.prisma.userPaymentMethod.create({
                    data: {
                        id: (0, nanoid_1.generateId)(),
                        default: false,
                        userPaymentIdentityId,
                        token: paymentMethods.data[i].id,
                        last4Digits: (_a = paymentMethods.data[i].card) === null || _a === void 0 ? void 0 : _a.last4,
                        expMonth: (_b = paymentMethods.data[i].card) === null || _b === void 0 ? void 0 : _b.exp_month,
                        expYear: (_c = paymentMethods.data[i].card) === null || _c === void 0 ? void 0 : _c.exp_year,
                        cardBrand: (_d = paymentMethods.data[i].card) === null || _d === void 0 ? void 0 : _d.brand,
                        funding: ((_e = paymentMethods.data[i].card) === null || _e === void 0 ? void 0 : _e.funding) === 'credit'
                            ? client_1.Card_type.Credit
                            : client_1.Card_type.Debit,
                    },
                });
            }
        });
    }
    makePayment({ userId, merchantPaymentPlatformId, checkoutId, }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const userPaymentIdentity = yield this.prisma.userPaymentIdentity.findFirst({
                where: { userId, merchantPaymentPlatformId },
            });
            if (!userPaymentIdentity || !userPaymentIdentity.externalCustomerId) {
                throw new server_1.TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Cannot identify stripe user',
                });
            }
            const checkout = yield this.prisma.checkout.findUnique({
                where: { id: checkoutId },
            });
            if (!checkout) {
                throw new server_1.TRPCError({ code: 'NOT_FOUND', message: 'Invalid checkoutId' });
            }
            const paymentMethod = yield this.prisma.userPaymentMethod.findFirst({
                where: { userPaymentIdentityId: userPaymentIdentity.id },
            });
            if (!paymentMethod) {
                throw new server_1.TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Could not find payment method',
                });
            }
            try {
                yield this.stripe.paymentIntents.create({
                    amount: 500,
                    currency: checkout.currencyCode,
                    customer: userPaymentIdentity.externalCustomerId,
                    payment_method: paymentMethod.token,
                    off_session: true,
                    confirm: true,
                });
            }
            catch (err) {
                // Error code will be authentication_required if authentication is needed
                console.log('Error code is: ', err);
            }
        });
    }
};
StripePlatform = tslib_1.__decorate([
    (0, tsyringe_1.injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof client_1.PrismaClient !== "undefined" && client_1.PrismaClient) === "function" ? _a : Object, typeof (_b = typeof stripe_1.Stripe !== "undefined" && stripe_1.Stripe) === "function" ? _b : Object])
], StripePlatform);
exports.StripePlatform = StripePlatform;


/***/ }),

/***/ "./packages/planpay-next-lib/src/payment/paymentService.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PaymentService = exports.savePayementMethodsParams = exports.SetUpPaymentBackEndParams = void 0;
const tslib_1 = __webpack_require__("tslib");
const client_1 = __webpack_require__("@prisma/client");
const server_1 = __webpack_require__("@trpc/server");
const tsyringe_1 = __webpack_require__("tsyringe");
const zod_1 = __webpack_require__("zod");
const stripePlatform_1 = __webpack_require__("./packages/planpay-next-lib/src/payment/paymentPlatforms/stripePlatform.ts");
exports.SetUpPaymentBackEndParams = zod_1.z.object({
    userId: zod_1.z.string(),
    merchantPaymentPlatformId: zod_1.z.string(),
    paymentPlatformVendor: zod_1.z.enum([
        'Stripe',
        'Adyen',
        'BrainTree',
        'PayPal',
        'WindCave',
    ]),
});
exports.savePayementMethodsParams = zod_1.z.object({
    userPaymentIdentityId: zod_1.z.string(),
    paymentPlatformVendor: zod_1.z.enum([
        'Stripe',
        'Adyen',
        'BrainTree',
        'PayPal',
        'WindCave',
    ]),
});
let PaymentService = class PaymentService {
    constructor(prisma, stripePlatform) {
        this.prisma = prisma;
        this.stripePlatform = stripePlatform;
    }
    setUpPaymentBackEnd({ userId, paymentPlatformVendor, merchantPaymentPlatformId, }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (paymentPlatformVendor == client_1.PaymentPlatform_vendor.Stripe) {
                const userPaymentIdentityId = yield this.stripePlatform.createOrGetUserPaymentIdentityId({
                    userId,
                    merchantPaymentPlatformId,
                });
                return this.stripePlatform.setUpPaymentIntent({ userPaymentIdentityId });
            }
            return;
        });
    }
    savePaymentMethods({ userPaymentIdentityId, paymentPlatformVendor, }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (paymentPlatformVendor == client_1.PaymentPlatform_vendor.Stripe) {
                this.stripePlatform.saveStripePaymentMethod({ userPaymentIdentityId });
            }
        });
    }
    finalisePayment({ checkoutId, userId, merchantPaymentPlatformId, }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const checkout = yield this.prisma.checkout.findUnique({
                where: {
                    id: checkoutId,
                },
                include: {
                    items: true,
                },
            });
            if (!checkout) {
                throw new server_1.TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'Unknown checkout id',
                });
            }
            yield this.stripePlatform.makePayment({
                checkoutId,
                userId,
                merchantPaymentPlatformId,
            });
        });
    }
};
PaymentService = tslib_1.__decorate([
    (0, tsyringe_1.injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof client_1.PrismaClient !== "undefined" && client_1.PrismaClient) === "function" ? _a : Object, typeof (_b = typeof stripePlatform_1.StripePlatform !== "undefined" && stripePlatform_1.StripePlatform) === "function" ? _b : Object])
], PaymentService);
exports.PaymentService = PaymentService;


/***/ }),

/***/ "./packages/planpay-next-lib/src/plan/index.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__("tslib");
tslib_1.__exportStar(__webpack_require__("./packages/planpay-next-lib/src/plan/planService.ts"), exports);


/***/ }),

/***/ "./packages/planpay-next-lib/src/plan/planService.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PlanService = exports.GetPlansParams = exports.GetPlanParams = void 0;
const tslib_1 = __webpack_require__("tslib");
const client_1 = __webpack_require__("@prisma/client");
const server_1 = __webpack_require__("@trpc/server");
const tsyringe_1 = __webpack_require__("tsyringe");
const zod_1 = __webpack_require__("zod");
const auth_1 = __webpack_require__("./packages/planpay-next-lib/src/auth/index.ts");
exports.GetPlanParams = zod_1.z.object({ planId: zod_1.z.string() });
exports.GetPlansParams = zod_1.z.object({
    startingAfter: zod_1.z.string().nullable(),
});
let PlanService = class PlanService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    getPlan({ planId }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const plan = yield this.prisma.plan.findUnique({ where: { id: planId } });
            if (!plan) {
                throw new server_1.TRPCError({ code: 'NOT_FOUND' });
            }
            return plan;
        });
    }
    getPlans(authn) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (authn.type === auth_1.AuthnType.Jwt) {
                const plans = yield this.prisma.plan.findMany({
                    where: { userId: authn.user.id },
                });
                return plans;
            }
            return [];
        });
    }
};
PlanService = tslib_1.__decorate([
    (0, tsyringe_1.injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof client_1.PrismaClient !== "undefined" && client_1.PrismaClient) === "function" ? _a : Object])
], PlanService);
exports.PlanService = PlanService;


/***/ }),

/***/ "./packages/planpay-next-lib/src/prisma/client.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.prisma = void 0;
const client_1 = __webpack_require__("@prisma/client");
exports.prisma = globalThis.prisma || new client_1.PrismaClient();
if (true)
    globalThis.prisma = exports.prisma;


/***/ }),

/***/ "./packages/planpay-next-lib/src/prisma/index.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__("tslib");
tslib_1.__exportStar(__webpack_require__("./packages/planpay-next-lib/src/prisma/client.ts"), exports);


/***/ }),

/***/ "./packages/planpay-next-lib/src/trpc/context.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createContext = void 0;
const tslib_1 = __webpack_require__("tslib");
const logging_1 = __webpack_require__("./packages/planpay-next-lib/src/logging/index.ts");
const auth_1 = __webpack_require__("./packages/planpay-next-lib/src/auth/index.ts");
/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/
const createContext = (opts) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { req, res } = opts;
    const authn = yield (0, auth_1.authenticateRequest)(req);
    const logger = (0, logging_1.createLogger)(req, res);
    return {
        authn,
        logger,
    };
});
exports.createContext = createContext;


/***/ }),

/***/ "./packages/planpay-next-lib/src/trpc/index.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__("tslib");
tslib_1.__exportStar(__webpack_require__("./packages/planpay-next-lib/src/trpc/trpc.ts"), exports);
tslib_1.__exportStar(__webpack_require__("./packages/planpay-next-lib/src/trpc/router.ts"), exports);
tslib_1.__exportStar(__webpack_require__("./packages/planpay-next-lib/src/trpc/context.ts"), exports);


/***/ }),

/***/ "./packages/planpay-next-lib/src/trpc/router.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.appRouter = void 0;
__webpack_require__("reflect-metadata");
const trpc_1 = __webpack_require__("./packages/planpay-next-lib/src/trpc/trpc.ts");
const routers_1 = __webpack_require__("./packages/planpay-next-lib/src/trpc/routers/index.ts");
exports.appRouter = trpc_1.t.router({
    auth: routers_1.auth,
    plan: routers_1.plan,
    merchant: routers_1.merchant,
    user: routers_1.user,
    checkout: routers_1.checkout,
    payment: routers_1.payment,
});


/***/ }),

/***/ "./packages/planpay-next-lib/src/trpc/routers/auth.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.auth = void 0;
const tslib_1 = __webpack_require__("tslib");
const server_1 = __webpack_require__("@trpc/server");
const auth_1 = __webpack_require__("./packages/planpay-next-lib/src/auth/index.ts");
const auth_2 = __webpack_require__("./packages/planpay-next-lib/src/auth/auth.ts");
const logging_1 = __webpack_require__("./packages/planpay-next-lib/src/logging/index.ts");
const dependencyInjection_1 = __webpack_require__("./packages/planpay-next-lib/src/utils/dependencyInjection.ts");
const trpc_1 = __webpack_require__("./packages/planpay-next-lib/src/trpc/trpc.ts");
exports.auth = trpc_1.t.router({
    verifyEmail: logging_1.loggedProcedure
        .input(auth_1.VerifyEmailParams)
        .mutation(({ input }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const authService = dependencyInjection_1.container.resolve(auth_1.AuthService);
        const { emailAddress } = input;
        return authService.verifyEmail({ emailAddress });
    })),
    signup: logging_1.loggedProcedure.input(auth_1.SignupParams).mutation(({ input }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const authService = dependencyInjection_1.container.resolve(auth_1.AuthService);
        const { emailAddress, firstName, lastName, phoneNumber, password, otpCode, } = input;
        return authService.signup({
            emailAddress,
            firstName,
            lastName,
            phoneNumber,
            password,
            otpCode,
        });
    })),
    getPermissions: logging_1.loggedProcedure
        .meta({
        openapi: { method: 'GET', path: '/v2/auth/permissions', tags: ['auth'] },
    })
        .input(auth_1.GetPermissionsParams)
        .output(auth_1.GetPermissionsResult)
        .query(({ ctx }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const { authn } = ctx;
        if (!authn || authn.type !== auth_2.AuthnType.MerchantApiKey) {
            throw new server_1.TRPCError({ code: 'UNAUTHORIZED' });
        }
        const { merchantId, key } = authn;
        const authService = dependencyInjection_1.container.resolve(auth_1.AuthService);
        return authService.getPermissions(merchantId, key);
    })),
    requestPasswordReset: logging_1.loggedProcedure
        .input(auth_1.RequestPasswordResetParams)
        .mutation(({ input }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const authService = dependencyInjection_1.container.resolve(auth_1.AuthService);
        const { emailAddress, resetPasswordPath } = input;
        return authService.requestPasswordReset({
            emailAddress,
            resetPasswordPath,
        });
    })),
    resetPassword: logging_1.loggedProcedure
        .input(auth_1.ResetPasswordParams)
        .mutation(({ input }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const authService = dependencyInjection_1.container.resolve(auth_1.AuthService);
        const { emailAddress, token, newPassword } = input;
        return authService.resetPassword({ emailAddress, token, newPassword });
    })),
});


/***/ }),

/***/ "./packages/planpay-next-lib/src/trpc/routers/checkout.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.checkout = void 0;
const tslib_1 = __webpack_require__("tslib");
const server_1 = __webpack_require__("@trpc/server");
const auth_1 = __webpack_require__("./packages/planpay-next-lib/src/auth/index.ts");
const checkoutService_1 = __webpack_require__("./packages/planpay-next-lib/src/checkout/checkoutService.ts");
const estimations_1 = __webpack_require__("./packages/planpay-next-lib/src/checkout/estimations.ts");
const logging_1 = __webpack_require__("./packages/planpay-next-lib/src/logging/index.ts");
const dependencyInjection_1 = __webpack_require__("./packages/planpay-next-lib/src/utils/dependencyInjection.ts");
const trpc_1 = __webpack_require__("./packages/planpay-next-lib/src/trpc/trpc.ts");
exports.checkout = trpc_1.t.router({
    createCheckout: logging_1.loggedProcedure
        .meta({
        openapi: { method: 'POST', path: '/v2/checkout', tags: ['checkout'] },
    })
        .input(checkoutService_1.CreateCheckoutParams)
        .output(checkoutService_1.CreateCheckoutOutput)
        .mutation(({ ctx, input }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const checkoutService = dependencyInjection_1.container.resolve(checkoutService_1.CheckoutService);
        const { type, merchantId, merchantOrderId, currencyCode, redirectURL, callbackURL, expiry, items, } = input;
        const { authn } = ctx;
        if (!authn ||
            authn.type !== auth_1.AuthnType.MerchantApiKey ||
            authn.merchantId !== merchantId)
            throw new server_1.TRPCError({ code: 'UNAUTHORIZED' });
        return checkoutService.createCheckout({
            type,
            merchantId,
            merchantOrderId,
            currencyCode,
            redirectURL,
            callbackURL,
            expiry,
            items,
        });
    })),
    getCheckout: logging_1.loggedProcedure
        .meta({
        openapi: {
            method: 'GET',
            path: '/v2/checkout/{checkoutId}',
            tags: ['checkout'],
        },
    })
        .input(checkoutService_1.GetCheckoutParams)
        .output(checkoutService_1.GetCheckoutOutput)
        .query(({ ctx, input }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const { authn } = ctx;
        if (!authn)
            throw new server_1.TRPCError({ code: 'UNAUTHORIZED' });
        const { checkoutId } = input;
        const checkoutService = dependencyInjection_1.container.resolve(checkoutService_1.CheckoutService);
        return checkoutService.getCheckout({ checkoutId });
    })),
    supportedPaymentPlatforms: logging_1.loggedProcedure
        .input(checkoutService_1.SupportedPaymentPlatformsParams)
        .query(({ ctx, input }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const { authn } = ctx;
        if (!authn || authn.type !== auth_1.AuthnType.Jwt)
            throw new server_1.TRPCError({ code: 'UNAUTHORIZED' });
        const userId = authn.user.id;
        const { checkoutId } = input;
        const checkoutService = dependencyInjection_1.container.resolve(checkoutService_1.CheckoutService);
        return checkoutService.supportedPaymentPlatforms(userId, checkoutId);
    })),
    estimatePlan: logging_1.loggedProcedure
        .input(estimations_1.EstimatePlanParams)
        .output(estimations_1.EstimatePlanOutput)
        .query(({ input }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const checkoutService = dependencyInjection_1.container.resolve(checkoutService_1.CheckoutService);
        return checkoutService.estimatePlan(input);
    })),
});


/***/ }),

/***/ "./packages/planpay-next-lib/src/trpc/routers/index.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__("tslib");
tslib_1.__exportStar(__webpack_require__("./packages/planpay-next-lib/src/trpc/routers/auth.ts"), exports);
tslib_1.__exportStar(__webpack_require__("./packages/planpay-next-lib/src/trpc/routers/checkout.ts"), exports);
tslib_1.__exportStar(__webpack_require__("./packages/planpay-next-lib/src/trpc/routers/merchant.ts"), exports);
tslib_1.__exportStar(__webpack_require__("./packages/planpay-next-lib/src/trpc/routers/payment.ts"), exports);
tslib_1.__exportStar(__webpack_require__("./packages/planpay-next-lib/src/trpc/routers/plan.ts"), exports);
tslib_1.__exportStar(__webpack_require__("./packages/planpay-next-lib/src/trpc/routers/user.ts"), exports);


/***/ }),

/***/ "./packages/planpay-next-lib/src/trpc/routers/merchant.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.merchant = void 0;
const tslib_1 = __webpack_require__("tslib");
const trpc_1 = __webpack_require__("./packages/planpay-next-lib/src/trpc/trpc.ts");
const logging_1 = __webpack_require__("./packages/planpay-next-lib/src/logging/index.ts");
const server_1 = __webpack_require__("@trpc/server");
const dependencyInjection_1 = __webpack_require__("./packages/planpay-next-lib/src/utils/dependencyInjection.ts");
const merchant_1 = __webpack_require__("./packages/planpay-next-lib/src/merchant/index.ts");
exports.merchant = trpc_1.t.router({
    getMerchant: logging_1.loggedProcedure
        .input(merchant_1.GetMerchantParams)
        .query(({ ctx, input }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const { authn } = ctx;
        if (!authn) {
            throw new server_1.TRPCError({ code: 'UNAUTHORIZED' });
        }
        const { id } = input;
        const merchantService = dependencyInjection_1.container.resolve(merchant_1.MerchantService);
        return merchantService.getMerchant(authn, { id });
    })),
    getMerchants: logging_1.loggedProcedure
        .input(merchant_1.GetMerchantsParams) // TODO: Pagination
        .query(({ ctx }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const { authn } = ctx;
        if (!authn) {
            throw new server_1.TRPCError({ code: 'UNAUTHORIZED' });
        }
        const merchantService = dependencyInjection_1.container.resolve(merchant_1.MerchantService);
        return merchantService.getMerchants(authn);
    })),
});


/***/ }),

/***/ "./packages/planpay-next-lib/src/trpc/routers/payment.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.payment = void 0;
const tslib_1 = __webpack_require__("tslib");
const server_1 = __webpack_require__("@trpc/server");
const logging_1 = __webpack_require__("./packages/planpay-next-lib/src/logging/index.ts");
const payment_1 = __webpack_require__("./packages/planpay-next-lib/src/payment/index.ts");
const stripePlatform_1 = __webpack_require__("./packages/planpay-next-lib/src/payment/paymentPlatforms/stripePlatform.ts");
const dependencyInjection_1 = __webpack_require__("./packages/planpay-next-lib/src/utils/dependencyInjection.ts");
const trpc_1 = __webpack_require__("./packages/planpay-next-lib/src/trpc/trpc.ts");
exports.payment = trpc_1.t.router({
    setUpPaymentBackEnd: logging_1.loggedProcedure
        .input(payment_1.SetUpPaymentBackEndParams)
        .mutation(({ ctx, input }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const { authn } = ctx;
        if (!authn) {
            throw new server_1.TRPCError({ code: 'UNAUTHORIZED' });
        }
        const { userId, merchantPaymentPlatformId, paymentPlatformVendor } = input;
        const paymentService = dependencyInjection_1.container.resolve(payment_1.PaymentService);
        return paymentService.setUpPaymentBackEnd({
            userId,
            merchantPaymentPlatformId,
            paymentPlatformVendor,
        });
    })),
    finalisePayment: logging_1.loggedProcedure
        .input(stripePlatform_1.MakePaymentParams)
        .mutation(({ ctx, input }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const { authn } = ctx;
        if (!authn) {
            throw new server_1.TRPCError({ code: 'UNAUTHORIZED' });
        }
        const { checkoutId, userId, merchantPaymentPlatformId } = input;
        const paymentService = dependencyInjection_1.container.resolve(payment_1.PaymentService);
        return paymentService.finalisePayment({
            checkoutId,
            userId,
            merchantPaymentPlatformId,
        });
    })),
});


/***/ }),

/***/ "./packages/planpay-next-lib/src/trpc/routers/plan.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.plan = void 0;
const tslib_1 = __webpack_require__("tslib");
const server_1 = __webpack_require__("@trpc/server");
const auth_1 = __webpack_require__("./packages/planpay-next-lib/src/auth/index.ts");
const logging_1 = __webpack_require__("./packages/planpay-next-lib/src/logging/index.ts");
const plan_1 = __webpack_require__("./packages/planpay-next-lib/src/plan/index.ts");
const dependencyInjection_1 = __webpack_require__("./packages/planpay-next-lib/src/utils/dependencyInjection.ts");
const trpc_1 = __webpack_require__("./packages/planpay-next-lib/src/trpc/trpc.ts");
exports.plan = trpc_1.t.router({
    getPlan: logging_1.loggedProcedure
        .input(plan_1.GetPlanParams)
        .query(({ ctx, input }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const { authn } = ctx;
        if (!authn) {
            throw new server_1.TRPCError({ code: 'UNAUTHORIZED' });
        }
        const { planId } = input;
        const planService = dependencyInjection_1.container.resolve(plan_1.PlanService);
        return planService.getPlan({ planId });
    })),
    getPlans: logging_1.loggedProcedure.input(plan_1.GetPlansParams).query(({ ctx }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const { authn } = ctx;
        if (!authn || authn.type !== auth_1.AuthnType.Jwt) {
            throw new server_1.TRPCError({ code: 'UNAUTHORIZED' });
        }
        const planService = dependencyInjection_1.container.resolve(plan_1.PlanService);
        return planService.getPlans(authn);
    })),
});


/***/ }),

/***/ "./packages/planpay-next-lib/src/trpc/routers/user.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.user = void 0;
const tslib_1 = __webpack_require__("tslib");
const server_1 = __webpack_require__("@trpc/server");
const logging_1 = __webpack_require__("./packages/planpay-next-lib/src/logging/index.ts");
const user_1 = __webpack_require__("./packages/planpay-next-lib/src/user/index.ts");
const dependencyInjection_1 = __webpack_require__("./packages/planpay-next-lib/src/utils/dependencyInjection.ts");
const trpc_1 = __webpack_require__("./packages/planpay-next-lib/src/trpc/trpc.ts");
exports.user = trpc_1.t.router({
    getUser: logging_1.loggedProcedure
        .input(user_1.GetUserParams)
        .output(user_1.GetUserResult)
        .query(({ ctx, input }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const { authn } = ctx;
        if (!authn) {
            throw new server_1.TRPCError({ code: 'UNAUTHORIZED' });
        }
        const { id } = input;
        const userService = dependencyInjection_1.container.resolve(user_1.UserService);
        return userService.getUser({ id });
    })),
});


/***/ }),

/***/ "./packages/planpay-next-lib/src/trpc/trpc.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.t = void 0;
const tslib_1 = __webpack_require__("tslib");
const server_1 = __webpack_require__("@trpc/server");
const superjson_1 = tslib_1.__importDefault(__webpack_require__("superjson"));
exports.t = server_1.initTRPC
    .context()
    .meta()
    .create({
    transformer: superjson_1.default,
    errorFormatter({ shape, error }) {
        console.error(error);
        console.error(error.cause);
        return shape;
    },
});


/***/ }),

/***/ "./packages/planpay-next-lib/src/user/index.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__("tslib");
tslib_1.__exportStar(__webpack_require__("./packages/planpay-next-lib/src/user/userService.ts"), exports);


/***/ }),

/***/ "./packages/planpay-next-lib/src/user/userService.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserService = exports.GetUserResult = exports.GetUserParams = void 0;
const tslib_1 = __webpack_require__("tslib");
const client_1 = __webpack_require__("@prisma/client");
const server_1 = __webpack_require__("@trpc/server");
const tsyringe_1 = __webpack_require__("tsyringe");
const zod_1 = __webpack_require__("zod");
exports.GetUserParams = zod_1.z.object({ id: zod_1.z.string() });
exports.GetUserResult = zod_1.z.object({
    id: zod_1.z.string(),
    emailAddress: zod_1.z.string(),
    firstName: zod_1.z.string(),
    lastName: zod_1.z.string().nullish(),
    phoneNumber: zod_1.z.string(),
    createdDate: zod_1.z.date(),
    stripeId: zod_1.z.string(),
});
let UserService = class UserService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    getUser({ id }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const user = yield this.prisma.user.findUnique({
                where: {
                    id,
                },
            });
            if (!user) {
                throw new server_1.TRPCError({ code: 'NOT_FOUND' });
            }
            return {
                id: user.id,
                emailAddress: user.emailAddress,
                firstName: user.firstName,
                lastName: user === null || user === void 0 ? void 0 : user.lastName,
                phoneNumber: user.phoneNumber,
                createdDate: user.createdAt,
                status: user.status,
                stripeId: 'asd',
            };
        });
    }
};
UserService = tslib_1.__decorate([
    (0, tsyringe_1.injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof client_1.PrismaClient !== "undefined" && client_1.PrismaClient) === "function" ? _a : Object])
], UserService);
exports.UserService = UserService;


/***/ }),

/***/ "./packages/planpay-next-lib/src/utils/dependencyInjection.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.container = void 0;
const tslib_1 = __webpack_require__("tslib");
__webpack_require__("reflect-metadata");
const tsyringe_1 = __webpack_require__("tsyringe");
Object.defineProperty(exports, "container", ({ enumerable: true, get: function () { return tsyringe_1.container; } }));
const client_1 = __webpack_require__("@prisma/client");
const notification_1 = __webpack_require__("./packages/planpay-next-lib/src/notification/index.ts");
const stripe_1 = tslib_1.__importDefault(__webpack_require__("stripe"));
tsyringe_1.container.register(client_1.PrismaClient, {
    useValue: new client_1.PrismaClient(),
    // If you want to log the prisma SQL Queries, add this object as an argument
    // to the prisma client
    //   {
    //   log: [
    //     {
    //       emit: 'stdout',
    //       level: 'query',
    //     },
    //     {
    //       emit: 'stdout',
    //       level: 'error',
    //     },
    //     {
    //       emit: 'stdout',
    //       level: 'info',
    //     },
    //     {
    //       emit: 'stdout',
    //       level: 'warn',
    //     },
    //   ],
    // }
});
tsyringe_1.container.register(notification_1.NotificationService, {
    useFactory: () => new notification_1.NotificationService(notification_1.NotificationServiceParamsSchema.parse({
        smtpHost: process.env.SMTP_HOST,
        smtpPort: process.env.SMTP_PORT,
        smtpUser: process.env.SMTP_USER,
        smtpPassword: process.env.SMTP_PASSWORD,
        smtpFrom: process.env.SMTP_FROM,
        imageBaseURL: `${process.env.URI_SCHEME}://${process.env.VERCEL_URL}/static`,
    })),
});
tsyringe_1.container.register(stripe_1.default, {
    useFactory: () => new stripe_1.default(process.env.STRIPE_SECRET_KEY || '', {
        apiVersion: '2020-08-27',
    }),
});


/***/ }),

/***/ "./packages/planpay-next-lib/src/utils/nanoid.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.generateId = void 0;
const nanoid_1 = __webpack_require__("nanoid");
function generateId() {
    return (0, nanoid_1.customAlphabet)('0123456789abcdefghijklmnopqrstuvwxyz', 12)();
}
exports.generateId = generateId;


/***/ }),

/***/ "./packages/planpay-next-lib/src/utils/schema.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.whitespace = exports.futureDateSchema = exports.minimumDepositSchema = void 0;
const zod_1 = __webpack_require__("zod");
exports.minimumDepositSchema = zod_1.z
    .discriminatedUnion('unit', [
    zod_1.z.object({
        unit: zod_1.z.literal('Currency'),
        value: zod_1.z.number().gte(0).multipleOf(0.01),
    }),
    zod_1.z.object({
        unit: zod_1.z.literal('Percentage'),
        value: zod_1.z.number().min(0).max(100),
    }),
])
    .optional();
const futureDateSchema = (propertyName) => zod_1.z
    .preprocess((arg) => (typeof arg == 'string' || arg instanceof Date) && new Date(arg), zod_1.z.date())
    .refine((date) => new Date(date) > new Date(Date.now()), `The ${propertyName} must be after the current time.`);
exports.futureDateSchema = futureDateSchema;
exports.whitespace = /^((?! ).)*$/;


/***/ }),

/***/ "@prisma/client":
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

/***/ "@trpc/server":
/***/ ((module) => {

module.exports = require("@trpc/server");

/***/ }),

/***/ "argon2":
/***/ ((module) => {

module.exports = require("argon2");

/***/ }),

/***/ "date-fns":
/***/ ((module) => {

module.exports = require("date-fns");

/***/ }),

/***/ "nanoid":
/***/ ((module) => {

module.exports = require("nanoid");

/***/ }),

/***/ "next-auth/jwt":
/***/ ((module) => {

module.exports = require("next-auth/jwt");

/***/ }),

/***/ "nodemailer":
/***/ ((module) => {

module.exports = require("nodemailer");

/***/ }),

/***/ "pino-http":
/***/ ((module) => {

module.exports = require("pino-http");

/***/ }),

/***/ "react":
/***/ ((module) => {

module.exports = require("react");

/***/ }),

/***/ "react-dom/server":
/***/ ((module) => {

module.exports = require("react-dom/server");

/***/ }),

/***/ "reflect-metadata":
/***/ ((module) => {

module.exports = require("reflect-metadata");

/***/ }),

/***/ "stripe":
/***/ ((module) => {

module.exports = require("stripe");

/***/ }),

/***/ "superjson":
/***/ ((module) => {

module.exports = require("superjson");

/***/ }),

/***/ "tslib":
/***/ ((module) => {

module.exports = require("tslib");

/***/ }),

/***/ "tsyringe":
/***/ ((module) => {

module.exports = require("tsyringe");

/***/ }),

/***/ "uuid":
/***/ ((module) => {

module.exports = require("uuid");

/***/ }),

/***/ "zod":
/***/ ((module) => {

module.exports = require("zod");

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
const event_loop_1 = __webpack_require__("./apps/event-processor/src/event-loop.ts");
function main() {
    return (0, event_loop_1.eventLoop)(process.env.EVENT_LOOP_INTERVAL
        ? Number(process.env.EVENT_LOOP_INTERVAL)
        : 30 * 1000);
}
main().catch((e) => {
    console.error(e);
    process.exit(1);
});

})();

var __webpack_export_target__ = exports;
for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;
//# sourceMappingURL=main.js.map