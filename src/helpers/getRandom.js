/* eslint-disable no-bitwise */
/* eslint-disable require-jsdoc */

const random = (n) => parseInt(Math.random() * (10 ** n), 10);

export default function GenerateOrdersNo() {
  const dt = new Date();
  const seed = dt.getYear() + dt.getDay()
    + dt.getMonth() + dt.getHours() + dt.getMinutes() + dt.getSeconds();
  const holdrand = ((seed * 214013 + 2531011) >> 16) & 0x7fff;
  const holdrand2 = ((holdrand * 214013 + 2531011) >> 16) & 0x7fff;
  return [holdrand, random(1), holdrand2, random(2)].join('');
}
