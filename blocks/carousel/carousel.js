/*  Carousel decorate — Royal Enfield-style banner
    --------------------------------------------------------------
    Expected author structure inside block:
    <div class="carousel">           (auto-wrapped by EDS)
      <div data-aue-model="slide">  ← row 0
        <picture>…</picture>
        <div>headline</div>
        <div>subhead</div>
        <div>primaryLabel</div>
        <div><a>primaryLink</a></div>
        <div>secondaryLabel</div>
        <div><a>secondaryLink</a></div>
        <div>ctaAlign (left|center|right)</div>
      </div>
      … more slide rows …
    </div>
----------------------------------------------------------------*/

export default function decorate(block) {
  /* ---------- wrap children in .carousel-track ---------- */
  const track = document.createElement('div');
  track.className = 'carousel-track';
  while (block.firstElementChild) track.append(block.firstElementChild);
  block.append(track);

  /* ---------- add arrows ---------- */
  block.insertAdjacentHTML('beforeend',
    '<button class="carousel-arrow prev" type="button">‹</button>' +
    '<button class="carousel-arrow next" type="button">›</button>');

  const slides = [...track.children];
  let index = 0;

  /* ---------- turn each authored row into a proper slide ---------- */
  slides.forEach((slide) => {
    slide.classList.add('carousel-slide');
    const parts = [...slide.children];
    const [desktopPic,mobilePicDiv, headDiv, subDiv,
           pLabDiv, pLinkDiv, sLabDiv, sLinkDiv, alignDiv] = parts;

  /* -------- build <picture> that swaps source ---------- */
  let pictureHTML = desktopPic.outerHTML;          // default
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

    slide.innerHTML = '';               // clear authored row
    slide.insertAdjacentHTML('beforeend', pictureHTML);
    slide.append(overlay);
  });

  /* ---------- arrow / autoplay handlers ---------- */
  const next = block.querySelector('.carousel-arrow.next');
  const prev = block.querySelector('.carousel-arrow.prev');

  function show(i) {
    index = (i slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
  }

  next.addEventListener('click', () => show(index 1));
  prev.addEventListener('click', () => show(index - 1));

  /* Auto-play (8 s) — pause on hover */
  let timer = setInterval(() => show(index 1), 8000);
  block.addEventListener('mouseenter', () => clearInterval(timer));
  block.addEventListener('mouseleave', () => {
    clearInterval(timer);
    timer = setInterval(() => show(index 1), 8000);
  });

  show(0); // init

  function cta(labelDiv, linkDiv) {
    const label = labelDiv?.textContent.trim();
    const href  = linkDiv?.querySelector('a')?.href;
    return label && href
      ? `<a href="${href}">${label} <span>›</span></a>`
      : '';
  }
}
