import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  // --- Start of new logic ---
  const container = footer.querySelector('.default-content-wrapper');
  if (container) {
    const allElements = [...container.children];
    container.innerHTML = ''; // Clear the original container

    const linksWrapper = document.createElement('div');
    linksWrapper.classList.add('footer-links-wrapper');

    const bottomWrapper = document.createElement('div');
    bottomWrapper.classList.add('footer-bottom-wrapper');

    let currentColumn;

    allElements.forEach((el) => {
      // If an H3 is found, start a new column
      if (el.tagName === 'H3') {
        currentColumn = document.createElement('div');
        currentColumn.classList.add('footer-column');
        currentColumn.append(el);
        linksWrapper.append(currentColumn);
      } else if (el.tagName === 'UL' && currentColumn) {
        // If a UL follows an H3, add it to the current column
        currentColumn.append(el);
      } else {
        // All other elements (copyright, legal links) go to the bottom
        bottomWrapper.append(el);
      }
    });

    container.append(linksWrapper);
    container.append(bottomWrapper);
  }
  // --- End of new logic ---

  block.append(footer);
}
