const minNormalNumber = 2.2250738585072014e-308;

function isNormalNumber(value: number): boolean {
  if (Number.isNaN(value)) return false;
  if (!Number.isFinite(value)) return false;
  return minNormalNumber <= Math.abs(value);
}

export { isNormalNumber };
