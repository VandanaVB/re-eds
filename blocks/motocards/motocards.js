import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const ul = document.createElement('ul');
  ul.classList.add('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', 'gap-6');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.classList.add('relative', 'overflow-hidden', 'rounded', 'group', 'text-white');
    moveInstrumentation(row, li);

    const [imgDiv, textDiv, primaryDiv, secondaryDiv] = [...row.children];

    if (imgDiv) {
      imgDiv.className = 'motocards-card-image';
      li.append(imgDiv);
    }

    const ctaRow = document.createElement('div');
    ctaRow.className = 'cta-row absolute inset-0 flex items-center justify-center gap-4 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0';

    [primaryDiv, secondaryDiv].forEach((div, idx) => {
      const link = div?.querySelector('a');
      if (link) {
        link.classList.add('cta', 'px-4', 'py-2', 'text-sm', 'font-medium', 'rounded');
        if (idx === 0) {
          link.classList.add('bg-red-600', 'text-white');
        } else {
          link.classList.add('border', 'border-white', 'text-white');
        }
        ctaRow.append(link);
      }
    });

    if (ctaRow.children.length) li.append(ctaRow);

    if (textDiv) {
      const overlay = document.createElement('div');
      overlay.className = 'absolute bottom-0 left-0 w-full bg-black bg-opacity-70 p-4';
      overlay.innerHTML = textDiv.innerHTML;
      overlay.querySelectorAll('p').forEach((p) => p.classList.add('font-bold', 'm-0'));
      li.append(overlay);
    }

    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.textContent = '';
  block.classList.add('bg-black', 'py-8');
  block.append(ul);
}
