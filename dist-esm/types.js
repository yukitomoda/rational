import { Ratio } from './Ratio';
function isConvertableToBigInt(value) {
    const type = typeof value;
    return type === 'number' || type === 'string' || type === 'bigint' || type === 'boolean';
}
function isConvertableToRatio(value) {
    return value instanceof Ratio || typeof value === 'bigint' || typeof value === 'number' || typeof value === 'string';
}
export { isConvertableToBigInt, isConvertableToRatio };
//# sourceMappingURL=types.js.map