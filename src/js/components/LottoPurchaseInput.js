import { $, clearInput } from '../utils/dom.js';
import { LOTTO_PRICE } from '../utils/constants.js';
import { mod, divide } from '../utils/lotto.js';
import { ERROR_MESSAGE, GUIDE_MESSAGE } from '../utils/message.js';

export default class LottoPurchaseInput {
  constructor(props) {
    this.props = props;

    this.selectDOM();
    this.bindEvent();
  }

  selectDOM() {
    this.$purchaseInput = $('#lotto-purchase-input');
    this.$purchaseButton = $('#lotto-purchase-btn');
  }

  bindEvent() {
    this.$purchaseButton.addEventListener('click', () => {
      this.purchaseButtonClickHandler();
    });

    this.$purchaseInput.addEventListener('keydown', e => {
      if (e.key !== 'Enter') {
        return;
      }

      e.preventDefault();
      this.purchaseButtonClickHandler();
    });
  }

  purchaseButtonClickHandler() {
    const { createLottos } = this.props;
    const purchaseInputValue = this.$purchaseInput.value.trim();
    const payment = Number(purchaseInputValue);

    const errorMessage = validatePurchaseInputValue(payment);
    if (errorMessage) {
      alert(errorMessage);
      clearInput(this.$purchaseInput);
      return;
    }

    const lottoCount = divide(payment, LOTTO_PRICE);
    const remainingMoney = mod(payment, LOTTO_PRICE);
    alert(GUIDE_MESSAGE.PAYMENT_RESULT_MESSAGE(lottoCount, remainingMoney));

    createLottos(lottoCount);
  }
}

const validatePurchaseInputValue = payment => {
  if (!Number.isInteger(payment)) {
    return ERROR_MESSAGE.NOT_INTEGER_NUMBER_ERROR;
  }

  if (payment < LOTTO_PRICE) {
    return ERROR_MESSAGE.PAYMENT_AMOUNT_ERROR;
  }
};