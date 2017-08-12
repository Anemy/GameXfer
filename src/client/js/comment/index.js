import $ from 'jquery';

import create from './create';
import Utils from '../../../shared/Utils';

export default {
  enable: () => {
    $(document).ready(() => {
      create.startListening();

      // When the page first loads, check if there is a specific comment to autoscroll to.
      const linkedComment = Utils.getParameterByName('lc');
      if (linkedComment) {
        // Auto scroll to a certain comment if it's requested via url.
        const el = document.getElementById('c-' + linkedComment);
        el.scrollIntoView(true);
        el.classList.add('linked-comment');
      }
    });
  }
};