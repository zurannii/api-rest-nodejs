"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const child_process_1 = require("child_process");
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../src/app");
(0, vitest_1.describe)('Transactions routes', () => {
    (0, vitest_1.beforeAll)(() => __awaiter(void 0, void 0, void 0, function* () {
        (0, child_process_1.execSync)('npm run knex migrate:latest');
        yield app_1.app.ready();
    }));
    (0, vitest_1.afterAll)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield app_1.app.close();
    }));
    (0, vitest_1.beforeEach)(() => __awaiter(void 0, void 0, void 0, function* () {
        (0, child_process_1.execSync)('npm run knex migrate:rollback --all');
        (0, child_process_1.execSync)('npm run knex migrate:latest');
    }));
    (0, vitest_1.it)('should be able to create a new transaction', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.app.server)
            .post('/transactions')
            .send({
            title: 'New transaction',
            amount: 5000,
            type: 'credit',
        })
            .expect(201);
    }));
    (0, vitest_1.it)('should be able to list all transactions', () => __awaiter(void 0, void 0, void 0, function* () {
        const createTransactionResponse = yield (0, supertest_1.default)(app_1.app.server)
            .post('/transactions')
            .send({
            title: 'New transaction',
            amount: 5000,
            type: 'credit',
        })
            .expect(201);
        const cookies = createTransactionResponse.get('Set-Cookie');
        const listTransactionsResponse = yield (0, supertest_1.default)(app_1.app.server)
            .get('/transactions')
            .set('Cookie', cookies || [])
            .expect(200);
        (0, vitest_1.expect)(listTransactionsResponse.body.transactions).toEqual([
            vitest_1.expect.objectContaining({
                title: 'New transaction',
                amount: 5000,
            }),
        ]);
    }));
    (0, vitest_1.it)('should be able to get a specific transaction', () => __awaiter(void 0, void 0, void 0, function* () {
        const createTransactionResponse = yield (0, supertest_1.default)(app_1.app.server)
            .post('/transactions')
            .send({
            title: 'New transaction',
            amount: 5000,
            type: 'credit',
        })
            .expect(201);
        const cookies = createTransactionResponse.get('Set-Cookie');
        const listTransactionsResponse = yield (0, supertest_1.default)(app_1.app.server)
            .get('/transactions')
            .set('Cookie', cookies || [])
            .expect(200);
        const transactionId = listTransactionsResponse.body.transactions[0].id;
        const getTransactionsResponse = yield (0, supertest_1.default)(app_1.app.server)
            .get(`/transactions/${transactionId}`)
            .set('Cookie', cookies || [])
            .expect(200);
        (0, vitest_1.expect)(listTransactionsResponse.body.transaction).toEqual([
            vitest_1.expect.objectContaining({
                title: 'New transaction',
                amount: 5000,
            }),
        ]);
    }));
});
