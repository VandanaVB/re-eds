/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-events
 * Parses a .marquee-rides-events-card.swiper-slide element from
 * .marquee-rides-events-cards.swiper-wrapper into a cards-events
 * block containing image and text cells.
 *
 * Actual DOM structure:
 *   <picture>...</picture>
 *   <h2 class="status-banner">Upcoming</h2>
 *   <div class="card-content-container">
 *     <div class="card-content">
 *       <h3 class="card-heading">Moroccan Odyssey 2026</h3>
 *       <div class="location"><p>Marrakesh - Rabat</p></div>
 *       <div class="date"><p>25 Mar 2026 - 5 Apr 2026</p></div>
 *       <div class="card-buttons"><a class="card-details-button">KNOW MORE</a></div>
 *     </div>
 *   </div>
 */
export default function parse(element, { document }) {
  const cells = [];

  // --- Image cell ---
  const imageCell = [];
  imageCell.push(document.createComment(' field:image '));
  const picture = element.querySelector('picture');
  if (picture) {
    imageCell.push(picture.cloneNode(true));
  } else {
    const img = element.querySelector('img');
    if (img) imageCell.push(img.cloneNode(true));
  }

  // --- Text cell ---
  const textCell = [];
  textCell.push(document.createComment(' field:text '));

  // Heading - use specific selectors first, avoid status-banner h2
  const heading = element.querySelector('.card-heading, h3.card-heading, .card-content h3, [class*="title"]:not(.status-banner):not([class*="status"])');
  if (heading) {
    const h3 = document.createElement('h3');
    h3.textContent = heading.textContent.trim();
    textCell.push(h3);
  }

  // Location
  const location = element.querySelector('.location p, .location');
  if (location) {
    const p = document.createElement('p');
    p.textContent = location.textContent.trim();
    textCell.push(p);
  }

  // Date
  const date = element.querySelector('.date p, .date, .event-date');
  if (date) {
    const p = document.createElement('p');
    p.textContent = date.textContent.trim();
    textCell.push(p);
  }

  // CTA link
  const cta = element.querySelector('.card-details-button, .card-buttons a, a[class*="button"]');
  if (cta) {
    const link = document.createElement('a');
    link.href = cta.href || cta.getAttribute('href');
    link.textContent = cta.textContent.trim();
    textCell.push(link);
  }

  cells.push([imageCell, textCell]);

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'cards-events',
    cells,
  });

  element.replaceWith(block);
}
