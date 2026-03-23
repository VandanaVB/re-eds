/* Motorcycles Showcase - Interactive motorcycle carousel with category tabs */

// Category-to-bike mapping (matches Royal Enfield's actual categories)
const CATEGORY_MAP = {
  Roadster: ['Hunter 350', 'Guerrilla 450', 'Shotgun 650'],
  'Pure Sport': ['Interceptor 650', 'Continental GT 650'],
  Heritage: ['Goan Classic 350', 'Classic 350', 'Bullet 350', 'Classic 650'],
  Cruiser: ['Meteor 350', 'Super Meteor 650'],
  Adventure: ['Scram 440', 'Himalayan 450', 'Bear 650'],
};

function parseContent(block) {
  const inner = block.querySelector(':scope > div');
  if (!inner) return null;

  const elements = [...inner.children];
  const categories = [];
  const bikeNames = [];
  const bikeImages = [];
  const ctas = [];
  let heading = null;
  const seenCategories = new Set();
  const seenBikeNames = new Set();
  const seenBikeImages = new Set();

  elements.forEach((el) => {
    if (el.tagName === 'H2') {
      const text = el.textContent.trim();
      if (text === 'Motorcycles') {
        heading = text;
      } else if (!seenBikeNames.has(text)) {
        seenBikeNames.add(text);
        bikeNames.push(text);
      }
    } else if (el.tagName === 'P') {
      const img = el.querySelector('img');
      const links = el.querySelectorAll('a');

      if (links.length > 0) {
        links.forEach((a) => {
          ctas.push({ text: a.textContent.trim(), href: a.href, img: a.querySelector('img') });
        });
      } else if (img) {
        const src = img.src || '';
        const alt = img.alt || '';
        // Skip decorative/icon images
        if (src.includes('left-arrow') || src.includes('right.svg')
          || src.includes('smallCircle') || src.includes('vector-strike') || !alt) {
          return;
        }
        // This is a motorcycle image
        if (!seenBikeImages.has(alt)) {
          seenBikeImages.add(alt);
          bikeImages.push({ src, alt });
        }
      } else {
        const text = el.textContent.trim();
        if (text && !seenCategories.has(text)) {
          seenCategories.add(text);
          categories.push(text);
        }
      }
    }
  });

  return {
    heading, categories, bikeNames, bikeImages, ctas,
  };
}

function findBikeImage(bikeImages, bikeName) {
  return bikeImages.find((img) => img.alt === bikeName);
}

function getCategoryForBike(bikeName) {
  const entries = Object.entries(CATEGORY_MAP);
  for (let i = 0; i < entries.length; i += 1) {
    const [cat, bikes] = entries[i];
    if (bikes.includes(bikeName)) return cat;
  }
  return null;
}

export default function decorate(block) {
  const data = parseContent(block);
  if (!data) return;

  const {
    heading, categories, bikeNames, bikeImages, ctas,
  } = data;

  // Clear block content
  block.textContent = '';

  // Build section heading
  const headingEl = document.createElement('h2');
  headingEl.className = 'moto-heading';
  headingEl.textContent = heading;
  block.append(headingEl);

  // Build category strip
  const catStrip = document.createElement('div');
  catStrip.className = 'moto-categories';
  categories.forEach((cat) => {
    const catEl = document.createElement('div');
    catEl.className = 'moto-cat';
    catEl.textContent = cat;
    catEl.dataset.category = cat;
    catStrip.append(catEl);
  });
  block.append(catStrip);

  // Build bike names carousel with arrows
  const bikesNav = document.createElement('div');
  bikesNav.className = 'moto-bikes-nav';

  const prevBtn = document.createElement('button');
  prevBtn.className = 'moto-arrow moto-prev';
  prevBtn.type = 'button';
  prevBtn.ariaLabel = 'Previous motorcycle';
  prevBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>';

  const nextBtn = document.createElement('button');
  nextBtn.className = 'moto-arrow moto-next';
  nextBtn.type = 'button';
  nextBtn.ariaLabel = 'Next motorcycle';
  nextBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 6 15 12 9 18"/></svg>';

  const namesContainer = document.createElement('div');
  namesContainer.className = 'moto-bike-names';
  bikeNames.forEach((name) => {
    const nameEl = document.createElement('div');
    nameEl.className = 'moto-bike-name';
    nameEl.textContent = name;
    namesContainer.append(nameEl);
  });

  bikesNav.append(prevBtn);
  bikesNav.append(namesContainer);
  bikesNav.append(nextBtn);
  block.append(bikesNav);

  // Build image area
  const imageArea = document.createElement('div');
  imageArea.className = 'moto-image-area';
  const bikeImg = document.createElement('img');
  bikeImg.className = 'moto-bike-img';
  imageArea.append(bikeImg);
  block.append(imageArea);

  // Build CTA area
  const ctaArea = document.createElement('div');
  ctaArea.className = 'moto-cta-area';

  // Know More link (first)
  if (ctas[0]) {
    const knowMore = document.createElement('a');
    knowMore.href = ctas[0].href;
    knowMore.textContent = ctas[0].text;
    knowMore.className = 'moto-cta-know-more';
    ctaArea.append(knowMore);
  }

  // Bottom row: Configure + Test Ride side by side
  const ctaRow = document.createElement('div');
  ctaRow.className = 'moto-cta-row';
  if (ctas[1]) {
    const configBtn = document.createElement('a');
    configBtn.href = ctas[1].href;
    configBtn.textContent = ctas[1].text;
    configBtn.className = 'moto-cta-configure';
    ctaRow.append(configBtn);
  }
  if (ctas[2]) {
    const testBtn = document.createElement('a');
    testBtn.href = ctas[2].href;
    testBtn.textContent = ctas[2].text;
    testBtn.className = 'moto-cta-test-ride';
    if (ctas[2].img) {
      const arrow = document.createElement('img');
      arrow.src = ctas[2].img.src;
      arrow.alt = '';
      arrow.className = 'moto-cta-arrow';
      testBtn.append(arrow);
    }
    ctaRow.append(testBtn);
  }
  ctaArea.append(ctaRow);
  block.append(ctaArea);

  // State
  let activeIndex = 4; // Start at Goan Classic 350 (Heritage, like the original)

  function updateCarousel(idx) {
    const total = bikeNames.length;
    activeIndex = ((idx % total) + total) % total;

    // Update bike names - show 3 visible: prev, active, next
    const nameEls = namesContainer.querySelectorAll('.moto-bike-name');
    nameEls.forEach((el, i) => {
      el.classList.remove('is-active', 'is-prev', 'is-next', 'is-visible');
      if (i === activeIndex) {
        el.classList.add('is-active', 'is-visible');
      } else if (i === ((activeIndex - 1 + total) % total)) {
        el.classList.add('is-prev', 'is-visible');
      } else if (i === ((activeIndex + 1) % total)) {
        el.classList.add('is-next', 'is-visible');
      }
    });

    // Position bike names using transforms
    const containerWidth = namesContainer.offsetWidth;
    const centerX = containerWidth / 2;
    const activeEl = nameEls[activeIndex];
    const activeWidth = activeEl ? activeEl.offsetWidth : 200;
    const gap = 40;

    nameEls.forEach((el, i) => {
      let diff = i - activeIndex;
      if (diff > total / 2) diff -= total;
      if (diff < -(total / 2)) diff += total;

      let tx;
      if (diff === 0) {
        tx = centerX - (el.offsetWidth / 2);
      } else if (diff === -1) {
        tx = centerX - (activeWidth / 2) - gap - el.offsetWidth;
      } else if (diff === 1) {
        tx = centerX + (activeWidth / 2) + gap;
      } else {
        tx = centerX + diff * 300 - (el.offsetWidth / 2);
      }

      el.style.transform = `translateX(${tx}px) translateY(-50%)`;
      el.style.opacity = Math.abs(diff) <= 1 ? '1' : '0';
    });

    // Update bike image
    const activeName = bikeNames[activeIndex];
    const imgData = findBikeImage(bikeImages, activeName);
    if (imgData) {
      bikeImg.src = imgData.src;
      bikeImg.alt = imgData.alt;
    }

    // Update active category
    const activeCat = getCategoryForBike(activeName);
    catStrip.querySelectorAll('.moto-cat').forEach((el) => {
      el.classList.toggle('is-active', el.dataset.category === activeCat);
    });
  }

  // Event handlers
  prevBtn.addEventListener('click', () => updateCarousel(activeIndex - 1));
  nextBtn.addEventListener('click', () => updateCarousel(activeIndex + 1));

  // Category click
  catStrip.querySelectorAll('.moto-cat').forEach((el) => {
    el.addEventListener('click', () => {
      const cat = el.dataset.category;
      const bikesInCat = CATEGORY_MAP[cat];
      if (bikesInCat) {
        const firstBikeIdx = bikeNames.findIndex((n) => bikesInCat.includes(n));
        if (firstBikeIdx >= 0) updateCarousel(firstBikeIdx);
      }
    });
  });

  // Bike name click
  namesContainer.querySelectorAll('.moto-bike-name').forEach((el, i) => {
    el.addEventListener('click', () => updateCarousel(i));
  });

  // Initial render
  requestAnimationFrame(() => updateCarousel(activeIndex));

  // Recalculate on resize
  window.addEventListener('resize', () => updateCarousel(activeIndex));
}
