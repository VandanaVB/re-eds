/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-shop
 * Parses a single .shop-card.swiper-slide
 * from .shop-section__cards.swiper-wrapper
 * into a cards-shop block with image and text cells.
 *
 * Actual DOM structure:
 *   <div class="shop-card__image-wrapper">
 *     <img class="shop-card__image" src="..." alt="Apparel">
 *   </div>
 *   <div class="shop-card__content">
 *     <div class="shop-card__title">Apparel</div>
 *     <p class="shop-card__description">Ride out. Stand out...</p>
 *     <div class="shop-card-action__button">
 *       <a class="shop-card__button" href="...">SHOP NOW</a>
 *     </div>
 *   </div>
 */
export default function parse(element, { document }) {
  const cells = [];

  // --- Image cell ---
  const imageCell = [];
  imageCell.push(document.createComment(' field:image '));
  const img = element.querySelector('img.shop-card__image')
    || element.querySelector('.shop-card__image-wrapper img');
  if (img) {
    imageCell.push(img.cloneNode(true));
  }

  // --- Text cell ---
  const textCell = [];
  textCell.push(document.createComment(' field:text '));

  const title = element.querySelector('.shop-card__title');
  if (title) {
    const h3 = document.createElement('h3');
    h3.textContent = title.textContent.trim();
    textCell.push(h3);
  }

  const desc = element.querySelector('.shop-card__description');
  if (desc) {
    const p = document.createElement('p');
    p.textContent = desc.textContent.trim();
    textCell.push(p);
  }

  const ctaLink = element.querySelector('.shop-card__button');
  if (ctaLink) {
    const link = document.createElement('a');
    link.href = ctaLink.href || ctaLink.getAttribute('href');
    link.textContent = ctaLink.textContent.trim();
    textCell.push(link);
  }

  cells.push([imageCell, textCell]);

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'cards-shop',
    cells,
  });

  element.replaceWith(block);
}
