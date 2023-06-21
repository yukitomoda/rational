import { assert } from 'chai';
import { it, describe } from 'mocha';
import { bitAt, bitOff, bitOn, countDigits, even, gcd, lcm, odd, roundTo } from '../src/BigMath';

describe('even,odd', () => {
  it('even', () => {
    assert.isTrue(even(2n));
    assert.isTrue(even(2n * 3n));
    assert.isTrue(even(2n * 3n * 5n));
    assert.isTrue(even(2n * 3n * 5n * 7n));

    assert.isFalse(even(1n));
    assert.isFalse(even(3n));
    assert.isFalse(even(3n * 5n));
    assert.isFalse(even(3n * 5n * 7n));
  });

  it('odd', () => {
    assert.isTrue(odd(1n));
    assert.isTrue(odd(3n));
    assert.isTrue(odd(3n * 5n));
    assert.isTrue(odd(3n * 5n * 7n));

    assert.isFalse(odd(2n));
    assert.isFalse(odd(2n * 3n));
    assert.isFalse(odd(2n * 3n * 5n));
    assert.isFalse(odd(2n * 3n * 5n * 7n));
  });
});

describe('gcd', () => {
  it('互いに素な二数のGCD', () => {
    assert.equal(gcd(1n, 24n), 1n);
    assert.equal(gcd(24n, 1n), 1n);
    assert.equal(gcd(3n, 7n), 1n);
    assert.equal(gcd(7n, 3n), 1n);
    assert.equal(gcd(2n ** 5n, 3n ** 5n), 1n);
    assert.equal(gcd(3n ** 5n, 2n ** 5n), 1n);
  });

  it('互いに素でない二数のGCD', () => {
    assert.equal(gcd(7n * 11n, 7n * 11n * 13n), 7n * 11n);
    assert.equal(gcd(7n * 11n * 13n, 7n * 11n), 7n * 11n);
    assert.equal(gcd(7n * 11n, 7n * 13n), 7n);
    assert.equal(gcd(7n * 13n, 7n * 11n), 7n);
    assert.equal(gcd(7n * 11n * 13n, 7n * 11n * 17n), 7n * 11n);
    assert.equal(gcd(7n * 11n * 17n, 7n * 11n * 13n), 7n * 11n);
    assert.equal(gcd(2n ** 5n * 3n ** 4n, 2n ** 4n * 3n ** 5n * 5n ** 5n), 2n ** 4n * 3n ** 4n);
    assert.equal(gcd(2n ** 4n * 3n ** 4n, 2n ** 5n * 3n ** 5n * 5n ** 5n), 2n ** 4n * 3n ** 4n);
    assert.equal(gcd(2n ** 5n * 3n ** 5n, 2n ** 4n * 3n ** 4n * 5n ** 5n), 2n ** 4n * 3n ** 4n);
    assert.equal(gcd(2n ** 5n * 3n ** 5n, 2n ** 5n * 3n ** 5n * 5n ** 5n), 2n ** 5n * 3n ** 5n);
  });

  it('負の数のGCDは絶対値を用いて計算する', () => {
    assert.equal(gcd(-7n * 11n, 7n * 11n * 13n), 7n * 11n);
    assert.equal(gcd(7n * 11n * 13n, -7n * 11n), 7n * 11n);
    assert.equal(gcd(-7n * 11n, 7n * 13n), 7n);
    assert.equal(gcd(7n * 13n, -7n * 11n), 7n);
    assert.equal(gcd(-7n * 11n * 13n, 7n * 11n * 17n), 7n * 11n);
    assert.equal(gcd(7n * 11n * 17n, -7n * 11n * 13n), 7n * 11n);
  });
});

describe('lcm', () => {
  it('互いに素な二数のLCM', () => {
    assert.equal(lcm(1n, 24n), 24n);
    assert.equal(lcm(24n, 1n), 24n);
    assert.equal(lcm(3n, 7n), 3n * 7n);
    assert.equal(lcm(7n, 3n), 3n * 7n);
    assert.equal(lcm(2n ** 5n, 3n ** 5n), 2n ** 5n * 3n ** 5n);
    assert.equal(lcm(3n ** 5n, 2n ** 5n), 2n ** 5n * 3n ** 5n);
  });

  it('互いに素でない二数のlcm', () => {
    assert.equal(lcm(7n * 11n, 7n * 11n * 13n), 7n * 11n * 13n);
    assert.equal(lcm(7n * 11n * 13n, 7n * 11n), 7n * 11n * 13n);
    assert.equal(lcm(7n * 11n, 7n * 13n), 7n * 11n * 13n);
    assert.equal(lcm(7n * 13n, 7n * 11n), 7n * 11n * 13n);
    assert.equal(lcm(7n * 11n * 13n, 7n * 11n * 17n), 7n * 11n * 13n * 17n);
    assert.equal(lcm(7n * 11n * 17n, 7n * 11n * 13n), 7n * 11n * 13n * 17n);
    assert.equal(lcm(2n ** 5n * 3n ** 4n, 2n ** 4n * 3n ** 5n * 5n ** 5n), 2n ** 5n * 3n ** 5n * 5n ** 5n);
    assert.equal(lcm(2n ** 4n * 3n ** 4n, 2n ** 5n * 3n ** 5n * 5n ** 5n), 2n ** 5n * 3n ** 5n * 5n ** 5n);
    assert.equal(lcm(2n ** 5n * 3n ** 5n, 2n ** 4n * 3n ** 4n * 5n ** 5n), 2n ** 5n * 3n ** 5n * 5n ** 5n);
    assert.equal(lcm(2n ** 5n * 3n ** 5n, 2n ** 5n * 3n ** 5n * 5n ** 5n), 2n ** 5n * 3n ** 5n * 5n ** 5n);
  });

  it('負の数のlcmは絶対値を用いて計算する', () => {
    assert.equal(lcm(-7n * 11n, 7n * 11n * 13n), 7n * 11n * 13n);
    assert.equal(lcm(7n * 11n * 13n, -7n * 11n), 7n * 11n * 13n);
    assert.equal(lcm(-7n * 11n, 7n * 13n), 7n * 11n * 13n);
    assert.equal(lcm(7n * 13n, -7n * 11n), 7n * 11n * 13n);
    assert.equal(lcm(-7n * 11n * 13n, 7n * 11n * 17n), 7n * 11n * 13n * 17n);
    assert.equal(lcm(7n * 11n * 17n, -7n * 11n * 13n), 7n * 11n * 13n * 17n);
  });
});

describe('bitAt, bitOn, bitOff', () => {
  it('bitAt', () => {
    assert.isTrue(bitAt(1n << 0n, 0));
    assert.isTrue(bitAt(1n << 1n, 1));
    assert.isTrue(bitAt(1n << 5n, 5));
    assert.isFalse(bitAt(1n << 5n, 0));
    assert.isFalse(bitAt(1n << 5n, 1));
    assert.isFalse(bitAt(1n << 5n, 4));
  });

  it('bitOn', () => {
    assert.equal(bitOn(0n, 0), 1n);
    assert.equal(bitOn(0n, 1), 2n);
    assert.equal(bitOn(0n, 2), 4n);
    assert.equal(bitOn(0n, 3), 8n);
    assert.equal(bitOn(1n, 0), 1n);
    assert.equal(bitOn(1n, 1), 3n);
    assert.equal(bitOn(7n, 0), 7n);
    assert.equal(bitOn(7n, 1), 7n);
    assert.equal(bitOn(7n, 2), 7n);
    assert.equal(bitOn(7n, 3), 15n);
  });

  it('bitOff', () => {
    assert.equal(bitOff(0n, 0), 0n);
    assert.equal(bitOff(0n, 1), 0n);
    assert.equal(bitOff(0n, 2), 0n);
    assert.equal(bitOff(0n, 3), 0n);
    assert.equal(bitOff(1n, 0), 0n);
    assert.equal(bitOff(1n, 1), 1n);
    assert.equal(bitOff(7n, 0), 6n);
    assert.equal(bitOff(7n, 1), 5n);
    assert.equal(bitOff(7n, 2), 3n);
    assert.equal(bitOff(7n, 3), 7n);
  });
});

describe('roundTo', () => {
  it('正の数の丸め', () => {
    assert.equal(roundTo(10n, 1), 10n);
    assert.equal(roundTo(11n, 1), 10n);
    assert.equal(roundTo(14n, 1), 10n);
    assert.equal(roundTo(15n, 1), 20n);
    assert.equal(roundTo(16n, 1), 20n);
    assert.equal(roundTo(20n, 1), 20n);
    assert.equal(roundTo(21n, 1), 20n);
    assert.equal(roundTo(25n, 1), 30n);

    assert.equal(roundTo(1300n, 2), 1300n);
    assert.equal(roundTo(1349n, 2), 1300n);
    assert.equal(roundTo(1350n, 2), 1400n);
    assert.equal(roundTo(1351n, 2), 1400n);
    assert.equal(roundTo(1400n, 2), 1400n);
  });

  it('負の数の丸めはちょうど中間のとき正の無限大方向へ丸める', () => {
    assert.equal(roundTo(-10n, 1), -10n);
    assert.equal(roundTo(-11n, 1), -10n);
    assert.equal(roundTo(-14n, 1), -10n);
    assert.equal(roundTo(-15n, 1), -20n);
    assert.equal(roundTo(-16n, 1), -20n);
    assert.equal(roundTo(-20n, 1), -20n);
    assert.equal(roundTo(-21n, 1), -20n);
    assert.equal(roundTo(-25n, 1), -30n);

    assert.equal(roundTo(-1300n, 2), -1300n);
    assert.equal(roundTo(-1349n, 2), -1300n);
    assert.equal(roundTo(-1350n, 2), -1400n);
    assert.equal(roundTo(-1351n, 2), -1400n);
    assert.equal(roundTo(-1400n, 2), -1400n);
  });
});

describe('countDigits', () => {
  it('10進法表記の桁数', () => {
    assert.equal(countDigits(9999n), 4);
    assert.equal(countDigits(10000n), 5);
    assert.equal(countDigits(10001n), 5);
    assert.equal(countDigits(999999999999n), 12);
    assert.equal(countDigits(1000000000000n), 13);
  });

  it('負の数の10進法表記の桁数', () => {
    assert.equal(countDigits(-9999n), 4);
    assert.equal(countDigits(-10000n), 5);
    assert.equal(countDigits(-10001n), 5);
    assert.equal(countDigits(-999999999999n), 12);
    assert.equal(countDigits(-1000000000000n), 13);
  });

  it('16進法表記の桁数', () => {
    assert.equal(countDigits(0xffffn, 16), 4);
    assert.equal(countDigits(0x10000n, 16), 5);
    assert.equal(countDigits(0x10001n, 16), 5);
    assert.equal(countDigits(0xffffffffffffn, 16), 12);
    assert.equal(countDigits(0x1000000000000n, 16), 13);
  });
});
