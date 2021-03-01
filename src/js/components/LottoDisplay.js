import { lottoManager } from './App.js';
import { isEmptyArray } from '../utils/common.js';
import { $, makeElement } from '../utils/dom.js';

export default class LottoDisplay {
  constructor(props) {
    this.props = props;

    this.initState();
    this.initDOM();
    this.selectDOM();
    this.bindEvent();
    this.subscribeAction();
  }

  initState() {
    this.isToggled = false;
  }

  initDOM() {
    const { $parent } = this.props;

    const $target = makeElement('section', {
      className: 'lotto-display mt-9 d-none',
    });
    $target.innerHTML = LottoDisplayHTML;

    this.$target = $target;
    $parent.append(this.$target);
  }

  selectDOM() {
    this.$toggleButton = $('.lotto-display__switch', this.$target);
    this.$lottoCount = $('.lotto-display__count', this.$target);
    this.$lottoDisplayArea = $('.lotto-display__area', this.$target);
  }

  bindEvent() {
    this.$toggleButton.addEventListener(
      'change',
      this.onToggleSwitch.bind(this),
    );
  }

  onToggleSwitch({ target: { checked } }) {
    this.setIsToggled({ isToggled: checked });
  }

  createTotalLottoCountHTML() {
    return `총 ${lottoManager.lottos.length}개를 구매하였습니다.`;
  }

  createLottoHTML() {
    const lottoNumbersHTML = numbers =>
      this.isToggled
        ? `<span data-test="lotto-numbers" class="text-2xl ml-4">${numbers.join(
            ', ',
          )}</span>`
        : '';

    return lottoManager.lottos
      .map(
        ({ numbers }) =>
          `<span data-test="lotto" class="mx-1 text-4xl d-flex items-center justify-center">🎟️ ${lottoNumbersHTML(
            numbers,
          )}</span>`,
      )
      .join('');
  }

  setIsToggled({ isToggled }) {
    this.isToggled = isToggled ?? this.isToggled;

    this.render();
  }

  render() {
    if (isEmptyArray(lottoManager.lottos)) {
      this.$target.classList.add('d-none');
      return;
    }

    this.$target.classList.remove('d-none');
    this.$lottoCount.innerHTML = this.createTotalLottoCountHTML();
    this.$lottoDisplayArea.innerHTML = this.createLottoHTML();
  }

  subscribeAction() {
    lottoManager.subscribe(this.render.bind(this));
  }
}

const LottoDisplayHTML = `
<div class="d-flex">
  <label class="lotto-display__count flex-auto my-0"></label>
  <div class="flex-auto d-flex justify-end pr-1">
    <label class="switch">
      <input type="checkbox" class="lotto-display__switch" />
      <span class="text-base font-normal">번호보기</span>
    </label>
  </div>
</div>
<div class="lotto-display__area d-flex flex-wrap">
</div>
`;
