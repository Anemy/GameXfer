import $ from 'jquery';

import Constants from '../../../shared/Constants';
import Utils from '../../../shared/Utils';

class CreateComment {
  constructor() {
    this.performingAction = false;

    this.messageShown = false;
  }

  showStatusMessage(statusString, className) {
    if(!this.messageShown) {
      $('.js-create-comment-message').removeClass('hide');
    }

    $('.js-create-comment-message').text(statusString);
    $('.js-create-comment-message').removeClass('message-success message-failure message-working');
    $('.js-create-comment-message').addClass(className);
  }

  hideStatusMessage() {
    this.messageShown = false;
    $('.js-create-comment-message').addClass('hide');
  }

  performCreateCommentRequest() {
    if (!this.performingAction) {
      this.performingAction = true;

      this.showStatusMessage('Working...', 'message-working');

      // Basic validation before making a request.
      if (!$('.ql-editor').html()) {
        this.performingAction = false;
        this.showStatusMessage('Error: Please fill out the comment field.', 'message-failure');
        return;
      }

      const text = $('.ql-editor').html();
      const forumId = $('.js-forum-id').attr('data-forum-id');
      const threadId = $('.js-thread-id').attr('data-thread-id');

      // Ensure the message conforms to the message guidelines. 
      if (!Utils.validCommentText(text)) {
        this.performingAction = false;
        this.showStatusMessage('Error: Invalid comment. Please check the comment guidelines.', 'message-failure');
        return;
      }

      $.post('/comment/create', {
        forumId: forumId,
        threadId: threadId,
        text: text
      }).done(() => {
        this.showStatusMessage('Success! Refreshing...', 'message-success');
        // Redirect to the most recent comment.
        window.location.replace(`/f/${forumId}/t/${threadId}/c/${Constants.MOST_RECENT_COMMENT}`);
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

  startListening() {
    // Activate the inline comment creation when the user clicks the button.
    $('.js-create-new-comment').on('click', () => {
      if ($('.js-inline-comment-creator').hasClass('hide')) {
        $('.js-inline-comment-creator').removeClass('hide');
      }
      setTimeout(() => {
        $(window).scrollTop($('.js-inline-comment-creator').offset().top);
        $('.js-create-comment-text').focus();
      });
    });

    // When the users type into the text fields, hide the last shown message, unless we are currently performing an action.
    $('.ql-editor').keypress(() => {
      if (!this.performingAction) {
        this.hideStatusMessage();
      }
    });
    
    $('.js-create-comment').on('click', (e) => {
      e.preventDefault();

      this.performCreateCommentRequest();
    });
  }
}

export default new CreateComment();