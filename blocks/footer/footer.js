import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // Load footer content from the fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // Decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  const container = footer.querySelector('.default-content-wrapper');
  if (container) {
    const allElements = [...container.children];
    container.innerHTML = ''; // Clear the original container to rebuild it

    // Create wrappers that mimic the original site's row structure
    const socialWrapper = document.createElement('div');
    socialWrapper.className = 'footer-social-wrapper';

    const linksWrapper = document.createElement('div');
    linksWrapper.className = 'footer-links-wrapper';

    const bottomWrapper = document.createElement('div');
    bottomWrapper.className = 'footer-bottom-wrapper';

    // NOTE: The AEM content fragment needs a section for social links for this to be populated.
    // For now, this acts as a placeholder for the "Join the conversation" part.

    // Group H3s and ULs into columns
    let i = 0;
    while (i < allElements.length) {
      const el = allElements[i];
      if (el.tagName === 'H3' && allElements[i + 1]?.tagName === 'UL') {
        // Found a heading and a list, group them into a column
        const column = document.createElement('div');
        // Add classes from original site for accurate styling
        column.className = 'list-of-links';

        // Add the heading to the column
        column.append(el);
        
        // Add the class 'nav-list' to the UL and add it to the column
        const ul = allElements[i + 1];
        ul.className = 'nav-list';
        column.append(ul);

        linksWrapper.append(column);
        i += 2; // Move past the H3 and UL
      } else {
        // Any other elements are moved to the bottom wrapper
        bottomWrapper.append(el);
        i += 1;
      }
    }

    // Refine the bottom wrapper structure for precise styling
    const copyrightP = bottomWrapper.querySelector('p');
    if (copyrightP) {
      const copyrightDiv = document.createElement('div');
      copyrightDiv.className = 'copyright-text';
      copyrightDiv.append(copyrightP);
      bottomWrapper.prepend(copyrightDiv);
    }
    const legalUl = bottomWrapper.querySelector('ul');
    if (legalUl) {
      legalUl.className = 'extra-links';
    }

    // Append the newly structured content
    container.append(socialWrapper);
    container.append(linksWrapper);
    container.append(bottomWrapper);
  }

  block.append(footer);
}
