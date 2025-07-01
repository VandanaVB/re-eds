/* ------------------------------------------------------------
   Accordion-Tabs  –  single source for Author + Preview/Publish
------------------------------------------------------------ */

/**
 * Builds side-nav, tab-panels and accordions.
 * Runs only in Preview / Publish (or when UE switches to preview).
 */
function build(block) {
  /* ─── separate author rows ─── */
  const rows    = [...block.children];          // row-0 = heading, rest = tabs
  const heading = rows.shift();                 // remove heading row

  /* NAV -------------------------------------------------------------------- */
  const nav = document.createElement('nav');
  nav.className = 'accordion-nav';
  nav.innerHTML = `
    <h3>${heading?.querySelector('[data-aue-prop="title"]')?.innerHTML
            || 'Categories'}</h3><ul></ul>`;
  const ulNav = nav.querySelector('ul');

  /* CONTENT WRAPPER -------------------------------------------------------- */
  const content = document.createElement('div');
  content.className = 'accordion-content';

  /* optional intro text from heading row */
  const introHTML = heading?.querySelector('[data-aue-prop="intro"]')?.innerHTML;
  if (introHTML) {
    const introDiv = document.createElement('div');
    introDiv.className = 'accordion-intro';
    introDiv.innerHTML = introHTML;
    content.append(introDiv);
  }

  /* BUILD TABS + ACCORDIONS ------------------------------------------------ */
  rows.forEach((row, idx) => {
    const tabTitle =
      row.querySelector('[data-aue-prop="tabTitle"]')?.textContent.trim()
      || `Tab ${idx + 1}`;

    /* side-nav button */
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = tabTitle;
    if (idx === 0) btn.classList.add('active');
    ulNav.append(btn);

    /* tab-panel */
    const panel = document.createElement('section');
    panel.className = 'accordion-panel';
    panel.hidden = idx !== 0;

    /* panel heading */
    const h2 = document.createElement('h2');
    h2.textContent = tabTitle;
    panel.append(h2);

    /* accordion container */
    const accordWrap = document.createElement('div');
    accordWrap.className = 'accordion-accordion';
    panel.append(accordWrap);

    /* every child row = one Q/A pair */
    [...row.children].forEach((item) => {
      const q = item.querySelector('[data-aue-prop="question"]')?.innerHTML || '';
      const a = item.querySelector('[data-aue-prop="answer"]')?.innerHTML   || '';
      if (!q) return;

      const accItem = document.createElement('div');
      accItem.className = 'accordion-accordion-item';
      accItem.innerHTML = `
        <div class="accordion-question">${q}</div>
        <div class="accordion-answer"><p>${a}</p></div>`;
      accordWrap.append(accItem);
    });

    content.append(panel);          // ← always append!
  });

  /* inject into block */
  block.innerHTML = '';
  block.classList.add('accordion-tabs');
  block.append(nav, content);

  /* NAV click – switch panels --------------------------------------------- */
  nav.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;

    [...nav.querySelectorAll('button')].forEach((b, i) => {
      const active = b === btn;
      b.classList.toggle('active', active);
      content.querySelectorAll('.accordion-panel')[i].hidden = !active;
    });
  });

  /* Accordion toggle ------------------------------------------------------- */
  content.addEventListener('click', (e) => {
    const q = e.target.closest('.accordion-question');
    if (!q) return;
    q.classList.toggle('open');
    q.nextElementSibling.classList.toggle('open');
  });
}

/* ------------------------------------------------------------
   Main entry – called by Franklin runtime
------------------------------------------------------------ */
export default function decorate(block) {
  /* Inside Universal-Editor’s AUTHOR view? → defer. */
  if (window.hlx && window.hlx.inEditor) {
    /* Run build() only when the editor switches this block to Preview */
    const once = () => { build(block); };
    block.addEventListener('aue-block-preview', once, { once: true });
    return;                           // leave authoring DOM unchanged
  }

  /* Preview / Publish context – build immediately */
  build(block);
}
