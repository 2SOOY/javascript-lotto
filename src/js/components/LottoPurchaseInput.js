import { lottoManager } from './App.js';
import {
  $,
  makeElement,
  clearInputValue,
  disableElements,
  enableElements,
} from '../utils/dom.js';
import { LOTTO } from '../utils/constants.js';
import { mod, divide, isEmptyArray } from '../utils/common.js';
import { ERROR_MESSAGE, GUIDE_MESSAGE } from '../utils/message.js';

export default class LottoPurchaseInput {
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
      className: 'lotto-purchase-input mt-5',
    });
    $target.innerHTML = LottoPurchaseInputHTML;

    this.$target = $target;
    $parent.append(this.$target);
  }

  selectDOM() {
    this.$purchaseInput = $('.lotto-purchase-input__input', this.$target);
    this.$purchaseButton = $('.lotto-purchase-input__btn', this.$target);
  }

  bindEvent() {
    this.$target.addEventListener('submit', e => {
      e.preventDefault();
      this.onPurchaseLotto();
    });
  }

  onPurchaseLotto() {
    const purchaseInputValue = this.$purchaseInput.value.trim();
    const payment = Number(purchaseInputValue);

    const errorMessage = validatePurchaseInputValue(payment);
    if (errorMessage) {
      alert(errorMessage);
      clearInputValue(this.$purchaseInput);
      return;
    }

    const lottoCount = divide(payment, LOTTO.PRICE);
    const remainingMoney = mod(payment, LOTTO.PRICE);
    alert(GUIDE_MESSAGE.PAYMENT_RESULT_MESSAGE(lottoCount, remainingMoney));

    disableElements(this.$purchaseInput, this.$purchaseInput);
    lottoManager.createLottos(lottoCount);
  }

  reset() {
    if (isEmptyArray(lottoManager.lottos)) {
      clearInputValue(this.$purchaseInput);
      enableElements(this.$purchaseInput, this.$purchaseButton);
    }
  }

  subscribeAction() {
    lottoManager.subscribe(this.reset.bind(this));
  }
}

const validatePurchaseInputValue = payment => {
  if (payment < LOTTO.PRICE) {
    return ERROR_MESSAGE.PAYMENT_AMOUNT;
  }
};

const LottoPurchaseInputHTML = `
<label class="mb-2 d-inline-block">구입할 금액을 입력해주세요.</label>
<div class="d-flex">
  <input
    type="number"
    class="lotto-purchase-input__input w-100 mr-2 pl-2"
    placeholder="구입 금액"
    autofocus
    required
    />
  <button type="submit" class="lotto-purchase-input__btn btn btn-cyan">확인</button>
</div>
`;
