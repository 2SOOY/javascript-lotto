import {
  LOTTO_LENGTH,
  MIN_LOTTO_NUMBER,
  MAX_LOTTO_NUMBER,
} from './constants.js';

const generateRandomNumber = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const sortNumbers = numbers => numbers.sort((a, b) => a - b);

export const divide = (a, b) => Math.floor(a / b);

export const mod = (a, b) => a % b;

export const generateLottoNumbers = () => {
  const lottoNumbers = new Set();
  while (lottoNumbers.size < LOTTO_LENGTH) {
    lottoNumbers.add(generateRandomNumber(MIN_LOTTO_NUMBER, MAX_LOTTO_NUMBER));
  }

  return sortNumbers([...lottoNumbers]);
};

export const isValidLottoNumbers = numbers =>
  numbers.length === LOTTO_LENGTH && new Set(numbers).size === numbers.length;

export const decideWinners = (lotto, winningNumbers) => {
  let count = 0;
  lotto.numbers.forEach(number => {
    if (winningNumbers.numbers.includes(number)) count++;
  });
  if (count === 6) {
    return 1;
  } else if (count === 5) {
    if (lotto.numbers.includes(winningNumbers.bonusNumber)) return 2;
    return 3;
  } else if (count === 4) return 4;
  else if (count === 3) return 5;
  return 6;
};
