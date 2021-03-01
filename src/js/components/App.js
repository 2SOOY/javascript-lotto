import LottoPurchaseInput from './LottoPurchaseInput.js';
import LottoDisplay from './LottoDisplay.js';
import WinningNumbersInput from './WinningNumbersInput.js';
import RewardModalDisplay from './RewardModalDisplay.js';
import LottoManager from '../model/LottoManager.js';
import { $ } from '../utils/dom.js';

export const lottoManager = new LottoManager([]);
export default class App {
  constructor($root) {
    this.$target = $root;
  }

  execute() {
    this.initDOM();
    this.selectDOM();
    this.mountComponent();
  }

  initDOM() {
    this.$target.innerHTML = AppHTML;
  }

  selectDOM() {
    this.$container = $('.app-container', this.$target);
  }

  mountComponent() {
    this.lottoPurchaseInput = new LottoPurchaseInput({
      $parent: this.$container,
    });
    this.lottoDisplay = new LottoDisplay({ $parent: this.$container });
    this.winningNumbersInput = new WinningNumbersInput({
      $parent: this.$container,
    });
    this.modalDisplay = new RewardModalDisplay({ $parent: this.$target });
  }
}

const AppHTML = `
<div class="d-flex justify-center mt-5">
  <div class="app-container w-100">
    <h1 class="text-center">🎱 행운의 로또</h1>
  </div>
</div>
`;
