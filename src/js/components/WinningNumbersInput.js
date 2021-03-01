import { lottoManager } from './App.js';
import { $, $$, clearInputValue, makeElement } from '../utils/dom.js';
import { isEmptyArray, isEmptyValue, isInRange } from '../utils/common.js';
import { ERROR_MESSAGE } from '../utils/message.js';
import { LOTTO } from '../utils/constants.js';

export default class WinningNumbersInput {
  constructor(props) {
    this.props = props;

    this.initDOM();
    this.selectDOM();
    this.bindEvent();
    this.subscribeAction();
  }

  initDOM() {
    const { $parent } = this.props;
    const $target = makeElement('form', {
      className: 'winning-number-input mt-9 d-none',
    });
    $target.innerHTML = WinningNumbersInputHTML;

    this.$target = $target;
    $parent.append(this.$target);
  }

  selectDOM() {
    this.$winningNumberInputs = $$('.winning-number', this.$target);
    this.$bonusNumberInput = $('.bonus-number', this.$target);
  }

  bindEvent() {
    this.$target.addEventListener('submit', e => {
      e.preventDefault();

      this.onShowWinningResult();
    });
  }

  onShowWinningResult() {
    const winningNumbers = this.$winningNumberInputs.map(({ value }) => value);
    const bonusNumber = this.$bonusNumberInput.value;

    const errorMessage = validateWinningNumbersInputValue(
      winningNumbers,
      bonusNumber,
    );
    if (errorMessage) {
      alert(errorMessage);
      return;
    }

    lottoManager.decideWinners(winningNumbers.map(Number), Number(bonusNumber));
  }

  render() {
    if (isEmptyArray(lottoManager.lottos)) {
      this.$target.classList.add('d-none');
      [...this.$winningNumberInputs, this.$bonusNumberInput].forEach(
        clearInputValue,
      );
      return;
    }

    this.$target.classList.remove('d-none');
  }

  subscribeAction() {
    lottoManager.subscribe(this.render.bind(this));
  }
}

const validateWinningNumbersInputValue = (winningNumbers, bonusNumber) => {
  const numbers = [...winningNumbers, bonusNumber].map(Number);

  if (winningNumbers.some(isEmptyValue) || isEmptyValue(bonusNumber)) {
    return ERROR_MESSAGE.EMPTY_INPUT_NUMBER;
  }

  if (
    numbers.some(number => !isInRange(number, LOTTO.MIN_NUM, LOTTO.MAX_NUM))
  ) {
    return ERROR_MESSAGE.OUT_OF_RANGE;
  }

  if (new Set(numbers).size !== numbers.length) {
    return ERROR_MESSAGE.DUPLICATED_NUMBER;
  }

  return '';
};

const WinningNumbersInputHTML = `
<label class="flex-auto d-inline-block mb-3">지난 주 당첨번호 6개와 보너스 넘버 1개를 입력해주세요.</label>
<div class="d-flex">
  <div>
    <h4 class="mt-0 mb-3 text-center">당첨 번호</h4>
    <div>
      <input type="number" min=1 max=45 class="winning-number mx-1 text-center" required/>
      <input type="number" min=1 max=45 class="winning-number mx-1 text-center" required/>
      <input type="number" min=1 max=45 class="winning-number mx-1 text-center" required/>
      <input type="number" min=1 max=45 class="winning-number mx-1 text-center" required/>
      <input type="number" min=1 max=45 class="winning-number mx-1 text-center" required/>
      <input type="number" min=1 max=45 class="winning-number mx-1 text-center" required/>
    </div>
  </div>
  <div class="flex-grow">
    <h4 class="mt-0 mb-3 text-center">보너스 번호</h4>
    <div class="d-flex justify-center">
      <input type="number" min=1 max=45 class="bonus-number text-center" required/>
    </div>
  </div>
</div>
<button type="submit" class="winning-number-input__result-btn mt-5 btn btn-cyan w-100">
  결과 확인하기
</button>
`;
