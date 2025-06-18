import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    const [imgDiv, iconDiv, textDiv, labelDiv, linkDiv] = [...row.children];

    if (imgDiv) imgDiv.className = 'supportcards-card-image';
    if (iconDiv) iconDiv.className = 'supportcards-card-icon';

    const bodyDiv = document.createElement('div');
    bodyDiv.className = 'supportcards-card-body';
    if (textDiv) {
      bodyDiv.append(...textDiv.childNodes);
    }

    const link = linkDiv?.querySelector('a');
    const label = labelDiv?.textContent.trim() || link?.textContent.trim() || '';
    if (link) {
      const btn = document.createElement('div');
      btn.className = 'supportcards-card-link';
      btn.textContent = label || 'Know More';
      bodyDiv.append(btn);
    }

    const wrapper = link ? document.createElement('a') : document.createElement('div');
    if (link) wrapper.href = link.href;
    wrapper.className = 'card-link';
    if (imgDiv) wrapper.append(imgDiv);
    if (iconDiv) wrapper.append(iconDiv);
    wrapper.append(bodyDiv);

    li.append(wrapper);
    ul.append(li);
  });

  ul.querySelectorAll('.supportcards-card-image img').forEach((img) => {
    const pic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, pic.querySelector('img'));
    img.closest('picture').replaceWith(pic);
  });

  block.textContent = '';
  block.append(ul);
}
