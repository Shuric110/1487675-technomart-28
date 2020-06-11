'use strict';

(function () {
  var popupWrapper;
  var openedPopups = [];

  var closePopup;

  var handleCloseButtonClick = function () {
    closePopup(this.dataPopup);
  };

  var handlePopupWrapperClick = function (evt) {
    if (evt.target !== popupWrapper) {
      return;
    }

    var lastPopup = openedPopups.pop();
    if (lastPopup) {
      closePopup(lastPopup);
    } else {
      popupWrapper.classList.remove('active');
    }
  }

  closePopup = function (popup) {
    var closeButton = popup.querySelector('.popup-close-button');
    if (closeButton) {
      closeButton.removeEventListener('click', handleCloseButtonClick);
    }

    popup.classList.remove('active');

    var i = openedPopups.indexOf(popup);
    if (i >= 0) {
      openedPopups.splice(i, 1);
    }

    if (openedPopups.length === 0) {
      popupWrapper.classList.remove('active');
    }
  };

  var openPopup = function (popup) {
    if (popup.classList.contains('active')) return;

    popupWrapper.classList.add('active');
    popup.classList.add('active');
    var closeButton = popup.querySelector('.popup-close-button');
    if (closeButton) {
      closeButton.dataPopup = popup;
      closeButton.addEventListener('click', handleCloseButtonClick);
    }
    openedPopups.push(popup);
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

  window.addEventListener('load', function () {
    popupWrapper = document.querySelector('.popup-wrapper');
    popupWrapper.addEventListener('click', handlePopupWrapperClick);

    makePopupLink('contacts-block-map', 'popup-map');
    makePopupLink('contacts-block-feedback', 'popup-feedback');
    makePopupLink('button-buy', 'popup-cartinfo');

    makeCardButtonsPopup();
  });

})();
