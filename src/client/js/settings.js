/**
 * This controls the user's settings page.
 */

import $ from 'jquery';

import Constants from '../../shared/Constants';

class Settings {
  constructor() {
    this.performingAction = false;
    this.hasParsedBiography = false;

    this.messageShown = false;
  }

  showStatusMessage(statusString, className) {
    if(!this.messageShown) {
      $('.js-settings-status-message').removeClass('hide');
    }

    $('.js-settings-status-message').text(statusString);
    $('.js-settings-status-message').removeClass('message-success message-failure message-working');
    $('.js-settings-status-message').addClass(className);
  }

  hideStatusMessage() {
    this.messageShown = false;
    $('.js-settings-status-message').addClass('hide');
  }

  performSaveSettingsRequest() {
    if (!this.performingAction) {
      this.performingAction = true;

      this.showStatusMessage('Working...', 'message-working');

      let data = {};

      if (this.hasParsedBiography) {
        data.biography = $('.js-settings-biography-input').val();
      }

      if ($('#js-avatar-url').val()) {
        data.avatarURL = $('#js-avatar-url').val();
      }

      $.post('/settings', data).done(() => {
        this.showStatusMessage('Success! Settings saved.', 'message-success');
        window.location.replace('/settings');
      }).fail((err) => {
        if (err && err.responseJSON) {
          this.showStatusMessage('Error: ' + err.responseJSON.err, 'message-failure');
        } else {
          this.showStatusMessage('Error: ' + err.responseText || 'unknown. Please check console.', 'message-failure');
        }
        this.performingAction = false;
      });
    }
  }

  getSignedRequest(file) {
    console.log('Getting a signed url...');
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `/sign-s3?file-type=${file.type}&file-name=${file.name}`);
    xhr.onreadystatechange = () => {
      if(xhr.readyState === 4){
        if(xhr.status === 200){
          const response = JSON.parse(xhr.responseText);
          console.log('Got signed URL!', response.url);
          this.uploadFile(file, response.signedRequest, response.url);
        } else {
          alert('Could not get signed URL to upload your photo. Please refresh & try again.');
        }
      }
    };
    xhr.send();
  }

  uploadFile(file, signedRequest, url) {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', signedRequest);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          console.log('Got successful posted image response from s3');
          document.getElementById('js-avatar-preview').src = url;
          document.getElementById('js-avatar-url').value = url;
          if ($('#js-avatar-preview').hasClass('hide')) {
            $('#js-avatar-preview').removeClass('hide');
          }
        } else {
          alert('Could not upload file. Please refresh and try again.');
        }
        this.performingAction = false;
      }
    };
    xhr.send(file);
  }


  startListening() {
    // When the users type into the text fields, hide the last shown message, unless we are currently performing an action.
    $('.js-settings-biography-input').keypress(() => {
      if (!this.performingAction) {
        this.hideStatusMessage();
      }
    });
    
    $('.js-settings-form').on('submit', (e) => {
      e.preventDefault();

      this.performSaveSettingsRequest();
    });

    $('#js-avatar-input').change((e) => {
      const files = document.getElementById('js-avatar-input').files;
      const file = files[0];
      if (file == null) {
        alert('No file selected.');
        return;
      } 

      // Ensure the file isn't a cray size.
      if (file.size > Constants.AVATAR_MAX_FILE_SIZE || file.fileSize > Constants.AVATAR_MAX_FILE_SIZE) {
        alert('That image is too large. Please keep your filesize under 500 KB.');

        // Reset the input.
        $(e.target).val('');

        return;
      }

      console.log('file:');
      console.log(file);

      this.getSignedRequest(file);
    });
  }
}

export default {
  enable: () => {
    $(document).ready(() => {
      const settings = new Settings();

      settings.startListening();

      const und = new upndown();
      const biographyText = $('.js-settings-biography-input').val();
      und.convert(biographyText || '', (err, markdown) => {
        if (err) {
          console.log('Error from parsing the biography:');
          console.log(err); 
          settings.showStatusMessage('Unable parse your biography. Try refreshing. Contact us if that doesn\'t solve it.', 'message-failure');
        } else { 
          settings.hasParsedBiography = true;
          $('.js-settings-biography-input').removeClass('hide');
          $('.js-settings-biography-input').val(markdown);
        }
      });
    });
  }
};