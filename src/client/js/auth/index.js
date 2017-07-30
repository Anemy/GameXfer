import $ from 'jquery';

import login from './login';
import logout from './logout';

export default {
  enable: () => {
    $(document).ready(() => {
      login.startListening();
      logout.startListening();
    });
  }
};