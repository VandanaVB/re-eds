import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && (div.querySelector('picture') || div.querySelector('img'))) div.className = 'cards-shop-card-image';
      else div.className = 'cards-shop-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('.cards-shop-card-image img').forEach((img) => {
    const pic = img.closest('picture');
    if (pic) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      pic.replaceWith(optimizedPic);
    }
  });
  block.textContent = '';
  block.append(ul);
}
