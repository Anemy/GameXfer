import $ from 'jquery';

import Utils from '../../../shared/Utils';

class Login {
  constructor() {
    this.performingAction = false;

    this.messageShown = false;
  }

  showStatusMessage(statusString, className) {
    if(!this.messageShown) {
      $('.js-login-status-message').removeClass('hide');
    }

    $('.js-login-status-message').text(statusString);
    $('.js-login-status-message').removeClass('message-success message-failure message-working');
    $('.js-login-status-message').addClass(className);
  }

  hideStatusMessage() {
    this.messageShown = false;
    $('.js-login-status-message').addClass('hide');
  }

  performLoginRequest() {
    if (!this.performingAction) {
      this.performingAction = true;

      this.showStatusMessage('Working...', 'message-working');

      // Basic validation before making a request.
      if (!$('.js-login-username-input').val() || !$('.js-login-password-input').val()) {
        this.performingAction = false;
        this.showStatusMessage('Error: Please fill out both of the fields.', 'message-failure');
        return;
      }

      $.post('/login', {
        username: $('.js-login-username-input').val(),
        password: $('.js-login-password-input').val(),
      }).done(() => {
        this.showStatusMessage('Success! Redirecting...', 'message-success');
        
        const redirectUrl = Utils.getParameterByName('re');

        // Redirect to home unless they have a specified redirect string.
        window.location.replace(redirectUrl ? redirectUrl : '/');
      }).fail((err) => {
        if (err && err.responseJSON) {
          this.showStatusMessage('Error: ' + err.responseJSON.err, 'message-failure');
        } else {
          this.showStatusMessage('Error: ' + err.responseText || 'unknown. Please check console', 'message-failure');
        }
        this.performingAction = false;
      });
    }
  }

  startListening() {
    // When the page first loads, check if they were redirected from somewhere requiring auth so we can display a message.
    const redirectUrl = Utils.getParameterByName('re');
    if (redirectUrl) {
      this.showStatusMessage('Please sign in to view that page.', 'message-failure');
    }

    // When the users type into the text fields, hide the last shown message, unless we are currently performing an action.
    $('.js-login-username-input, .js-login-password-input').keypress((e) => {
      if (!this.performingAction) {
        this.hideStatusMessage();

        if (e.keyCode === 13) {
          this.performLoginRequest();
        }
      }
    });
    
    $('.js-login').on('click', (e) => {
      e.preventDefault();

      this.performLoginRequest();
    });
  }
}

export default new Login();