/* eslint-disable */
/* global WebImporter */

/**
 * Parser: carousel-legacy
 * Parses a single .swiper-slide from .swiper-container--legacy
 * into a carousel-legacy block with image and text cells.
 * Block table: each row represents one slide with [image | text content] columns.
 *
 * Model fields:
 *   - media_image (reference)
 *   - media_imageAlt (collapsed-skip)
 *   - content_text (richtext)
 */
export default function parse(element, { document }) {
  const cells = [];

  // --- Image cell ---
  const imageCell = [];
  imageCell.push(document.createComment(' field:media_image '));
  const desktopImg = element.querySelector('img.timeline-image');
  if (desktopImg) {
    const picture = document.createElement('picture');
    picture.append(desktopImg.cloneNode(true));
    imageCell.push(picture);
  }

  // --- Text cell ---
  const textCell = [];
  textCell.push(document.createComment(' field:content_text '));

  const yearsEl = element.querySelector('.years');
  if (yearsEl) {
    const yearText = yearsEl.getAttribute('data-year') || yearsEl.textContent.trim();
    if (yearText) {
      const h2 = document.createElement('h2');
      h2.textContent = yearText;
      textCell.push(h2);
    }
  }

  const timelineContent = element.querySelector('.timeline-content');
  if (timelineContent) {
    const paragraphs = timelineContent.querySelectorAll('p');
    paragraphs.forEach((srcP) => {
      const cloned = srcP.cloneNode(true);
      const readMore = cloned.querySelector('.read-more');
      if (readMore) readMore.remove();
      const text = cloned.textContent.trim();
      if (text) {
        const p = document.createElement('p');
        p.innerHTML = cloned.innerHTML.trim();
        textCell.push(p);
      }
    });
  }

  cells.push([imageCell, textCell]);

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'carousel-legacy',
    cells,
  });

  element.replaceWith(block);
}
