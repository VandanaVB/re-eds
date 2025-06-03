/*  Royal-Enfield-style Tabs hero
    ---------------------------------------------------------------
    • Keeps the IDs you already author (`tab-…`, `tabpanel-…`)
    • Turns each cell’s author-time fields into one .hero-slide
    • Auto-centres the active tab in the horizontal nav strip
-----------------------------------------------------------------*/

export default function decorate(block) {
  const cells   = [...block.children];                  // each original table cell
  const tablist = document.createElement('nav');
  tablist.className = 'tabs-list';
  tablist.setAttribute('role', 'tablist');

  /* ---------------- build buttons & panels ------------------- */
  const panels = cells.map((cell, i) => {
    const labelWrapper = cell.firstElementChild;        // your Title component
    const btnId   = labelWrapper.querySelector('[id^="tab-"]')?.id || `tab-${i}`;
    const panelId = cell.id || labelWrapper.getAttribute('aria-controls') || `tabpanel-${i}`;

    /* button --------------------------------------------------- */
    const btn = document.createElement('button');
    btn.className = 'tabs-tab';
    btn.id        = btnId;
    btn.type      = 'button';
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-controls', panelId);
    btn.setAttribute('aria-selected', i === 0);
    btn.innerHTML = labelWrapper.innerHTML;             // inline-editable text
    btn.addEventListener('click', () => activate(i));
    tablist.append(btn);

    /* panel ---------------------------------------------------- */
    cell.className = 'tabs-panel';
    cell.id        = panelId;
    cell.setAttribute('role',          'tabpanel');
    cell.setAttribute('aria-labelledby', btnId);
    cell.setAttribute('aria-hidden',   i !== 0);

    buildHero(cell);                                    // transform author fields
    return cell;
  });

  block.prepend(tablist);

  /* ---------------- activation ------------------------------- */
  function activate(idx) {
    tablist.querySelectorAll('button').forEach((b, i) =>
      b.setAttribute('aria-selected', i === idx));
    panels.forEach((p, i) =>
      p.setAttribute('aria-hidden', i !== idx));

    /* centre the active button in the strip */
    const active = tablist.children[idx];
    const offset = active.offsetLeft - tablist.clientWidth / 2 + active.clientWidth / 2;
    tablist.scrollTo({ left: offset, behavior: 'smooth' });
  }

  /* ---------------- hero builder ----------------------------- */
  function buildHero(panel) {
    /* expected author order inside each cell:
       0 text, 1 picture, 2 primaryLabel, 3 primaryLink,
       4 secondaryLabel, 5 secondaryLink, 6 ctaAlign (left|center|right) */
    const kids = [...panel.children];
    const [txt, pic, pLab, pLink, sLab, sLink, alignDiv] = kids;
    const align = (alignDiv?.textContent || 'center').trim();

    const hero = document.createElement('div');
    hero.className = 'hero-slide';
    hero.innerHTML = `
      <picture class="hero-bg">${pic?.innerHTML || ''}</picture>
      <div class="hero-overlay align-${align}">
        <div class="hero-copy">${txt?.innerHTML || ''}</div>
        <div class="cta-row">
          ${cta(pLab, pLink)}
          ${cta(sLab, sLink)}
        </div>
      </div>`;
    panel.innerHTML = '';
    panel.append(hero);
  }

  function cta(labelDiv, linkDiv) {
    const label = labelDiv?.textContent.trim();
    const href  = linkDiv?.querySelector('a')?.getAttribute('href');
    return label && href
      ? `<a class="cta" href="${href}">${label} <span>›</span></a>`
      : '';
  }
}
