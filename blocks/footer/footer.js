import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Creates the social media links section dynamically.
 * This is done in JS because the content is not available in the AEM fragment.
 * @returns {HTMLElement} A div element containing the social links.
 */
function createSocialLinks() {
  // Data for social media links, including inline SVG icons for high quality.
  const socialLinksData = [
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/royalenfield',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z"/></svg>`,
    },
    {
      name: 'X',
      url: 'https://twitter.com/royalenfield',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
    },
    {
      name: 'YouTube',
      url: 'https://www.youtube.com/channel/UCyxUUHqmz9IiAnrROJc0mag',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M21.582 7.643A2.46 2.46 0 0 0 19.84 5.9c-1.75-.48-8.83-.48-8.83 0A2.46 2.46 0 0 0 9.228 7.643c-.48 1.75-.48 5.45 0 7.2.24.87.98 1.5 1.782 1.74 1.75.48 8.83.48 8.83 0 .8-.24 1.54-.87 1.782-1.74.48-1.75.48-5.45 0-7.2zM10 15.2V8.8l6 3.2-6 3.2z"/></svg>`,
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/royalenfield',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.012 3.584-.07 4.85c-.148 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.012-3.584.07-4.85c.148-3.225 1.664-4.771 4.919-4.919C8.416 2.175 8.796 2.163 12 2.163zm0 1.802c-3.153 0-3.502.012-4.728.068-2.751.126-3.939 1.313-4.064 4.064-.056 1.225-.069 1.575-.069 4.728s.013 3.503.069 4.728c.125 2.751 1.313 3.939 4.064 4.064 1.225.056 1.575.069 4.728.069s3.503-.013 4.728-.069c2.751-.125 3.939-1.313 4.064-4.064.056-1.225.069-1.575.069-4.728s-.013-3.503-.069-4.728c-.125-2.751-1.313-3.939-4.064-4.064-1.226-.056-1.575-.068-4.728-.068zm0 3.064a5.158 5.158 0 1 0 0 10.316 5.158 5.158 0 0 0 0-10.316zm0 1.802a3.356 3.356 0 1 1 0 6.712 3.356 3.356 0 0 1 0-6.712zM16.965 5.585a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4z"/></svg>`,
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/company/royal-enfield/',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zm1.775 13.019H3.562V9h3.55v11.452z"/></svg>`,
    },
  ];

  const socialLinksDiv = document.createElement('div');
  socialLinksDiv.className = 'social-links';

  const p = document.createElement('p');
  p.textContent = 'Join the conversation';
  socialLinksDiv.append(p);

  const ul = document.createElement('ul');
  socialLinksData.forEach((item) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = item.url;
    a.title = item.name;
    a.target = '_blank';
    a.rel = 'nofollow noopener'; // Added noopener for security
    a.innerHTML = item.icon;
    li.append(a);
    ul.append(li);
  });

  socialLinksDiv.append(ul);
  return socialLinksDiv;
}

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

    // Add the dynamically created social links to the social wrapper
    const socialLinksEl = createSocialLinks();
    socialWrapper.append(socialLinksEl);

    const linksWrapper = document.createElement('div');
    linksWrapper.className = 'footer-links-wrapper';

    const bottomWrapper = document.createElement('div');
    bottomWrapper.className = 'footer-bottom-wrapper';

    // Group H3s and ULs into columns
    let i = 0;
    while (i < allElements.length) {
      const el = allElements[i];
      if (el.tagName === 'H3' && allElements[i + 1]?.tagName === 'UL') {
        const column = document.createElement('div');
        column.className = 'list-of-links';
        column.append(el);
        const ul = allElements[i + 1];
        ul.className = 'nav-list';
        column.append(ul);
        linksWrapper.append(column);
        i += 2;
      } else {
        bottomWrapper.append(el);
        i += 1;
      }
    }

    // Refine the bottom wrapper structure for copyright and legal links
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

    // Append the newly structured content in the correct order
    container.append(socialWrapper);
    container.append(linksWrapper);
    container.append(bottomWrapper);
  }

  block.append(footer);

  // --- Accordion Logic for Mobile ---
  const mediaQuery = window.matchMedia('(max-width: 767px)');
  const accordionLinks = footer.querySelectorAll('.list-of-links h3');
  
  const setupAccordion = () => {
    accordionLinks.forEach(h3 => {
      h3.addEventListener('click', (e) => {
        if (mediaQuery.matches) {
          const parent = e.target.closest('.list-of-links');
          parent.classList.toggle('expanded');
        }
      });
    });
  };

  if (mediaQuery.matches) {
    setupAccordion();
  }
}
