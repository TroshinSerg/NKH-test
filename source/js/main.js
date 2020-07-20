'use strict';

document.querySelector('html').classList.remove('no-js');
var accButtons = document.querySelectorAll('.accordion__item-btn');

var ActiveClass = {
  ACC_BTN: 'accordion__item-btn--active',
  ACC_TXT: 'accordion__item-text--showed'
};

accButtons.forEach(function(btn) {
  btn.addEventListener('click', onAccBtnClick);
});

function onAccBtnClick(evt) {
  var accBtn = evt.currentTarget;
  var accText = accBtn.nextElementSibling;
  console.log(accText);

  accBtn.classList.toggle(ActiveClass.ACC_BTN);
  accText.classList.toggle(ActiveClass.ACC_TXT);
}
