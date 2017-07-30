import $ from 'jquery';

import login from './login';
import logout from './logout';
import signup from './signup';

export default {
  enable: () => {
    $(document).ready(() => {
      login.startListening();
      logout.startListening();
      signup.startListening();
    });
  }
};