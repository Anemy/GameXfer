import $ from 'jquery';

export default {
  enable: () => {
    $(document).ready(() => {
      new Quill('#editor', {
        modules: { 
          toolbar: '#toolbar' 
        },
        theme: 'snow'
      });    
    }); 
  }
};