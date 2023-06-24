"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isConvertableToRatio = exports.isConvertableToBigInt = void 0;
const Ratio_1 = require("./Ratio");
function isConvertableToBigInt(value) {
    const type = typeof value;
    return type === 'number' || type === 'string' || type === 'bigint' || type === 'boolean';
}
exports.isConvertableToBigInt = isConvertableToBigInt;
function isConvertableToRatio(value) {
    return value instanceof Ratio_1.Ratio || typeof value === 'bigint' || typeof value === 'number';
}
exports.isConvertableToRatio = isConvertableToRatio;
//# sourceMappingURL=types.js.map