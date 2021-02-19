import { $, $$ } from '../utils/dom.js';
import { WINNINGS, LOTTO_PRICE } from '../utils/constants.js';

export default class ModalDisplay {
  constructor(props) {
    this.props = props;
    this.selectDOM();
    this.bindEvent();
    this.initState();
  }

  initState() {
    this.winners = this.props.winners;
    this.lottoCount = this.props.lottoCount;
    this.lottoProfit = 0;
  }

  selectDOM() {
    this.$target = $('.modal');
    this.$winnerCountsText = $$('.winner-count');
    this.$lottoProfitText = $('#lotto-profit');
    this.$lottoResultButton = $('.open-result-modal-button');
    this.$restartButton = $('#restart-btn');
  }
  onModalShow() {
    this.$target.classList.add('open');
  }
  onModalClose() {
    this.$target.classList.remove('open');
  }
  bindEvent() {
    this.$lottoResultButton.addEventListener(
      'click',
      this.onModalShow.bind(this),
    );
    this.$target.addEventListener('click', this.onModalClose.bind(this));
    this.$restartButton.addEventListener('click', this.onRestart.bind(this));
  }

  onRestart() {
    const { restart } = this.props;
    restart();
  }

  // winner 반환할때 정수로 반환하기, 로또 당첨 번호 입력안되어있으면 결과버튼 막기
  setState({ winners, lottoCount }) {
    this.winners = winners ?? this.winners;
    this.lottoCount = lottoCount ?? this.lottoCount;
    console.log(
      this.winners.map((winner, index) => WINNINGS[index] * Number(winner)),
    );
    this.lottoProfit =
      (this.winners
        .map((winner, index) => WINNINGS[index] * Number(winner))
        .reduce((a, b) => a + b, 0) /
        (this.lottoCount * LOTTO_PRICE)) *
      100;
    this.render();
  }

  render() {
    console.log(this.lottoProfit);
    this.$lottoProfitText.textContent = `당신의 총 수익률은 ${this.lottoProfit}%입니다.`;
    this.$winnerCountsText.forEach((textElement, index) => {
      textElement.textContent = `${this.winners[4 - index]}개`;
    });
  }
}
