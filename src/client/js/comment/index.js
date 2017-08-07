import $ from 'jquery';

import create from './create';

export default {
  enable: () => {
    $(document).ready(() => {
      create.startListening();
    });
  }
};