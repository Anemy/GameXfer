import $ from 'jquery';

const deleteMessageText = 'Are you sure you want to delete these messages? The trash folder has a message limit (oldest deletes get tossed to make room for the new). Old messages may be gone FOREVER!';

class Inbox {
  constructor() {
    this.performingAction = false;

    this.showActions = false;
  }

  displayActions() {
    if (!this.showActions) {
      this.showActions = true;

      $('.js-inbox-actions').removeClass('hide');
    }
  }

  hideActions() {
    if (this.showActions) {
      this.showActions = false;

      $('.js-inbox-actions').addClass('hide');
    }
  }

  areAllBoxesChecked() {
    let checked = true;

    $('.js-inbox-checkbox:checkbox').each(function(){
      if (!this.checked) {
        checked = false;
        return false; // break;
      }
    });

    return checked;
  }

  areBoxesChecked() {
    let checked = false;

    $('.js-inbox-checkbox:checkbox').each(function(){
      if (this.checked) {
        checked = true;
        return false; // break;
      }
    });

    return checked;
  }

  markMessagesRead(messageIds) {
    for (let i = 0; i < messageIds.length; i++) {
      $(`#${messageIds[i]}`).removeClass('unread-message');
      $(`#${messageIds[i]}`).addClass('read-message');
    }

    this.ensureHeaderEnvelope();
  }

  markMessagesUnread(messageIds) {
    for (let i = 0; i < messageIds.length; i++) {
      $(`#${messageIds[i]}`).removeClass('read-message');
      $(`#${messageIds[i]}`).addClass('unread-message');
    }

    this.ensureHeaderEnvelope();
  }

  // Make sure the envelope in the header shows the correct state.
  ensureHeaderEnvelope() {
    $('.js-header-envelope').removeClass('fa-envelope');
    $('.js-header-envelope').removeClass('fa-envelope-o');

    if (this.areThereUnread()) {
      $('.js-header-envelope').addClass('fa-envelope');
    } else {
      $('.js-header-envelope').addClass('fa-envelope-o');
    }
  }

  areThereUnread() {
    let areUnread = false;
    $('.js-message-row').each(function(){
      if ($(this).hasClass('unread-message') && !$(this).hasClass('hide')) {
        areUnread = true;
        return false; // break;
      }
    });

    return areUnread;
  }

  toggleAllBoxes() {
    if (this.areAllBoxesChecked()) {
      // Uncheck all of the boxes.
      $('.js-inbox-checkbox').prop('checked', false);
      $('.js-inbox-top-checkbox').prop('checked', false);
      this.hideActions();
    } else {
      // Check all of the boxes.
      $('.js-inbox-checkbox').prop('checked', true);
      $('.js-inbox-top-checkbox').prop('checked', true);
      this.displayActions();
    }
  }

  performDeleteMessageRequest(messageIds) {
    if (!this.performingAction && messageIds && messageIds.length > 0) {
      if (messageIds.length < 2 || confirm(deleteMessageText)) {
        this.performingAction = true;        

        $.post('/message/delete', {
          messagesToDelete: messageIds
        }).done(() => {
          for (let i = 0; i < messageIds.length; i++) {
            $(`#${messageIds[i]}`).addClass('hide');
          }

          this.ensureHeaderEnvelope();

          this.performingAction = false;
        }).fail((err) => {
          let errMsg = err.responseText ? err.responseText : 'unknown. Please check console.';
          alert('Unable to delete message(s). Please refresh and try again.\nError:' + errMsg);
          this.performingAction = false;
        });
      }
    }
  }

  // Send a request to the server to mark messages as read or unread based on the passed messageIds.
  performMarkMessageRequest(messageIds, markAsRead) {
    if (!this.performingAction && messageIds && messageIds.length > 0) {
      this.performingAction = true;        

      $.post('/message/read', {
        messagesToMark: messageIds,
        markAsRead: markAsRead
      }).done(() => {
        if (markAsRead) {
          this.markMessagesRead(messageIds);
        } else {
          this.markMessagesUnread(messageIds);
        }
        
        this.performingAction = false;
      }).fail(() => {
        alert('Unable to mark message(s). Please refresh and try again.');
        this.performingAction = false;
      });
    }
  }

  getAllSelectedMessageIds() {
    const messageIds = [];

    $('.js-inbox-checkbox:checkbox').each(function(){
      if (this.checked) {
        messageIds.push($(this).attr('data-messageId'));
      }
    });

    return messageIds;
  }

  performMessageReadRequest() {
    if (!this.performingAction) {
      this.performingAction = true;
    }
  }

  toggleViewMessage(messageId) {
    let $el = $(`.js-message-text[data-messageId='${messageId}']`);
    if ($el.hasClass('hide')) {
      $el.removeClass('hide');
    } else {
      $el.addClass('hide');
    }

    // If the message was unread, tell the server to mark it as read.
    if ($(`#${messageId}`).hasClass('unread-message')) {
      this.performMarkMessageRequest([messageId], true /* Read it */);
    }
  }

  startListening() {
    $('.js-inbox-top-checkbox').click(() => {
      this.toggleAllBoxes();
    });

    $('.js-inbox-checkbox').click(() => {
      if (this.areBoxesChecked()) {
        this.displayActions();
      } else {
        this.hideActions();
      }
    });

    $('.js-select-message').click((e) => {
      this.toggleViewMessage($(e.currentTarget).attr('data-messageId'));
    });

    $('.js-mark-as-read').click(() => {
      this.performMarkMessageRequest(this.getAllSelectedMessageIds(), true /* Mark them as read. */);
    });

    $('.js-mark-as-unread').click(() => {
      this.performMarkMessageRequest(this.getAllSelectedMessageIds(), false /* Mark them as unread. */);
    });

    $('.js-delete-messages').click(() => {
      this.performDeleteMessageRequest(this.getAllSelectedMessageIds());
    });

    $('.js-delete-message').click((e) => {
      const messageId = $(e.currentTarget).attr('data-messageId');
      const messageIdsArray = [ messageId ];
      this.performDeleteMessageRequest(messageIdsArray);
    });
  }
}

export default new Inbox();