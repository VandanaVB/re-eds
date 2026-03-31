import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Consolidates sibling cards-spotlight blocks within the same section into a single block.
 */
function consolidateSiblingBlocks(block) {
  const section = block.closest('.section');
  if (!section) return;
  const allBlocks = [...section.querySelectorAll('.cards-spotlight')];
  if (allBlocks.length <= 1 || allBlocks[0] !== block) return;
  allBlocks.slice(1).forEach((sibling) => {
    const rows = sibling.querySelectorAll(':scope > div');
    rows.forEach((row) => block.append(row));
    const wrapper = sibling.closest('.cards-spotlight-wrapper');
    if (wrapper) wrapper.remove();
  });
}

function getSlideWidth() {
  if (window.innerWidth < 900) return window.innerWidth - 48;
  if (window.innerWidth < 1200) return 450;
  return 546;
}

function updateActiveSlide(block, index) {
  const slides = block.querySelector('.cards-spotlight-slides');
  if (!slides) return;

  const slideEls = [...slides.children];
  const total = slideEls.length;
  const idx = ((index % total) + total) % total;
  block.dataset.activeSlide = idx;

  const slideWidth = getSlideWidth();
  const gap = 24;
  const containerWidth = slides.parentElement.offsetWidth;
  const centerOffset = (containerWidth - slideWidth) / 2;

  slideEls.forEach((slide, i) => {
    slide.classList.remove('is-active', 'is-prev', 'is-next', 'is-far');

    let diff = i - idx;
    let ty = 0;
    let cls = 'is-far';

    if (diff === 0) {
      cls = 'is-active';
    } else if (diff === -1 || (idx === 0 && i === total - 1)) {
      cls = 'is-prev';
      ty = 320;
      diff = -1;
    } else if (diff === 1 || (idx === total - 1 && i === 0)) {
      cls = 'is-next';
      diff = 1;
    }

    const tx = centerOffset + diff * (slideWidth + gap);
    slide.classList.add(cls);
    slide.style.transform = `translate(${tx}px, ${ty}px)`;
  });
}

function buildCarouselNav(block) {
  const prevBtn = document.createElement('button');
  prevBtn.type = 'button';
  prevBtn.className = 'cards-spotlight-nav cards-spotlight-nav-prev';
  prevBtn.ariaLabel = 'Previous slide';
  prevBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>';
  prevBtn.addEventListener('click', () => {
    const current = parseInt(block.dataset.activeSlide, 10) || 0;
    updateActiveSlide(block, current - 1);
  });

  const nextBtn = document.createElement('button');
  nextBtn.type = 'button';
  nextBtn.className = 'cards-spotlight-nav cards-spotlight-nav-next';
  nextBtn.ariaLabel = 'Next slide';
  nextBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 6 15 12 9 18"/></svg>';
  nextBtn.addEventListener('click', () => {
    const current = parseInt(block.dataset.activeSlide, 10) || 0;
    updateActiveSlide(block, current + 1);
  });

  const slidesContainer = block.querySelector('.cards-spotlight-slides-container');
  slidesContainer.append(prevBtn);
  slidesContainer.append(nextBtn);
}

export default function decorate(block) {
  consolidateSiblingBlocks(block);
  if (!block.isConnected) return;

  const ul = document.createElement('ul');
  ul.className = 'cards-spotlight-slides';
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.className = 'cards-spotlight-slide';
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div, divIdx) => {
      const hasImage = div.querySelector('picture') || div.querySelector('img');
      if (divIdx === 0 && div.children.length === 1 && hasImage) {
        div.className = 'cards-spotlight-card-image';
      } else {
        div.className = 'cards-spotlight-card-body';
      }
    });
    ul.append(li);
  });

  ul.querySelectorAll('.cards-spotlight-card-image img').forEach((img) => {
    const isExternal = img.src && !img.src.startsWith(window.location.origin);
    if (!isExternal) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      const parent = img.closest('picture') || img.parentElement;
      parent.replaceWith(optimizedPic);
    }
  });

  block.textContent = '';
  block.dataset.activeSlide = '0';

  const slidesContainer = document.createElement('div');
  slidesContainer.className = 'cards-spotlight-slides-container';
  slidesContainer.append(ul);
  block.append(slidesContainer);

  const slideCount = ul.children.length;
  if (slideCount > 1) {
    buildCarouselNav(block);
  }

  // Defer initial positioning until after layout
  requestAnimationFrame(() => updateActiveSlide(block, 0));

  // Recalculate on resize
  window.addEventListener('resize', () => {
    const current = parseInt(block.dataset.activeSlide, 10) || 0;
    updateActiveSlide(block, current);
  });
}
