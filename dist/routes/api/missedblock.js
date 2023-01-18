"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var missedblock_1 = require("../../handlers/missedblock");
var missedblockMothods = new missedblock_1.MissedBlockHandler();
var missedblocks = express_1["default"].Router();
missedblocks.get("/", missedblockMothods.index);
missedblocks.get("/:id", missedblockMothods.getAggregatedWithinSpecifiedTime);
exports["default"] = missedblocks;
