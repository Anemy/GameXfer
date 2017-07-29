import $ from 'jquery';

import login from './login';

export default {
  enable: () => {
    $(document).ready(() => {
      login.startListening();
    });
  }
};