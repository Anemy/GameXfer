import $ from 'jquery';

import login from './login';
import logout from './logout';
import signup from './signup';
import contact from './contact';

export default {
  enable: () => {
    $(document).ready(() => {
      login.startListening();
      logout.startListening();
      signup.startListening();
      contact.startListening();
    });
  }
};