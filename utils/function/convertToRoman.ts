export function convertToRoman(number: number): string {
  const romanNumerals = [
    ['I', 'IV', 'V', 'IX'],
    ['X', 'XL', 'L', 'XC'],
    ['C', 'CD', 'D', 'CM'],
    ['M'],
  ];

  let result = '';
  let digit,
    divisor = 1000;

  for (let i = 3; i >= 0; i--) {
    digit = Math.floor(number / divisor);
    number %= divisor;
    divisor /= 10;

    if (digit !== 0) {
      if (digit === 9) {
        result += romanNumerals[i][3];
      } else if (digit >= 5) {
        result +=
          romanNumerals[i][2] +
          Array(digit - 5)
            .fill(romanNumerals[i][0])
            .join('');
      } else if (digit === 4) {
        result += romanNumerals[i][1];
      } else {
        result += Array(digit).fill(romanNumerals[i][0]).join('');
      }
    }
  }

  return result;
}
