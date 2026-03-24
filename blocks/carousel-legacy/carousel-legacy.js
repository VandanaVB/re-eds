import { moveInstrumentation } from '../../scripts/scripts.js';

function createSlide(row, slideIndex, cId) {
  const slide = document.createElement('li');
  slide.dataset.slideIndex = slideIndex;
  slide.setAttribute('id', `carousel-legacy-${cId}-slide-${slideIndex}`);
  slide.classList.add('carousel-legacy-slide');

  row.querySelectorAll(':scope > div').forEach((column, colIdx) => {
    column.classList.add(`carousel-legacy-slide-${colIdx === 0 ? 'image' : 'content'}`);
    slide.append(column);
  });

  const labeledBy = slide.querySelector('h1, h2, h3, h4, h5, h6');
  if (labeledBy) {
    slide.setAttribute('aria-labelledby', labeledBy.getAttribute('id'));
  }

  return slide;
}

/**
 * Set up section-level navigation for multiple carousel-legacy blocks
 * that should behave as a single unified carousel.
 */
function setupSectionCarousel(block) {
  const section = block.closest('.section.carousel-legacy-container');
  if (!section || section.dataset.legacyInit) return;
  section.dataset.legacyInit = 'true';

  const wrappers = [...section.querySelectorAll('.carousel-legacy-wrapper')];
  if (wrappers.length < 2) return;

  let activeIndex = 0;

  // Hide the first default-content-wrapper (Previous/Next + indicators markup)
  const firstDefault = section.querySelector('.default-content-wrapper:first-child');
  if (firstDefault) firstDefault.style.display = 'none';

  // Inject "Legacy since 1901" heading from the existing h2
  const existingH2 = section.querySelector('.default-content-wrapper h2');
  const headingText = existingH2 ? existingH2.textContent : 'Legacy since 1901';
  const heading = document.createElement('h3');
  heading.className = 'carousel-legacy-section-heading';
  heading.textContent = headingText;
  section.prepend(heading);

  // Create carousel area container to hold all wrappers
  const carouselArea = document.createElement('div');
  carouselArea.className = 'carousel-legacy-carousel-area';

  // Move all carousel wrappers into the carousel area
  wrappers.forEach((wrapper, idx) => {
    carouselArea.append(wrapper);
    if (idx === 0) {
      wrapper.classList.add('legacy-active');
    }
  });

  // Insert carousel area after the heading
  heading.after(carouselArea);

  // Create section-level navigation arrows
  const nav = document.createElement('div');
  nav.className = 'carousel-legacy-section-nav';
  nav.innerHTML = `
    <button type="button" class="legacy-prev" aria-label="Previous slide"></button>
    <button type="button" class="legacy-next" aria-label="Next slide"></button>
  `;
  carouselArea.append(nav);

  // Create pagination indicators
  const indicators = document.createElement('ul');
  indicators.className = 'carousel-legacy-section-indicators';
  wrappers.forEach((_, idx) => {
    const li = document.createElement('li');
    li.dataset.index = idx;
    if (idx === 0) li.classList.add('active');
    li.addEventListener('click', () => goToSlide(idx));
    indicators.append(li);
  });
  carouselArea.after(indicators);

  function goToSlide(index) {
    const total = wrappers.length;
    activeIndex = ((index % total) + total) % total;

    wrappers.forEach((wrapper, idx) => {
      wrapper.classList.toggle('legacy-active', idx === activeIndex);
    });

    indicators.querySelectorAll('li').forEach((li, idx) => {
      li.classList.toggle('active', idx === activeIndex);
    });
  }

  nav.querySelector('.legacy-prev').addEventListener('click', () => {
    goToSlide(activeIndex - 1);
  });

  nav.querySelector('.legacy-next').addEventListener('click', () => {
    goToSlide(activeIndex + 1);
  });

  // Touch/swipe support for mobile
  let touchStartX = 0;
  carouselArea.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  carouselArea.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      goToSlide(diff > 0 ? activeIndex + 1 : activeIndex - 1);
    }
  }, { passive: true });
}

let carouselId = 0;
export default async function decorate(block) {
  carouselId += 1;
  block.setAttribute('id', `carousel-legacy-${carouselId}`);
  const rows = block.querySelectorAll(':scope > div');

  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', 'Carousel');

  const container = document.createElement('div');
  container.classList.add('carousel-legacy-slides-container');

  const slidesWrapper = document.createElement('ul');
  slidesWrapper.classList.add('carousel-legacy-slides');

  rows.forEach((row, idx) => {
    const slide = createSlide(row, idx, carouselId);
    moveInstrumentation(row, slide);
    slidesWrapper.append(slide);
    row.remove();
  });

  container.append(slidesWrapper);
  block.prepend(container);

  // Set up section-level unified carousel after this block decorates
  requestAnimationFrame(() => setupSectionCarousel(block));
}
