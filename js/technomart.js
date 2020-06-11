'use strict';

(function () {
  var popupWrapper;
  var openedPopups = [];

  var closePopup;
  var closeLastPopup;

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

  closeLastPopup = function () {
    var lastPopup = openedPopups.pop();
    if (lastPopup) {
      closePopup(lastPopup);
    } else {
      popupWrapper.classList.remove('active');
      document.removeEventListener('keydown', handleKeyDown);
    }
  };

  closePopup = function (popup) {
    var closeButton = popup.querySelector('.popup-close-button');
    if (closeButton) {
      closeButton.removeEventListener('click', handleCloseButtonClick);
    }

    popup.classList.remove('active');
    popup.classList.remove("popup-error");

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
    var closeButton = popup.querySelector('.popup-close-button');
    if (closeButton) {
      closeButton.dataPopup = popup;
      closeButton.addEventListener('click', handleCloseButtonClick);
    }
    openedPopups.push(popup);

    if (!popupWrapper.classList.contains('active')) {
      popupWrapper.classList.add('active');
      document.addEventListener('keydown', handleKeyDown);
    }
  };

  var makePopupLink = function (activatorClass, popupClass) {
    var activator = document.querySelector('.'+activatorClass);
    var popup = document.querySelector('.'+popupClass);
    if (activator && popup) {
      activator.addEventListener('click', function (evt) {
        evt.preventDefault();
        openPopup(popup);
      });
    }
  };

  var makeCardButtonsPopup = function () {
    var productContainer = document.querySelector('.product-list');
    var productHoverPopup = document.querySelector('.popup-product-hover');

    if (!productContainer || !productHoverPopup) {
      return;
    }

    var handleMouseOut = function (evt) {
      productHoverPopup.classList.remove('active');

      target.removeEventListener('mouseout', handleMouseOut);
    };

    var handleMouseOver = function (evt) {
      var target = evt.target;
      while (target && !target.classList.contains('product-card') && target !== productContainer) {
        target = target.parentElement;
      }
      if (target.classList.contains('product-card')) {
        var cardImageBox = target.querySelector('.product-image-box');
        if (cardImageBox) {
          cardImageBox.appendChild(productHoverPopup);
          productHoverPopup.classList.add('active');
        }
        target.addEventListener('mouseout', handleMouseOut);
      }
    };

    productContainer.addEventListener('mouseover', handleMouseOver);

  };

  var initSlider = function (slider) {
    var slides = slider.querySelectorAll('.common-slider-slide');
    var switches = slider.querySelectorAll('.common-slider-switch');
    var btnPrev = slider.querySelector('.common-slider-prev');
    var btnNext = slider.querySelector('.common-slider-next');

    var currentSlideNo = 0;

    var showSlide = function (slideNo) {
      if (slideNo !== currentSlideNo) {
        slides[currentSlideNo].classList.remove('active');
        if (switches[currentSlideNo]) {
          switches[currentSlideNo].classList.remove('active');
        }
        currentSlideNo = slideNo;
        slides[currentSlideNo].classList.add('active');
        if (switches[currentSlideNo]) {
          switches[currentSlideNo].classList.add('active');
        }
      }
    };

    var addSwitchEvent = function (sw, slideNo) {
      sw.addEventListener('click', function () {
        showSlide(slideNo)
      });
    };

    for (var i = 0; i < slides.length; i++) {
      if (slides[i].classList.contains('active')) {
        currentSlideNo = i;
        break;
      }
    }

    for (var i = 0; i < slides.length; i++) {
      if (i == currentSlideNo) {
        slides[i].classList.add('active');
        if (switches[i]) {
          switches[i].classList.add('active');
        }
      } else {
        slides[i].classList.remove('active');
        if (switches[i]) {
          switches[i].classList.remove('active');
        }
      }
    }

    if (btnPrev) {
      btnPrev.addEventListener('click', function () {
        var newSlideNo = currentSlideNo-1;
        if (newSlideNo < 0) {
          newSlideNo = slides.length-1;
        }
        showSlide(newSlideNo);
      });
    }

    if (btnNext) {
      btnNext.addEventListener('click', function () {
        var newSlideNo = currentSlideNo+1;
        if (newSlideNo >= slides.length) {
          newSlideNo = 0;
        }
        showSlide(newSlideNo);
      });
    }

    for (var i = 0; i < slides.length && i < switches.length; i++) {
      addSwitchEvent(switches[i], i);
    }
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
      }
    });
  };

  window.addEventListener('load', function () {
    popupWrapper = document.querySelector('.popup-wrapper');
    popupWrapper.addEventListener('click', handlePopupWrapperClick);

    makePopupLink('contacts-block-map', 'popup-map');
    makePopupLink('contacts-block-feedback', 'popup-feedback');
    makePopupLink('button-buy', 'popup-cartinfo');

    makeCardButtonsPopup();

    makeFeedbackValidator();

    var sliders = document.querySelectorAll('.common-slider');
    for (var i = 0; i < sliders.length; i++) {
      initSlider(sliders[i]);
    }
  });

})();
