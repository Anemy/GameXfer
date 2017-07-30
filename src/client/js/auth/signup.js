import $ from 'jquery';

import Utils from '../../../shared/Utils';

class Signup {
  constructor() {
    this.performingAction = false;

    this.messageShown = false;
  }

  showStatusMessage(statusString, className) {
    if(!this.messageShown) {
      $('.js-signup-status-message').removeClass('hide');
    }

    $('.js-signup-status-message').text(statusString);
    $('.js-signup-status-message').removeClass('message-success message-failure message-working');
    $('.js-signup-status-message').addClass(className);
  }

  hideStatusMessage() {
    this.messageShown = false;
    $('.js-signup-status-message').addClass('hide');
  }

  performSignupRequest() {
    if (!this.performingAction) {
      this.performingAction = true;

      this.showStatusMessage('Working...', 'message-working');

      // Basic validation before making a request.
      if (Utils.validUsername($('.js-signup-username-input').val())) {
        this.performingAction = false;
        this.showStatusMessage('Error: Invalid username.', 'message-failure');
        return;
      } else if (Utils.validEmail($('.js-signup-email-input').val())) {
        this.performingAction = false;
        this.showStatusMessage('Error: Invalid email.', 'message-failure');
        return;
      } else if (Utils.validEmail($('.js-signup-password-input').val())) {
        this.performingAction = false;
        this.showStatusMessage('Error: Invalid password. Please choose a better one.', 'message-failure');
        return;
      }

      // Ensure the passwords match.
      if ($('.js-signup-password-input').val() !== $('.js-signup-password-confirmation-input').val()) {
        this.performingAction = false;
        this.showStatusMessage('Error: Your passwords do not match.', 'message-failure');
        return;
      }

      $.post('/signup', {
        username: $('.js-signup-username-input').val(),
        email: $('.js-signup-email-input').val(),
        password: $('.js-signup-password-input').val(),
      }).done(() => {
        this.showStatusMessage('Success! Redirecting in 3 seconds.', 'message-success');
        setTimeout(() => {
          this.showStatusMessage('Success! Redirecting in 2 seconds.', 'message-success');
        }, 1000 /* 1s */);
        setTimeout(() => {
          this.showStatusMessage('Success! Redirecting in 1 second.', 'message-success');
        }, 2000 /* 2s */);
        setTimeout(() => {
          // TODO: Replace with an optional redirect string param.
          window.location.replace('/');
        }, 3000 /* 3s */);
      }).fail((err) => {
        this.showStatusMessage('Error: ' + err.responseJSON.err, 'message-failure');
        this.performingAction = false;
      });
    }
  }

  startListening() {
    // When the users type into the text fields, hide the last shown message, unless we are currently performing an action.
    $('.js-signup-username-input, .js-signup-password-input, .js-signup-password-confirmation-input, .js-signup-email-input').keypress(() => {
      if (!this.performingAction) {
        this.hideStatusMessage();
      }
    });

    $('.js-signup-form').on('submit', (e) => {
      e.preventDefault();

      this.performSignupRequest();
    });
  }
}

export default new Signup();