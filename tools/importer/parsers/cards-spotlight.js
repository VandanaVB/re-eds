/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-spotlight
 * Parses a single .swiper-slide from #highlights-section
 * .whats-trending-cmp-desktop .swiper-wrapper into a cards-spotlight
 * block with image and text cells.
 *
 * Actual DOM structure:
 *   <div class="thumbnail-image"><picture>...</picture></div>
 *   <div class="trending-content-card">
 *     <div class="card-image">
 *       <picture><img class="bg-img" ...></picture>
 *       <h2 class="card-title">Title</h2>    (optional - not all slides have this)
 *     </div>
 *     <div class="card-description"><p>Description</p></div>
 *     <div class="cta-buttons">
 *       <a class="viewfinanceoption">KNOW MORE</a>
 *       <a class="whats-trending__view-motorcycle-button">Watch Now</a>
 *     </div>
 *   </div>
 */
export default function parse(element, { document }) {
  const cells = [];

  // --- Image cell ---
  const imageCell = [];
  imageCell.push(document.createComment(' field:image '));
  const picture = element.querySelector('.trending-content-card .card-image picture');
  if (picture) {
    imageCell.push(picture.cloneNode(true));
  } else {
    const img = element.querySelector('.trending-content-card .card-image img.bg-img');
    if (img) imageCell.push(img.cloneNode(true));
  }

  // --- Text cell ---
  const textCell = [];
  textCell.push(document.createComment(' field:text '));

  const title = element.querySelector('.card-title');
  if (title) {
    const h2 = document.createElement('h2');
    h2.textContent = title.textContent.trim();
    textCell.push(h2);
  }

  const desc = element.querySelector('.card-description p');
  if (desc) {
    const p = document.createElement('p');
    p.textContent = desc.textContent.trim();
    textCell.push(p);
  }

  const ctaLinks = element.querySelectorAll('.cta-buttons a');
  ctaLinks.forEach((a) => {
    const link = document.createElement('a');
    link.href = a.href || a.getAttribute('href');
    link.textContent = a.textContent.trim();
    textCell.push(link);
  });

  cells.push([imageCell, textCell]);

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'cards-spotlight',
    cells,
  });

  element.replaceWith(block);
}
