/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Royal Enfield cleanup.
 * Selectors from captured DOM of https://www.royalenfield.com/in/en/home/
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Fix overflow:hidden on body that blocks parsing
    if (element.style && element.style.overflow === 'hidden') {
      element.style.overflow = '';
    }

    // Remove cookie/consent/GDPR forms (from captured DOM: .re-cookies, .form-gdpr, .consent__check)
    WebImporter.DOMUtils.remove(element, [
      '.form-gdpr',
      '.consent__check',
      '.re__revamp-v4__consent__heading',
      '.gdpr-error',
      '[class*="cookie"]',
    ]);
  }

  if (hookName === H.after) {
    // Remove header experience fragment (from captured DOM: .cmp-experiencefragment--header)
    WebImporter.DOMUtils.remove(element, [
      '.cmp-experiencefragment--header',
      '.re-revamp-v4-header',
    ]);

    // Remove footer experience fragment (from captured DOM: .cmp-experiencefragment--footer, .re-revamp__footer-fragment)
    WebImporter.DOMUtils.remove(element, [
      '.cmp-experiencefragment--footer',
      '.re-revamp__footer-fragment',
    ]);

    // Remove non-authorable sidebar elements
    WebImporter.DOMUtils.remove(element, [
      '.re-revamp-v4-sidebar-header',
      '.re-revamp-v4-sidebar-footer',
    ]);

    // Remove safe non-content elements
    WebImporter.DOMUtils.remove(element, [
      'iframe',
      'link',
      'noscript',
      'script',
    ]);

    // Remove tracking/analytics attributes
    element.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('data-cmp-data-layer');
      el.removeAttribute('data-cmp-clickable');
      el.removeAttribute('onclick');
      el.removeAttribute('data-track');
    });
  }
}
