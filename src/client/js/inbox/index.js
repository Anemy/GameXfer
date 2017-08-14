import $ from 'jquery';

import inbox from './inbox';

export default {
  enable: () => {
    $(document).ready(() => {
      inbox.startListening(); 
    }); 
  }
};