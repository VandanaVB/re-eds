/* eslint-disable */
/* global WebImporter */

/**
 * Parser: tabs-showcase
 * Extracts tabbed content from Motorcycles (.motorcyclewithcategories)
 * and Ride (.iridegrid) sections into a Tabs Showcase block.
 *
 * Model fields (tabs-showcase-item):
 *   title           (text)      - tab label
 *   content_heading (text)      - heading text
 *   content_image   (reference) - image
 *   content_richtext(richtext)  - rich text content
 *
 * Block table: each row = 1 tab with 2 columns [title | content]
 */
export default function parse(element, { document }) {
  const isMotorcycles = element.matches('.motorcyclewithcategories');
  const isRide = element.matches('.iridegrid');
  if (!isMotorcycles && !isRide) return;

  const rows = [];

  if (isMotorcycles) {
    // Get unique category tab labels (skip slick clones, deduplicate by text)
    const tabSpans = element.querySelectorAll('.category-tab:not(.slick-cloned) span');
    const seen = new Set();
    const uniqueTabs = [];
    tabSpans.forEach((span) => {
      const label = span.textContent.trim();
      if (label && !seen.has(label)) {
        seen.add(label);
        uniqueTabs.push(label);
      }
    });

    // Bike names and images are individual slides with a bike-category attribute
    const nameSlides = element.querySelectorAll(
      '.motorcycle-carousel-bike-names:not(.slick-cloned)',
    );
    const imageSlides = element.querySelectorAll(
      '.motorcycle-carousel-bike-images:not(.slick-cloned)',
    );

    uniqueTabs.forEach((tabLabel) => {
      // --- Cell 1: title ---
      const titleCell = [];
      titleCell.push(document.createComment(' field:title '));
      titleCell.push(document.createTextNode(tabLabel));

      // --- Cell 2: content (heading + image + richtext) ---
      const contentCell = [];

      // content_heading
      contentCell.push(document.createComment(' field:content_heading '));
      const heading = document.createElement('h3');
      heading.textContent = tabLabel;
      contentCell.push(heading);

      // content_image — first image matching this category
      contentCell.push(document.createComment(' field:content_image '));
      imageSlides.forEach((slide) => {
        if (slide.getAttribute('bike-category') === tabLabel) {
          const img = slide.querySelector('img');
          if (img) contentCell.push(img.cloneNode(true));
        }
      });

      // content_richtext — bike names for this category
      contentCell.push(document.createComment(' field:content_richtext '));
      nameSlides.forEach((slide) => {
        if (slide.getAttribute('bike-category') === tabLabel) {
          const bikeName = slide.textContent.trim();
          if (bikeName) {
            const p = document.createElement('p');
            p.textContent = bikeName;
            contentCell.push(p);
          }
        }
      });

      rows.push([titleCell, contentCell]);
    });
  }

  if (isRide) {
    const cards = element.querySelectorAll('.swiper-slide.grid-item .card');
    cards.forEach((card) => {
      const headingEl = card.querySelector('.content h2');
      const tabLabel = headingEl ? headingEl.textContent.trim() : '';

      // --- Cell 1: title ---
      const titleCell = [];
      titleCell.push(document.createComment(' field:title '));
      titleCell.push(document.createTextNode(tabLabel));

      // --- Cell 2: content (heading + image + richtext) ---
      const contentCell = [];

      // content_heading
      contentCell.push(document.createComment(' field:content_heading '));
      const heading = document.createElement('h3');
      heading.textContent = tabLabel;
      contentCell.push(heading);

      // content_image
      contentCell.push(document.createComment(' field:content_image '));
      const picture = card.querySelector('picture');
      if (picture) {
        contentCell.push(picture.cloneNode(true));
      } else {
        const img = card.querySelector('img');
        if (img) contentCell.push(img.cloneNode(true));
      }

      // content_richtext
      contentCell.push(document.createComment(' field:content_richtext '));
      const hiddenContent = card.querySelector('.content .hidden-one');
      if (hiddenContent) {
        const paras = hiddenContent.querySelectorAll('p');
        paras.forEach((p) => contentCell.push(p.cloneNode(true)));
        const links = hiddenContent.querySelectorAll('a');
        links.forEach((a) => {
          const p = document.createElement('p');
          p.append(a.cloneNode(true));
          contentCell.push(p);
        });
      }

      rows.push([titleCell, contentCell]);
    });
  }

  if (!rows.length) return;

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'tabs-showcase',
    cells: rows,
  });

  element.replaceWith(block);
}
