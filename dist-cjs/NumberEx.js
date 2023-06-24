"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNormalNumber = void 0;
const minNormalNumber = 2.2250738585072014e-308;
function isNormalNumber(value) {
    if (Number.isNaN(value))
        return false;
    if (!Number.isFinite(value))
        return false;
    return minNormalNumber <= Math.abs(value);
}
exports.isNormalNumber = isNormalNumber;
//# sourceMappingURL=NumberEx.js.map