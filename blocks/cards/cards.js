import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-card-image';
      } else {
        div.className = 'cards-card-body';
      }
    });

    /* ---------- overlay variant? ---------- */
    const ctaLabelDiv = li.querySelector('[data-aue-prop="ctaLabel"]');
    const ctaLinkDiv  = li.querySelector('.cards-card-body a');

    if (ctaLabelDiv && ctaLinkDiv) {
      /* Build overlay */
      const overlay = document.createElement('div');
      overlay.className = 'cards-overlay';

      const titleDiv = li.querySelector('.cards-card-body'); // first body = headline
      if (titleDiv) {
        overlay.append(titleDiv); // move headline into overlay
      }

      const btn = document.createElement('a');
      btn.className = 'cards-btn';
      btn.href = ctaLinkDiv.getAttribute('href');
      btn.textContent = ctaLabelDiv.textContent.trim();
      overlay.append(btn);

      ctaLabelDiv.remove();
      ctaLinkDiv.closest('.cards-card-body')?.remove();

      li.append(overlay);

    } else {
      /* ---------- simple card variant (wrap whole card) ---------- */
      const link = li.querySelector('a');
      if (link) {
        const url = link.getAttribute('href');
        const wrapper = document.createElement('a');
        wrapper.href = url;
        wrapper.className = 'card-link';
        moveInstrumentation(li, wrapper);

        /* remove old links */
        li.querySelectorAll('a').forEach((a) => a.remove());

        while (li.firstChild) wrapper.append(li.firstChild);
        li.appendChild(wrapper);
      }
    }

    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const pic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, pic.querySelector('img'));
    img.closest('picture').replaceWith(pic);
  });

  block.textContent = '';
  block.append(ul);
}