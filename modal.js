class Dialog {
  constructor(dialogElement, overlayElement) {
    this.dialogElement = dialogElement;
    this.overlayElement = overlayElement;
    //this.focusedElBeforeOpen = document.activeElement;
    this.focusableEls = Array.prototype.slice.call(this.dialogElement.querySelectorAll('a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]'));
    this.firstFocusableEl = this.focusableEls[0];
    this.lastFocusableEl = this.focusableEls[ this.focusableEls.length - 1 ];
    //this.close();
  }

  open() {
    const Dialog = this;

    this.dialogElement.removeAttribute('aria-hidden');
    this.overlayElement.removeAttribute('aria-hidden');

    this.focusedElBeforeOpen = document.activeElement;

    this.dialogElement.addEventListener('keydown', function(e) {
      Dialog._handleKeyDown(e);
    });

    this.overlayElement.addEventListener('click', function() {
      Dialog.close();
    });

    this.firstFocusableEl.focus();
  }

  close(){
    this.dialogElement.setAttribute('aria-hidden', true);
    this.overlayElement.setAttribute('aria-hidden', true);

    console.log(this.focusedElBeforeOpen);
    if ( this.focusedElBeforeOpen ) {
      this.focusedElBeforeOpen.focus();
    }
  }

  _handleKeyDown(e){
    const Dialog = this;
    const KEY_TAB = 9;
    const KEY_ESC = 27;

    function handleBackwardTab() {
      if ( document.activeElement === Dialog.firstFocusableEl ) {
        e.preventDefault();
        Dialog.lastFocusableEl.focus();
      }
    }
    function handleForwardTab() {
      if ( document.activeElement === Dialog.lastFocusableEl ) {
        e.preventDefault();
        Dialog.firstFocusableEl.focus();
      }
    }

    switch(e.keyCode) {
      case KEY_TAB:
        if ( Dialog.focusableEls.length === 1 ) {
          e.preventDefault();
          break;
        }
        if ( e.shiftKey ) {
          handleBackwardTab();
        } else {
          handleForwardTab();
        }
        break;
      case KEY_ESC:
        Dialog.close();
        break;
      default:
        break;
    }
  }

  addEventListeners(openDialogSel, closeDialogSel){
    const Dialog = this;

    openDialogSel.addEventListener('click', function() {
      Dialog.open();
    });

    const closeDialogElements = document.querySelectorAll(closeDialogSel);
    for (let closeDialogElement of closeDialogElements) {
      closeDialogElement.addEventListener('click', function() {
        Dialog.close();
      });
    }
  }
}
