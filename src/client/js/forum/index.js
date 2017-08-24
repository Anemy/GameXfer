import $ from 'jquery';

const showForumsInfoLocalVariable = 'gamexfer-show-forums-info';

let showingForumsInfo = false;

function toggleForumsInfo() {
  if (showingForumsInfo) {
    $('.js-forums-info').addClass('hide');
  } else {
    $('.js-forums-info').addClass('animated  fadeIn');
    $('.js-forums-info').removeClass('hide');
  }

  showingForumsInfo = !showingForumsInfo;
}

export default {
  enable: () => {
    $(document).ready(() => {
      // Set up the display if it does not currently exist.
      const displayForumsInfo = JSON.parse(localStorage.getItem(showForumsInfoLocalVariable));

      if (displayForumsInfo == undefined || displayForumsInfo) {
        toggleForumsInfo();
      }

      $('.js-forums-info-selector').on('click', () => {
        toggleForumsInfo();
        localStorage.setItem(showForumsInfoLocalVariable, JSON.stringify(showingForumsInfo)); 
      });
    }); 
  }
};