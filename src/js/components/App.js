import winningNumbersInput from './WinningNumbersInput.js';
import LottoPerchaseInput from './LottoPerchaseInput.js';
import ModalDisplay from './ModalDisplay.js';
import LottoDisplay from './LottoDisplay.js';
import Lotto from '../model/Lotto.js';
import { decideWinners } from '../utils/lotto.js';

import { $, clearInputValue, enableElements } from '../utils/dom.js';
import { generateLottoNumbers } from '../utils/lotto.js';

export default class App {
  constructor() {
    this.initState();
    this.selectDOM();
    this.mountComponent();
  }

  initState() {
    this.lottos = [];
    this.winners = [...Array(6)].fill(0); // winner count로 네이밍?
  }

  selectDOM() {
    this.$target = $('#app');
  }

  mountComponent() {
    this.lottoPerchaseInput = new LottoPerchaseInput({
      createLottos: this.createLottos.bind(this),
    });

    this.lottoDisplay = new LottoDisplay({ lottos: this.lottos });
    this.winningNumbersInput = new winningNumbersInput({
      lottos: this.lottos,
      createWinners: this.createWinners.bind(this),
    });

    this.modalDisplay = new ModalDisplay({
      lottoCount: this.lottos.length,
      winners: this.winners,
      restart: this.restart.bind(this),
    });
  }

  createLottos(lottoCount) {
    const lottos = Array.from(
      { length: lottoCount },
      () => new Lotto(generateLottoNumbers()),
    );
    this.setState({ lottos });
  }

  createWinners(winningNumbers) {
    const temp = [...Array(6)].fill(0);
    this.lottos.forEach(lotto => {
      temp[decideWinners(lotto, winningNumbers) - 1]++;
    });
    this.setState({ winners: temp });
  }

  restart() {
    this.setState({ lottos: [], winners: [...Array(6)].fill(0) });

    this.modalDisplay.onModalClose();
    enableElements(
      this.lottoPerchaseInput.$perchaseInput,
      this.lottoPerchaseInput.$perchaseButton,
    );
    clearInputValue(this.lottoPerchaseInput.$perchaseInput);
  }

  setState({ lottos, winners }) {
    this.lottos = lottos ?? this.lottos;
    this.winners = winners ?? this.winners;

    this.lottoDisplay.setState({ lottos: this.lottos });
    this.winningNumbersInput.setState({ lottos: this.lottos });
    this.modalDisplay.setState({
      winners: this.winners,
      lottoCount: this.lottos.length,
    });
  }
}
