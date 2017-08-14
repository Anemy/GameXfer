import $ from 'jquery';

class Inbox {
  constructor() {
    this.performingAction = false;
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

  toggleAllBoxes() {
    if (this.areAllBoxesChecked()) {
      // Uncheck all of the boxes.
      $('.js-inbox-checkbox').prop('checked', false);
      $('.js-inbox-top-checkbox').prop('checked', false);
    } else {
      // Check all of the boxes.
      $('.js-inbox-checkbox').prop('checked', true);
      $('.js-inbox-top-checkbox').prop('checked', true);
    }
  }

  performDeleteMessageRequest() {
    if (!this.performingAction) {
      this.performingAction = true;
    }
  }

  startListening() {
    $('.js-inbox-top-checkbox').click(() => {
      this.toggleAllBoxes();
    });
  }
}

export default new Inbox();