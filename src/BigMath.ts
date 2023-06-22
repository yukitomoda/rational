function abs(value: bigint): bigint {
  return value < 0 ? -value : value;
}

function even(value: bigint): boolean {
  return (value & 1n) === 0n;
}

function odd(value: bigint): boolean {
  return (value & 1n) !== 0n;
}

function gcd(lhs: bigint, rhs: bigint): bigint {
  if (lhs === 0n) return rhs;
  if (rhs === 0n) return lhs;
  let x = abs(lhs);
  let y = abs(rhs);
  let k = 0;
  while (even(x) && even(y)) {
    k++;
    x >>= 1n;
    y >>= 1n;
  }

  let z = odd(x) ? -y : x;

  while (z !== 0n) {
    while (even(z)) {
      z >>= 1n;
    }

    if (z > 0) {
      x = z;
    } else {
      y = -z;
    }
    z = x - y;
  }

  return (1n << BigInt(k)) * x;
}

function lcm(lhs: bigint, rhs: bigint): bigint {
  return abs((lhs * rhs) / gcd(lhs, rhs));
}

function bitAt(value: bigint, pos: number): boolean {
  return (value & (1n << BigInt(pos))) !== 0n;
}

function bitOn(value: bigint, pos: number): bigint {
  return (value |= 1n << BigInt(pos));
}

function bitOff(value: bigint, pos: number): bigint {
  const mask = 1n << BigInt(pos);
  return (value & mask) !== 0n ? value - mask : value;
}

function roundTo(value: bigint, exponent: number | bigint, base: number | bigint = 10): bigint {
  const absValue = abs(value);
  const divisor = BigInt(base) ** BigInt(exponent);
  const remainder = absValue % divisor;
  const roundUp = divisor <= remainder * 2n;
  const absResult = roundUp ? absValue - remainder + divisor : absValue - remainder;
  return value < 0 ? -absResult : absResult;
}

function countDigits(value: bigint, base: number | bigint = 10): number {
  base = BigInt(base);
  value = abs(value);
  let n = 1;
  while ((value /= base) !== 0n) {
    n++;
  }
  return n;
}

export { abs, even, odd, gcd, lcm, bitAt, bitOn, bitOff, roundTo, countDigits };
