import { Ratio, ratio } from '../src/Ratio';
import { assert } from 'chai';
import { it, describe } from 'mocha';

describe('utils', () => {
  it('ratio(bigint)', () => {
    assert.isTrue(ratio(10n ** 100n).eq(Ratio.from(10n ** 100n)));
    assert.isTrue(ratio(2n).eq(Ratio.from(2n)));
    assert.isTrue(ratio(1n).eq(Ratio.from(1n)));
    assert.isTrue(ratio(0n).eq(Ratio.from(0n)));
    assert.isTrue(ratio(-1n).eq(Ratio.from(-1n)));
    assert.isTrue(ratio(-2n).eq(Ratio.from(-2n)));
    assert.isTrue(ratio(-(10n ** 100n)).eq(Ratio.from(-(10n ** 100n))));
  });

  it('ratio(number)', () => {
    assert.isTrue(ratio(Number.MAX_VALUE).eq(Ratio.from(Number.MAX_VALUE)));
    assert.isTrue(ratio(Number.MAX_SAFE_INTEGER).eq(Ratio.from(Number.MAX_SAFE_INTEGER)));
    assert.isTrue(ratio(2).eq(Ratio.from(2)));
    assert.isTrue(ratio(1).eq(Ratio.from(1)));
    assert.isTrue(ratio(0.5).eq(Ratio.from(0.5)));
    assert.isTrue(ratio(Number.MIN_VALUE).eq(Ratio.from(Number.MIN_VALUE)));
    assert.isTrue(ratio(0).eq(Ratio.from(0)));
    assert.isTrue(ratio(-Number.MIN_VALUE).eq(Ratio.from(-Number.MIN_VALUE)));
    assert.isTrue(ratio(-0.5).eq(Ratio.from(-0.5)));
    assert.isTrue(ratio(-1).eq(Ratio.from(-1)));
    assert.isTrue(ratio(-2).eq(Ratio.from(-2)));
    assert.isTrue(ratio(-Number.MAX_SAFE_INTEGER).eq(Ratio.from(-Number.MAX_SAFE_INTEGER)));
    assert.isTrue(ratio(-Number.MAX_VALUE).eq(Ratio.from(-Number.MAX_VALUE)));
  });

  it('ratio(bigint, bigint)', () => {
    assert.isTrue(ratio(7n ** 10n, 13n ** 10n).eq(Ratio.reduced(7n ** 10n, 13n ** 10n)));
    assert.isTrue(ratio(2n, 1n).eq(Ratio.reduced(2n, 1n)));
    assert.isTrue(ratio(1n, 2n).eq(Ratio.reduced(1n, 2n)));
    assert.isTrue(ratio(0n, 1n).eq(Ratio.reduced(0n, 1n)));
    assert.isTrue(ratio(-1n, 2n).eq(Ratio.reduced(-1n, 2n)));
    assert.isTrue(ratio(-2n, 1n).eq(Ratio.reduced(-2n, 1n)));
    assert.isTrue(ratio(-(7n ** 10n), 13n ** 10n).eq(Ratio.reduced(-(7n ** 10n), 13n ** 10n)));
  });

  it('ratio(number, number)', () => {
    assert.isTrue(ratio(2, 1).eq(Ratio.reduced(2, 1)));
    assert.isTrue(ratio(1, 2).eq(Ratio.reduced(1, 2)));
    assert.isTrue(ratio(0, 1).eq(Ratio.reduced(0, 1)));
    assert.isTrue(ratio(-1, 2).eq(Ratio.reduced(-1, 2)));
    assert.isTrue(ratio(-2, 1).eq(Ratio.reduced(-2, 1)));

    assert.throws(() => ratio(1.5, 2));
    assert.throws(() => ratio(2, 1.5));
  });
});

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

describe('conversion', () => {
  it('fromNumber', () => {
    assert.isTrue(Ratio.fromNumber(1).eq(ratio(1, 1)));
    assert.isTrue(Ratio.fromNumber(0.5).eq(ratio(1, 2)));
    assert.isTrue(Ratio.fromNumber(0.25).eq(ratio(1, 4)));
    assert.isTrue(Ratio.fromNumber(0.75).eq(ratio(3, 4)));
    assert.isTrue(Ratio.fromNumber(2).eq(ratio(2, 1)));
    assert.isTrue(Ratio.fromNumber(3).eq(ratio(3, 1)));
    assert.isTrue(Ratio.fromNumber(4).eq(ratio(4, 1)));

    assert.isTrue(Ratio.fromNumber(-1).eq(ratio(-1, 1)));
    assert.isTrue(Ratio.fromNumber(-0.25).eq(ratio(-1, 4)));
    assert.isTrue(Ratio.fromNumber(-4).eq(ratio(-4, 1)));

    assert.isTrue(Ratio.fromNumber(Number.MAX_SAFE_INTEGER).eq(ratio(Number.MAX_SAFE_INTEGER, 1)));
    assert.isTrue(Ratio.fromNumber(Number.MAX_VALUE).eq(ratio(Number.MAX_VALUE, 1)));
    assert.isTrue(Ratio.fromNumber(Number.MIN_VALUE).eq(ratio(1n, 2n ** (1023n + 51n))));

    assert.isTrue(
      Ratio.fromNumber(98304.000000000014551915228366851806640625).eq(ratio(6755399441055745n, 68719476736n))
    );
    assert.isTrue(
      Ratio.fromNumber(3.641632560655153838524711318314075469970703125).eq(ratio(128128555024897n, 35184372088832n))
    );

    assert.throws(() => Ratio.fromNumber(Number.NaN));
    assert.throws(() => Ratio.fromNumber(Number.POSITIVE_INFINITY));
    assert.throws(() => Ratio.fromNumber(Number.NEGATIVE_INFINITY));
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
