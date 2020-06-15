'use strict';

(function () {
  var popupWrapper;
  var openedPopups = [];

  var handleCloseButtonClick = function () {
    closePopup(this.dataPopup);
  };

  var handlePopupWrapperClick = function (evt) {
    if (evt.target === popupWrapper) {
      closeLastPopup();
    }
  };

  var handleKeyDown = function (evt) {
    if (evt.keyCode === 27) {
      closeLastPopup();
    }
  };

  var closeLastPopup = function () {
    var lastPopup = openedPopups.pop();
    if (lastPopup) {
      closePopup(lastPopup);
    } else {
      popupWrapper.classList.remove('active');
      document.removeEventListener('keydown', handleKeyDown);
    }
  };

  var closePopup = function (popup) {
    var closeButtons = popup.querySelectorAll('.popup-close');
    for (var i = 0; i < closeButtons.length; i++) {
      closeButtons[i].removeEventListener('click', handleCloseButtonClick);
    }

    popup.classList.remove('active');
    popup.classList.remove('popup-error');

    var i = openedPopups.indexOf(popup);
    if (i >= 0) {
      openedPopups.splice(i, 1);
    }

    if (openedPopups.length === 0) {
      popupWrapper.classList.remove('active');
      document.removeEventListener('keydown', handleKeyDown);
    }
  };

  var openPopup = function (popup) {
    if (popup.classList.contains('active')) return;

    popup.classList.add('active');
    var closeButtons = popup.querySelectorAll('.popup-close');
    for (var i = 0; i < closeButtons.length; i++) {
      closeButtons[i].dataPopup = popup;
      closeButtons[i].addEventListener('click', handleCloseButtonClick);
    }
    openedPopups.push(popup);

    if (!popupWrapper.classList.contains('active')) {
      popupWrapper.classList.add('active');
      document.addEventListener('keydown', handleKeyDown);
    }
  };

  var makePopupLink = function (activatorClass, popupClass, onOpenPopup) {
    var activators = document.querySelectorAll('.' + activatorClass);
    var popup = document.querySelector('.' + popupClass);
    if (popup) {
      for (var i = 0; i < activators.length; i++) {
        activators[i].addEventListener('click', function (evt) {
          evt.preventDefault();
          openPopup(popup);
          if (onOpenPopup) {
            onOpenPopup(popup);
          }
        });
      }
    }
  };

  var initSlider = function (slider) {
    var slides = slider.querySelectorAll('.common-slider-slide');
    var switches = slider.querySelectorAll('.common-slider-switch');
    var btnPrev = slider.querySelector('.common-slider-prev');
    var btnNext = slider.querySelector('.common-slider-next');

    var currentSlideNo = 0;

    var setSlideActive = function (slideNo, isActive) {
      slides[slideNo].classList.toggle('active', isActive);
      if (switches[slideNo]) {
        switches[slideNo].classList.toggle('active', isActive);
      }
    };

    var showSlide = function (slideNo) {
      if (slideNo !== currentSlideNo) {
        setSlideActive(currentSlideNo, false);
        currentSlideNo = slideNo;
        setSlideActive(currentSlideNo, true);
      }
    };

    for (var i = 0; i < slides.length; i++) {
      if (slides[i].classList.contains('active')) {
        currentSlideNo = i;
        break;
      }
    }

    for (i = 0; i < slides.length; i++) {
      setSlideActive(i, i === currentSlideNo);
      if (switches[i]) {
        switches[i].slideNo = i;
      }
    }

    if (btnPrev) {
      btnPrev.addEventListener('click', function () {
        var newSlideNo = (currentSlideNo === 0) ? slides.length - 1 : currentSlideNo - 1;
        showSlide(newSlideNo);
      });
    }

    if (btnNext) {
      btnNext.addEventListener('click', function () {
        var newSlideNo = (currentSlideNo === slides.length-1) ? 0 : currentSlideNo + 1;
        showSlide(newSlideNo);
      });
    }

    slider.addEventListener('click', function (evt) {
      if (evt.target.classList.contains('common-slider-switch') && typeof evt.target.slideNo !== 'undefined') {
        showSlide(evt.target.slideNo);
      }
    });
  };

  var makeFeedbackValidator = function () {
    var popupFeedback = document.querySelector('.popup-feedback');
    if (!popupFeedback) {
      return;
    }

    var feedbackForm = popupFeedback.querySelector('form');
    var feedbackName = popupFeedback.querySelector('[name=name]');
    var feedbackEmail = popupFeedback.querySelector('[name=email]');
    var feedbackMsg = popupFeedback.querySelector('[name=msg]');

    feedbackForm.addEventListener('submit', function (evt) {
      if (!feedbackName.value || !feedbackEmail.value || !feedbackMsg.value) {
        evt.preventDefault();
        popupFeedback.classList.remove("popup-error");
        popupFeedback.offsetWidth;
        popupFeedback.classList.add("popup-error");
      } else {
        localStorage.setItem('feedback-name', feedbackName.value);
        localStorage.setItem('feedback-email', feedbackEmail.value);
      }
    });
  };

  window.addEventListener('load', function () {
    popupWrapper = document.querySelector('.popup-wrapper');
    popupWrapper.addEventListener('click', handlePopupWrapperClick);

    makePopupLink('contacts-block-map', 'popup-map');
    makePopupLink('contacts-block-feedback', 'popup-feedback', function (popup) {
      var feedbackName = popup.querySelector('[name=name]');
      var feedbackEmail = popup.querySelector('[name=email]');
      var feedbackMsg = popup.querySelector('[name=msg]');
      feedbackName.value = localStorage.getItem('feedback-name');
      feedbackEmail.value = localStorage.getItem('feedback-email');
      feedbackMsg.value = '';
      if (!feedbackName.value) {
        feedbackName.focus();
      }
      else if (!feedbackEmail.value) {
        feedbackEmail.focus();
      } else {
        feedbackMsg.focus();
      }
    });
    makePopupLink('button-buy', 'popup-cartinfo');

    makeFeedbackValidator();

    var sliders = document.querySelectorAll('.common-slider');
    for (var i = 0; i < sliders.length; i++) {
      initSlider(sliders[i]);
    }
  });

})();
