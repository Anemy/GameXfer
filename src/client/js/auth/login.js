import $ from 'jquery';

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