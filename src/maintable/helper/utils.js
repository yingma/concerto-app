'use strict';

export function closest(el, fn) {
    while (el) {
      if (fn(el)) {
        return el;
      }
  
      el = el.parentNode;
    }
  
    return null;
}

export const events = {
    end: ['touchend', 'touchcancel', 'mouseup'],
    move: ['touchmove', 'mousemove'],
    start: ['touchstart', 'mousedown'],
}

export function getPosition(event) {
    if (event.touches && event.touches.length) {
      return {
        x: event.touches[0].pageX,
        y: event.touches[0].pageY,
      };
    } else if (event.changedTouches && event.changedTouches.length) {
      return {
        x: event.changedTouches[0].pageX,
        y: event.changedTouches[0].pageY,
      };
    } else {
      return {
        x: event.pageX,
        y: event.pageY,
      };
    }
}

export const vendorPrefix = (function() {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    // Server environment
    return '';
  }

  // fix for: https://bugzilla.mozilla.org/show_bug.cgi?id=548397
  // window.getComputedStyle() returns null inside an iframe with display: none
  // in this case return an array with a fake mozilla style in it.
  const styles = window.getComputedStyle(document.documentElement, '') || [
    '-moz-hidden-iframe',
  ];
  const pre = (Array.prototype.slice
    .call(styles)
    .join('')
    .match(/-(moz|webkit|ms)-/) ||
    (styles.OLink === '' && ['', 'o']))[1];

  switch (pre) {
    case 'ms':
      return 'ms';
    default:
      return pre && pre.length ? pre[0].toUpperCase() + pre.substr(1) : '';
  }
})();

export function setTranslate(node, translate) {
  node.style[`${vendorPrefix}Transform`] =
    translate == null ? '' : `translate(${translate.x}px,${translate.y}px)`;
}

export function setRotate(node, degree) {
  node.style[`${vendorPrefix}Transform`] =
    degree == null ? '' : `rotate(${degree}deg)`;
}

export function setTransitionDuration(node, duration) {
  node.style[`${vendorPrefix}TransitionDuration`] =
    duration == null ? '' : `${duration}ms`;
}