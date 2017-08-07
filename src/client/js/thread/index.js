import $ from 'jquery';

import createThread from './create';

export default {
  enable: () => {
    $(document).ready(() => {
      createThread.startListening(); 
    }); 
  }
};