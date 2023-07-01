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

  describe('parse', () => {
    describe('fractionNumber', () => {
      it('binary', () => {
        assert.isTrue(Ratio.parse('0b1/0b101').eq(ratio(0b1, 0b101)));
        assert.isTrue(Ratio.parse('-0b1/0b101').eq(ratio(-0b1, 0b101)));
        assert.isTrue(Ratio.parse('0b101/0b1').eq(ratio(0b101)));
        assert.isTrue(Ratio.parse('-0b101/1').eq(ratio(-0b101)));
        assert.isTrue(Ratio.parse('0b101.010/0b10.101').eq(ratio(0b101010, 0b10101)));
        assert.isTrue(Ratio.parse('0b101.010/0b101').eq(ratio(0b101010, 0b101000)));
        assert.isTrue(Ratio.parse('0b101/0b10.101').eq(ratio(0b101000, 0b10101)));
        assert.throws(() => Ratio.parse('0b101/0b0'));
        assert.throws(() => Ratio.parse('0b2/0b1'));
      });

      it('octal', () => {
        assert.isTrue(Ratio.parse('0o1/0o147').eq(ratio(0o1, 0o147)));
        assert.isTrue(Ratio.parse('-0o1/0o147').eq(ratio(-0o1, 0o147)));
        assert.isTrue(Ratio.parse('0o756/0o1').eq(ratio(0o756)));
        assert.isTrue(Ratio.parse('-0o756/1').eq(ratio(-0o756)));
        assert.isTrue(Ratio.parse('0o123.456/0o134.567').eq(ratio(0o123456, 0o134567)));
        assert.isTrue(Ratio.parse('0o123.456/0o147').eq(ratio(0o123456, 0o147000)));
        assert.isTrue(Ratio.parse('0o123/0o147.345').eq(ratio(0o123000, 0o147345)));
        assert.throws(() => Ratio.parse('0o6/0o0'));
        assert.throws(() => Ratio.parse('0o8/0o1'));
      });

      it('decimal', () => {
        assert.isTrue(Ratio.parse('1/3').eq(ratio(1, 3)));
        assert.isTrue(Ratio.parse('-1/3').eq(ratio(-1, 3)));
        assert.isTrue(Ratio.parse('7/1').eq(ratio(7)));
        assert.isTrue(Ratio.parse('-7/1').eq(ratio(-7)));
        assert.isTrue(Ratio.parse('1/4.56').eq(ratio(100, 456)));
        assert.isTrue(Ratio.parse('1.23/4').eq(ratio(123, 400)));
        assert.isTrue(Ratio.parse('12/4.56').eq(ratio(1200, 456)));
        assert.isTrue(Ratio.parse('7e2/6e1').eq(ratio(700, 60)));
        assert.isTrue(Ratio.parse('1.23e3/4.56e5').eq(ratio(1230, 456000)));
        assert.throws(() => Ratio.parse('5/0'));
      });

      it('hex', () => {
        assert.isTrue(Ratio.parse('0x1/0x17f').eq(ratio(0x1, 0x17f)));
        assert.isTrue(Ratio.parse('-0x1/0x17F').eq(ratio(-0x1, 0x17f)));
        assert.isTrue(Ratio.parse('0x49C/0x1').eq(ratio(0x49c)));
        assert.isTrue(Ratio.parse('-0x156/1').eq(ratio(-0x156)));
        assert.isTrue(Ratio.parse('0x89A.BCD/0x567.89A').eq(ratio(0x89abcd, 0x56789a)));
        assert.isTrue(Ratio.parse('0x789.ABC/0xFAB').eq(ratio(0x789abc, 0xfab000)));
        assert.throws(() => Ratio.parse('0xf/0x0'));
        assert.throws(() => Ratio.parse('0xg/0x1'));
      });

      it('mixed', () => {
        assert.isTrue(Ratio.parse('0b10101/0o12345').eq(ratio(0b10101, 0o12345)));
        assert.isTrue(Ratio.parse('0b10101/56789').eq(ratio(0b10101, 56789)));
        assert.isTrue(Ratio.parse('0b10101/0xABCDE').eq(ratio(0b10101, 0xabcde)));
        assert.isTrue(Ratio.parse('0o12345/0b10101').eq(ratio(0o12345, 0b10101)));
        assert.isTrue(Ratio.parse('0o12345/56789').eq(ratio(0o12345, 56789)));
        assert.isTrue(Ratio.parse('0o12345/0xABCDE').eq(ratio(0o12345, 0xabcde)));
        assert.isTrue(Ratio.parse('56789/0b10101').eq(ratio(56789, 0b10101)));
        assert.isTrue(Ratio.parse('56789/0o12345').eq(ratio(56789, 0o12345)));
        assert.isTrue(Ratio.parse('56789/0xABCDE').eq(ratio(56789, 0xabcde)));
        assert.isTrue(Ratio.parse('0xABCDE/0b10101').eq(ratio(0xabcde, 0b10101)));
        assert.isTrue(Ratio.parse('0xABCDE/56789').eq(ratio(0xabcde, 56789)));
        assert.isTrue(Ratio.parse('0xABCDE/0o12345').eq(ratio(0xabcde, 0o12345)));
      });
    });

    describe('pointNumber', () => {
      it('binary', () => {
        assert.isTrue(Ratio.parse('0b0.1').eq(ratio(0b1, 2 ** 1)));
        assert.isTrue(Ratio.parse('0b10.01').eq(ratio(0b1001, 2 ** 2)));
        assert.isTrue(Ratio.parse('-0b1.111').eq(ratio(-0b1111, 2 ** 3)));
        assert.isTrue(Ratio.parse('-0b1.010(1)').eq(ratio(-0b1011, 2 ** 3)));
        assert.isTrue(Ratio.parse('0b0.(1)').eq(ratio(1)));
        assert.isTrue(Ratio.parse('0b101.(0)').eq(ratio(0b101)));
        assert.isTrue(Ratio.parse('-0b1.(101)').eq(ratio(-0b1100, 2 ** 3 - 1)));
      });

      it('octal', () => {
        assert.isTrue(Ratio.parse('0o0.7').eq(ratio(0o7, 8 ** 1)));
        assert.isTrue(Ratio.parse('0o45.67').eq(ratio(0o4567, 8 ** 2)));
        assert.isTrue(Ratio.parse('-0o3.456').eq(ratio(-0o3456, 8 ** 3)));
        assert.isTrue(Ratio.parse('0o0.34(5)').eq(ratio(0o311, 8 ** 2 * (8 ** 1 - 1))));
        assert.isTrue(Ratio.parse('0o0.(5)').eq(ratio(0o5, 8 ** 1 - 1)));
        assert.isTrue(Ratio.parse('0o567.(1)').eq(ratio(0o5102, 8 ** 1 - 1)));
        assert.isTrue(Ratio.parse('-0o123.(456)').eq(ratio(-0o123333, 8 ** 3 - 1)));
      });

      it('decimal', () => {
        assert.isTrue(Ratio.parse('0.1').eq(ratio(1, 10)));
        assert.isTrue(Ratio.parse('-1.2').eq(ratio(-12, 10)));
        assert.isTrue(Ratio.parse('0.(3)').eq(ratio(1, 3)));
        assert.isTrue(Ratio.parse('-1.2(3)').eq(ratio(-111, 90)));
        assert.isTrue(Ratio.parse('0.(102)').eq(ratio(34, 333)));
        assert.isTrue(Ratio.parse('12.3(45)e3').eq(ratio(12222 * 10 ** 3, 10 * (10 ** 2 - 1))));
      });

      it('hex', () => {
        assert.isTrue(Ratio.parse('0x0.a').eq(ratio(0xa, 16)));
        assert.isTrue(Ratio.parse('-0x1.2').eq(ratio(-0x12, 16)));
        assert.isTrue(Ratio.parse('0x0.(b)').eq(ratio(0xb, 16 ** 1 - 1)));
        assert.isTrue(Ratio.parse('-0xa.b(c)').eq(ratio(-0xa11, 16 ** 1 * (16 ** 1 - 1))));
        assert.isTrue(Ratio.parse('0x0.(abc)').eq(ratio(0xabc, 16 ** 3 - 1)));
      });
    });
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

  it('gt', () => {
    assert.isTrue(ratio(10n ** 10n, 1).gt(ratio(10n ** 10n - 1n, 1)));
    assert.isTrue(ratio(2, 3).gt(ratio(4, 7)));
    assert.isTrue(ratio(2, 3).gt(ratio(0)));
    assert.isTrue(ratio(0).gt(ratio(-2, 3)));
    assert.isTrue(ratio(-4, 7).gt(ratio(-2, 3)));
    assert.isTrue(ratio(-(10n ** 10n - 1n), 1).gt(ratio(-(10n ** 10n), 1)));

    assert.isFalse(ratio(10n ** 10n, 1).gt(ratio(10n ** 10n, 1)));
    assert.isFalse(ratio(10n ** 10n - 1n, 1).gt(ratio(10n ** 10n, 1)));
    assert.isFalse(ratio(4, 7).gt(ratio(4, 7)));
    assert.isFalse(ratio(4, 7).gt(ratio(2, 3)));
    assert.isFalse(ratio(0).gt(ratio(0)));
    assert.isFalse(ratio(-2, 3).gt(ratio(-4, 7)));
    assert.isFalse(ratio(-4, 7).gt(ratio(-4, 7)));
    assert.isFalse(ratio(-(10n ** 10n), 1).gt(ratio(-(10n ** 10n - 1n), 1)));
    assert.isFalse(ratio(-(10n ** 10n), 1).gt(ratio(-(10n ** 10n), 1)));
  });

  it('geq', () => {
    assert.isTrue(ratio(10n ** 10n, 1).geq(ratio(10n ** 10n, 1)));
    assert.isTrue(ratio(10n ** 10n, 1).geq(ratio(10n ** 10n - 1n, 1)));
    assert.isTrue(ratio(4, 7).geq(ratio(4, 7)));
    assert.isTrue(ratio(2, 3).geq(ratio(4, 7)));
    assert.isTrue(ratio(2, 3).geq(ratio(0)));
    assert.isTrue(ratio(0).geq(ratio(0)));
    assert.isTrue(ratio(0).geq(ratio(-2, 3)));
    assert.isTrue(ratio(-4, 7).geq(ratio(-2, 3)));
    assert.isTrue(ratio(-4, 7).geq(ratio(-4, 7)));
    assert.isTrue(ratio(-(10n ** 10n - 1n), 1).geq(ratio(-(10n ** 10n), 1)));
    assert.isTrue(ratio(-(10n ** 10n), 1).geq(ratio(-(10n ** 10n), 1)));

    assert.isFalse(ratio(10n ** 10n - 1n, 1).geq(ratio(10n ** 10n, 1)));
    assert.isFalse(ratio(4, 7).geq(ratio(2, 3)));
    assert.isFalse(ratio(-2, 3).geq(ratio(-4, 7)));
    assert.isFalse(ratio(-(10n ** 10n), 1).geq(ratio(-(10n ** 10n - 1n), 1)));
  });

  it('lt', () => {
    assert.isTrue(ratio(10n ** 10n - 1n, 1).lt(ratio(10n ** 10n, 1)));
    assert.isTrue(ratio(4, 7).lt(ratio(2, 3)));
    assert.isTrue(ratio(0).lt(ratio(2, 3)));
    assert.isTrue(ratio(-2, 3).lt(ratio(0)));
    assert.isTrue(ratio(-2, 3).lt(ratio(-4, 7)));
    assert.isTrue(ratio(-(10n ** 10n), 1).lt(ratio(-(10n ** 10n - 1n), 1)));

    assert.isFalse(ratio(10n ** 10n, 1).lt(ratio(10n ** 10n, 1)));
    assert.isFalse(ratio(10n ** 10n, 1).lt(ratio(10n ** 10n - 1n, 1)));
    assert.isFalse(ratio(4, 7).lt(ratio(4, 7)));
    assert.isFalse(ratio(2, 3).lt(ratio(4, 7)));
    assert.isFalse(ratio(0).lt(ratio(0)));
    assert.isFalse(ratio(-4, 7).lt(ratio(-2, 3)));
    assert.isFalse(ratio(-4, 7).lt(ratio(-4, 7)));
    assert.isFalse(ratio(-(10n ** 10n - 1n), 1).lt(ratio(-(10n ** 10n), 1)));
    assert.isFalse(ratio(-(10n ** 10n), 1).lt(ratio(-(10n ** 10n), 1)));
  });

  it('leq', () => {
    assert.isTrue(ratio(10n ** 10n, 1).leq(ratio(10n ** 10n, 1)));
    assert.isTrue(ratio(10n ** 10n - 1n, 1).leq(ratio(10n ** 10n, 1)));
    assert.isTrue(ratio(4, 7).leq(ratio(4, 7)));
    assert.isTrue(ratio(4, 7).leq(ratio(2, 3)));
    assert.isTrue(ratio(0).leq(ratio(2, 3)));
    assert.isTrue(ratio(0).leq(ratio(0)));
    assert.isTrue(ratio(-2, 3).leq(ratio(0)));
    assert.isTrue(ratio(-2, 3).leq(ratio(-4, 7)));
    assert.isTrue(ratio(-4, 7).leq(ratio(-4, 7)));
    assert.isTrue(ratio(-(10n ** 10n), 1).leq(ratio(-(10n ** 10n - 1n), 1)));
    assert.isTrue(ratio(-(10n ** 10n), 1).leq(ratio(-(10n ** 10n), 1)));

    assert.isFalse(ratio(10n ** 10n, 1).leq(ratio(10n ** 10n - 1n, 1)));
    assert.isFalse(ratio(2, 3).leq(ratio(4, 7)));
    assert.isFalse(ratio(-4, 7).leq(ratio(-2, 3)));
    assert.isFalse(ratio(-(10n ** 10n - 1n), 1).leq(ratio(-(10n ** 10n), 1)));
  });
});

describe('floor, ceil, trunc', () => {
  it('floor', () => {
    assert.equal(ratio(10n ** 10n).floor(), 10n ** 10n);
    assert.equal(ratio(1).floor(), 1n);
    assert.equal(ratio(0).floor(), 0n);
    assert.equal(ratio(-1).floor(), -1n);
    assert.equal(ratio(-(10n ** 10n)).floor(), -(10n ** 10n));

    assert.equal(ratio(9, 10).floor(), 0n);
    assert.equal(ratio(10, 10).floor(), 1n);
    assert.equal(ratio(11, 10).floor(), 1n);

    assert.equal(ratio(-9, 10).floor(), -1n);
    assert.equal(ratio(-10, 10).floor(), -1n);
    assert.equal(ratio(-11, 10).floor(), -2n);
  });

  it('ceil', () => {
    assert.equal(ratio(10n ** 10n).ceil(), 10n ** 10n);
    assert.equal(ratio(1).ceil(), 1n);
    assert.equal(ratio(0).ceil(), 0n);
    assert.equal(ratio(-1).ceil(), -1n);
    assert.equal(ratio(-(10n ** 10n)).ceil(), -(10n ** 10n));

    assert.equal(ratio(9, 10).ceil(), 1n);
    assert.equal(ratio(10, 10).ceil(), 1n);
    assert.equal(ratio(11, 10).ceil(), 2n);

    assert.equal(ratio(-9, 10).ceil(), 0n);
    assert.equal(ratio(-10, 10).ceil(), -1n);
    assert.equal(ratio(-11, 10).ceil(), -1n);
  });

  it('trunc', () => {
    assert.equal(ratio(10n ** 10n).trunc(), 10n ** 10n);
    assert.equal(ratio(1).trunc(), 1n);
    assert.equal(ratio(0).trunc(), 0n);
    assert.equal(ratio(-1).trunc(), -1n);
    assert.equal(ratio(-(10n ** 10n)).trunc(), -(10n ** 10n));

    assert.equal(ratio(9, 10).trunc(), 0n);
    assert.equal(ratio(10, 10).trunc(), 1n);
    assert.equal(ratio(11, 10).trunc(), 1n);

    assert.equal(ratio(-9, 10).trunc(), 0n);
    assert.equal(ratio(-10, 10).trunc(), -1n);
    assert.equal(ratio(-11, 10).trunc(), -1n);
  });
});
