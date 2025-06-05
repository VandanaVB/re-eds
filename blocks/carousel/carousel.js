export default function decorate(block) {
  const track = document.createElement('div');
  track.className = 'carousel-track';
  while (block.firstElementChild) track.append(block.firstElementChild);
  block.append(track);

  block.insertAdjacentHTML('beforeend',
    '<button class="carousel-arrow prev" type="button">‹</button>' +
    '<button class="carousel-arrow next" type="button">›</button>');

  const slides = [...track.children];
  let index = 0;

  slides.forEach((slide) => {
    slide.classList.add('carousel-slide');
    const parts = [...slide.children];
    const [desktopPic, mobilePicDiv, headDiv, subDiv,
           pLabDiv, pLinkDiv, sLabDiv, sLinkDiv, alignDiv] = parts;

  let pictureHTML = desktopPic.outerHTML;
  if (mobilePicDiv && mobilePicDiv.querySelector('img')) {
    const desktopSrc = desktopPic.querySelector('img').src;
    const mobileSrc  = mobilePicDiv.querySelector('img').src;
    const alt        = desktopPic.querySelector('img').alt || '';
    pictureHTML = `
      <picture>
        <source media="(max-width: 767px)" srcset="${mobileSrc}">
        <img src="${desktopSrc}" alt="${alt}" loading="lazy">
      </picture>`;
  }
    const align = (alignDiv?.textContent || 'left').trim();

    /* build overlay */
    const overlay = document.createElement('div');
    overlay.className = `carousel-overlay align-${align}`;
    overlay.innerHTML = `
      ${headDiv ? `<h2 class="carousel-head">${headDiv.innerHTML}</h2>` : ''}
      ${subDiv  ? `<p class="carousel-sub">${subDiv.innerHTML}</p>`  : ''}
      <div class="carousel-cta">
        ${cta(pLabDiv, pLinkDiv)}
        ${cta(sLabDiv, sLinkDiv)}
      </div>`;

    slide.innerHTML = '';
    slide.insertAdjacentHTML('beforeend', pictureHTML);
    slide.append(overlay);
  });

  /* ---------- arrow / autoplay handlers ---------- */
  const next = block.querySelector('.carousel-arrow.next');
  const prev = block.querySelector('.carousel-arrow.prev');

  function show(i) {
    index = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
  }

  next.addEventListener('click', () => show(index + 1));
  prev.addEventListener('click', () => show(index - 1));

  /* Auto-play (8 s) — pause on hover */
  let timer = setInterval(() => show(index + 1), 8000);
  block.addEventListener('mouseenter', () => clearInterval(timer));
  block.addEventListener('mouseleave', () => {
    clearInterval(timer);
    timer = setInterval(() => show(index + 1), 8000);
  });

  show(0);

  function cta(labelDiv, linkDiv) {
    const label = labelDiv?.textContent.trim();
    const href  = linkDiv?.querySelector('a')?.href;
    return label && href
      ? `<a href="${href}">${label} <span>›</span></a>`
      : '';
  }
}
