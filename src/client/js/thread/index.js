import $ from 'jquery';

import createThread from './create';
import trackThread from './track';

export default {
  enable: () => {
    $(document).ready(() => {
      createThread.startListening(); 
      trackThread.startListening(); 
    }); 
  }
};