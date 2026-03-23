/* eslint-disable */
/* global WebImporter */

/**
 * Parser: carousel-hero
 * Parses a single .swiper-slide from .swipercarousel.cmp--royal-enfield-swiper
 * into a carousel-hero block with image and text cells.
 * Block table: each row = 1 slide with [image | text content] columns.
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
  const picture = element.querySelector('picture');
  if (picture) {
    imageCell.push(picture.cloneNode(true));
  } else {
    const img = element.querySelector('img.banner-background-image');
    if (img) imageCell.push(img.cloneNode(true));
  }

  // --- Text cell ---
  const textCell = [];
  textCell.push(document.createComment(' field:content_text '));

  const heroTitle = element.querySelector('.hero-title p');
  if (heroTitle) {
    const h2 = document.createElement('h2');
    h2.textContent = heroTitle.textContent.trim();
    textCell.push(h2);
  }

  const heroDesc = element.querySelector('.hero-description p');
  if (heroDesc) {
    const p = document.createElement('p');
    p.textContent = heroDesc.textContent.trim();
    textCell.push(p);
  }

  const ctaButton = element.querySelector('button.glass-button');
  if (ctaButton) {
    const a = document.createElement('a');
    a.textContent = ctaButton.textContent.trim();
    a.href = ctaButton.getAttribute('title') || '#';
    textCell.push(a);
  }

  cells.push([imageCell, textCell]);

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'carousel-hero',
    cells,
  });

  element.replaceWith(block);
}
