import { assert } from 'chai';
import { it, describe } from 'mocha';
import { isNormalNumber } from '../src/NumberEx';

describe('isNormalNumber', () => {
  it('通常の数', () => {
    assert.isTrue(isNormalNumber(1));
    assert.isTrue(isNormalNumber(-1));
    assert.isTrue(isNormalNumber(2.2250738585072014e-308));
    assert.isTrue(isNormalNumber(-2.2250738585072014e-308));
    assert.isFalse(isNormalNumber(0));
    assert.isFalse(isNormalNumber(2.225073858507201e-308));
    assert.isFalse(isNormalNumber(-2.225073858507201e-308));
  });

  it('特別な数', () => {
    assert.isFalse(isNormalNumber(Number.NaN));
    assert.isFalse(isNormalNumber(Number.POSITIVE_INFINITY));
    assert.isFalse(isNormalNumber(Number.NEGATIVE_INFINITY));
  });
});
