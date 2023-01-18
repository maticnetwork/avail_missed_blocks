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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.Subscription = void 0;
// Import
var _a = require("@polkadot/api"), ApiPromise = _a.ApiPromise, WsProvider = _a.WsProvider;
var database_1 = __importDefault(require("../database"));
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1["default"].config();
var Subscription = /** @class */ (function () {
    function Subscription() {
    }
    // Construct
    Subscription.prototype.main = function () {
        return __awaiter(this, void 0, void 0, function () {
            var wsProvider, api, chain, lastHeader, block, hash, filename, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        wsProvider = new WsProvider("wss://testnet.polygonavail.net/ws");
                        return [4 /*yield*/, ApiPromise.create({ provider: wsProvider })];
                    case 1:
                        api = _a.sent();
                        // Wait until we are ready and connected
                        return [4 /*yield*/, api.isReady];
                    case 2:
                        // Wait until we are ready and connected
                        _a.sent();
                        return [4 /*yield*/, api.rpc.system.chain()];
                    case 3:
                        chain = _a.sent();
                        return [4 /*yield*/, api.rpc.chain.getHeader()];
                    case 4:
                        lastHeader = _a.sent();
                        // // Log the information
                        console.log("".concat(chain, ": last block #").concat(lastHeader.number, " has hash ").concat(lastHeader.hash));
                        block = "".concat(lastHeader.number);
                        hash = "".concat(lastHeader.hash);
                        return [4 /*yield*/, this.create({ block: block, hash: hash })];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, this.getCurrentDate()];
                    case 6:
                        filename = _a.sent();
                        return [3 /*break*/, 8];
                    case 7:
                        error_1 = _a.sent();
                        throw new Error(error_1.message);
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    Subscription.prototype.getCurrentDate = function () {
        return __awaiter(this, void 0, void 0, function () {
            var date, day, month, year, currentDate, timestamp;
            return __generator(this, function (_a) {
                date = new Date();
                day = date.getDate();
                month = date.getMonth() + 1;
                year = date.getFullYear();
                currentDate = "".concat(day, "-").concat(month, "-").concat(year, ".txt");
                timestamp = new Date().getTime();
                return [2 /*return*/, String("".concat(timestamp, ".txt"))];
            });
        });
    };
    Subscription.prototype.create = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var block, hash, conn, lastRecord, totalMissedBlock, tblock, sql, result, newBlock, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        console.log("\n");
                        console.log("--------------------------------------------");
                        console.log("Starting cron: run every minute");
                        console.log("--------------------------------------------");
                        console.log("\n");
                        block = data.block, hash = data.hash;
                        return [4 /*yield*/, database_1["default"].connect()];
                    case 1:
                        conn = _a.sent();
                        return [4 /*yield*/, this.getLastRecord()];
                    case 2:
                        lastRecord = _a.sent();
                        totalMissedBlock = 0;
                        tblock = void 0;
                        if (lastRecord) {
                            tblock = parseInt(block) - parseInt(lastRecord.blocknumber);
                            totalMissedBlock = parseInt(process.env.TOTAL_EXPECTED_BLOCK) - tblock;
                        }
                        else {
                            totalMissedBlock = 0;
                        }
                        sql = "INSERT INTO blocks (blocknumber, hash, missedblocks, block_produced_within_time) VALUES($1, $2, $3, $4) RETURNING *";
                        return [4 /*yield*/, conn.query(sql, [
                                block,
                                hash,
                                totalMissedBlock,
                                tblock,
                            ])];
                    case 3:
                        result = _a.sent();
                        newBlock = result.rows[0];
                        conn.release();
                        // return block;
                        console.log(newBlock);
                        return [3 /*break*/, 5];
                    case 4:
                        error_2 = _a.sent();
                        console.log(error_2.message);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Subscription.prototype.getLastRecord = function () {
        return __awaiter(this, void 0, void 0, function () {
            var conn, sql, result, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, database_1["default"].connect()];
                    case 1:
                        conn = _a.sent();
                        sql = "SELECT * FROM blocks ORDER BY id DESC LIMIT 1";
                        return [4 /*yield*/, conn.query(sql)];
                    case 2:
                        result = _a.sent();
                        conn.release();
                        return [2 /*return*/, result.rows[0]];
                    case 3:
                        error_3 = _a.sent();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Subscription.prototype.getAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            var connection, sql, result, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, database_1["default"].connect()];
                    case 1:
                        connection = _a.sent();
                        sql = "SELECT * FROM blocks";
                        return [4 /*yield*/, connection.query(sql)];
                    case 2:
                        result = _a.sent();
                        //close conection
                        connection.release();
                        //return result to the calling client
                        console.log(result.rows, "Welcome");
                        return [3 /*break*/, 4];
                    case 3:
                        error_4 = _a.sent();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return Subscription;
}());
exports.Subscription = Subscription;
