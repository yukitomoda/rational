import { Ratio, ratio } from '../src/Ratio';
import { assert } from 'chai';
import { it, describe } from 'mocha';

describe('properties', () => {
  it('isZero', () => {
    assert.isTrue(new Ratio(0, 1).isZero);
    assert.isTrue(new Ratio(0, 10000000n).isZero);
    assert.isFalse(new Ratio(1, 10n ** 20n).isZero);
    assert.isFalse(new Ratio(-1, 10n ** 20n).isZero);
  });

  it('isPositive', () => {
    assert.isTrue(new Ratio(1, 10n ** 20n).isPositive);
    assert.isTrue(new Ratio(-1, -(10n ** 20n)).isPositive);
    assert.isFalse(new Ratio(-1, 10n ** 20n).isPositive);
    assert.isFalse(new Ratio(1, -(10n ** 20n)).isPositive);
    assert.isFalse(new Ratio(0, 1).isPositive);
    assert.isFalse(new Ratio(0, 10000000n).isPositive);
  });

  it('isNegative', () => {
    assert.isTrue(new Ratio(-1, 10n ** 20n).isNegative);
    assert.isTrue(new Ratio(1, -(10n ** 20n)).isNegative);
    assert.isFalse(new Ratio(1, 10n ** 20n).isNegative);
    assert.isFalse(new Ratio(-1, -(10n ** 20n)).isNegative);
    assert.isFalse(new Ratio(0, 1).isNegative);
    assert.isFalse(new Ratio(0, 10000000n).isNegative);
  });
});

describe('toDecimal', () => {
  it('正の整数の文字列表現', () => {
    assert.equal(ratio(33, 1).toDecimal(0), '33');
    assert.equal(ratio(33, 1).toDecimal(10), '33.0000000000');
  });

  it('正の有理数の文字列表現', () => {
    assert.equal(ratio(1, 3).toDecimal(3), '0.333');

    assert.equal(ratio(10, 3).toDecimal(0), '3');
    assert.equal(ratio(10, 3).toDecimal(3), '3.333');
    assert.equal(ratio(10, 3).toDecimal(10), '3.3333333333');

    assert.equal(ratio(1151, 83).toDecimal(6), '13.867470');
    assert.equal(ratio(1151, 83).toDecimal(12), '13.867469879518');
  });

  it('負の整数の文字列表現', () => {
    assert.equal(ratio(-33, 1).toDecimal(0), '-33');
    assert.equal(ratio(-33, 1).toDecimal(10), '-33.0000000000');
  });

  it('負の有理数の文字列表現', () => {
    assert.equal(ratio(-1, 3).toDecimal(3), '-0.333');

    assert.equal(ratio(-10, 3).toDecimal(0), '-3');
    assert.equal(ratio(-10, 3).toDecimal(3), '-3.333');
    assert.equal(ratio(-10, 3).toDecimal(10), '-3.3333333333');

    assert.equal(ratio(-1151, 83).toDecimal(6), '-13.867470');
    assert.equal(ratio(-1151, 83).toDecimal(12), '-13.867469879518');
  });

  it('ちょうど5の桁で丸める場合', () => {
    assert.equal(ratio(1, 8).toDecimal(2), '0.13');
    assert.equal(ratio(1, 8).toDecimal(2), '0.13');

    assert.equal(ratio(1949, 1000).toDecimal(1), '1.9');
    assert.equal(ratio(1949, 1000).toDecimal(2), '1.95');
    assert.equal(ratio(1949, 1000).toDecimal(3), '1.949');
  });
});

describe('standard operators', () => {
  it('inv', () => {
    assert.isTrue(new Ratio(1, 2).inv().eq(new Ratio(2, 1)));
    assert.isTrue(new Ratio(-1, 2).inv().eq(new Ratio(-2, 1)));
    assert.throws(() => new Ratio(0, 1).inv());
    assert.throws(() => new Ratio(0, 2).inv());
    assert.throws(() => new Ratio(0, -2).inv());
  });

  it('neg', () => {
    assert.isTrue(new Ratio(1, 2).neg().eq(new Ratio(-1, 2)));
    assert.isTrue(new Ratio(-1, 2).neg().eq(new Ratio(1, 2)));
    assert.isTrue(new Ratio(0, 1).neg().eq(new Ratio(0, 1)));
  });

  describe('eq', () => {
    it('Ratio', () => {
      assert.isTrue(new Ratio(0, 1).eq(new Ratio(0, 1)));
      assert.isTrue(new Ratio(0, 1).eq(new Ratio(0, 2)));
      assert.isTrue(new Ratio(0, 1).eq(new Ratio(0, -1)));
      assert.isTrue(new Ratio(1, 2).eq(new Ratio(1, 2)));
      assert.isTrue(new Ratio(1, 2).eq(new Ratio(2, 4)));
      assert.isTrue(new Ratio(1, 2).eq(new Ratio(-2, -4)));
      assert.isTrue(new Ratio(-1, 2).eq(new Ratio(-2, 4)));
      assert.isTrue(new Ratio(-1, 2).eq(new Ratio(2, -4)));
      assert.isTrue(new Ratio(1, -2).eq(new Ratio(-2, 4)));

      assert.isFalse(new Ratio(1, 2).eq(new Ratio(1, 3)));
      assert.isFalse(new Ratio(1, 2).eq(new Ratio(3, 2)));
      assert.isFalse(new Ratio(1, 2).eq(new Ratio(-1, 2)));
      assert.isFalse(new Ratio(1, 2).eq(new Ratio(1, -2)));
      assert.isFalse(new Ratio(-1, 2).eq(new Ratio(1, 2)));
      assert.isFalse(new Ratio(1, -2).eq(new Ratio(1, 2)));
      assert.isFalse(new Ratio(1, -2).eq(new Ratio(0, 1)));
    });

    it('bigint', () => {
      assert.isTrue(new Ratio(0, 1).eq(0n));
      assert.isTrue(new Ratio(0, 2).eq(0n));
      assert.isTrue(new Ratio(1, 1).eq(1n));
      assert.isTrue(new Ratio(-1, -1).eq(1n));
      assert.isTrue(new Ratio(1, -1).eq(-1n));
      assert.isTrue(new Ratio(-1, 1).eq(-1n));
      assert.isTrue(new Ratio(10, 1).eq(10n));
      assert.isTrue(new Ratio(-10, -1).eq(10n));
      assert.isTrue(new Ratio(10, -1).eq(-10n));
      assert.isTrue(new Ratio(-10, 1).eq(-10n));

      assert.isFalse(new Ratio(1, 2).eq(0n));
      assert.isFalse(new Ratio(1, 2).eq(1n));
      assert.isFalse(new Ratio(2, 1).eq(1n));
      assert.isFalse(new Ratio(-1, 1).eq(1n));
      assert.isFalse(new Ratio(1, -1).eq(1n));
      assert.isFalse(new Ratio(1, 1).eq(-1n));
      assert.isFalse(new Ratio(-1, -1).eq(-1n));
    });
  });
});
