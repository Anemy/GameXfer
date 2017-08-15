import $ from 'jquery';

import Utils from '../../../shared/Utils';

class CreateMessage {
  constructor() {
    this.performingAction = false;

    this.messageShown = false;
  }

  showStatusMessage(statusString, className) {
    if(!this.messageShown) {
      $('.js-create-message-message').removeClass('hide');
    }

    $('.js-create-message-message').text(statusString);
    $('.js-create-message-message').removeClass('message-success message-failure message-working');
    $('.js-create-message-message').addClass(className);
  }

  hideStatusMessage() {
    this.messageShown = false;
    $('.js-create-message-message').addClass('hide');
  }

  performCreateMessageRequest() {
    if (!this.performingAction) {
      this.performingAction = true;

      this.showStatusMessage('Working...', 'message-working');

      // Basic validation before making a request.
      if (!$('.js-create-message-destination').val() || !$('.js-create-message-subject').val() || !$('.ql-editor').html()) {
        this.performingAction = false;
        this.showStatusMessage('Error: Please fill out all of the fields.', 'message-failure');
        return;
      }

      const destination = $('.js-create-message-destination').val();
      const subject = $('.js-create-message-subject').val();
      const text = $('.ql-editor').html();

      if (!Utils.validMessageSubject(subject)) {
        this.performingAction = false;
        this.showStatusMessage('Error: That\'s an invalid message subjec.', 'message-failure');
        return;
      }

      // Ensure the message conforms to the message guidelines. 
      if (!Utils.validMessageText(text)) {
        this.performingAction = false;
        this.showStatusMessage('Error: Invalid first comment.', 'message-failure');
        return;
      }

      $.post('/message/create', {
        destination: destination,
        subject: subject,
        text: text
      }).done(() => {
        this.showStatusMessage('Success! Redirecting...', 'message-success');
        window.location.replace('/inbox');
      }).fail((err) => {
        if (err && err.responseJSON) {
          this.showStatusMessage('Error: ' + err.responseJSON.err, 'message-failure');
        } else {
          const errMsg = err.responseText ? err.responseText : 'unknown. Please check console.';
          this.showStatusMessage('Error: ' + errMsg, 'message-failure');
        }
        this.performingAction = false;
      });
    }
  }

  startListening() {
    // When the users type into the text fields, hide the last shown message, unless we are currently performing an action.
    $('.js-create-message-destination, .js-create-message-subject, .ql-editor').keypress(() => {
      if (!this.performingAction) {
        this.hideStatusMessage();
      }
    });
    
    $('.js-create-message').on('click', (e) => {
      e.preventDefault();

      this.performCreateMessageRequest();
    });
  }
}

export default new CreateMessage();