import { $, $$, clearInputValue } from '../utils/dom.js';
import { decideWinners } from '../utils/lotto.js';
import { WINNINGS } from '../utils/constants.js';

export default class winningNumbersInput {
  constructor(props) {
    this.selectDOM();
    this.props = props;
    this.lottos = this.props.lottos;
    this.winningNumbers = { numbers: [], bonusNumber: 0 };
    this.winners = [];
    // this.lottoProfit = 0;
    this.bindEvent();
  }

  selectDOM() {
    this.$target = $('#winning-numbers-input');
    this.$winningNumbers = $$('.winning-number');
    this.$bonusNumber = $('.bonus-number-container .bonus-number');
    this.$lottoResultButton = $('.open-result-modal-button');

    console.log(this.$target);
  }

  bindEvent() {
    this.$lottoResultButton.addEventListener(
      'click',
      this.handleLottoResultButton.bind(this),
    );
  }

  setState({ lottos }) {
    this.lottos = lottos ?? this.lottos;

    this.render();
  }

  render() {
    if (this.lottos.length) {
      this.$target.classList.remove('hidden');
      [...this.$winningNumbers, this.$bonusNumber].forEach(clearInputValue);
    } else {
      this.$target.classList.add('hidden');
    }
  }

  handleLottoResultButton() {
    const { createWinners } = this.props;
    if (
      // 1~45 체크기능 추가, 중복 체크 추가
      !(
        [...this.$winningNumbers].every(node =>
          Number.isInteger(Number(node.value)),
        ) && Number.isInteger(Number(this.$bonusNumber.value))
      )
    ) {
      return;
    }

    this.winningNumbers = { numbers: [], bonusNumber: 0 };
    this.$winningNumbers.forEach(node => {
      // 네이밍 바꾸기
      this.winningNumbers.numbers.push(Number(node.value));
    });

    this.winningNumbers.bonusNumber = Number(this.$bonusNumber.value);

    createWinners(this.winningNumbers);
  }
}
