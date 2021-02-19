export const $ = selector => document.querySelector(selector);
export const $$ = selector => document.querySelectorAll(selector);

export const clearInputValue = $input => {
  $input.value = '';
};

export const disableElements = (...elements) => {
  elements.forEach(elem => (elem.disabled = true));
};

export const enableElements = (...elements) => {
  elements.forEach(elem => (elem.disabled = false));
};
