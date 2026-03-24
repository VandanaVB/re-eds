export default function decorate(block) {
  const section = block.closest('.section');
  const allBlocks = section ? [...section.querySelectorAll('.cards-culture')] : [block];

  // Only the first cards-culture block builds the slider
  if (allBlocks[0] !== block) {
    block.closest('.cards-culture-wrapper')?.remove();
    return;
  }

  // Collect all card data from all cards-culture blocks in this section
  const cards = [];
  allBlocks.forEach((b) => {
    [...b.children].forEach((row) => {
      const cols = [...row.children];
      const imgCol = cols.find((d) => d.querySelector('picture, img'));
      const bodyCol = cols.find((d) => d !== imgCol);
      const picture = imgCol?.querySelector('picture');
      const img = imgCol?.querySelector('img');
      const h4 = bodyCol?.querySelector('h4');
      const link = bodyCol?.querySelector('a');
      cards.push({
        picture,
        img,
        title: h4?.textContent?.trim() || '',
        href: link?.href || '#',
      });
    });
  });

  // Remove other cards-culture blocks (keep this one)
  allBlocks.slice(1).forEach((b) => {
    b.closest('.cards-culture-wrapper')?.remove();
  });

  // Build the slider
  const slider = document.createElement('div');
  slider.className = 'cards-culture-slider';

  const track = document.createElement('div');
  track.className = 'cards-culture-track';

  cards.forEach((card, i) => {
    const num = String(i + 1).padStart(2, '0');

    const slide = document.createElement('a');
    slide.className = 'cards-culture-card';
    slide.href = card.href;

    // Image — reuse existing picture/img element from content
    const imageWrap = document.createElement('div');
    imageWrap.className = 'cards-culture-card-image';
    if (card.picture) {
      imageWrap.append(card.picture);
    } else if (card.img) {
      imageWrap.append(card.img);
    }
    slide.append(imageWrap);

    // Text overlay
    const overlay = document.createElement('div');
    overlay.className = 'cards-culture-card-overlay';

    const number = document.createElement('span');
    number.className = 'cards-culture-card-number';
    number.textContent = num;
    overlay.append(number);

    const title = document.createElement('span');
    title.className = 'cards-culture-card-title';
    title.textContent = card.title;
    overlay.append(title);

    slide.append(overlay);
    track.append(slide);
  });

  slider.append(track);

  // Next button
  const nextBtn = document.createElement('button');
  nextBtn.className = 'cards-culture-next';
  nextBtn.setAttribute('aria-label', 'Next');
  nextBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>';
  slider.append(nextBtn);

  // Scroll behavior
  nextBtn.addEventListener('click', () => {
    track.scrollBy({ left: 442, behavior: 'smooth' });
  });

  block.textContent = '';
  block.append(slider);
}
