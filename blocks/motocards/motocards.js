import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    const [imgDiv, textDiv, primaryDiv, secondaryDiv] = [...row.children];
    if (imgDiv) {
      imgDiv.className = 'motocards-card-image';
      li.append(imgDiv);
    }
    if (textDiv) {
      textDiv.className = 'motocards-card-body';
      const ctaRow = document.createElement('div');
      ctaRow.className = 'cta-row';
      [primaryDiv, secondaryDiv].forEach((div) => {
        const link = div?.querySelector('a');
        if (link) {
          link.classList.add('cta');
          ctaRow.append(link);
        }
      });
      if (ctaRow.children.length) textDiv.append(ctaRow);
      li.append(textDiv);
    }
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
  block.textContent = '';
  block.append(ul);
}
