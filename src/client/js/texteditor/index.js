import $ from 'jquery';

import Quill from '../lib/quill.js';

export default {
  enable: () => {
    $(document).ready(() => {
      // Only run quill when the editor is on the page.
      if ($('#editor').length) {
        new Quill('#editor', {
          modules: {
            toolbar: [
              [{ header: [1, 2, 3, 4, 5, false] }],
              ['bold', 'italic', 'underline', 'strike'],
              [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
              [{ 'align': [] }],
              ['link', 'image', 'code-block'],
            ]
          },
          placeholder: $('#editor').attr('data-placeholder'),
          theme: 'snow'
        });
      }
    }); 
  }
};