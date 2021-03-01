import { lottoManager } from './App.js';
import { isEmptyObject } from '../utils/common.js';
import {
  $,
  $$,
  makeElement,
  addClassNames,
  removeClassNames,
} from '../utils/dom.js';

export default class RewardModalDisplay {
  constructor(props) {
    this.props = props;

    this.initDOM();
    this.selectDOM();
    this.bindEvent();
    this.subscribeAction();
  }

  initDOM() {
    const { $parent } = this.props;

    const $target = makeElement('div', { className: 'modal' });
    $target.innerHTML = RewardModalHTML;

    this.$target = $target;
    $parent.append(this.$target);
  }

  selectDOM() {
    this.$restartButton = $('.modal__restart-btn', this.$target);
    this.$winningCountTexts = $$('[data-prize]', this.$target);
    this.$profitText = $('.modal__profit', this.$target);
    this.$closeButton = $('.modal__close-btn', this.$target);
  }

  bindEvent() {
    this.$restartButton.addEventListener('click', this.onRestart.bind(this));

    this.$closeButton.addEventListener('click', this.onModalClose.bind(this));
    this.$target.addEventListener('mousedown', ({ target }) => {
      if (target.closest('.modal-inner')) {
        return;
      }

      this.onModalClose();
    });
  }

  onRestart() {
    lottoManager.resetState();
  }

  onModalClose() {
    removeClassNames(this.$target, 'open');
  }

  onModalShow() {
    addClassNames(this.$target, 'open');
  }

  render() {
    if (isEmptyObject(lottoManager.winningResult)) {
      this.onModalClose();
      return;
    }

    this.onModalShow();
    this.$winningCountTexts.forEach($winningCountText => {
      const key = $winningCountText.getAttribute('data-prize');
      $winningCountText.textContent = `${lottoManager.winningResult[key]}개`;
    });
    this.$profitText.textContent = `당신의 총 수익률은 ${lottoManager
      .calculateProfitMargin()
      .toFixed(2)}% 입니다.`;
  }

  subscribeAction() {
    lottoManager.subscribe(this.render.bind(this));
  }
}

const RewardModalHTML = `
<div class="modal-inner p-10">
  <div class="modal__close-btn modal-close">
    <svg viewbox="0 0 40 40">
      <path class="close-x" d="M 10,10 L 30,30 M 30,10 L 10,30" />
    </svg>
  </div>

  <h2 class="text-center">🏆 당첨 통계 🏆</h2>
  <div class="d-flex justify-center">
    <table class="result-table border-collapse border border-black">
      <thead>
        <tr class="text-center">
          <th class="p-3">일치 갯수</th>
          <th class="p-3">당첨금</th>
          <th class="p-3">당첨 갯수</th>
        </tr>
      </thead>
      <tbody>
        <tr class="text-center">
          <td class="p-3">3개</td>
          <td class="p-3">5,000</td>
          <td data-prize="FIFTH" class="p-3">n개</td>
        </tr>
        <tr class="text-center">
          <td class="p-3">4개</td>
          <td class="p-3">50,000</td>
          <td data-prize="FOURTH" class="p-3">n개</td>
        </tr>
        <tr class="text-center">
          <td class="p-3">5개</td>
          <td class="p-3">1,500,000</td>
          <td data-prize="THIRD" class="p-3">n개</td>
        </tr>
        <tr class="text-center">
          <td class="p-3">5개 + 보너스볼</td>
          <td class="p-3">30,000,000</td>
          <td data-prize="SECOND" class="p-3">n개</td>
        </tr>
        <tr class="text-center">
          <td class="p-3">6개</td>
          <td class="p-3">2,000,000,000</td>
          <td data-prize="FIRST" class="p-3">n개</td>
        </tr>
      </tbody>
    </table>
  </div>
  <p class="modal__profit text-center font-bold">당신의 총 수익률은 %입니다.</p>
  <div class="d-flex justify-center mt-5">
    <button type="button" class="modal__restart-btn btn btn-cyan">다시 시작하기</button>
  </div>
</div>
`;
