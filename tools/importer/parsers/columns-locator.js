/* eslint-disable */
/* global WebImporter */

/**
 * Parser: columns-locator
 * Extracts the Locate Us section (.section-locate-centre.re-rides-home-locate-us-component)
 * into a Columns Locator block.
 *
 * Columns blocks do NOT require HTML field-hint comments per xwalk rules.
 * Block table: one row, two columns → [leftContent | rightContent]
 */
export default function parse(element, { document }) {
  if (!element.matches('.section-locate-centre.re-rides-home-locate-us-component')) return;

  // --- Left column: heading + description ---
  const leftCol = [];

  const h3 = element.querySelector('h3');
  if (h3) {
    const heading = document.createElement('h3');
    heading.textContent = h3.textContent.trim();
    leftCol.push(heading);
  }

  const descEl = element.querySelector('.locate-centre__card-desc');
  if (descEl) {
    const paras = descEl.querySelectorAll('p');
    paras.forEach((p) => {
      const text = p.textContent.trim();
      if (text) {
        const para = document.createElement('p');
        para.textContent = text;
        leftCol.push(para);
      }
    });
  }

  // CTA link - try .locate-centre__card-cta a, then fall back to any visible link
  const ctaLink = element.querySelector('.locate-centre__card-cta a')
    || element.querySelector('a.locate-view-more-cta')
    || element.querySelector('.locate-centre__card-lh a');
  if (ctaLink) {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = ctaLink.href || ctaLink.getAttribute('href');
    a.textContent = ctaLink.textContent.trim();
    p.append(a);
    leftCol.push(p);
  }

  // --- Right column: image ---
  const rightCol = [];

  const img = element.querySelector('.locate-centre__card img')
    || element.querySelector('img');
  if (img) {
    rightCol.push(img.cloneNode(true));
  }

  const cells = [[leftCol, rightCol]];

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'columns-locator',
    cells,
  });

  element.replaceWith(block);
}
