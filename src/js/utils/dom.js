export const $ = (selector, $parent = document) => {
  return $parent.querySelector(selector);
};

export const $$ = (selector, $parent = document) => {
  return Array.from($parent.querySelectorAll(selector));
};

export const makeElement = (type, attributes) => {
  const $el = document.createElement(type);

  Object.keys(attributes).forEach(attr => {
    $el[attr] = attributes[attr];
  });

  return $el;
};

export const clearInputValue = $input => {
  $input.value = '';
};

export const disableElements = (...$elements) => {
  $elements.forEach($elem => {
    $elem.disabled = true;
  });
};

export const enableElements = (...$elements) => {
  $elements.forEach($elem => {
    $elem.disabled = false;
  });
};

export const removeClassNames = ($target, ...names) => {
  names.forEach(className => {
    if (!$target.classList.contains(className)) {
      return;
    }
    $target.classList.remove(className);
  });
};

export const addClassNames = ($target, ...names) => {
  names.forEach(className => {
    if ($target.classList.contains(className)) {
      return;
    }

    $target.classList.add(className);
  });
};
