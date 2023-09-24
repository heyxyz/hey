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
Object.defineProperty(exports, "__esModule", { value: true });
var errors_1 = require("@hey/data/errors");
var tracking_1 = require("@hey/data/tracking");
var response_1 = require("@hey/lib/response");
var ua_parser_js_1 = require("ua-parser-js");
var zod_1 = require("zod");
var checkEventExistence_1 = require("../helpers/checkEventExistence");
var validationSchema = (0, zod_1.object)({
    name: (0, zod_1.string)().min(1, { message: 'Name is required!' }),
    actor: (0, zod_1.string)().nullable().optional(),
    url: (0, zod_1.string)(),
    referrer: (0, zod_1.string)().nullable().optional(),
    platform: (0, zod_1.string)(),
    properties: (0, zod_1.any)()
});
exports.default = (function (request) { return __awaiter(void 0, void 0, void 0, function () {
    var body, validation, _a, name, actor, url, referrer, platform, properties, ip, user_agent, parser, ua, ipData, ipResponse, _b, parsedUrl, utmSource, utmMedium, utmCampaign, utmTerm, utmContent, clickhouseResponse, error_1;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, request.json()];
            case 1:
                body = _c.sent();
                if (!body) {
                    return [2 /*return*/, (0, response_1.default)({ success: false, error: errors_1.Errors.NoBody })];
                }
                validation = validationSchema.safeParse(body);
                if (!validation.success) {
                    return [2 /*return*/, (0, response_1.default)({ success: false, error: validation.error.issues })];
                }
                _a = body, name = _a.name, actor = _a.actor, url = _a.url, referrer = _a.referrer, platform = _a.platform, properties = _a.properties;
                if (!(0, checkEventExistence_1.default)(tracking_1.ALL_EVENTS, name)) {
                    return [2 /*return*/, (0, response_1.default)({ success: false, error: 'Invalid event!' })];
                }
                ip = request.headers.get('cf-connecting-ip');
                user_agent = request.headers.get('user-agent');
                _c.label = 2;
            case 2:
                _c.trys.push([2, 9, , 10]);
                parser = new ua_parser_js_1.default(user_agent || '');
                ua = parser.getResult();
                ipData = null;
                _c.label = 3;
            case 3:
                _c.trys.push([3, 6, , 7]);
                return [4 /*yield*/, fetch("https://pro.ip-api.com/json/".concat(ip, "?key=").concat(request.env.IPAPI_KEY))];
            case 4:
                ipResponse = _c.sent();
                return [4 /*yield*/, ipResponse.json()];
            case 5:
                ipData = _c.sent();
                return [3 /*break*/, 7];
            case 6:
                _b = _c.sent();
                return [3 /*break*/, 7];
            case 7:
                parsedUrl = new URL(url);
                utmSource = parsedUrl.searchParams.get('utm_source') || null;
                utmMedium = parsedUrl.searchParams.get('utm_medium') || null;
                utmCampaign = parsedUrl.searchParams.get('utm_campaign') || null;
                utmTerm = parsedUrl.searchParams.get('utm_term') || null;
                utmContent = parsedUrl.searchParams.get('utm_content') || null;
                return [4 /*yield*/, fetch(request.env.CLICKHOUSE_REST_ENDPOINT, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: "\n        INSERT INTO events (\n          name,\n          actor,\n          properties,\n          url,\n          city,\n          country,\n          region,\n          referrer,\n          platform,\n          browser,\n          browser_version,\n          os,\n          utm_source,\n          utm_medium,\n          utm_campaign,\n          utm_term,\n          utm_content\n        ) VALUES (\n          '".concat(name, "',\n          ").concat(actor ? "'".concat(actor, "'") : null, ",\n          ").concat(properties ? "'".concat(JSON.stringify(properties), "'") : null, ",\n          ").concat(url ? "'".concat(url, "'") : null, ",\n          ").concat((ipData === null || ipData === void 0 ? void 0 : ipData.city) ? "'".concat(ipData === null || ipData === void 0 ? void 0 : ipData.city, "'") : null, ",\n          ").concat((ipData === null || ipData === void 0 ? void 0 : ipData.country) ? "'".concat(ipData === null || ipData === void 0 ? void 0 : ipData.country, "'") : null, ",\n          ").concat((ipData === null || ipData === void 0 ? void 0 : ipData.regionName) ? "'".concat(ipData === null || ipData === void 0 ? void 0 : ipData.regionName, "'") : null, ",\n          ").concat(referrer ? "'".concat(referrer, "'") : null, ",\n          ").concat(platform ? "'".concat(platform, "'") : null, ",\n          ").concat(ua.browser.name ? "'".concat(ua.browser.name, "'") : null, ",\n          ").concat(ua.browser.version ? "'".concat(ua.os.version, "'") : null, ",\n          ").concat(ua.os.name ? "'".concat(ua.os.name, "'") : null, ",\n          ").concat(utmSource ? "'".concat(utmSource, "'") : null, ",\n          ").concat(utmMedium ? "'".concat(utmMedium, "'") : null, ",\n          ").concat(utmCampaign ? "'".concat(utmCampaign, "'") : null, ",\n          ").concat(utmTerm ? "'".concat(utmTerm, "'") : null, ",\n          ").concat(utmContent ? "'".concat(utmContent, "'") : null, "\n        )\n      ")
                    })];
            case 8:
                clickhouseResponse = _c.sent();
                if (clickhouseResponse.status !== 200) {
                    return [2 /*return*/, (0, response_1.default)({ success: false, error: errors_1.Errors.StatusCodeIsNot200 })];
                }
                return [2 /*return*/, (0, response_1.default)({ success: true })];
            case 9:
                error_1 = _c.sent();
                throw error_1;
            case 10: return [2 /*return*/];
        }
    });
}); });
