import $ from 'jquery';

class Contact {
  constructor() {
    this.performingAction = false;

    this.messageShown = false;
  }

  showStatusMessage(statusString, className) {
    if(!this.messageShown) {
      $('.js-contact-status-message').removeClass('hide');
    }

    $('.js-contact-status-message').text(statusString);
    $('.js-contact-status-message').removeClass('message-success message-failure message-working');
    $('.js-contact-status-message').addClass(className);
  }

  hideStatusMessage() {
    this.messageShown = false;
    $('.js-contact-status-message').addClass('hide');
  }

  performContactRequest() {
    if (!this.performingAction) {
      this.performingAction = true;

      this.showStatusMessage('Working...', 'message-working');

      // Basic validation before making a request.
      if (!$('.js-contact-text-input').val() || !$('.js-contact-email-input').val()) {
        this.performingAction = false;
        this.showStatusMessage('Error: Please fill out both of the fields.', 'message-failure');
        return;
      }

      $.post('//formspree.io/rhysh@live.com', {
        username: $('.js-contact-text-input').val(),
        password: $('.js-contact-email-input').val(),
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
    $('.js-contact-text-input, .js-contact-email-input').keypress(() => {
      if (!this.performingAction) {
        this.hideStatusMessage();
      }
    });
    
    $('.js-contact-submit').on('click', (e) => {
      e.preventDefault();

      this.performContactRequest();
    });
  }
}

export default new Contact();