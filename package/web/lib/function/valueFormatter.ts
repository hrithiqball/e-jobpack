export const valueFormatterPercentage = (number: number, postfix?: string) =>
  `${Intl.NumberFormat('us', { style: 'percent' }).format(number).toString()} ${postfix || ''}`;

export const valueFormatter = (
  number: number,
  prefix?: string,
  postfix?: string,
) =>
  `${prefix || ''} ${Intl.NumberFormat('us').format(number).toString()} ${postfix || ''}`;
