'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.');
      while ((g && ((g = 0), op[0] && (_ = 0)), _))
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y['return']
                  : op[0]
                  ? y['throw'] || ((t = y['return']) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
Object.defineProperty(exports, '__esModule', { value: true });
var errors_1 = require('@hey/data/errors');
var lens_endpoints_1 = require('@hey/data/lens-endpoints');
var response_1 = require('@hey/lib/response');
var zod_1 = require('zod');
var validationSchema = (0, zod_1.object)({
  address: (0, zod_1.string)(),
  isMainnet: (0, zod_1.boolean)()
});
exports.default = function (request) {
  return __awaiter(void 0, void 0, void 0, function () {
    var body,
      accessToken,
      validation,
      _a,
      address,
      isMainnet,
      mutation,
      inviteResponse,
      inviteResponseJson,
      error_1;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          return [4 /*yield*/, request.json()];
        case 1:
          body = _b.sent();
          if (!body) {
            return [
              2 /*return*/,
              (0, response_1.default)({
                success: false,
                error: errors_1.Errors.NoBody
              })
            ];
          }
          accessToken = request.headers.get('X-Access-Token');
          if (!accessToken) {
            return [
              2 /*return*/,
              (0, response_1.default)({
                success: false,
                error: errors_1.Errors.NoAccessToken
              })
            ];
          }
          validation = validationSchema.safeParse(body);
          if (!validation.success) {
            return [
              2 /*return*/,
              (0, response_1.default)({
                success: false,
                error: validation.error.issues
              })
            ];
          }
          (_a = body), (address = _a.address), (isMainnet = _a.isMainnet);
          _b.label = 2;
        case 2:
          _b.trys.push([2, 5, , 6]);
          mutation =
            '\n      mutation Invite($request: InviteRequest!) {\n        invite(request: $request)\n      }\n    ';
          return [
            4 /*yield*/,
            fetch(
              isMainnet
                ? lens_endpoints_1.default.Mainnet
                : lens_endpoints_1.default.Testnet,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer '.concat(accessToken),
                  'User-agent': 'Lenster'
                },
                body: JSON.stringify({
                  query: mutation,
                  variables: {
                    request: {
                      invites: [address],
                      secret: request.env.SHARED_LENS_INVITE_SECRET
                    }
                  }
                })
              }
            )
          ];
        case 3:
          inviteResponse = _b.sent();
          return [4 /*yield*/, inviteResponse.json()];
        case 4:
          inviteResponseJson = _b.sent();
          if (!inviteResponseJson.errors) {
            return [
              2 /*return*/,
              (0, response_1.default)({ success: true, alreadyInvited: false })
            ];
          }
          return [
            2 /*return*/,
            (0, response_1.default)({ success: false, alreadyInvited: true })
          ];
        case 5:
          error_1 = _b.sent();
          throw error_1;
        case 6:
          return [2 /*return*/];
      }
    });
  });
};
