/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-culture
 * Parses a single a.swiper-slide from .motoculture .swiper-wrapper
 * into a cards-culture block with image and text cells.
 */
export default function parse(element, { document }) {
  const cells = [];

  // --- Image cell ---
  const imageCell = [];
  imageCell.push(document.createComment(' field:image '));
  const img = element.querySelector('.img-box img');
  if (img) {
    imageCell.push(img.cloneNode(true));
  }

  // --- Text cell ---
  const textCell = [];
  textCell.push(document.createComment(' field:text '));

  const textP = element.querySelector('.text-section p');
  if (textP) {
    const h4 = document.createElement('h4');
    h4.textContent = textP.textContent.trim();
    textCell.push(h4);
  }

  const href = element.href || element.getAttribute('href');
  if (href) {
    const link = document.createElement('a');
    link.href = href;
    link.textContent = (textP && textP.textContent.trim()) || href;
    textCell.push(link);
  }

  cells.push([imageCell, textCell]);

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'cards-culture',
    cells,
  });

  element.replaceWith(block);
}
