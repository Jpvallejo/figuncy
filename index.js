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
        while (_) try {
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
exports.__esModule = true;
var playwright_1 = require("playwright");
var cron = require("node-cron");
var telegraf_1 = require("telegraf");
var dotenv = require("dotenv");
dotenv.config();
try {
    var telegramToken = process.env.TELEGRAM_TOKEN || "";
    var channelId_1 = process.env.CHANNEL_ID || "";
    if (!telegramToken || telegramToken === "") {
        throw new Error("Please provide a token via environment variables");
    }
    var bot_1 = new telegraf_1.Telegraf(telegramToken);
    var chatId_1 = 0;
    bot_1.start(function (ctx) {
        chatId_1 = ctx.chat.id;
        ctx.reply("Este bot te avisa si hay figuritas con un mensaje en telegram.");
    });
    var url_1 = "https://www.zonakids.com/productos/1-album-tapa-dura-fifa-world-cup-qatar-2022/";
    var toescape = "\n  *HAY FIGURITAS\\!\\!*\n  HAY STOCK DEL ALBUM TAPA DURA.\n  And\u00E1 a ".concat(url_1, "\n");
    var message_1 = toescape.replace(/\./g, "\\.").replace(/\-/g, "\\-");
    cron.schedule("0,30 * * * * *", function () { return __awaiter(void 0, void 0, void 0, function () {
        var browser, page, content;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Running on: ".concat(new Date().toLocaleString("es-AR", {
                        timeZone: "America/Buenos_Aires"
                    })));
                    return [4 /*yield*/, playwright_1.chromium.launch()];
                case 1:
                    browser = _a.sent();
                    return [4 /*yield*/, browser.newPage()];
                case 2:
                    page = _a.sent();
                    return [4 /*yield*/, page.goto(url_1)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, page.inputValue('#product_form input[type="submit"]')];
                case 4:
                    content = _a.sent();
                    if (content === "Sin stock") {
                        console.log("SIN STOCK");
                    }
                    else {
                        bot_1.telegram.sendMessage(channelId_1, message_1, {
                            parse_mode: "MarkdownV2"
                        });
                    }
                    return [4 /*yield*/, browser.close()];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    bot_1.launch();
    // Enable graceful stop
    process.once('SIGINT', function () { return bot_1.stop('SIGINT'); });
    process.once('SIGTERM', function () { return bot_1.stop('SIGTERM'); });
    console.log("bot started!");
}
catch (e) {
    console.log(e);
}
