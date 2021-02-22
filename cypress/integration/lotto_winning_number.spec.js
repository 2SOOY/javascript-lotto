/// <reference types="cypress" />

import LottoManager from '../../src/js/model/LottoManager.js';
import Lotto from '../../src/js/model/Lotto.js';
import { LOTTO } from '../../src/js/utils/constants.js';

describe('LOTTO - 당첨번호 입력 및 상금확인 테스트', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5500/');
  });

  // 번호 범위 + 중복 + 개수(길이) + isNaN

  it('당첨 번호 각각이 1~45 범위를 벗어나게 입력한 경우, alert에 오류 메시지를 출력한다.', () => {
    const winningNumbers = [1, 2, 3, 4, 5, 100];
    const bonusNumber = 40;

    const alertStub = cy.stub();
    cy.on('window:alert', alertStub);

    cy.get('#lotto-purchase-input').type('4500');
    cy.get('#lotto-purchase-btn').click();
    cy.get('.winning-number')
      .each((elem, index) => {
        cy.wrap(elem).type(winningNumbers[index]);
      })
      .then(() => {
        cy.get('.bonus-number').type(bonusNumber);
      });

    cy.get('.open-result-modal-button')
      .click()
      .then(() => {
        expect(alertStub.getCall(1)).to.be.calledWith(
          `1~45 사이의 숫자만 가능합니다. 당첨 번호를 다시 입력해주세요.`,
        );
      });
  });

  it('중복된 숫자를 당첨 번호로 입력한 경우, alert에 오류 메시지를 출력한다.', () => {
    const winningNumbers = [1, 1, 3, 4, 5, 6];
    const bonusNumber = 45;

    const alertStub = cy.stub();
    cy.on('window:alert', alertStub);

    cy.get('#lotto-purchase-input').type('4500');
    cy.get('#lotto-purchase-btn').click();

    cy.get('.winning-number')
      .each((elem, index) => {
        cy.wrap(elem).type(winningNumbers[index]);
      })
      .then(() => {
        cy.get('.bonus-number').type(bonusNumber);
      });

    cy.get('.open-result-modal-button')
      .click()
      .then(() => {
        expect(alertStub.getCall(1)).to.be.calledWith(
          `중복된 숫자가 존재합니다. 당첨 번호를 다시 입력해주세요.`,
        );
      });
  });

  it('7개의 번호 중 하나라도 입력하지 않은 경우, alert에 오류 메시지를 출력한다.', () => {
    const winningNumbers = [1, 1, 3, 4, 5, 6];

    const alertStub = cy.stub();
    cy.on('window:alert', alertStub);

    cy.get('#lotto-purchase-input').type('4500');
    cy.get('#lotto-purchase-btn').click();
    cy.get('.winning-number').each((elem, index) => {
      cy.wrap(elem).type(winningNumbers[index]);
    });

    cy.get('.open-result-modal-button')
      .click()
      .then(() => {
        expect(alertStub.getCall(1)).to.be.calledWith(
          `빈 입력값이 존재 합니다. 7개의 숫자를 모두 입력해주세요.`,
        );
      });
  });

  it('로또 구매를 완료할 경우, 당첨 번호 입력 UI를 화면에 출력한다.', () => {
    cy.get('#lotto-purchase-input').type('4500');
    cy.get('#lotto-purchase-btn').click();

    cy.get('#lotto-winning-number-input-container').should('be.visible');
  });

  it('결과 확인하기 버튼을 누르면, 모달이 화면에 출력한다.', () => {
    let count = 1;
    cy.get('#lotto-purchase-input').type('4500');
    cy.get('#lotto-purchase-btn').click();

    cy.get('.winning-number')
      .each(elem => {
        cy.wrap(elem).type(count++);
      })
      .then(() => {
        cy.get('.bonus-number').type(count);
      });
    cy.get('.open-result-modal-button').click();

    cy.get('.modal').should('be.visible');
  });

  it('로또와 당첨 번호가 주어질 때, 당첨 통계/수익률을 계산한다.', () => {
    const winningNumbers = [1, 2, 3, 4, 5, 6];
    const bonusNumber = 45;
    const lottoManager = new LottoManager([
      new Lotto([45, 2, 3, 4, 5, 6]),
      new Lotto([45, 2, 3, 4, 5, 6]),
      new Lotto([45, 2, 3, 4, 5, 6]),
      new Lotto([45, 2, 3, 4, 5, 6]),
      new Lotto([45, 2, 3, 4, 5, 6]),
    ]);

    const result = {
      FIRST: 0,
      SECOND: 5,
      THIRD: 0,
      FOURTH: 0,
      FIFTH: 0,
    };

    lottoManager.decideWinners(winningNumbers, bonusNumber);
    for (const [key, value] of Object.entries(lottoManager.winningCount)) {
      expect(result[key]).to.equal(value);
    }

    const profitMargin = lottoManager.calculateProfitMargin();
    expect(profitMargin).to.equal(100 * ((300000000 * 5 - 5000) / 5000));
  });

  it('모달이 출력된 상태에서 닫기(X)버튼을 클릭하면, 모달이 닫힌다.', () => {
    const winningNumbers = [1, 2, 3, 4, 5, 100];
    const bonusNumber = 40;

    cy.get('#lotto-purchase-input').type('4500');
    cy.get('#lotto-purchase-btn').click();
    cy.get('.winning-number')
      .each((elem, index) => {
        cy.wrap(elem).type(winningNumbers[index]);
      })
      .then(() => {
        cy.get('.bonus-number').type(bonusNumber);
      });

    cy.get('.open-result-modal-button').click();
    cy.get('.modal-close').click({ force: true });
    cy.get('.modal').should('not.be.visible');
  });
});