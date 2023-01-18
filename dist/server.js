"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var index_1 = __importDefault(require("./routes/index"));
var cron_1 = require("./cron");
var cronJob = new cron_1.CronService();
var app = (0, express_1["default"])();
var PORT = 7000;
app.use("/api", index_1["default"]);
cronJob.base();
app.listen(PORT, function () {
    console.log("starting app on port:".concat(PORT));
});
