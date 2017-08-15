import $ from 'jquery';

import create from './create';
import inbox from './inbox';

export default {
  enable: () => {
    $(document).ready(() => {
      inbox.startListening(); 
      create.startListening(); 
    }); 
  }
};